'use client';

import { motion } from 'framer-motion';

const flavors = [
  { name: 'Peri Peri Spice', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80' },
  { name: 'Himalayan Salt', img: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=400&q=80' },
  { name: 'Mint & Cheese', img: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=400&q=80' },
  { name: 'Spanish Tomato', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
];

export default function FlavorsShowcase() {
  return (
    <section id="flavors" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-black text-white">4 Artisanal Flavors</h2>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {flavors.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -8 }}
            className="rounded-2xl border border-[#262626] bg-[#141414] overflow-hidden"
          >
            <img src={item.img} alt={item.name} className="h-40 w-full object-cover" />
            <div className="p-4 text-center">
              <h3 className="font-bold text-white">{item.name}</h3>
              <p className="mt-1 text-xs text-gray-400">100% Roasted in Olive Oil</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}