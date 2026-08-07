'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Sparkles,
  MapPin,
  Leaf,
  ShieldCheck,
  Heart,
  Sun,
  CheckCircle2,
} from 'lucide-react';

export default function SourcingStory() {
  const processSteps = [
    {
      icon: MapPin,
      step: "01",
      title: "Ethical Harvest",
      desc: "Directly cultivated in traditional wetlands, honoring centuries-old harvesting methods that preserve nutrient purity.",
    },
    {
      icon: Sun,
      step: "02",
      title: "Sun-Dried & Graded",
      desc: "Naturally sun-dried to lock in essential minerals, calcium, and plant protein before careful size selection.",
    },
    {
      icon: Leaf,
      step: "03",
      title: "Slow Roasted",
      desc: "Never deep fried in oil. Gently slow-roasted to achieve the perfect light crunch without adding harmful trans fats.",
    },
    {
      icon: Heart,
      title: "Clean Blend",
      desc: "Blended with clean, natural ingredients like dates and ripe banana for subtle sweetness — zero added sugar.",
    },
  ];

  return (
    <section
      id="sourcing"
      className="relative overflow-hidden bg-[#0b1711] py-16 sm:py-24 border-b border-[#2d4739]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-[#1b3d2f]/30 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-[#d4af37]/10 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold text-[#d4af37]">
            <Sparkles className="h-3.5 w-3.5" /> OUR FARM TO BOWL PROMISE
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-extrabold text-[#f4efe6] tracking-tight">
            Rooted in Tradition, <br className="hidden sm:inline" />
            <span className="text-[#d4af37]">Crafted for Mind & Body</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#c2d1c7] leading-relaxed">
            Makhana (Fox Nuts) has been a cornerstone of India&apos;s holistic wellness diet for generations. We bring you this age-old superfood in its purest form — unadulterated, wholesome, and sustainably sourced.
          </p>
        </div>

        {/* Feature Story Grid with Dummy Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-[#2d4739] bg-gradient-to-r from-[#11241a] via-[#070f0b] to-[#11241a] p-6 sm:p-10 shadow-2xl">
          
          {/* Left Text Story */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Clean & Natural Ingredients</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#f4efe6]">
              Nature&apos;s Gift in Every Bite
            </h3>

            <p className="text-xs sm:text-sm text-[#c2d1c7] leading-relaxed">
              At BrainBowl, we combine premium, hand-picked Makhana with clean natural ingredients to create a delicious blend of cognitive nutrition and rich taste. Every batch is prepared without synthetic chemicals, artificial preservatives, or refined sugars.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
              <div className="rounded-xl bg-[#0b1711] p-3 border border-[#2d4739]">
                <p className="text-xs font-bold text-[#f4efe6]">100% Plant-Based</p>
                <p className="text-[10px] text-[#8ea396] mt-0.5">Pure vegan wellness</p>
              </div>
              <div className="rounded-xl bg-[#0b1711] p-3 border border-[#2d4739]">
                <p className="text-xs font-bold text-[#f4efe6]">Gluten-Free</p>
                <p className="text-[10px] text-[#8ea396] mt-0.5">Easy on digestion</p>
              </div>
              <div className="rounded-xl bg-[#0b1711] p-3 border border-[#2d4739]">
                <p className="text-xs font-bold text-[#f4efe6]">Zero Preservatives</p>
                <p className="text-[10px] text-[#8ea396] mt-0.5">Fresh & clean nutrition</p>
              </div>
            </div>
          </div>

          {/* Right Product Image Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative h-52 w-52 sm:h-64 sm:w-64 rounded-full border-2 border-[#d4af37]/40 bg-[#0b1711] p-3 shadow-2xl flex items-center justify-center">
              <div className="absolute inset-2 rounded-full border border-[#d4af37]/20 pointer-events-none" />
              <Image
                src="/Brain Bowl Logo.png"
                alt="BrainBowl Superfood Makhana Sourcing"
                width={220}
                height={220}
                className="object-contain drop-shadow-xl"
              />
            </div>
          </div>

        </div>

        {/* 4 Step Process Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {processSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative rounded-3xl border border-[#2d4739] bg-gradient-to-b from-[#11241a] to-[#070f0b] p-6 shadow-xl hover:border-[#d4af37]/60 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d4af37]/40 bg-[#0b1711] text-[#d4af37] shadow-inner group-hover:scale-105 group-hover:bg-[#d4af37] group-hover:text-[#0b1711] transition duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-serif text-lg font-extrabold text-[#d4af37]/40 group-hover:text-[#d4af37] transition">
                    {item.step}
                  </span>
                </div>

                <h4 className="font-serif text-base font-bold text-[#f4efe6] group-hover:text-[#d4af37] transition">
                  {item.title}
                </h4>
                <p className="mt-2 text-xs text-[#c2d1c7] leading-relaxed">
                  {item.desc}
                </p>

                <div className="mt-4 pt-3 border-t border-[#2d4739]/50 flex items-center gap-1.5 text-[11px] text-[#8ea396]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#d4af37]" />
                  <span>Quality Standard Verified</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}