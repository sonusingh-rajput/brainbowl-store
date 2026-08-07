'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check, X, Sparkles, ShieldCheck } from 'lucide-react';

export default function ComparisonTable() {
  const comparisonData = [
    {
      feature: "Ingredient Purity",
      brainBowl: "100% Plant-Based Superfood",
      others: "Refined Wheat / Mixed Grains",
      brainBowlCheck: true,
      othersCheck: false,
    },
    {
      feature: "Sweetening Agent",
      brainBowl: "Natural Date & Ripe Banana",
      others: "Refined White Sugar / Syrups",
      brainBowlCheck: true,
      othersCheck: false,
    },
    {
      feature: "Preservatives & Additives",
      brainBowl: "Zero Chemical Preservatives",
      others: "Synthetic Sulfites & Flavors",
      brainBowlCheck: true,
      othersCheck: false,
    },
    {
      feature: "Cooking & Roasting",
      brainBowl: "Slow Roasted (Never Deep Fried)",
      others: "Fried in Refined Palm Oil",
      brainBowlCheck: true,
      othersCheck: false,
    },
    {
      feature: "Digestibility",
      brainBowl: "Gluten-Free & Light on Stomach",
      others: "Causes Bloating & Acid Reflux",
      brainBowlCheck: true,
      othersCheck: false,
    },
    {
      feature: "Cognitive & Body Benefits",
      brainBowl: "Supports Focus, Memory & Immunity",
      others: "Empty Calories & Sugar Spikes",
      brainBowlCheck: true,
      othersCheck: false,
    },
  ];

  return (
    <section
      id="comparison"
      className="relative overflow-hidden bg-[#0b1711] py-16 sm:py-24 border-b border-[#2d4739]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1b3d2f]/25 blur-[130px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold text-[#d4af37]">
            <Sparkles className="h-3.5 w-3.5" /> WHY WE STAND OUT
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-extrabold text-[#f4efe6] tracking-tight">
            How BrainBowl <span className="text-[#d4af37]">Compares</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#c2d1c7] leading-relaxed">
            See how our authentic, nutrient-rich Makhana superfood drink outperforms standard commercial store snacks.
          </p>
        </div>

        {/* Highlight Card with Dummy Product Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-[#2d4739] bg-gradient-to-r from-[#11241a] via-[#070f0b] to-[#11241a] p-6 sm:p-8 shadow-2xl">
          <div className="lg:col-span-8 space-y-3 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-[#d4af37]">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">The BrainBowl Standard</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#f4efe6]">
              Uncompromising Quality & Natural Nutrition
            </h3>
            <p className="text-xs sm:text-sm text-[#c2d1c7] leading-relaxed">
              We combine the ancient power of Makhana with clean, functional ingredients to deliver sustained brain energy, digestive ease, and overall wellness in every serving.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative h-32 w-32 sm:h-36 sm:w-36 rounded-full border-2 border-[#d4af37]/40 bg-[#0b1711] p-2 shadow-xl flex items-center justify-center">
              <Image
                src="/Brain Bowl Logo.png"
                alt="BrainBowl Superfood"
                width={130}
                height={130}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Comparison Table Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl border border-[#2d4739] bg-gradient-to-b from-[#11241a] to-[#070f0b] shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-[#2d4739] bg-[#0b1711]/80 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 text-[#8ea396] font-semibold w-1/3">
                    Features & Standards
                  </th>
                  <th className="py-4 px-6 text-[#d4af37] font-extrabold w-1/3 bg-[#d4af37]/10 border-x border-[#2d4739]/80">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      BrainBowl Makhana
                    </div>
                  </th>
                  <th className="py-4 px-6 text-[#8ea396] font-semibold w-1/3">
                    Ordinary Store Snacks
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-[#2d4739]/60 text-xs sm:text-sm">
                {comparisonData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="transition hover:bg-[#11241a]/40"
                  >
                    {/* Feature Name */}
                    <td className="py-4 px-6 font-serif font-bold text-[#f4efe6]">
                      {row.feature}
                    </td>

                    {/* BrainBowl Column (Highlighted) */}
                    <td className="py-4 px-6 font-semibold text-[#f4efe6] bg-[#d4af37]/5 border-x border-[#2d4739]/80">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d4af37] text-[#0b1711]">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <span>{row.brainBowl}</span>
                      </div>
                    </td>

                    {/* Other Brands Column */}
                    <td className="py-4 px-6 text-[#8ea396]">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-950/80 border border-red-800/40 text-red-400">
                          <X className="h-3 w-3 stroke-[3]" />
                        </div>
                        <span>{row.others}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Banner */}
          <div className="border-t border-[#2d4739] bg-[#0b1711]/90 p-4 text-center">
            <p className="text-xs font-semibold text-[#d4af37]">
              ✨ 100% Pure Plant Nutrition • No Added Sugar • Clean & Preservative-Free
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}