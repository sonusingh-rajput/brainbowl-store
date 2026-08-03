export default function FAQSection() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-20 border-t border-neutral-800">
      <h2 className="text-center text-3xl font-black text-white">Frequently Asked Questions</h2>
      <div className="mt-12 space-y-6">
        <details className="group rounded-xl bg-neutral-900 p-6 border border-neutral-800">
          <summary className="cursor-pointer font-bold text-white">What is the shelf life of BrainBowl Makhana?</summary>
          <p className="mt-3 text-sm text-neutral-400">Our nitrogen-flushed packaging guarantees a shelf life of 9 months from the date of manufacturing.</p>
        </details>
        <details className="group rounded-xl bg-neutral-900 p-6 border border-neutral-800">
          <summary className="cursor-pointer font-bold text-white">How long does shipping take?</summary>
          <p className="mt-3 text-sm text-neutral-400">Orders are dispatched within 24 hours. Delivery takes 2–4 business days across major Indian cities.</p>
        </details>
      </div>
    </section>
  );
}