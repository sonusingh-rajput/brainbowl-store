'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  ShoppingBag,
  User,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  LogOut,
  PackageCheck,
  RefreshCw,
  ExternalLink,
  FileText,
  RotateCcw,
  CheckCircle,
  Truck,
  AlertCircle,
} from 'lucide-react';
import { formatExternalUrl } from '@/lib/formatUrl';
import InvoiceModal, { InvoiceOrder } from '@/components/InvoiceModal';
import ReturnRequestModal, { ReturnModalOrder } from '@/components/ReturnRequestModal';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface OrderItem {
  id: string;
  receiptId: string;
  amount: number;
  shippingCost?: number;
  status: string;
  shippingAddress: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  razorpayPaymentId?: string | null;
  awbNumber?: string | null;
  courierUrl?: string | null;
  deliveredAt?: string | null;
  returnReason?: string | null;
  returnDetails?: string | null;
  returnUpi?: string | null;
  returnStatus?: string | null;
  returnRequestedAt?: string | null;
  returnAdminNotes?: string | null;
  createdAt: string;
}

export default function UserDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Invoice Modal State
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<InvoiceOrder | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Return Request Modal State
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<ReturnModalOrder | null>(null);
  const [returnModalOpen, setReturnModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/user/dashboard', {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load user profile');
      }

      setUser(data.data.user);
      setOrders(data.data.orders || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error fetching user data');
      toast.error(err.message || 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully 👋');
      window.location.href = '/';
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const handleOpenInvoice = (order: OrderItem) => {
    if (order.status !== 'PAID' && order.status !== 'SHIPPED' && order.status !== 'DELIVERED' && order.status !== 'RETURN_REQUESTED' && order.status !== 'RETURNED') {
      toast.error('Tax invoice is only generated for PAID orders.');
      return;
    }

    setSelectedInvoiceOrder({
      id: order.id,
      receiptId: order.receiptId,
      amount: order.amount,
      shippingCost: order.shippingCost || 0,
      status: order.status,
      customerName: user?.name || order.customerName || 'Valued Customer',
      customerEmail: user?.email || order.customerEmail || '',
      customerPhone: user?.phone || order.customerPhone || '',
      shippingAddress: order.shippingAddress,
      razorpayPaymentId: order.razorpayPaymentId,
      awbNumber: order.awbNumber,
      createdAt: order.createdAt,
    });
    setInvoiceModalOpen(true);
  };

  const handleOpenReturnModal = (order: OrderItem) => {
    setSelectedReturnOrder({
      id: order.id,
      receiptId: order.receiptId || order.id.slice(0, 8),
      amount: order.amount,
      status: order.status,
      customerName: user?.name || order.customerName,
    });
    setReturnModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <RefreshCw className="h-4 w-4 animate-spin text-[#22c55e]" />
          Loading profile...
        </div>
      </div>
    );
  }

  if (errorMessage && !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md rounded-2xl border border-[#262626] bg-[#141414] p-6 text-center">
          <h2 className="text-lg font-bold text-red-400">Unable to Fetch Account Data</h2>
          <p className="mt-2 text-xs text-gray-400">{errorMessage}</p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href="/"
              className="rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-2 text-xs font-semibold hover:bg-[#1a1a1a]"
            >
              Back to Home
            </a>
            <button
              onClick={fetchDashboardData}
              className="rounded-xl bg-[#16a34a] px-4 py-2 text-xs font-bold text-white hover:bg-[#15803d]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10 font-sans print:hidden">
        <div className="mx-auto max-w-6xl">
        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#262626]">
          <div>
            <a href="/" className="flex items-center gap-1 text-xs font-bold text-[#22c55e] hover:underline mb-2">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Store
            </a>
            <h1 className="text-3xl font-black tracking-tight">Customer Account</h1>
            <p className="text-xs text-gray-400 mt-1">Manage profile details, track deliveries, and request returns.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 bg-[#141414] border border-[#262626] px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#1f1f1f] transition"
            >
              <RefreshCw className="h-4 w-4 text-[#22c55e]" /> Refresh
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-950/20 border border-red-900/40 text-red-400 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-900/30 transition"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        {/* User Account Info Cards */}
        {user && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gray-400">Full Name</span>
                <User className="h-5 w-5 text-[#22c55e]" />
              </div>
              <p className="mt-3 text-lg font-black text-white">{user.name}</p>
              <span className="text-[10px] text-gray-500">Verified Customer</span>
            </div>

            <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gray-400">Email Address</span>
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <p className="mt-3 text-sm font-bold text-white truncate">{user.email}</p>
              <span className="text-[10px] text-gray-500">Primary Contact</span>
            </div>

            <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gray-400">Phone Number</span>
                <Phone className="h-5 w-5 text-amber-400" />
              </div>
              <p className="mt-3 text-lg font-black text-white">+91 {user.phone}</p>
              <span className="text-[10px] text-gray-500">Shipping SMS Alerts</span>
            </div>

            <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gray-400">Member Since</span>
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
              <p className="mt-3 text-lg font-black text-white">
                {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </p>
              <span className="text-[10px] text-gray-500">Account Active</span>
            </div>
          </div>
        )}

        {/* Order History Table */}
        <div className="mt-10 rounded-2xl border border-[#262626] bg-[#141414] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#22c55e]" />
              <h2 className="text-lg font-bold text-white">Your Order History</h2>
            </div>
            <span className="text-xs text-gray-400">{orders.length} Total Orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="border-b border-[#262626] text-gray-400 uppercase">
                <tr>
                  <th className="py-3 px-3">Receipt ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">AWB & Tracking</th>
                  <th className="py-3 px-3">Invoice</th>
                  <th className="py-3 px-3">Returns & Facility</th>
                  <th className="py-3 px-3">Shipping Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#1a1a1a] transition">
                      <td className="py-4 px-3 font-semibold text-white font-mono">{order.receiptId || order.id.slice(0, 8)}</td>
                      <td className="py-4 px-3 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-4 px-3 font-bold text-white">
                        ₹{(order.amount / 100).toFixed(2)}
                      </td>
                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.status === 'DELIVERED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : order.status === 'SHIPPED'
                              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                              : order.status === 'RETURN_REQUESTED'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : order.status === 'RETURNED'
                              ? 'bg-purple-950 text-purple-400 border border-purple-800'
                              : order.status === 'PAID'
                              ? 'bg-green-950 text-green-400 border border-green-800'
                              : order.status === 'CANCELLED'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {order.status === 'DELIVERED' && <CheckCircle className="h-3 w-3" />}
                          {order.status === 'SHIPPED' && <Truck className="h-3 w-3" />}
                          {order.status === 'RETURN_REQUESTED' && <RotateCcw className="h-3 w-3" />}
                          {order.status === 'DELIVERED'
                            ? 'DELIVERED'
                            : order.status === 'SHIPPED'
                            ? 'SHIPPED / IN TRANSIT'
                            : order.status === 'RETURN_REQUESTED'
                            ? 'RETURN UNDER REVIEW'
                            : order.status === 'RETURNED'
                            ? 'RETURN COMPLETED'
                            : order.status === 'PAID'
                            ? 'PAID & CONFIRMED'
                            : order.status === 'CANCELLED'
                            ? 'CANCELLED'
                            : 'PENDING PAYMENT'}
                        </span>
                        {order.deliveredAt && order.status === 'DELIVERED' && (
                          <span className="block text-[10px] text-gray-500 mt-0.5">
                            on {new Date(order.deliveredAt).toLocaleDateString('en-IN')}
                          </span>
                        )}
                      </td>
                      {/* AWB & Tracking Link Column (Opens strictly external URL) */}
                      <td className="py-4 px-3">
                        {order.awbNumber ? (
                          <div className="flex flex-col gap-1 items-start">
                            <span className="font-mono text-xs text-[#22c55e] font-bold bg-green-950/40 px-2 py-0.5 rounded border border-green-800/40">
                              {order.awbNumber}
                            </span>
                            <a
                              href={formatExternalUrl(order.courierUrl, order.awbNumber)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 hover:underline font-semibold"
                            >
                              Track Courier <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-500 italic">
                            Dispatch in progress
                          </span>
                        )}
                      </td>
                      {/* Invoice Column */}
                      <td className="py-4 px-3">
                        {order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'RETURN_REQUESTED' || order.status === 'RETURNED' ? (
                          <button
                            onClick={() => handleOpenInvoice(order)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#262626] hover:bg-[#333333] text-gray-200 px-3 py-1.5 text-xs font-semibold transition border border-gray-700 hover:text-white cursor-pointer"
                          >
                            <FileText className="h-3.5 w-3.5 text-[#d4af37]" /> Invoice
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-500 italic">
                            Paid orders only
                          </span>
                        )}
                      </td>

                      {/* Return Facility Column */}
                      <td className="py-4 px-3">
                        {order.status === 'DELIVERED' ? (
                          <button
                            onClick={() => handleOpenReturnModal(order)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 px-3 py-1.5 text-xs font-bold transition shadow-sm cursor-pointer"
                          >
                            <RotateCcw className="h-3.5 w-3.5" /> Request Return
                          </button>
                        ) : order.status === 'RETURN_REQUESTED' ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                              <RotateCcw className="h-3 w-3 animate-spin" /> Return Pending
                            </span>
                            <span className="text-[10px] text-gray-400 truncate max-w-[140px]" title={order.returnReason || ''}>
                              Reason: {order.returnReason}
                            </span>
                          </div>
                        ) : order.status === 'RETURNED' ? (
                          <span className="text-[11px] font-bold text-purple-400 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Refund Settled
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-500 italic">
                            Available once delivered
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-3 text-gray-400 max-w-xs truncate">
                        {order.shippingAddress}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-500">
                      <PackageCheck className="h-8 w-8 mx-auto text-gray-600 mb-2" />
                      <p className="text-sm font-semibold">No orders placed yet.</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Your purchases and shipping tracking info will show here once you make an order.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    {/* Printable Invoice Modal */}
    <InvoiceModal
      isOpen={invoiceModalOpen}
      order={selectedInvoiceOrder}
      onClose={() => {
        setInvoiceModalOpen(false);
        setSelectedInvoiceOrder(null);
      }}
    />

    {/* Customer Return Request Modal */}
    <ReturnRequestModal
      isOpen={returnModalOpen}
      order={selectedReturnOrder}
      onClose={() => {
        setReturnModalOpen(false);
        setSelectedReturnOrder(null);
      }}
      onSuccess={() => {
        fetchDashboardData();
      }}
    />
  </>
  );
}