export default function ComparisonTable() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="text-center text-3xl font-black text-white">How We Compare</h2>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-300">
          <thead className="border-b border-neutral-800 text-xs uppercase text-neutral-400">
            <tr>
              <th className="py-3 px-4">Feature</th>
              <th className="py-3 px-4 text-green-400">BrainBowl</th>
              <th className="py-3 px-4">Store Makhana</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            <tr><td className="py-3 px-4">Size Grade</td><td className="py-3 px-4 text-green-400 font-bold">Jumbo (4+ Suta)</td><td className="py-3 px-4">Standard Mixed</td></tr>
            <tr><td className="py-3 px-4">Roasting Method</td><td className="py-3 px-4 text-green-400 font-bold">Air Roasted</td><td className="py-3 px-4">Palm Oil Fried</td></tr>
            <tr><td className="py-3 px-4">Preservatives</td><td className="py-3 px-4 text-green-400 font-bold">Zero</td><td className="py-3 px-4">Added Sulfites</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}