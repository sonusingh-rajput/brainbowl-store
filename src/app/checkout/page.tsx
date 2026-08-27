"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RefreshCw,
  Building2,
  Globe,
  Plus,
  Minus,
  Lock,
  LogIn,
  UserPlus,
} from "lucide-react";
import AuthModal from "@/components/AuthModal";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingPincode, setFetchingPincode] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Auth Modal State for Unauthenticated Visitors
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  // Single Item Base Price in Paise (₹299 = 29900 paise)
  const unitPrice = 29900;

  // Quantity State (1 to Many Items)
  const [quantity, setQuantity] = useState(1);

  // Calculated Product Subtotal based on Quantity
  const productSubtotal = unitPrice * quantity;

  // Dynamic Shipping Settings State (Fetched from Admin API)
  const [shippingRules, setShippingRules] = useState({
    freeShippingMinAmount: 99900, // Default ₹999 threshold in paise
    standardShippingFee: 9900,    // Default ₹99 fee in paise
  });

  // Structured Address State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    streetAddress: "",
    pincode: "",
    district: "",
    state: "",
  });

  // Fetch logged-in user profile & store shipping settings
  useEffect(() => {
    async function initCheckout() {
      try {
        // 1. Fetch Admin Shipping Settings
        const settingsRes = await fetch("/api/admin/settings");
        const settingsData = await settingsRes.json();
        if (settingsData.success && settingsData.data) {
          setShippingRules({
            freeShippingMinAmount: settingsData.data.freeShippingMinAmount,
            standardShippingFee: settingsData.data.standardShippingFee,
          });
        }

        // 2. Fetch User Profile & Check Authentication
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (userData.success && userData.user) {
          setUser(userData.user);
          setFormData((prev) => ({
            ...prev,
            name: userData.user.name || "",
            email: userData.user.email || "",
            phone: userData.user.phone || "",
          }));
        } else {
          setUser(null);
          setAuthModalMode("login");
          setAuthModalOpen(true);
          toast("Please sign in or create an account to proceed with checkout", {
            icon: "🔐",
          });
        }
      } catch (err) {
        toast.error("Error loading session details");
      } finally {
        setLoading(false);
      }
    }
    initCheckout();
  }, []);

  // Calculate Dynamic Shipping Charges
  const isFreeShipping = productSubtotal >= shippingRules.freeShippingMinAmount;
  const shippingFee = isFreeShipping ? 0 : shippingRules.standardShippingFee;
  const grandTotal = productSubtotal + shippingFee;

  // Quantity Change Handlers
  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Auto-Match Pincode to District & State via India Post API
  const handlePincodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const code = e.target.value.replace(/\D/g, ""); // Numeric only
    setFormData((prev) => ({ ...prev, pincode: code }));

    if (code.length === 6) {
      setFetchingPincode(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
        const data = await res.json();

        if (
          data[0] &&
          data[0].Status === "Success" &&
          data[0].PostOffice?.length > 0
        ) {
          const postOffice = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            district: postOffice.District,
            state: postOffice.State,
          }));
          toast.success(
            `Location matched: ${postOffice.District}, ${postOffice.State} 📍`,
          );
        } else {
          toast.error("Invalid Pincode. Please check and re-enter.");
        }
      } catch (err) {
        toast.error("Could not auto-verify pincode");
      } finally {
        setFetchingPincode(false);
      }
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setAuthModalMode("login");
      setAuthModalOpen(true);
      toast.error("Please sign in or register to complete payment");
      return;
    }

    if (!formData.district || !formData.state) {
      toast.error(
        "Please enter a valid 6-digit Pincode to match District & State",
      );
      return;
    }

    setSubmitting(true);

    // Combine structured address fields for PostgreSQL storage
    const fullShippingAddress = `${formData.streetAddress}, ${formData.district}, ${formData.state} - ${formData.pincode}`;

    try {
      const orderRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          quantity: quantity,
          shippingCost: shippingFee,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: fullShippingAddress,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        if (orderRes.status === 401) {
          setUser(null);
          setAuthModalMode("login");
          setAuthModalOpen(true);
          throw new Error("Authentication required. Please sign in to place an order.");
        }
        throw new Error(orderData.error || "Failed to initialize order");
      }

      const options = {
        key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "BrainBowl Superfood",
        description: `BrainBowl Organic Roasted Makhana Pack (${quantity}x)`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#16a34a" },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              toast.success("🎉 Payment Successful! Order confirmed.");
              window.location.href = "/dashboard";
            } else {
              toast.error(verifyData.error || "Payment verification failed.");
            }
          } catch (err) {
            toast.error("Payment verification error");
          }
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      toast.error(err.message || "Payment initiation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <RefreshCw className="h-4 w-4 animate-spin text-[#22c55e]" />
          Verifying session and loading checkout...
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State Gate
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-[#262626] bg-[#141414] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-950/50 border border-green-800/40 text-[#22c55e]">
            <Lock className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-2xl font-black">Sign In Required</h1>
          <p className="mt-2 text-xs text-gray-400 leading-relaxed">
            Please log in or create an account to proceed with checkout and track your BrainBowl orders.
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => {
                setAuthModalMode("login");
                setAuthModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] py-3.5 text-xs font-bold text-white shadow-lg shadow-green-600/20 hover:bg-[#15803d] transition"
            >
              <LogIn className="h-4 w-4" />
              Sign In to Your Account
            </button>

            <button
              onClick={() => {
                setAuthModalMode("register");
                setAuthModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#262626] bg-[#0a0a0a] py-3.5 text-xs font-bold text-[#f4efe6] hover:border-[#22c55e] hover:text-[#22c55e] transition"
            >
              <UserPlus className="h-4 w-4" />
              Create New Account
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-[#262626]">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Return to Store
            </Link>
          </div>
        </div>

        {/* Auth Modal for Checkout Gate */}
        <AuthModal
          isOpen={authModalOpen}
          initialMode={authModalMode}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setFormData((prev) => ({
              ...prev,
              name: loggedInUser.name || "",
              email: loggedInUser.email || "",
              phone: loggedInUser.phone || "",
            }));
            setAuthModalOpen(false);
            toast.success(`Welcome back, ${loggedInUser.name}! Proceeding with checkout.`);
          }}
        />
      </div>
    );
  }

  // 3. Authenticated Checkout Screen
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#22c55e] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Store
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-green-800/40 bg-green-950/40 px-3 py-1 text-xs text-green-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
            Signed in as {user.name}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 rounded-3xl border border-[#262626] bg-[#141414] p-8">
            <h1 className="text-2xl font-black">Shipping & Payment</h1>
            <p className="text-xs text-gray-400 mt-1">
              ✨ Profile details auto-filled for {user.name}
            </p>

            <form onSubmit={handlePayment} className="mt-8 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400">
                  Full Name
                </label>
                <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3.5 py-3">
                  <User className="h-4 w-4 text-gray-500 mr-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Sonu Singh"
                    className="w-full bg-transparent text-sm text-white focus:outline-none"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400">
                    Email Address
                  </label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3.5 py-3">
                    <Mail className="h-4 w-4 text-gray-500 mr-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="sonu@example.com"
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400">
                    Phone Number
                  </label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3.5 py-3">
                    <Phone className="h-4 w-4 text-gray-500 mr-2.5" />
                    <input
                      type="tel"
                      required
                      pattern="[6-9][0-9]{9}"
                      placeholder="9876543210"
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400">
                  Street / House Address
                </label>
                <div className="mt-1 flex items-start rounded-xl border border-[#262626] bg-[#0a0a0a] px-3.5 py-3">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2.5 mt-0.5" />
                  <textarea
                    required
                    rows={2}
                    placeholder="Flat No, Building, Area, Landmark"
                    className="w-full bg-transparent text-sm text-white focus:outline-none resize-none"
                    value={formData.streetAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        streetAddress: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Pincode with Auto-Lookup */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400">
                  Pincode (Auto-Lookup)
                </label>
                <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3.5 py-3">
                  <Globe className="h-4 w-4 text-[#22c55e] mr-2.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="854105"
                    className="w-full bg-transparent text-sm text-white tracking-widest focus:outline-none"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                  />
                  {fetchingPincode && (
                    <RefreshCw className="h-4 w-4 animate-spin text-[#22c55e]" />
                  )}
                </div>
              </div>

              {/* District / City & State (Auto-Filled) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400">
                    District / City
                  </label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#1a1a1a] px-3.5 py-3">
                    <Building2 className="h-4 w-4 text-gray-500 mr-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Auto-matched"
                      className="w-full bg-transparent text-sm text-white focus:outline-none font-medium"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400">
                    State
                  </label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262626] bg-[#1a1a1a] px-3.5 py-3">
                    <Globe className="h-4 w-4 text-gray-500 mr-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Auto-matched"
                      className="w-full bg-transparent text-sm text-white focus:outline-none font-medium"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || fetchingPincode}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] py-4 text-sm font-bold text-white shadow-lg shadow-green-600/20 hover:bg-[#15803d] transition disabled:opacity-50"
              >
                <CreditCard className="h-4 w-4" />
                {submitting
                  ? "Processing Payment..."
                  : `Pay ₹${(grandTotal / 100).toFixed(2)} Securely`}
              </button>
            </form>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-[#262626] bg-[#141414] p-8">
              <h2 className="text-lg font-bold border-b border-[#262626] pb-4">
                Order Summary
              </h2>

              <div className="flex items-center justify-between py-4 border-b border-[#262626]">
                <div>
                  <p className="text-sm font-bold text-white">
                    BrainBowl Roasted Makhana
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Unit Price: ₹{(unitPrice / 100).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls (+ / -) */}
                <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#262626] rounded-xl px-2 py-1">
                  <button
                    type="button"
                    onClick={handleDecreaseQuantity}
                    className="p-1 text-gray-400 hover:text-white transition rounded-md"
                    title="Decrease Quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncreaseQuantity}
                    className="p-1 text-gray-400 hover:text-white transition rounded-md"
                    title="Increase Quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 py-4 text-xs text-gray-400 border-b border-[#262626]">
                <div className="flex justify-between">
                  <span>Subtotal ({quantity} {quantity === 1 ? "item" : "items"})</span>
                  <span className="text-white font-medium">
                    ₹{(productSubtotal / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  {isFreeShipping ? (
                    <span className="text-[#22c55e] font-bold">FREE</span>
                  ) : (
                    <span className="text-white font-semibold">
                      +₹{(shippingFee / 100).toFixed(2)}
                    </span>
                  )}
                </div>

                {!isFreeShipping && (
                  <p className="mt-2 text-[10px] text-amber-400 bg-amber-950/30 border border-amber-800/40 p-2 rounded-lg">
                    💡 Add items worth ₹{((shippingRules.freeShippingMinAmount - productSubtotal) / 100).toFixed(0)} more for FREE shipping!
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-sm font-bold">Total Amount</span>
                <span className="text-xl font-black text-[#22c55e]">
                  ₹{(grandTotal / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6 space-y-3">
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <ShieldCheck className="h-5 w-5 text-[#22c55e]" /> 256-Bit SSL
                Encrypted Payment
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <Truck className="h-5 w-5 text-[#22c55e]" /> Dispatched within
                24 hours
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal for Authenticated Screen in case needed */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setFormData((prev) => ({
            ...prev,
            name: loggedInUser.name || "",
            email: loggedInUser.email || "",
            phone: loggedInUser.phone || "",
          }));
          setAuthModalOpen(false);
          toast.success(`Welcome, ${loggedInUser.name}!`);
        }}
      />
    </div>
  );
}