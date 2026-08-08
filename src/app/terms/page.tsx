import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions — BrainBowl',
  description: 'Terms and Conditions for using the BrainBowl website and purchasing products.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0b1711] text-[#f4efe6] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8 bg-[#11241a] p-8 sm:p-12 rounded-3xl border border-[#2d4739] shadow-2xl">
        <Link href="/" className="text-xs font-bold text-[#d4af37] hover:underline">
          ← Back to Home
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#f4efe6]">
          Terms & Conditions
        </h1>
        <p className="text-xs text-[#8ea396]">Last Updated: August 2026</p>

        <div className="space-y-6 text-sm text-[#c2d1c7] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">1. Introduction</h2>
            <p>
              Welcome to BrainBowl (www.brainbowl.in). By accessing or purchasing from our website, you agree to be bound by these Terms and Conditions. Please read them carefully before placing an order.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">2. Products & Orders</h2>
            <p>
              All products listed on the website are subject to availability. We reserve the right to discontinue or change product specifications, pricing, and availability without prior notice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">3. Pricing & Payments</h2>
            <p>
              Prices listed are in Indian Rupees (INR) and include applicable taxes unless specified otherwise. Payments are securely processed via Razorpay. We accept UPI, debit/credit cards, net banking, and Cash on Delivery (COD).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">4. User Account & Conduct</h2>
            <p>
              You are responsible for maintaining the confidentiality of your user account details and password. You agree not to misuse the website or engage in fraudulent transaction activities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">5. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in New Delhi / Bihar.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}