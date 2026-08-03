export default function HowItIsMade() {
  return (
    <section className="border-t border-neutral-800 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-black text-white">The 4-Step Perfection Process</h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
          <div><div className="text-green-400 font-black text-xl">01</div><h3 className="mt-2 text-white font-bold">Harvesting</h3><p className="text-xs text-neutral-400 mt-1">Hand-picked from fresh wetlands.</p></div>
          <div><div className="text-green-400 font-black text-xl">02</div><h3 className="mt-2 text-white font-bold">Sun Drying</h3><p className="text-xs text-neutral-400 mt-1">Naturally sun-cured for 48 hours.</p></div>
          <div><div className="text-green-400 font-black text-xl">03</div><h3 className="mt-2 text-white font-bold">Air Roasting</h3><p className="text-xs text-neutral-400 mt-1">Roasted to peak crispness.</p></div>
          <div><div className="text-green-400 font-black text-xl">04</div><h3 className="mt-2 text-white font-bold">Nitrogen Pack</h3><p className="text-xs text-neutral-400 mt-1">Sealed fresh with zero oxygen.</p></div>
        </div>
      </div>
    </section>
  );
}