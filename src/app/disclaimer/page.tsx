import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nutritional Disclaimer — BrainBowl',
  description: 'Health and dietary disclaimer regarding BrainBowl superfood products.',
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#0b1711] text-[#f4efe6] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8 bg-[#11241a] p-8 sm:p-12 rounded-3xl border border-[#2d4739] shadow-2xl">
        <Link href="/" className="text-xs font-bold text-[#d4af37] hover:underline">
          ← Back to Home
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#f4efe6]">
          Nutritional & Health Disclaimer
        </h1>
        <p className="text-xs text-[#8ea396]">Last Updated: August 2026</p>

        <div className="space-y-6 text-sm text-[#c2d1c7] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">1. Dietary Product Information</h2>
            <p>
              BrainBowl products are intended as wholesome, natural dietary superfoods. The statements and health benefits mentioned on this website have not been evaluated as medical claims.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">2. Not Medical Advice</h2>
            <p>
              Content provided on this site is for informational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always consult your physician before starting new dietary regimens.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#d4af37]">3. Allergens</h2>
            <p>
              While Makhana is naturally gluten-free and non-allergenic, our products are processed in facilities that follow strict sanitation standards. Please read ingredient labels carefully if you have severe food allergies.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}