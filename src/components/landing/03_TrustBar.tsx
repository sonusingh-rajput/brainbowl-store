'use client';

import { motion } from 'framer-motion';
import {
  Leaf,
  Wheat,
  ShieldAlert,
  HeartPulse,
  Brain,
  Sparkles,
} from 'lucide-react';

export default function TrustBar() {
  // Items extracted directly from the BrainBowl poster
  const trustItems = [
    {
      icon: Leaf,
      title: "100% NATURAL",
      subtitle: "100% Plant Based",
    },
    {
      icon: Wheat,
      title: "GLUTEN FREE",
      subtitle: "Easy to Digest",
    },
    {
      icon: ShieldAlert,
      title: "NO PRESERVATIVES",
      subtitle: "Pure & Clean Nutrition",
    },
    {
      icon: HeartPulse,
      title: "NO ADDED SUGAR",
      subtitle: "Date & Banana Sweetened",
    },
    {
      icon: Brain,
      title: "BOOSTS BRAIN HEALTH",
      subtitle: "Focus & Memory Support",
    },
    {
      icon: Sparkles,
      title: "SUPERFOOD MAKHANA",
      subtitle: "Rich in Minerals & Protein",
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-[#2d4739] bg-gradient-to-r from-[#070f0b] via-[#11241a] to-[#070f0b] py-8 sm:py-10">
      {/* Gold Divider Accent Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Poster Top Banner Tagline */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-1 text-xs font-bold tracking-widest text-[#d4af37] uppercase">
            <span>✨</span> SUPERFOOD FOR EVERY BODY & EVERY AGE
          </span>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5 items-stretch justify-center">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="group relative flex flex-col items-center text-center p-3.5 rounded-2xl border border-[#2d4739]/60 bg-[#0b1711]/70 hover:bg-[#11241a] hover:border-[#d4af37] transition-all duration-300 shadow-md"
              >
                {/* Gold Circle Icon Box */}
                <div className="mb-2.5 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#0b1711] text-[#d4af37] shadow-inner group-hover:scale-105 group-hover:bg-[#d4af37] group-hover:text-[#0b1711] transition duration-300">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Badge Title & Description */}
                <h4 className="font-serif text-xs font-bold text-[#f4efe6] tracking-wide group-hover:text-[#d4af37] transition">
                  {item.title}
                </h4>
                <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-[#8ea396] leading-tight group-hover:text-[#c2d1c7] transition">
                  {item.subtitle}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Poster Footer Tagline Bar */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-[11px] font-bold text-[#d4af37] uppercase tracking-wider text-center border-t border-[#2d4739]/40 pt-4">
          <span>🌿 PURE NUTRITION</span>
          <span className="hidden sm:inline text-[#2d4739]">•</span>
          <span>🌱 CLEAN INGREDIENTS</span>
          <span className="hidden sm:inline text-[#2d4739]">•</span>
          <span>💪 BETTER YOU</span>
        </div>
      </div>
    </section>
  );
}