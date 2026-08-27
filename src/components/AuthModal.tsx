'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, Phone, KeyRound, RefreshCw, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useResendTimer } from '@/hooks/useResendTimer';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
  onAuthSuccess: (user: any) => void;
}

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  otp: '',
  newPassword: '',
  confirmNewPassword: '',
};

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Input details, Step 2: Verify OTP
  const [loading, setLoading] = useState(false);

  // Show / Hide Password Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [formData, setFormData] = useState(initialFormState);

  // 60-Second Cooldown Timer Hook
  const { timeLeft, isTimerActive, startTimer } = useResendTimer(60);

  useEffect(() => {
    setMode(initialMode);
    setStep(1);
    setFormData(initialFormState);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowLoginPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Client-Side Security Validations
  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      throw new Error('Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.');
    }
    if (/^(\d)\1{9}$/.test(cleanPhone) || ['1234567890', '9876543210'].includes(cleanPhone)) {
      throw new Error('Please enter a genuine phone number.');
    }
    return cleanPhone;
  };

  const validateStrongPassword = (pass: string) => {
    if (pass.length < 8) throw new Error('Password must be at least 8 characters long.');
    if (!/[A-Z]/.test(pass)) throw new Error('Password must contain at least one uppercase letter (A-Z).');
    if (!/[a-z]/.test(pass)) throw new Error('Password must contain at least one lowercase letter (a-z).');
    if (!/[0-9]/.test(pass)) throw new Error('Password must contain at least one number (0-9).');
    if (!/[^a-zA-Z0-9]/.test(pass)) throw new Error('Password must contain at least one special character (@, #, $, etc.).');
  };

  // Close and reset form inputs
  const handleClose = () => {
    setFormData(initialFormState);
    setStep(1);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowLoginPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
    onClose();
  };

  // Switch tabs and reset form
  const handleTabSwitch = (newMode: 'login' | 'register' | 'forgot') => {
    setMode(newMode);
    setStep(1);
    setFormData(initialFormState);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowLoginPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
  };

  // Send OTP Handler
  const handleSendOtp = async (type: 'REGISTER' | 'FORGOT_PASSWORD') => {
    setLoading(true);
    try {
      if (!formData.email) throw new Error('Please enter your email address.');

      let cleanPhone = '';
      if (type === 'REGISTER') {
        if (!formData.name.trim()) throw new Error('Please enter your full name.');
        cleanPhone = validatePhone(formData.phone);
        validateStrongPassword(formData.password);

        if (!formData.confirmPassword) {
          throw new Error('Please enter the confirm password field.');
        }

        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match. Please ensure Password and Confirm Password are the same.');
        }
      }

      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, phone: cleanPhone, type }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success(`OTP sent to ${formData.email} 📩`);
      startTimer(); // Start 60s cooldown
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP inside Step 2
  const handleResendOtp = async () => {
    if (isTimerActive) return;

    setLoading(true);
    try {
      const type = mode === 'register' ? 'REGISTER' : 'FORGOT_PASSWORD';
      const cleanPhone = mode === 'register' ? formData.phone.replace(/\D/g, '') : '';
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, phone: cleanPhone, type }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success('New OTP sent to your email 📩');
      startTimer();
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // Main Submit Handler
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
        setFormData(initialFormState); // Clear form after login
        onAuthSuccess(data.user);
        handleClose();
      } else if (mode === 'register') {
        const cleanPhone = validatePhone(formData.phone);
        validateStrongPassword(formData.password);

        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match. Please ensure Password and Confirm Password match.');
        }

        const res = await fetch('/api/auth/register-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, phone: cleanPhone }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        toast.success('🎉 Account created and verified!');
        setFormData(initialFormState); // Clear form after registration
        onAuthSuccess(data.user);
        handleClose();
      } else if (mode === 'forgot') {
        validateStrongPassword(formData.newPassword);

        if (formData.confirmNewPassword && formData.newPassword !== formData.confirmNewPassword) {
          throw new Error('New passwords do not match. Please verify.');
        }

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

        toast.success('Password updated successfully! Please Sign In.');
        setFormData(initialFormState); // Clear form after password reset
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
                onClick={() => handleTabSwitch('login')}
                className={`text-sm font-bold transition ${
                  mode === 'login' ? 'text-[#22c55e] border-b-2 border-[#22c55e]' : 'text-gray-400'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch('register')}
                className={`text-sm font-bold transition ${
                  mode === 'register' ? 'text-[#22c55e] border-b-2 border-[#22c55e]' : 'text-gray-400'
                }`}
              >
                Register
              </button>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email Field */}
            {step === 1 && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">
                  Email Address
                </label>
                <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 focus-within:border-[#22c55e]">
                  <Mail className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
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
            )}

            {/* Registration Step 1 Fields */}
            {mode === 'register' && step === 1 && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase">
                    Full Name
                  </label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 focus-within:border-[#22c55e]">
                    <UserIcon className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
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
                  <label className="block text-xs font-semibold text-gray-400 uppercase">
                    Phone Number
                  </label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 focus-within:border-[#22c55e]">
                    <Phone className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })
                      }
                    />
                  </div>
                </div>

                {/* Password with Eye Icon Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase">
                    High Security Password
                  </label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 focus-within:border-[#22c55e]">
                    <Lock className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-white transition p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Must be 8+ chars with uppercase, lowercase, number, & special symbol.
                  </p>
                </div>

                {/* Confirm Password with Eye Icon Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase">
                    Confirm Password
                  </label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 focus-within:border-[#22c55e]">
                    <Lock className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-white transition p-1"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <p className={`mt-1 text-[10px] ${formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                      {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
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

            {/* OTP Entry Step 2 with 60s Resend Timer */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase">
                    Enter 6-Digit OTP sent to {formData.email}
                  </label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 focus-within:border-[#22c55e]">
                    <KeyRound className="h-4 w-4 text-[#22c55e] mr-2 shrink-0" />
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

                {/* 60s Resend Timer */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isTimerActive || loading}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#22c55e] hover:underline disabled:opacity-50 disabled:no-underline"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isTimerActive ? 'animate-spin' : ''}`} />
                    {isTimerActive ? `Resend OTP in ${timeLeft}s` : 'Resend OTP'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Change Email
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password New Password Fields in Step 2 */}
            {mode === 'forgot' && step === 2 && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase">
                    New High Security Password
                  </label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 focus-within:border-[#22c55e]">
                    <Lock className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-gray-400 hover:text-white transition p-1"
                      title={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase">
                    Confirm New Password
                  </label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 focus-within:border-[#22c55e]">
                    <Lock className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                    <input
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                      value={formData.confirmNewPassword}
                      onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="text-gray-400 hover:text-white transition p-1"
                      title={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.confirmNewPassword && (
                    <p className={`mt-1 text-[10px] ${formData.newPassword === formData.confirmNewPassword ? 'text-green-400' : 'text-red-400'}`}>
                      {formData.newPassword === formData.confirmNewPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Login Mode Fields */}
            {mode === 'login' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase">
                    Password
                  </label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 focus-within:border-[#22c55e]">
                    <Lock className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="text-gray-400 hover:text-white transition p-1"
                      title={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('forgot')}
                    className="text-xs text-[#22c55e] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}

            {/* Final Submit Button */}
            {(mode === 'login' || step === 2) && (
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-xl bg-[#16a34a] py-3 text-sm font-bold text-white shadow-lg hover:bg-[#15803d] disabled:opacity-50 transition"
              >
                {loading
                  ? 'Processing...'
                  : mode === 'login'
                  ? 'Sign In'
                  : mode === 'register'
                  ? 'Verify OTP & Register'
                  : 'Reset Password'}
              </button>
            )}

            {/* Forgot Password Step 1 Button */}
            {mode === 'forgot' && step === 1 && (
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSendOtp('FORGOT_PASSWORD')}
                className="w-full rounded-xl bg-[#16a34a] py-3 text-sm font-bold text-white shadow-lg hover:bg-[#15803d] disabled:opacity-50 transition"
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