export default function ValueBundle({ onBuyNow }: { onBuyNow: () => void }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-black text-white">Save More With Multi-Packs</h2>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900/30 text-center">
          <h3 className="font-bold text-white">Single Pack</h3>
          <p className="text-2xl font-black text-white mt-2">₹299</p>
          <button onClick={onBuyNow} className="mt-6 w-full rounded-xl border border-neutral-700 py-3 text-xs font-bold text-white hover:bg-neutral-800">Order Single</button>
        </div>
        <div className="p-8 rounded-2xl border-2 border-green-500 bg-neutral-900 text-center relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-black px-3 py-0.5 text-xs font-bold rounded-full">MOST POPULAR</span>
          <h3 className="font-bold text-white">Pack of 3</h3>
          <p className="text-2xl font-black text-green-400 mt-2">₹799 <span className="text-xs text-neutral-500 line-through">₹897</span></p>
          <button onClick={onBuyNow} className="mt-6 w-full rounded-xl bg-green-600 py-3 text-xs font-bold text-white hover:bg-green-500">Order Pack of 3</button>
        </div>
        <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900/30 text-center">
          <h3 className="font-bold text-white">Family Pack of 6</h3>
          <p className="text-2xl font-black text-white mt-2">₹1,499</p>
          <button onClick={onBuyNow} className="mt-6 w-full rounded-xl border border-neutral-700 py-3 text-xs font-bold text-white hover:bg-neutral-800">Order Pack of 6</button>
        </div>
      </div>
    </section>
  );
}