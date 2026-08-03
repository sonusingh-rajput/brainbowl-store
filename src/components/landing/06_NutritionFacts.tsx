export default function NutritionFacts() {
  return (
    <section id="nutrition" className="mx-auto max-w-4xl px-6 py-16 bg-neutral-900/50 rounded-3xl border border-neutral-800 my-10">
      <h2 className="text-center text-2xl font-bold text-white">Nutritional Profile (Per 100g)</h2>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
          <span className="block text-2xl font-black text-green-400">14.5g</span>
          <span className="text-xs text-neutral-400">Protein</span>
        </div>
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
          <span className="block text-2xl font-black text-green-400">347 kcal</span>
          <span className="text-xs text-neutral-400">Calories</span>
        </div>
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
          <span className="block text-2xl font-black text-green-400">14.5g</span>
          <span className="text-xs text-neutral-400">Dietary Fiber</span>
        </div>
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
          <span className="block text-2xl font-black text-green-400">60mg</span>
          <span className="text-xs text-neutral-400">Calcium</span>
        </div>
      </div>
    </section>
  );
}