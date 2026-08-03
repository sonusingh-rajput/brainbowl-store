export default function RecipeIdeas() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 bg-neutral-900/30 rounded-3xl border border-neutral-800">
      <h2 className="text-center text-3xl font-black text-white">More Than Just A Snack</h2>
      <p className="text-center text-xs text-neutral-400 mt-2">Versatile superfood for any time of the day.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800"><h3 className="font-bold text-white">Makhana Kheer</h3><p className="text-xs text-neutral-400 mt-1">Healthy high-protein dessert replacement.</p></div>
        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800"><h3 className="font-bold text-white">Trail Mix</h3><p className="text-xs text-neutral-400 mt-1">Toss with almonds & pumpkin seeds.</p></div>
        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800"><h3 className="font-bold text-white">Curry Topper</h3><p className="text-xs text-neutral-400 mt-1">Add crunch to rich vegetable gravies.</p></div>
      </div>
    </section>
  );
}