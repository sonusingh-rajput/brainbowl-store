import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy — BrainBowl',
  description: 'Pan-India shipping rates, dispatch timelines, and delivery details.',
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0b1711] text-[#f4efe6] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8 bg-[#11241a] p-8 sm:p-12 rounded-3xl border border-[#2d4739] shadow-2xl">
        <Link href="/" className="text-xs font-bold text-[#d4af37] hover:underline">
          ← Back to Home
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#f4efe6]">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-[#8ea396]">Last Updated: August 2026</p>

        <div className="space-y-6 text-sm text-[#c2d1c7] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">1. Dispatch Timeline</h2>
            <p>
              All orders placed on BrainBowl are processed and dispatched within 24 business hours from our fulfillment facility.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">2. Delivery Estimates</h2>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Metro Cities: 2 to 4 business days</li>
              <li>Rest of India: 4 to 6 business days</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">3. Order Tracking</h2>
            <p>
              Once your shipment is dispatched, a tracking link will be sent to your registered email and phone number via SMS/WhatsApp.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}