'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, CreditCard, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================================================
// 2. INTERFACES
// ============================================================================
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface CheckoutModalProps {
  productId: string;
  price: number; // Product base price in paise (e.g., 29900 = ₹299.00)
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
}

export default function CheckoutModal({
  productId,
  price,
  isOpen,
  onClose,
  user,
}: CheckoutModalProps) {
  // ============================================================================
  // 3. COMPONENT STATES
  // ============================================================================
  const [loading, setLoading] = useState(false);

  // Global Shipping Settings State (Loaded from API)
  const [shippingRules, setShippingSettings] = useState({
    freeShippingMinAmount: 99900, // ₹999 in paise
    standardShippingFee: 9900,    // ₹99 in paise
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // ============================================================================
  // 4. EFFECTS & CALCULATIONS
  // ============================================================================
  // Fetch global store shipping settings
  useEffect(() => {
    async function fetchShippingSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success && data.data) {
          setShippingSettings({
            freeShippingMinAmount: data.data.freeShippingMinAmount,
            standardShippingFee: data.data.standardShippingFee,
          });
        }
      } catch {
        // Fallback to defaults if settings API fails
      }
    }
    if (isOpen) {
      fetchShippingSettings();
    }
  }, [isOpen]);

  // Auto-fill form when user logs in or modal opens
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user, isOpen]);

  // Determine if shipping is free or subject to standard fee
  const isFreeShipping = price >= shippingRules.freeShippingMinAmount;
  const shippingFee = isFreeShipping ? 0 : shippingRules.standardShippingFee;
  const grandTotal = price + shippingFee;

  if (!isOpen) return null;

  // ============================================================================
  // 5. CHECKOUT & PAYMENT HANDLER
  // ============================================================================
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Pending Order in Database
      const orderRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          amount: grandTotal,
          shippingCost: shippingFee,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: formData.address,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize checkout');
      }

      // 2. Trigger Razorpay Checkout Popup
      const options = {
        key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'BrainBowl Superfood',
        description: 'Organic Roasted Makhana Pack',
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#16a34a',
        },
        handler: async function (response: any) {
          // 3. Verify Payment Signature
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success('🎉 Payment Successful! Order confirmed.');
            onClose();
            window.location.href = '/dashboard';
          } else {
            toast.error(verifyData.error || 'Payment verification failed.');
          }
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      toast.error(err.message || 'Checkout error');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // 6. UI RENDER
  // ============================================================================
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg rounded-3xl border border-[#262626] bg-[#141414] p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
            <div>
              <h2 className="text-xl font-bold">Complete Your Order</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {user ? '✨ Details auto-filled from your profile' : 'Enter shipping details below'}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleCheckout} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">
                Full Name
              </label>
              <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5">
                <User className="h-4 w-4 text-gray-500 mr-2" />
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

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">
                Email Address
              </label>
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

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">
                Phone Number
              </label>
              <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5">
                <Phone className="h-4 w-4 text-gray-500 mr-2" />
                <input
                  type="tel"
                  required
                  pattern="[6-9][0-9]{9}"
                  placeholder="9876543210"
                  className="w-full bg-transparent text-sm text-white focus:outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">
                Delivery Address
              </label>
              <div className="mt-1 flex items-start rounded-xl border border-[#262626] bg-[#0a0a0a] px-3 py-2.5">
                <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                <textarea
                  required
                  rows={2}
                  placeholder="House No., Street, City, State, Pincode"
                  className="w-full bg-transparent text-sm text-white focus:outline-none resize-none"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            {/* Shipping Summary & Price Breakdown */}
            <div className="rounded-2xl border border-[#262626] bg-[#0a0a0a] p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Product Subtotal</span>
                <span className="font-semibold text-white">₹{(price / 100).toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-[#22c55e]" /> Shipping Fee
                </span>
                {isFreeShipping ? (
                  <span className="font-bold text-[#22c55e] uppercase">FREE</span>
                ) : (
                  <span className="font-semibold text-white">
                    +₹{(shippingFee / 100).toFixed(2)}
                  </span>
                )}
              </div>

              {!isFreeShipping && (
                <p className="text-[10px] text-amber-400 pt-1 border-t border-[#262626]">
                  💡 Add items worth ₹{((shippingRules.freeShippingMinAmount - price) / 100).toFixed(0)} more for FREE shipping!
                </p>
              )}
            </div>

            {/* Grand Total & Pay Button */}
            <div className="pt-4 border-t border-[#262626] flex items-center justify-between">
              <div>
                <span className="block text-xs text-gray-400">Grand Total</span>
                <span className="text-xl font-black text-[#22c55e]">
                  ₹{(grandTotal / 100).toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-[#16a34a] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 hover:bg-[#15803d] transition disabled:opacity-50"
              >
                <CreditCard className="h-4 w-4" />
                {loading ? 'Processing...' : 'Pay Securely'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}