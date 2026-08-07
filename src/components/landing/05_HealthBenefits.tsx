'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Brain,
  Shield,
  Activity,
  Heart,
  Dumbbell,
  Bone,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function HealthBenefits() {
  const healthBenefits = [
    {
      icon: Brain,
      title: "Boosts Brain Health",
      subtitle: "Focus & Cognitive Power",
      description:
        "Rich in essential thiamine and natural antioxidants that support memory, concentration, and long-term cognitive clarity.",
      badge: "Mental Focus",
    },
    {
      icon: Shield,
      title: "Strengthens Immunity",
      subtitle: "Cellular Defense System",
      description:
        "Packed with vital micronutrients, minerals, and polyphenols that help build a strong natural immune response against stress.",
      badge: "Immunity Shield",
    },
    {
      icon: Activity,
      title: "Improves Digestion",
      subtitle: "Gut-Friendly Nutrition",
      description:
        "Naturally light on the stomach and rich in dietary fiber to promote smooth digestion and maintain long-term gut health.",
      badge: "Light & Easy",
    },
    {
      icon: Heart,
      title: "Supports Heart Health",
      subtitle: "Zero Cholesterol",
      description:
        "Low in sodium and cholesterol, helping maintain balanced blood pressure levels and active cardiovascular health.",
      badge: "Heart Care",
    },
    {
      icon: Dumbbell,
      title: "Aids Weight Management",
      subtitle: "Sustained Fullness",
      description:
        "High-protein, low-calorie superfood that curbs mid-day hunger cravings and supports lean muscle maintenance.",
      badge: "Low Calorie",
    },
    {
      icon: Bone,
      title: "Strengthens Bones",
      subtitle: "Essential Minerals",
      description:
        "Loaded with organic calcium, magnesium, and phosphorus to keep bones dense, resilient, and joints strong.",
      badge: "Calcium Rich",
    },
  ];

  return (
    <section
      id="benefits"
      className="relative overflow-hidden bg-[#0b1711] py-16 sm:py-24 border-b border-[#2d4739]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[#1b3d2f]/30 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold text-[#d4af37]">
            <Sparkles className="h-3.5 w-3.5" /> BACKED BY SCIENCE & TRADITION
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-extrabold text-[#f4efe6] tracking-tight">
            Nourish Your Body With <br className="hidden sm:inline" />
            <span className="text-[#d4af37]">6 Core Health Benefits</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#c2d1c7] leading-relaxed">
            Makhana (Fox Nuts) combines ancient Ayurvedic wellness with modern nutrition. Clean, plant-based snacking designed for every lifestyle and age group.
          </p>
        </div>

        {/* 6 Core Health Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthBenefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#2d4739] bg-gradient-to-b from-[#11241a] to-[#070f0b] p-6 sm:p-7 shadow-xl hover:border-[#d4af37]/60 transition-all duration-300"
              >
                <div>
                  {/* Top Header inside Card */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d4af37]/40 bg-[#0b1711] text-[#d4af37] shadow-inner group-hover:scale-105 group-hover:bg-[#d4af37] group-hover:text-[#0b1711] transition duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-extrabold tracking-wider text-[#d4af37] uppercase bg-[#d4af37]/10 border border-[#d4af37]/20 px-2.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  {/* Benefit Title & Subtitle */}
                  <h3 className="font-serif text-lg font-bold text-[#f4efe6] group-hover:text-[#d4af37] transition">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-[#d4af37]/80 mt-0.5">
                    {item.subtitle}
                  </p>

                  {/* Body Copy */}
                  <p className="mt-3 text-xs sm:text-sm text-[#c2d1c7] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Subtle Divider Line */}
                <div className="mt-6 pt-4 border-t border-[#2d4739]/50 flex items-center justify-between text-[11px] text-[#8ea396]">
                  <span>100% Plant Based</span>
                  <CheckCircle2 className="h-4 w-4 text-[#d4af37]" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Focus Banner with Dummy Product Visual */}
        <div className="rounded-3xl border border-[#2d4739] bg-gradient-to-r from-[#11241a] via-[#070f0b] to-[#11241a] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <span className="text-xs font-bold tracking-widest text-[#d4af37] uppercase">
                PURE NUTRITION GUARANTEE
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#f4efe6]">
                Nature’s Perfect Blend in Every Single Bite
              </h3>
              <p className="text-xs sm:text-sm text-[#c2d1c7] leading-relaxed">
                At BrainBowl, we carefully select jumbo-grade Fox Nuts and slow-roast them to perfection. No artificial preservatives, zero refined sugar, and completely gluten-free for guilt-free daily snacking.
              </p>

              <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-semibold text-[#f4efe6]">
                <div className="flex items-center gap-1.5 bg-[#0b1711] px-3 py-1.5 rounded-lg border border-[#2d4739]">
                  <span className="text-[#d4af37]">✔</span> No Added Sugar
                </div>
                <div className="flex items-center gap-1.5 bg-[#0b1711] px-3 py-1.5 rounded-lg border border-[#2d4739]">
                  <span className="text-[#d4af37]">✔</span> Zero Preservatives
                </div>
                <div className="flex items-center gap-1.5 bg-[#0b1711] px-3 py-1.5 rounded-lg border border-[#2d4739]">
                  <span className="text-[#d4af37]">✔</span> 100% Clean Ingredients
                </div>
              </div>
            </div>

            {/* Right Visual Image Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-full border-2 border-[#d4af37]/40 bg-[#0b1711] p-3 shadow-2xl flex items-center justify-center">
                <div className="absolute inset-2 rounded-full border border-[#d4af37]/20 pointer-events-none" />
                <Image
                  src="/Brain Bowl Logo.png"
                  alt="BrainBowl Superfood Makhana"
                  width={180}
                  height={180}
                  className="object-contain drop-shadow-lg"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}