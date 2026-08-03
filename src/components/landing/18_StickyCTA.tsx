'use client';

export default function StickyCTA({ onBuyNow }: { onBuyNow: () => void }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-md bg-neutral-900/90 backdrop-blur-md border border-neutral-700 p-4 rounded-2xl shadow-2xl flex items-center justify-between">
      <div>
        <span className="block text-xs font-bold text-white">BrainBowl Superfood</span>
        <span className="text-sm font-black text-green-400">₹299.00</span>
      </div>
      <button onClick={onBuyNow} className="bg-green-600 text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-green-500 transition">
        Buy Now
      </button>
    </div>
  );
}