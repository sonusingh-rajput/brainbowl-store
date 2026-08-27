'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { ArrowLeft, Printer, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface InvoiceData {
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
  createdAt: string;
}

export default function InvoicePage({
  params,
}: {
  params: Promise<{ receiptId: string }>;
}) {
  const resolvedParams = use(params);
  const receiptId = resolvedParams.receiptId;

  const [order, setOrder] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders?receiptId=${receiptId}`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const fetchedOrder = data.data[0];
          const ELIGIBLE_STATUSES = ['PAID', 'SHIPPED', 'DELIVERED', 'RETURN_REQUESTED', 'RETURNED'];
          if (!ELIGIBLE_STATUSES.includes(fetchedOrder.status?.toUpperCase())) {
            setError(`Tax invoices are generated for Paid, Shipped, or Delivered orders. Current status: ${fetchedOrder.status}`);
          } else {
            setOrder(fetchedOrder);
          }
        } else {
          setError('Invoice not found for receipt number: ' + receiptId);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [receiptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-sans">
        <p className="text-sm text-gray-400 animate-pulse">Generating invoice receipt...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 font-sans">
        <div className="rounded-2xl border border-[#262626] bg-[#141414] p-8 max-w-md text-center">
          <h2 className="text-lg font-bold text-red-400">Invoice Unavailable</h2>
          <p className="text-xs text-gray-400 mt-2">{error || 'Order record not found.'}</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-[#16a34a] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#15803d]"
          >
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const basePrice = order.amount / 100;
  const shippingFee = (order.shippingCost || 0) / 100;
  const totalAmount = basePrice + shippingFee;
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 font-sans print:p-0 print:bg-white print:text-black">
      {/* Universal 1-Page A4 Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #111827 !important;
            height: auto !important;
            overflow: visible !important;
          }
          .no-print {
            display: none !important;
          }
          .invoice-page-paper {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #111827 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-3xl">
        {/* Navigation & Action Bar (Hidden on Print) */}
        <div className="no-print flex items-center justify-between pb-6 mb-6 border-b border-[#262626]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#22c55e] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl bg-[#16a34a] px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-[#15803d] transition cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Print / Download PDF
          </button>
        </div>

        {/* Invoice Body (Pure White Paper Card, Single-Page Compact Fit) */}
        <div
          className="invoice-page-paper rounded-3xl bg-white text-gray-900 p-6 sm:p-8 shadow-2xl border border-gray-200"
        >
          {/* Header */}
          <div className="flex justify-between items-center gap-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-full border border-amber-500 bg-[#0b1711] p-1 flex items-center justify-center shrink-0">
                <Image
                  src="/Brain Bowl Logo.png"
                  alt="BrainBowl"
                  width={38}
                  height={38}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="font-serif text-xl font-black tracking-tight text-gray-900">
                  Brain<span className="text-amber-700">Bowl</span>
                </h1>
                <p className="text-[9px] tracking-wider uppercase text-amber-800 font-bold">
                  Nourish Your Brain & Body
                </p>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-base font-black uppercase tracking-wider text-gray-900">TAX INVOICE</h2>
              <p className="text-xs font-mono text-gray-600 mt-0.5">
                Invoice No: <span className="font-bold text-gray-900">{order.receiptId}</span>
              </p>
              <p className="text-xs text-gray-600">Date: {orderDate}</p>
            </div>
          </div>

          {/* Seller & Customer Details */}
          <div className="grid grid-cols-2 gap-4 my-4 text-xs">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Sold By / Brand
              </span>
              <p className="mt-0.5 font-bold text-gray-900 text-xs">BrainBowl Foods & Wellness</p>
              <p className="text-gray-600 text-[11px] mt-0.5">100% Plant-Based Superfoods</p>
              <p className="text-gray-600 text-[11px]">Support: support@brainbowl.in</p>
              <p className="text-gray-600 text-[11px]">Website: https://www.brainbowl.in</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Billed & Shipped To
              </span>
              <p className="mt-0.5 font-bold text-gray-900 text-xs">{order.customerName}</p>
              {order.customerPhone && (
                <p className="text-gray-600 text-[11px] mt-0.5">Phone: +91 {order.customerPhone}</p>
              )}
              {order.customerEmail && (
                <p className="text-gray-600 text-[11px]">Email: {order.customerEmail}</p>
              )}
              <p className="text-gray-800 text-[11px] mt-0.5 font-medium leading-tight">
                {order.shippingAddress}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-xl border border-gray-200 overflow-hidden mb-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-3.5 font-bold">Item Description</th>
                  <th className="py-2.5 px-3.5 text-center font-bold">Qty</th>
                  <th className="py-2.5 px-3.5 text-right font-bold">Price</th>
                  <th className="py-2.5 px-3.5 text-right font-bold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-3.5">
                    <p className="font-bold text-gray-900">
                      BrainBowl — Premium Roasted Superfood Makhana
                    </p>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      100% Plant-Based • Zero Added Sugar • Gluten Free
                    </p>
                  </td>
                  <td className="py-3 px-3.5 text-center font-semibold text-gray-800">1</td>
                  <td className="py-3 px-3.5 text-right text-gray-800 font-medium">₹{basePrice.toFixed(2)}</td>
                  <td className="py-3 px-3.5 text-right font-bold text-gray-900">₹{basePrice.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-4">
            <div className="w-60 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">₹{basePrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping & Handling:</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Taxes (Included):</span>
                <span className="font-semibold text-gray-900">₹0.00</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-black text-gray-900">
                <span>Total Amount Paid:</span>
                <span className="text-green-700">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200 flex justify-between items-center gap-2 text-[10px] text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
              <span className="font-medium">FSSAI Certified Superfood Makhana • ISO 22000 Assured</span>
            </div>
            <p>Computer-generated tax invoice. No physical signature required.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
