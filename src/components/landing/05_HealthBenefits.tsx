export default function HealthBenefits() {
  return (
    <section id="benefits" className="mx-auto max-w-6xl px-6 py-20 border-t border-neutral-800">
      <h2 className="text-center text-3xl font-black text-white">Backed By Science & Nutrition</h2>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40">
          <div className="text-4xl">🧠</div>
          <h3 className="mt-4 font-bold text-white text-lg">Brain Function</h3>
          <p className="mt-2 text-xs text-neutral-400">Contains essential thiamine & flavonoids supporting memory and cognitive performance.</p>
        </div>
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40">
          <div className="text-4xl">⚖️</div>
          <h3 className="mt-4 font-bold text-white text-lg">Weight Management</h3>
          <p className="mt-2 text-xs text-neutral-400">Low glycemic index and high dietary fiber content suppress unhealthy food cravings.</p>
        </div>
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40">
          <div className="text-4xl">❤️</div>
          <h3 className="mt-4 font-bold text-white text-lg">Heart & Bone Health</h3>
          <p className="mt-2 text-xs text-neutral-400">Rich in calcium and potassium to maintain healthy blood pressure and bone density.</p>
        </div>
      </div>
    </section>
  );
}