'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Sparkles,
  FileCheck2,
  Factory,
  Leaf,
  Sun,
} from 'lucide-react';

export default function Certifications() {
  const certificationBadges = [
    {
      icon: FileCheck2,
      title: "ISO 22000 Certified",
      subtitle: "Food Safety Management System",
      code: "ISO 22000:2018",
    },
    {
      icon: Factory,
      title: "GMP Facility",
      subtitle: "Good Manufacturing Practices",
      code: "GMP Certified",
    },
    {
      icon: Leaf,
      title: "100% Non-GMO",
      subtitle: "Organically Grown Seeds",
      code: "Pure Genetic Lineage",
    },
    {
      icon: Sun,
      title: "Non-Irradiated",
      subtitle: "Natural Solar & Air Drying",
      code: "100% Chemical Free",
    },
  ];

  return (
    <section
      id="certifications"
      className="relative overflow-hidden bg-[#0b1711] py-16 sm:py-20 border-b border-[#2d4739]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1b3d2f]/30 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-10 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold text-[#d4af37]">
            <Award className="h-3.5 w-3.5" /> QUALITY ASSURANCE STANDARDS
          </span>
          <h2 className="mt-3 font-serif text-2xl sm:text-4xl font-extrabold text-[#f4efe6] tracking-tight">
            Certified Quality & <span className="text-[#d4af37]">Safety Compliance</span>
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#c2d1c7] leading-relaxed">
            Every batch of BrainBowl Superfood Makhana undergoes rigorous quality verification and strict food safety protocols from harvest to packaging.
          </p>
        </div>

        {/* 4 Certification Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certificationBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#2d4739] bg-gradient-to-b from-[#11241a] to-[#070f0b] p-5 text-center shadow-lg hover:border-[#d4af37]/60 transition-all duration-300"
              >
                <div>
                  {/* Badge Icon Box */}
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d4af37]/40 bg-[#0b1711] text-[#d4af37] shadow-inner group-hover:scale-105 group-hover:bg-[#d4af37] group-hover:text-[#0b1711] transition duration-300">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Certification Title */}
                  <h3 className="font-serif text-base font-bold text-[#f4efe6] group-hover:text-[#d4af37] transition">
                    {badge.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="mt-1 text-xs text-[#c2d1c7]">
                    {badge.subtitle}
                  </p>
                </div>

                {/* Footer Standard Code Tag */}
                <div className="mt-4 pt-3 border-t border-[#2d4739]/50 flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#8ea396] uppercase tracking-wider">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#d4af37]" />
                  <span>{badge.code}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Trust Seal Banner */}
        <div className="rounded-2xl border border-[#2d4739] bg-gradient-to-r from-[#11241a]/80 via-[#0b1711] to-[#11241a]/80 p-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-[#f4efe6]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#d4af37]" />
              <span>100% Quality Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#d4af37]" />
              <span>Zero Synthetic Chemical Residuals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#d4af37]" />
              <span>Food Grade Barrier Packaging</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}