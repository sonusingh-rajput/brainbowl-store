'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Sparkles,
  Zap,
  Leaf,
  Scale,
  Activity,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function NutritionFacts() {
  const primaryNutrients = [
    {
      label: "Plant Protein",
      value: "14.5g",
      unit: "per 100g",
      icon: Zap,
      desc: "Supports body repair & muscle growth",
    },
    {
      label: "Energy",
      value: "347 kcal",
      unit: "per 100g",
      icon: Activity,
      desc: "Sustained clean energy without slumps",
    },
    {
      label: "Dietary Fiber",
      value: "14.5g",
      unit: "per 100g",
      icon: Leaf,
      desc: "Promotes gut health & smooth digestion",
    },
    {
      label: "Calcium & Minerals",
      value: "60mg",
      unit: "per 100g",
      icon: Scale,
      desc: "Magnesium, potassium & phosphorus",
    },
  ];

  const nutritionTable = [
    { nutrient: "Calories", amount: "347 kcal", dailyValue: "17%" },
    { nutrient: "Protein", amount: "14.5 g", dailyValue: "26%" },
    { nutrient: "Dietary Fiber", amount: "14.5 g", dailyValue: "52%" },
    { nutrient: "Total Fat", amount: "0.1 g", dailyValue: "< 1%" },
    { nutrient: "Cholesterol", amount: "0 mg", dailyValue: "0%" },
    { nutrient: "Calcium", amount: "60 mg", dailyValue: "6%" },
    { nutrient: "Magnesium", amount: "210 mg", dailyValue: "50%" },
    { nutrient: "Potassium", amount: "350 mg", dailyValue: "10%" },
    { nutrient: "Added Sugar", amount: "0 g", dailyValue: "0%" },
  ];

  return (
    <section
      id="nutrition"
      className="relative overflow-hidden bg-[#0b1711] py-16 sm:py-24 border-b border-[#2d4739]"
    >
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#1b3d2f]/25 blur-[140px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold text-[#d4af37]">
            <Sparkles className="h-3.5 w-3.5" /> CLEAN & TRANSPARENT NUTRITION
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-extrabold text-[#f4efe6] tracking-tight">
            Nutritional Profile <br className="hidden sm:inline" />
            <span className="text-[#d4af37]">(Per 100g Serving)</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#c2d1c7] leading-relaxed">
            Light, nutrient-dense Fox Nuts loaded with essential minerals, plant protein, and dietary fiber — 100% natural with zero added preservatives.
          </p>
        </div>

        {/* 4 Highlight Nutrient Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {primaryNutrients.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative rounded-3xl border border-[#2d4739] bg-gradient-to-b from-[#11241a] to-[#070f0b] p-6 text-center shadow-xl hover:border-[#d4af37]/60 transition-all duration-300"
              >
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d4af37]/40 bg-[#0b1711] text-[#d4af37] shadow-inner group-hover:scale-105 group-hover:bg-[#d4af37] group-hover:text-[#0b1711] transition duration-300">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="block text-3xl font-serif font-black text-[#f4efe6] group-hover:text-[#d4af37] transition">
                  {item.value}
                </span>
                <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider block mt-0.5">
                  {item.unit}
                </span>

                <h3 className="mt-3 font-serif text-sm font-bold text-[#f4efe6]">
                  {item.label}
                </h3>
                <p className="mt-1 text-xs text-[#8ea396] leading-snug">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Nutrition Table & Product Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-[#2d4739] bg-gradient-to-b from-[#11241a] via-[#070f0b] to-[#11241a] p-6 sm:p-10 shadow-2xl">
          
          {/* Left: Product Frame */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative h-48 w-48 sm:h-60 sm:w-60 rounded-full border-2 border-[#d4af37]/40 bg-[#0b1711] p-3 shadow-2xl flex items-center justify-center">
              <div className="absolute inset-2 rounded-full border border-[#d4af37]/20 pointer-events-none" />
              <Image
                src="/Brain Bowl Logo.png"
                alt="BrainBowl Superfood Makhana Nutrition"
                width={200}
                height={200}
                className="object-contain drop-shadow-xl"
              />
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-[#f4efe6]">
                BrainBowl Superfood Makhana
              </h3>
              <p className="text-xs text-[#d4af37] mt-0.5">
                Pure Plant Nutrition • Slow Roasted
              </p>
            </div>

            <div className="w-full space-y-2 pt-2 text-left bg-[#0b1711]/60 p-4 rounded-2xl border border-[#2d4739]">
              <div className="flex items-center gap-2 text-xs text-[#c2d1c7]">
                <CheckCircle2 className="h-4 w-4 text-[#d4af37] shrink-0" />
                <span>Sweetened naturally with date & banana</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#c2d1c7]">
                <CheckCircle2 className="h-4 w-4 text-[#d4af37] shrink-0" />
                <span>Zero added artificial preservatives</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#c2d1c7]">
                <CheckCircle2 className="h-4 w-4 text-[#d4af37] shrink-0" />
                <span>100% Gluten-Free & Easy to Digest</span>
              </div>
            </div>
          </div>

          {/* Right: Nutrition Panel */}
          <div className="lg:col-span-7 bg-[#0b1711]/90 rounded-2xl border border-[#2d4739] p-5 sm:p-6 shadow-inner">
            <div className="flex items-center justify-between border-b border-[#2d4739] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#d4af37]" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#f4efe6]">
                  Nutrition Facts Label
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-[#8ea396]">
                Serving Size: 100g
              </span>
            </div>

            <div className="divide-y divide-[#2d4739]/60 text-xs sm:text-sm">
              {nutritionTable.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2.5 transition hover:bg-[#11241a]/50 px-1 rounded-md"
                >
                  <span className="font-medium text-[#c2d1c7]">
                    {row.nutrient}
                  </span>
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-[#f4efe6]">
                      {row.amount}
                    </span>
                    <span className="text-xs text-[#d4af37] w-12 text-right font-semibold">
                      {row.dailyValue}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[10px] text-[#8ea396] text-center border-t border-[#2d4739]/60 pt-3">
              *Percent Daily Values (%DV) are based on a 2,000 calorie diet.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}