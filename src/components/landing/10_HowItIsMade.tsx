'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Sparkles,
  Droplets,
  Waves,
  Filter,
  Flame,
  Hammer,
  Sparkle,
  PackageCheck,
  CheckCircle2,
  ShieldCheck,
  Target,
} from 'lucide-react';

export default function HowItIsMade() {
  const processSteps = [
    {
      step: "01",
      title: "Pond Cultivation",
      subtitle: "8–10 Month Growth Cycle",
      objective: "Grow healthy Makhana plants until the fruits reach full maturity.",
      points: [
        "Makhana (Euryale ferox) is cultivated in natural ponds and shallow wetlands.",
        "Large floating leaves cover the water surface while fruits develop underneath.",
        "Proper water depth and nutrient management are essential for quality seed yields."
      ],
      icon: Droplets,
      image: "/setp1.jpg",
    },
    {
      step: "02",
      title: "Harvesting & Seed Collection",
      subtitle: "Labor-Intensive Manual Diving",
      objective: "Collect mature seeds without damaging their hard outer shell.",
      points: [
        "Mature fruits burst naturally, releasing black seeds that sink to the pond bed.",
        "Skilled workers manually enter shallow water bodies to gather sunken seeds.",
        "Requires significant physical skill to collect seeds intact from muddy waters."
      ],
      icon: Waves,
      image: "/setp2.jpg",
    },
    {
      step: "03",
      title: "Cleaning & Size Grading",
      subtitle: "Perforated Sieve Sorting",
      objective: "Prepare clean and uniformly graded seeds for processing.",
      points: [
        "Collected black seeds are washed thoroughly to remove mud and weeds.",
        "Graded by size using traditional perforated hand-held sieves.",
        "Uniform seed size ensures even heat distribution during subsequent roasting."
      ],
      icon: Filter,
      image: "/setp3.jpg",
    },
    {
      step: "04",
      title: "Roasting the Seeds",
      subtitle: "High-Heat Sand Roasting (250–300°C)",
      objective: "Heat the seeds to prepare them for popping.",
      points: [
        "Graded seeds are heated in iron pans containing hot sand at 250–300°C.",
        "Workers continuously stir seeds to ensure uniform heat transfer.",
        "Roasting softens the inner kernel while preserving outer shell integrity."
      ],
      icon: Flame,
      image: "/setp4.jpg",
    },
    {
      step: "05",
      title: "Manual Popping (Phodai)",
      subtitle: "Artisanal Wooden Hammer Strike",
      objective: "Separate the edible white kernel from the hard shell.",
      points: [
        "Immediately after roasting, hot seeds are placed onto wooden blocks.",
        "Each seed is struck with a wooden hammer, popping open the white kernel.",
        "Requires precise timing and experience to maximize high-yield popping."
      ],
      icon: Hammer,
      image: "/setp5.jpg",
    },
    {
      step: "06",
      title: "Collection & Quality Sorting",
      subtitle: "Manual Cleaning & Color Inspection",
      objective: "Obtain clean, high-quality white Makhana kernels.",
      points: [
        "Popped Makhana kernels are collected and allowed to cool naturally.",
        "Broken kernels, shell fragments, and residual dust are removed manually.",
        "Kernels are sorted according to size grade, color, and texture purity."
      ],
      icon: Sparkle,
      image: "/setp6.jpg",
    },
    {
      step: "07",
      title: "Packaging & Marketing",
      subtitle: "Moisture-Proof Barrier Protection",
      objective: "Preserve fresh crunch and supply to global wellness markets.",
      points: [
        "Finished white Makhana is sealed in food-grade, moisture-proof barrier bags.",
        "Locks in natural lightness, crispness, and long-term shelf stability.",
        "Supplied to health brands, wholesalers, retailers, and export partners."
      ],
      icon: PackageCheck,
      image: "/product_image.jpeg",
    },
  ];

  return (
    <section
      id="how-it-is-made"
      className="relative overflow-hidden bg-[#0b1711] py-16 sm:py-24 border-b border-[#2d4739]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-[#1b3d2f]/30 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold text-[#d4af37]">
            <Sparkles className="h-3.5 w-3.5" /> BIHAR’S HERITAGE CROP
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-extrabold text-[#f4efe6] tracking-tight">
            How Superfood Makhana <br className="hidden sm:inline" />
            <span className="text-[#d4af37]">Is Traditionally Processed</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#c2d1c7] leading-relaxed">
            Scientifically known as <em className="text-[#d4af37] font-serif">Euryale ferox</em>, Bihar contributes nearly 90% of India&apos;s total Makhana production. Discover the 7-step artisanal process passed down through generations.
          </p>
        </div>

        {/* Heritage Story Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-[#2d4739] bg-gradient-to-r from-[#11241a] via-[#070f0b] to-[#11241a] p-6 sm:p-10 shadow-2xl">
          <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              <ShieldCheck className="h-4 w-4" />
              <span>90% National Production Origin</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#f4efe6]">
              Traditional Artisanal Skill & Precision
            </h3>
            <p className="text-xs sm:text-sm text-[#c2d1c7] leading-relaxed">
              While modern technologies are emerging, authentic Makhana processing relies heavily on skilled craftsmen who manage pond diving, sand roasting, and wooden hammer popping with timing.
            </p>

            <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-3 text-xs font-semibold text-[#f4efe6]">
              <div className="flex items-center gap-1.5 bg-[#0b1711] px-3 py-1.5 rounded-lg border border-[#2d4739]">
                <CheckCircle2 className="h-4 w-4 text-[#d4af37]" /> Wetland Cultivated
              </div>
              <div className="flex items-center gap-1.5 bg-[#0b1711] px-3 py-1.5 rounded-lg border border-[#2d4739]">
                <CheckCircle2 className="h-4 w-4 text-[#d4af37]" /> Hand-Popped Kernels
              </div>
              <div className="flex items-center gap-1.5 bg-[#0b1711] px-3 py-1.5 rounded-lg border border-[#2d4739]">
                <CheckCircle2 className="h-4 w-4 text-[#d4af37]" /> Food-Grade Sealing
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative h-40 w-40 sm:h-48 sm:w-48 rounded-full border-2 border-[#d4af37]/40 bg-[#0b1711] p-3 shadow-2xl flex items-center justify-center">
              <Image
                src="/Brain Bowl Logo.png"
                alt="BrainBowl Superfood Makhana"
                width={160}
                height={160}
                className="object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* 7-Step Processing Timeline */}
        <div className="space-y-8">
          {processSteps.map((item, idx) => {
            const Icon = item.icon;
            const isEven = idx % 2 === 1;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-[#2d4739] bg-gradient-to-b from-[#11241a] to-[#070f0b] p-6 sm:p-8 shadow-xl hover:border-[#d4af37]/60 transition-all duration-300 ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Step Real Image Container */}
                <div
                  className={`lg:col-span-5 relative overflow-hidden rounded-2xl border border-[#2d4739] h-56 sm:h-64 w-full group ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500 brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1711] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-3 left-3 bg-[#0b1711]/90 border border-[#d4af37] text-[#d4af37] rounded-xl px-3 py-1 font-serif text-xs font-bold backdrop-blur-sm">
                    STEP {item.step}
                  </div>
                </div>

                {/* Step Details & Points */}
                <div
                  className={`lg:col-span-7 space-y-3.5 text-left ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d4af37]/40 bg-[#0b1711] text-[#d4af37]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                      {item.subtitle}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#f4efe6]">
                    Step {item.step}: {item.title}
                  </h3>

                  {/* Objective Callout Box */}
                  <div className="flex items-start gap-2 bg-[#0b1711]/80 p-3 rounded-xl border border-[#2d4739]/80 text-xs text-[#d4af37]">
                    <Target className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[10px] block">Objective</span>
                      <span className="text-[#f4efe6]">{item.objective}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 pt-1">
                    {item.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#c2d1c7]">
                        <CheckCircle2 className="h-4 w-4 text-[#d4af37] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}