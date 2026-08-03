export default function CustomerReviews() {
  return (
    <section id="reviews" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-black text-white">Loved By 10,000+ Health Enthusiasts</h2>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Ananya Sharma', review: 'The crunch is unmatched! Perfect for late-night study cravings without guilt.', city: 'Delhi' },
          { name: 'Rahul Verma', review: 'Switching from potato chips to BrainBowl reduced my weekly calorie intake noticeably.', city: 'Bengaluru' },
          { name: 'Priya Patel', review: 'Fresh, jumbo-sized Makhana. Best Peri Peri flavor on the market hands down.', city: 'Mumbai' }
        ].map((item, idx) => (
          <div key={idx} className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40">
            <div className="text-yellow-400 text-sm">★★★★★</div>
            <p className="mt-3 text-sm text-neutral-300">"{item.review}"</p>
            <div className="mt-4 text-xs font-bold text-white">{item.name} <span className="text-neutral-500">• {item.city}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}