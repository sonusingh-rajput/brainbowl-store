'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, Phone, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
  onAuthSuccess: (user: any) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Request OTP, Step 2: Verify OTP
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    otp: '',
    newPassword: '',
  });

  useEffect(() => {
    setMode(initialMode);
    setStep(1);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Send OTP handler
  const handleSendOtp = async (type: 'REGISTER' | 'FORGOT_PASSWORD') => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, type }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success(`OTP sent to ${formData.email} 📩`);
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        toast.success(`Welcome back, ${data.user.name}! 👋`);
        onAuthSuccess(data.user);
        onClose();
      } else if (mode === 'register') {
        const res = await fetch('/api/auth/register-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        toast.success('🎉 Account created and verified!');
        onAuthSuccess(data.user);
        onClose();
      } else if (mode === 'forgot') {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp,
            newPassword: formData.newPassword,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        toast.success('Password updated! Please Sign In.');
        setMode('login');
        setStep(1);
      }
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md rounded-3xl border border-[#262626] bg-[#141414] p-8 shadow-2xl text-white"
        >
          {/* Header Tabs */}
          <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => { setMode('login'); setStep(1); }}
                className={`text-sm font-bold transition ${mode === 'login' ? 'text-[#22c55e] border-b-2 border-[#22c55e]' : 'text-gray-400'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setStep(1); }}
                className={`text-sm font-bold transition ${mode === 'register' ? 'text-[#22c55e] border-b-2 border-[#22c55e]' : 'text-gray-400'}`}
              >
                Register
              </button>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">Email Address</label>
              <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5">
                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                <input
                  type="email"
                  required
                  placeholder="sonu@example.com"
                  className="w-full bg-transparent text-sm text-white focus:outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Registration Fields */}
            {mode === 'register' && step === 1 && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase">Full Name</label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5">
                    <UserIcon className="h-4 w-4 text-gray-500 mr-2" />
                    <input
                      type="text"
                      required
                      placeholder="Sonu Singh"
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase">Phone Number</label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <input
                      type="tel"
                      required
                      pattern="[6-9][0-9]{9}"
                      placeholder="9876543210"
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase">Password</label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5">
                    <Lock className="h-4 w-4 text-gray-500 mr-2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSendOtp('REGISTER')}
                  className="w-full rounded-xl bg-[#16a34a] py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 hover:bg-[#15803d]"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP to Email'}
                </button>
              </>
            )}

            {/* OTP Entry Step for Register or Forgot Password */}
            {step === 2 && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">Enter 6-Digit OTP</label>
                <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5">
                  <KeyRound className="h-4 w-4 text-[#22c55e] mr-2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    className="w-full bg-transparent text-sm text-white tracking-widest focus:outline-none"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Forgot Password New Password Field */}
            {mode === 'forgot' && step === 2 && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">New Password</label>
                <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5">
                  <Lock className="h-4 w-4 text-gray-500 mr-2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm text-white focus:outline-none"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Login Fields */}
            {mode === 'login' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase">Password</label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5">
                    <Lock className="h-4 w-4 text-gray-500 mr-2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setStep(1); }}
                    className="text-xs text-[#22c55e] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}

            {/* Submit Action */}
            {(mode === 'login' || step === 2) && (
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-xl bg-[#16a34a] py-3 text-sm font-bold text-white shadow-lg hover:bg-[#15803d]"
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Verify OTP & Register' : 'Reset Password'}
              </button>
            )}

            {/* Forgot Password Step 1 Button */}
            {mode === 'forgot' && step === 1 && (
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSendOtp('FORGOT_PASSWORD')}
                className="w-full rounded-xl bg-[#16a34a] py-3 text-sm font-bold text-white shadow-lg hover:bg-[#15803d]"
              >
                {loading ? 'Sending OTP...' : 'Send Reset Code'}
              </button>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}