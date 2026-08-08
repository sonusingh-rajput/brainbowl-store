'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  Quote,
  ShieldCheck,
  Award,
  CheckCircle2,
  Stethoscope,
  HeartPulse,
  Leaf,
  UserCheck,
} from 'lucide-react';

export default function ExpertEndorsement() {
  const experts = [
    {
      id: 1,
      name: "Dr. S. Mukherjee",
      title: "Chief Clinical Nutritionist & Metabolic Specialist",
      credentials: "M.Sc. Clinical Nutrition, Ph.D.",
      location: "New Delhi",
      quote:
        "Fox nuts (Makhana) are an extraordinary plant protein source with an exceptional potassium-to-sodium ratio. BrainBowl maintains this nutritional integrity by completely avoiding palm oil deep-frying and synthetic preservatives. It offers clean, unadulterated quality for daily cognitive and heart health.",
      tag: "Clinical Endorsement",
    },
    {
      id: 2,
      name: "Radhika Kapoor",
      title: "Sports Dietitian & Performance Coach",
      credentials: "CISSN Certified, Sports Nutritionist",
      location: "Bengaluru",
      quote:
        "The combination of low GI carbohydrates, plant-based protein, and essential minerals like magnesium makes BrainBowl Makhana an ideal pre- or post-workout snack. It provides sustained energy without causing insulin slumps or gastric discomfort.",
      tag: "Sports Nutrition",
    },
    {
      id: 3,
      name: "Dr. Ananya Roy",
      title: "Ayurvedic Lifestyle & Gut Health Consultant",
      credentials: "BAMS, MD (Ayurveda)",
      location: "Kolkata",
      quote:
        "In traditional wellness, Makhana is celebrated for its soothing, light digestibility and mind-nourishing properties. BrainBowl's choice to sweeten naturally with date and ripe banana rather than refined sugar aligns perfectly with holistic health principles.",
      tag: "Holistic Wellness",
    },
  ];

  const sciencePillars = [
    {
      icon: HeartPulse,
      title: "Optimal Potassium & Low Sodium",
      desc: "Supports healthy blood pressure levels and cardiovascular wellness.",
    },
    {
      icon: Leaf,
      title: "Clean Plant Protein",
      desc: "Rich in essential amino acids for daily muscle repair and growth.",
    },
    {
      icon: Stethoscope,
      title: "Zero Preservatives & Palm Oil",
      desc: "Slow roasted to protect natural antioxidants and gut health.",
    },
  ];

  return (
    <section
      id="expert-endorsement"
      className="relative overflow-hidden bg-[#0b1711] py-16 sm:py-24 border-b border-[#2d4739]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 right-1/4 h-[550px] w-[550px] rounded-full bg-[#1b3d2f]/30 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold text-[#d4af37]">
            <Award className="h-3.5 w-3.5" /> NUTRITIONIST & CLINICIAN APPROVED
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-extrabold text-[#f4efe6] tracking-tight">
            Validated By <span className="text-[#d4af37]">Health & Science Experts</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#c2d1c7] leading-relaxed">
            Leading clinical nutritionists, sports dietitians, and wellness experts endorse BrainBowl Superfood Makhana for its clean formulation, high mineral density, and guilt-free digestibility.
          </p>
        </div>

        {/* Featured Hero Endorsement Box (Dr. S. Mukherjee) - No Avatar Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-[#d4af37]/50 bg-gradient-to-r from-[#11241a] via-[#070f0b] to-[#11241a] p-6 sm:p-10 shadow-2xl overflow-hidden"
        >
          {/* Background Decorative Gold Arch */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full border border-[#d4af37]/15 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Expert Profile Details */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30 text-[10px] font-extrabold text-[#d4af37] uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" /> Certified Expert Review
              </div>

              <div className="pt-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#f4efe6]">
                  {experts[0].name}
                </h3>
                <p className="text-xs font-semibold text-[#d4af37] mt-1">
                  {experts[0].title}
                </p>
                <p className="text-[11px] text-[#8ea396] mt-1">
                  {experts[0].credentials} • <span className="text-[#c2d1c7]">{experts[0].location}</span>
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#8ea396] pt-1">
                <UserCheck className="h-4 w-4 text-[#d4af37]" />
                <span>Verified Independent Reviewer</span>
              </div>
            </div>

            {/* Right Endorsement Quote Content */}
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left border-t lg:border-t-0 lg:border-l border-[#2d4739] pt-6 lg:pt-0 lg:pl-8">
              <Quote className="h-8 w-8 text-[#d4af37]/40 mx-auto lg:mx-0" />

              <blockquote className="font-serif text-base sm:text-xl font-medium text-[#f4efe6] italic leading-relaxed">
                &ldquo;{experts[0].quote}&rdquo;
              </blockquote>

              <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-2.5 text-xs font-semibold text-[#c2d1c7]">
                <div className="flex items-center gap-1.5 bg-[#0b1711] px-3 py-1.5 rounded-lg border border-[#2d4739]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#d4af37]" /> High Protein & Fiber
                </div>
                <div className="flex items-center gap-1.5 bg-[#0b1711] px-3 py-1.5 rounded-lg border border-[#2d4739]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#d4af37]" /> Low Glycemic Index
                </div>
                <div className="flex items-center gap-1.5 bg-[#0b1711] px-3 py-1.5 rounded-lg border border-[#2d4739]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#d4af37]" /> Zero Added Preservatives
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Secondary Expert Endorsements Grid - Clean Text Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experts.slice(1).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex flex-col justify-between rounded-3xl border border-[#2d4739] bg-gradient-to-b from-[#11241a] to-[#070f0b] p-6 sm:p-7 shadow-xl hover:border-[#d4af37]/60 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-[10px] font-extrabold tracking-wider text-[#d4af37] uppercase bg-[#d4af37]/10 border border-[#d4af37]/20 px-2.5 py-1 rounded-full">
                    {item.tag}
                  </span>
                  <Quote className="h-5 w-5 text-[#d4af37]/30" />
                </div>

                <blockquote className="text-xs sm:text-sm text-[#c2d1c7] leading-relaxed font-normal">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              {/* Expert Profile Footer */}
              <div className="mt-6 pt-4 border-t border-[#2d4739]/60 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#f4efe6]">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-medium text-[#d4af37] mt-0.5">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-[#8ea396] mt-0.5">
                    {item.credentials} • {item.location}
                  </p>
                </div>

                <ShieldCheck className="h-5 w-5 text-[#d4af37]/60 shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Science & Medical Pillars Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          {sciencePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 rounded-2xl border border-[#2d4739] bg-[#0b1711]/80 p-4 shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/40 bg-[#11241a] text-[#d4af37]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-[#f4efe6]">
                    {pillar.title}
                  </h4>
                  <p className="text-[11px] text-[#8ea396] mt-0.5 leading-snug">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}