'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { XCircle, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export default function ProblemSolution() {
  const problemPoints = [
    {
      title: "Deep Fried in Palm Oil",
      desc: "Packed with harmful trans fats and refined palm oils that increase bad cholesterol.",
    },
    {
      title: "Energy Crashes & Brain Fog",
      desc: "High simple carb & sugar content causes rapid blood sugar spikes followed by sudden fatigue.",
    },
    {
      title: "Loaded with Artificial Additives",
      desc: "Contains synthetic preservatives, artificial flavors, and MSG that cause bloating.",
    },
    {
      title: "Empty Calories",
      desc: "Provides zero essential minerals, leaving you hungry again within 30 minutes.",
    },
  ];

  const solutionPoints = [
    {
      title: "100% Plant-Based & Slow Roasted",
      desc: "Lightly roasted Fox Nuts without deep frying or artificial oils.",
    },
    {
      title: "Boosts Focus & Sustained Energy",
      desc: "Packed with magnesium, potassium, and plant protein for steady cognitive energy.",
    },
    {
      title: "Clean Nutrition & Zero Sugar",
      desc: "No artificial preservatives or added sugars — sweetened naturally with dates and ripe banana.",
    },
    {
      title: "Nutrient-Dense Superfood",
      desc: "Rich in calcium, phosphorus, and antioxidants that support gut, heart, and bone health.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0b1711] py-16 sm:py-24 border-b border-[#2d4739]">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1b3d2f]/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold text-[#d4af37]">
            <Sparkles className="h-3.5 w-3.5" /> SMART SNACKING SWITCH
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-extrabold text-[#f4efe6] tracking-tight">
            Why Upgrade to <span className="text-[#d4af37]">Superfood Makhana?</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#c2d1c7] leading-relaxed">
            Ditch ultra-processed junk snacks and nourish your brain & body with traditional, nutrient-rich nutrition.
          </p>
        </div>

        {/* Center Visual Banner (Dummy Image Showcase) */}
        <div className="mb-12 relative rounded-3xl border border-[#2d4739] bg-gradient-to-b from-[#11241a] to-[#070f0b] p-6 text-center overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-[#d4af37] uppercase">TRADITIONAL WISDOM</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#f4efe6]">India’s Ancient Superfood for Modern Focus</h3>
            </div>
            
            {/* Dummy Superfood Bowl Image */}
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-2xl border border-[#d4af37]/40 bg-[#0b1711] p-2 shadow-lg flex items-center justify-center">
              <Image
                src="/Brain Bowl Logo.png"
                alt="BrainBowl Superfood Makhana"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Side by Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* PROBLEM CARD (Junk Snacks) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-red-900/40 bg-gradient-to-b from-red-950/20 to-[#0b1711] p-6 sm:p-8 space-y-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 border-b border-red-900/30 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-950/80 border border-red-800/50 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-red-300">
                    Unhealthy Junk Snacks
                  </h3>
                  <p className="text-xs text-red-400/80">Chips, Biscuits & Fried Snacks</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {problemPoints.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-red-200">{item.title}</h4>
                      <p className="text-[11px] sm:text-xs text-red-300/70 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-red-900/30 bg-red-950/30 p-3 text-center">
              <span className="text-xs font-semibold text-red-300">❌ Result: Energy Slumps & Unhealthy Weight Gain</span>
            </div>
          </motion.div>

          {/* SOLUTION CARD (BrainBowl Makhana) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-[#d4af37]/50 bg-gradient-to-b from-[#1b3d2f]/50 to-[#0b1711] p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center gap-3 border-b border-[#2d4739] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b1711] border border-[#d4af37] text-[#d4af37]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#f4efe6]">
                    BrainBowl Superfood Makhana
                  </h3>
                  <p className="text-xs text-[#d4af37]">100% Natural • Plant-Based Nutrition</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {solutionPoints.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#d4af37] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#f4efe6]">{item.title}</h4>
                      <p className="text-[11px] sm:text-xs text-[#c2d1c7] mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 p-3 text-center">
              <span className="text-xs font-semibold text-[#d4af37]">✅ Result: Sustained Mental Focus & Clean Wellness</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}