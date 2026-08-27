'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { X, RotateCcw, AlertCircle, CheckCircle, ShieldCheck, HelpCircle } from 'lucide-react';

export interface ReturnModalOrder {
  id: string;
  receiptId: string;
  amount: number;
  status: string;
  customerName?: string;
}

interface ReturnRequestModalProps {
  isOpen: boolean;
  order: ReturnModalOrder | null;
  onClose: () => void;
  onSuccess: () => void;
}

const RETURN_REASONS = [
  'Damaged Packaging / Broken Seal',
  'Wrong Item / Flavor Delivered',
  'Quality or Taste Issue',
  'Product Expired or Near Expiry',
  'Defective Product / Foreign Object',
  'Ordered by Mistake / Other',
];

export default function ReturnRequestModal({
  isOpen,
  order,
  onClose,
  onSuccess,
}: ReturnRequestModalProps) {
  const [reason, setReason] = useState(RETURN_REASONS[0]);
  const [details, setDetails] = useState('');
  const [upiId, setUpiId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason) {
      toast.error('Please select a return reason');
      return;
    }

    if (!upiId.trim()) {
      toast.error('Please provide your UPI ID for the refund');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Submitting return request...');

    try {
      const res = await fetch('/api/orders/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          receiptId: order.receiptId,
          returnReason: reason,
          returnDetails: details,
          returnUpi: upiId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit return request');
      }

      toast.success('Return request submitted successfully! 🔄', { id: toastId });
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error submitting return request', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#262626] bg-[#141414] p-6 sm:p-8 text-white shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-gray-400 hover:bg-[#262626] hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#262626]">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Request Return / Refund</h3>
            <p className="text-xs text-gray-400">
              Receipt <span className="font-mono text-[#22c55e] font-semibold">#{order.receiptId}</span> • ₹{(order.amount / 100).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Return Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
              Reason for Return <span className="text-red-400">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-[#262626] bg-[#0a0a0a] px-3.5 py-3 text-sm text-white focus:border-[#22c55e] focus:outline-none"
            >
              {RETURN_REASONS.map((r) => (
                <option key={r} value={r} className="bg-[#141414] text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Detailed Problem Description */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
              Problem Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Tell us what went wrong so we can quickly resolve it..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full rounded-xl border border-[#262626] bg-[#0a0a0a] p-3 text-sm text-white placeholder-gray-600 focus:border-[#22c55e] focus:outline-none resize-none"
            />
          </div>

          {/* Refund UPI ID */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
              UPI ID for Instant Refund <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="yourname@okaxis or 9876543210@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full rounded-xl border border-[#262626] bg-[#0a0a0a] px-3.5 py-3 text-sm text-white placeholder-gray-600 focus:border-[#22c55e] focus:outline-none font-mono"
            />
            <span className="text-[11px] text-gray-500 mt-1 block">
              100% full refund will be credited directly to this UPI handle once verified.
            </span>
          </div>

          {/* Return Policy Notice */}
          <div className="rounded-xl border border-amber-900/30 bg-amber-950/20 p-3.5 text-xs text-amber-300/90 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <ShieldCheck className="h-4 w-4" /> 100% Satisfaction Guarantee
            </div>
            <p className="text-[11px] text-gray-400">
              Once submitted, our team will review the request within 24 hours. A courier pickup will be scheduled from your delivery address.
            </p>
          </div>

          {/* Submit Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#262626] px-4 py-2.5 text-xs font-semibold text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-500 transition disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {submitting ? 'Submitting...' : 'Submit Return Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
