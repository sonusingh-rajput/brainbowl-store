'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Image as ImageIcon, Upload, Check, RefreshCw, FolderOpen, Sparkles } from 'lucide-react';

export interface GalleryItem {
  name: string;
  url: string;
  size?: number;
  createdAt?: string;
  isDefault?: boolean;
}

interface ImageGalleryModalProps {
  isOpen: boolean;
  currentImageUrl: string;
  onClose: () => void;
  onSelectImage: (url: string) => void;
}

export default function ImageGalleryModal({
  isOpen,
  currentImageUrl,
  onClose,
  onSelectImage,
}: ImageGalleryModalProps) {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(currentImageUrl || '/product_image.jpeg');
  const [uploading, setUploading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setImages(data.data);
      }
    } catch {
      toast.error('Failed to load image gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentImageUrl || '/product_image.jpeg');
      fetchGallery();
    }
  }, [isOpen, currentImageUrl]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 1 * 1024 * 1024; // 1 MB
    if (file.size > MAX_SIZE) {
      toast.error(`File is ${(file.size / (1024 * 1024)).toFixed(2)} MB. Maximum allowed is 1 MB!`);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    const toastId = toast.loading('Uploading to Media Gallery...');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        toast.success('Image added to gallery! 📸', { id: toastId });
        setSelectedUrl(data.url);
        fetchGallery();
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed', { id: toastId });
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleApply = () => {
    if (!selectedUrl) {
      toast.error('Please select an image');
      return;
    }
    onSelectImage(selectedUrl);
    toast.success('Product image updated! ✨');
    onClose();
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setSelectedUrl(customUrl.trim());
    onSelectImage(customUrl.trim());
    toast.success('Custom image URL applied! 🌐');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-3xl rounded-3xl border border-[#262626] bg-[#141414] p-6 sm:p-8 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Media & Image Gallery</h3>
              <p className="text-xs text-gray-400">
                Choose an image from your library or upload a new photo (Max 1 MB)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchGallery}
              disabled={loading}
              className="p-2 rounded-xl border border-[#262626] bg-[#0a0a0a] text-gray-400 hover:text-white transition"
              title="Refresh Gallery"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:bg-[#262626] hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Upload Zone & Custom URL Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <label className="flex items-center justify-center gap-2.5 rounded-2xl border border-dashed border-[#333] hover:border-emerald-500/60 bg-[#0a0a0a]/60 hover:bg-emerald-950/10 p-3.5 cursor-pointer transition text-xs font-semibold text-gray-300">
            <Upload className="h-4 w-4 text-emerald-400" />
            <span>{uploading ? 'Uploading...' : 'Upload New Photo (Max 1 MB)'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFileUpload}
            />
          </label>

          <form onSubmit={handleApplyCustomUrl} className="flex items-center gap-2">
            <input
              type="url"
              placeholder="Or paste external image URL..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 rounded-2xl border border-[#262626] bg-[#0a0a0a] px-3.5 py-3 text-xs text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-2xl bg-[#262626] hover:bg-[#333] px-3.5 py-3 text-xs font-bold text-gray-200 hover:text-white transition"
            >
              Use
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-[220px]">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-xs text-gray-500">
              <RefreshCw className="h-5 w-5 animate-spin text-emerald-400 mr-2" />
              Loading media assets...
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((item, idx) => {
                const isSelected = selectedUrl === item.url;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedUrl(item.url)}
                    className={`group relative rounded-2xl border p-2 bg-[#0a0a0a] cursor-pointer transition duration-150 flex flex-col items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-950/10'
                        : 'border-[#262626] hover:border-gray-600 hover:bg-[#111]'
                    }`}
                  >
                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}

                    {/* Thumbnail Image */}
                    <div className="h-28 w-full flex items-center justify-center p-1 overflow-hidden rounded-xl bg-[#141414]">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-full w-full object-contain transition duration-200 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/product_image.jpeg';
                        }}
                      />
                    </div>

                    {/* Metadata */}
                    <div className="w-full mt-2 text-center">
                      <p className="text-[11px] font-semibold text-gray-200 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <span className="text-[9px] text-gray-500">
                        {item.isDefault ? 'Default Store Asset' : item.size ? `${(item.size / 1024).toFixed(0)} KB` : 'Uploaded'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500">
              <ImageIcon className="h-8 w-8 text-gray-600 mb-2" />
              <p className="text-xs font-semibold">No media images found</p>
              <p className="text-[10px] text-gray-600 mt-0.5">Upload a product photo above to get started.</p>
            </div>
          )}
        </div>

        {/* Selected Image Preview & Action Footer */}
        <div className="mt-4 pt-4 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="h-10 w-10 rounded-xl bg-[#0a0a0a] border border-[#262626] p-1 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={selectedUrl}
                alt="Selected"
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/product_image.jpeg';
                }}
              />
            </div>
            <div className="truncate max-w-[200px] sm:max-w-xs">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Active Selection</span>
              <p className="text-xs text-emerald-400 font-mono truncate">{selectedUrl}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#262626] px-4 py-2.5 text-xs font-semibold text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Apply Image to Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
