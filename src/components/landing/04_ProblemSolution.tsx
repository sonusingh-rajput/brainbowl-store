export default function ProblemSolution() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-black text-white">Why Ditch Unhealthy Snacks?</h2>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-red-900/30 bg-red-950/10 p-8">
          <h3 className="text-xl font-bold text-red-400">❌ Junk Snacks (Chips/Biscuits)</h3>
          <ul className="mt-4 space-y-3 text-sm text-neutral-400">
            <li>• Deep fried in refined palm oils</li>
            <li>• High calorie & causes energy crashes</li>
            <li>• Loaded with artificial preservatives</li>
            <li>• Promotes weight gain and bloating</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-green-900/30 bg-green-950/10 p-8">
          <h3 className="text-xl font-bold text-green-400">✅ BrainBowl Makhana</h3>
          <ul className="mt-4 space-y-3 text-sm text-neutral-300">
            <li>• Slow roasted in pure olive oil/ghee</li>
            <li>• Rich in plant protein & magnesium</li>
            <li>• Keeps you full for hours with clean energy</li>
            <li>• 100% natural, guilt-free snacking</li>
          </ul>
        </div>
      </div>
    </section>
  );
}