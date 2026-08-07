'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeroSection({ onBuyNow }: { onBuyNow: () => void }) {
  return (
    <section className="relative overflow-hidden bg-[#0b1711] py-12 md:py-20 border-b border-[#2d4739]">
      {/* Background Gold Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-[#1b3d2f]/40 blur-2xl pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
        
        {/* Left Column: Text & CTA */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold text-[#d4af37] border border-[#d4af37]/30">
            🌱 100% Plant-Based • No Added Sugar
          </span>
          
          <h1 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#f4efe6] leading-tight font-serif">
            Fuel Your Brain With <br />
            <span className="text-[#d4af37]">Superfood Wellness Drink</span>
          </h1>
          
          <p className="mt-4 text-sm sm:text-base text-[#c2d1c7] leading-relaxed">
            Nourish your brain and body with pure, natural ingredients. Packed with mental focus nutrients, immunity support, and sustained energy — with zero added sugar.
          </p>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-3xl font-extrabold text-[#f4efe6]">₹499.00</span>
            <span className="text-lg text-[#6b7c70] line-through">₹799.00</span>
            <span className="text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-md border border-[#d4af37]/30">
              37% OFF
            </span>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={onBuyNow}
              className="rounded-xl bg-[#d4af37] px-8 py-4 font-bold text-[#0b1711] shadow-lg shadow-[#d4af37]/15 hover:bg-[#c39e2e] transition transform hover:scale-[1.02]"
            >
              Order Now — ₹499
            </button>
          </div>
        </motion.div>

        {/* Right Column: Refined Podium Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          {/* Main Card Container */}
          <div className="relative w-full rounded-3xl border border-[#2d4739] bg-gradient-to-b from-[#11241a] to-[#070f0b] p-6 sm:p-8 text-center overflow-hidden shadow-2xl group flex flex-col items-center">
            
            {/* Background Decorative Arches */}
            <div className="absolute top-6 w-72 h-72 rounded-t-full border-2 border-[#d4af37]/20 bg-gradient-to-b from-[#d4af37]/5 to-transparent pointer-events-none" />
            
            {/* Top Right Net Wt Badge */}
            <div className="absolute top-4 right-4 h-16 w-16 sm:h-18 sm:w-18 rounded-full border-2 border-[#d4af37] bg-[#0b1711]/90 backdrop-blur-sm p-1 shadow-lg flex flex-col items-center justify-center text-center z-20">
              <span className="text-[9px] font-bold uppercase text-[#d4af37] tracking-wider">NET WT.</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#f4efe6]">500g</span>
            </div>

            {/* Product Image Frame */}
            <div className="relative z-10 w-full max-w-sm flex justify-center transition duration-500 group-hover:scale-105 my-2">
              <Image
                src="/product_image.jpeg"
                alt="BrainBowl Wellness Drink"
                width={500}
                height={400}
                className="w-full h-auto max-h-[280px] sm:max-h-[320px] object-contain rounded-2xl drop-shadow-[0_15px_20px_rgba(0,0,0,0.7)]"
                priority
              />
            </div>

            {/* Subtle Divider Line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent my-4" />

            {/* Card Caption */}
            <div className="w-full text-center z-10">
              <h3 className="font-serif font-bold text-[#f4efe6] text-lg sm:text-xl">
                BrainBowl Wellness Drink (500g)
              </h3>
              <p className="text-xs sm:text-sm font-medium text-[#d4af37] mt-1 tracking-wide">
                Mental Focus • Immunity • Sustained Energy
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}