import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — BrainBowl',
  description: 'Learn how BrainBowl collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0b1711] text-[#f4efe6] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8 bg-[#11241a] p-8 sm:p-12 rounded-3xl border border-[#2d4739] shadow-2xl">
        <Link href="/" className="text-xs font-bold text-[#d4af37] hover:underline">
          ← Back to Home
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#f4efe6]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#8ea396]">Last Updated: August 2026</p>

        <div className="space-y-6 text-sm text-[#c2d1c7] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">1. Information We Collect</h2>
            <p>
              We collect personal details such as your name, email address, shipping address, phone number, and payment information when you place an order or register on our website.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">2. How We Use Your Information</h2>
            <p>
              Your information is strictly used to fulfill your orders, process payments, send shipping updates, improve our products, and provide customer support.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">3. Data Security & Third-Party Sharing</h2>
            <p>
              We do not sell or rent your personal data to third parties. Data is shared only with trusted service providers (e.g., payment gateways like Razorpay and shipping couriers) strictly for order processing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">4. Cookies</h2>
            <p>
              Our website uses cookies to store session preferences, enhance browsing speed, and analyze website traffic to deliver a better user experience.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}