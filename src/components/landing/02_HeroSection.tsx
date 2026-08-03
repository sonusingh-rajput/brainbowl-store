'use client';

import { motion } from 'framer-motion';

export default function HeroSection({ onBuyNow }: { onBuyNow: () => void }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block rounded-full bg-[#22c55e]/10 px-3 py-1 text-xs font-semibold text-[#22c55e] border border-[#22c55e]/20">
          🌱 100% Organic & Slow Roasted
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl text-white leading-tight">
          Fuel Your Brain With <span className="text-[#22c55e]">Superfood Makhana</span>
        </h1>
        <p className="mt-4 text-base text-gray-400 leading-relaxed">
          Handpicked premium Fox Nuts roasted in cold-pressed olive oil. Packed with plant protein, magnesium, and zero cholesterol.
        </p>

        <div className="mt-8 flex items-baseline gap-4">
          <span className="text-3xl font-black text-white">₹299.00</span>
          <span className="text-lg text-gray-500 line-through">₹499.00</span>
          <span className="text-xs font-bold text-[#22c55e] bg-green-950/50 px-2 py-1 rounded border border-green-800">
            40% OFF
          </span>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={onBuyNow}
            className="rounded-xl bg-[#16a34a] px-8 py-4 font-bold text-white shadow-lg shadow-green-600/20 hover:bg-[#15803d] transition transform hover:scale-[1.02]"
          >
            Order Now — ₹299
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative rounded-3xl border border-[#262626] bg-[#141414] p-4 text-center overflow-hidden group"
      >
        <img
          src="https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80"alt="BrainBowl Superfood Makhana"className="w-full h-80 object-cover rounded-2xl group-hover:scale-105 transition duration-500"/>
        <div className="p-4 text-left">
          <p className="font-bold text-white text-lg">BrainBowl Classic Roasted Pack (250g)</p>
          <p className="text-xs text-gray-400 mt-1">Jumbo 4+ Suta Grade • Zero Trans Fat</p>
        </div>
      </motion.div>
    </section>
  );
}