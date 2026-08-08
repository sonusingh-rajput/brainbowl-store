import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy — BrainBowl',
  description: 'Read our replacement and refund guidelines.',
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0b1711] text-[#f4efe6] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8 bg-[#11241a] p-8 sm:p-12 rounded-3xl border border-[#2d4739] shadow-2xl">
        <Link href="/" className="text-xs font-bold text-[#d4af37] hover:underline">
          ← Back to Home
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#f4efe6]">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs text-[#8ea396]">Last Updated: August 2026</p>

        <div className="space-y-6 text-sm text-[#c2d1c7] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">1. Order Cancellation</h2>
            <p>
              You can cancel your order within 2 hours of placing it or before it has been dispatched by contacting support@brainbowl.in. Once an order is dispatched, it cannot be canceled.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">2. Freshness & Replacement Guarantee</h2>
            <p>
              Due to the perishable food nature of our superfood products, we do not offer general returns. However, if your package arrives unsealed, damaged, or expired, we provide a 100% free immediate replacement or refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">3. Refund Processing Time</h2>
            <p>
              Approved refunds are credited back to the original payment method within 5 to 7 business days.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}