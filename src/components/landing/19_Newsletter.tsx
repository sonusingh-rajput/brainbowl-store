export default function Newsletter() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-center">
      <h2 className="text-2xl font-bold text-white">Join The Healthy Snacking Club</h2>
      <p className="mt-2 text-xs text-neutral-400">Get 10% off your second order + exclusive health tips.</p>
      <form className="mt-6 flex max-w-md mx-auto gap-2">
        <input type="email" placeholder="Enter your email" className="flex-1 rounded-xl bg-neutral-900 border border-neutral-800 p-3 text-sm text-white focus:outline-none focus:border-green-500" />
        <button type="button" className="bg-neutral-800 px-6 py-3 rounded-xl text-xs font-bold text-white hover:bg-neutral-700">Subscribe</button>
      </form>
    </section>
  );
}