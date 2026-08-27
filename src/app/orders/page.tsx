'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Search,
  Truck,
  ExternalLink,
  PackageCheck,
  RefreshCw,
  FileText,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { formatExternalUrl } from '@/lib/formatUrl';
import InvoiceModal, { InvoiceOrder } from '@/components/InvoiceModal';
import ReturnRequestModal, { ReturnModalOrder } from '@/components/ReturnRequestModal';

interface LookupOrder {
  id: string;
  receiptId: string;
  amount: number;
  shippingCost?: number;
  status: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress: string;
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

export default function OrderLookupPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<LookupOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Invoice Modal State
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<InvoiceOrder | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Return Modal State
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<ReturnModalOrder | null>(null);
  const [returnModalOpen, setReturnModalOpen] = useState(false);

  const fetchOrders = async () => {
    if (!phone) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders?phone=${phone}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleOpenInvoice = (order: LookupOrder) => {
    if (
      order.status !== 'PAID' &&
      order.status !== 'SHIPPED' &&
      order.status !== 'DELIVERED' &&
      order.status !== 'RETURN_REQUESTED' &&
      order.status !== 'RETURNED'
    ) {
      toast.error('Tax invoice is only generated for PAID orders.');
      return;
    }

    setSelectedInvoiceOrder({
      id: order.id,
      receiptId: order.receiptId,
      amount: order.amount,
      shippingCost: order.shippingCost || 0,
      status: order.status,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone || phone,
      shippingAddress: order.shippingAddress,
      razorpayPaymentId: order.razorpayPaymentId,
      awbNumber: order.awbNumber,
      createdAt: order.createdAt,
    });
    setInvoiceModalOpen(true);
  };

  const handleOpenReturnModal = (order: LookupOrder) => {
    setSelectedReturnOrder({
      id: order.id,
      receiptId: order.receiptId || order.id.slice(0, 8),
      amount: order.amount,
      status: order.status,
      customerName: order.customerName,
    });
    setReturnModalOpen(true);
  };

  return (
    <>
      <main className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans print:hidden">
        <div className="mx-auto max-w-3xl py-6">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#22c55e] hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to BrainBowl Store
        </a>

        <div className="rounded-3xl border border-[#262626] bg-[#141414] p-8 shadow-2xl">
          <div className="flex items-center gap-3 pb-6 border-b border-[#262626]">
            <div className="p-3 rounded-2xl bg-green-950/50 border border-green-800/40 text-[#22c55e]">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Track Your Order Delivery & Returns</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Enter your 10-digit registered phone number to check live shipping, delivery dates, request returns, and download tax invoices.
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="tel"
                required
                maxLength={10}
                pattern="[6-9][0-9]{9}"
                placeholder="Enter 10-Digit Mobile Number"
                className="w-full rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm text-white focus:border-[#22c55e] focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 hover:bg-[#15803d] transition disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {loading ? 'Searching...' : 'Track Orders'}
            </button>
          </form>

          {/* Results List */}
          {searched && !loading && orders.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Found {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </h2>

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-[#262626] bg-[#0a0a0a] p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262626] pb-3">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Receipt Number</span>
                      <p className="font-mono text-sm font-bold text-white">{order.receiptId || order.id.slice(0, 8)}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-[#22c55e]">
                        ₹{(order.amount / 100).toFixed(2)}
                      </span>
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
                          ? 'RETURN REQUESTED'
                          : order.status === 'RETURNED'
                          ? 'RETURN COMPLETED'
                          : order.status === 'PAID'
                          ? 'PAID & CONFIRMED'
                          : order.status === 'CANCELLED'
                          ? 'CANCELLED'
                          : 'PENDING'}
                      </span>
                    </div>
                  </div>

                  {/* Tracking Link & AWB Box */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#141414] p-3.5 rounded-xl border border-[#262626]">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold">AWB Tracking Number</span>
                      {order.awbNumber ? (
                        <span className="font-mono text-xs text-[#22c55e] font-bold">
                          {order.awbNumber}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 italic">Dispatch & AWB assignment in progress</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {order.awbNumber && (
                        <a
                          href={formatExternalUrl(order.courierUrl, order.awbNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-950/60 border border-blue-800/50 px-3 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-900/80 transition"
                        >
                          Track Package <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}

                      {/* Invoice Button */}
                      {(order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'RETURN_REQUESTED' || order.status === 'RETURNED') && (
                        <button
                          onClick={() => handleOpenInvoice(order)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#262626] border border-gray-700 px-3 py-1.5 text-xs font-bold text-gray-200 hover:bg-[#333] hover:text-white transition cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5 text-[#d4af37]" /> Invoice
                        </button>
                      )}

                      {/* Return Action Button */}
                      {order.status === 'DELIVERED' && (
                        <button
                          onClick={() => handleOpenReturnModal(order)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 px-3 py-1.5 text-xs font-bold transition cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Return
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Return details callout if active */}
                  {order.status === 'RETURN_REQUESTED' && (
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-300 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">⏳ Return Request Under Review</span>
                        {order.returnRequestedAt && (
                          <span className="text-[10px] text-gray-400">
                            Requested on {new Date(order.returnRequestedAt).toLocaleDateString('en-IN')}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-[11px]">
                        <strong>Reason:</strong> {order.returnReason}
                      </p>
                      {order.returnUpi && (
                        <p className="text-gray-400 text-[10px] font-mono">
                          Refund destination: {order.returnUpi}
                        </p>
                      )}
                    </div>
                  )}

                  {order.status === 'RETURNED' && (
                    <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs text-purple-300 space-y-1">
                      <span className="font-bold">✓ Return Completed & Refund Processed</span>
                      <p className="text-gray-300 text-[11px]">
                        The item has been returned and refund settled to your account.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-400 pt-1">
                    <span>
                      Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {order.deliveredAt && order.status === 'DELIVERED' && ` • Delivered on ${new Date(order.deliveredAt).toLocaleDateString('en-IN')}`}
                    </span>
                    <span className="max-w-xs truncate">{order.shippingAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searched && !loading && orders.length === 0 && (
            <div className="mt-8 rounded-2xl border border-[#262626] bg-[#0a0a0a] p-8 text-center">
              <PackageCheck className="h-8 w-8 mx-auto text-gray-600 mb-2" />
              <p className="text-sm font-semibold text-white">No Orders Found</p>
              <p className="text-xs text-gray-400 mt-1">
                No orders match phone number <span className="text-[#22c55e] font-mono">{phone}</span>. Please verify and try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>

    {/* Reusable Printable Invoice Modal */}
    <InvoiceModal
      isOpen={invoiceModalOpen}
      order={selectedInvoiceOrder}
      onClose={() => {
        setInvoiceModalOpen(false);
        setSelectedInvoiceOrder(null);
      }}
    />

    {/* Reusable Return Request Modal */}
    <ReturnRequestModal
      isOpen={returnModalOpen}
      order={selectedReturnOrder}
      onClose={() => {
        setReturnModalOpen(false);
        setSelectedReturnOrder(null);
      }}
      onSuccess={() => {
        fetchOrders();
      }}
    />
  </>
  );
}