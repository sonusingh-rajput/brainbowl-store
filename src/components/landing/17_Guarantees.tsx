'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  RefreshCw,
  Truck,
  Sparkles,
  Lock,
  ThumbsUp,
} from 'lucide-react';

export default function Guarantees() {
  const guaranteeCards = [
    {
      icon: RefreshCw,
      title: "100% Freshness & Replacement",
      description:
        "If your order arrives unsealed, damaged, or stale, we offer an immediate, hassle-free replacement with zero questions asked.",
      badge: "Zero Risk",
    },
    {
      icon: Truck,
      title: "Express Pan-India Shipping",
      description:
        "All orders are processed and dispatched within 24 hours in multi-layer food-grade protective sealing for maximum crunch.",
      badge: "Fast Dispatch",
    },
    {
      icon: Lock,
      title: "100% Secure Checkout",
      description:
        "Encrypted transactions powered by Razorpay. We support UPI, Cards, Net Banking, and Cash on Delivery across India.",
      badge: "256-Bit Encrypted",
    },
  ];

  return (
    <section
      id="guarantees"
      className="relative overflow-hidden bg-[#0b1711] py-16 sm:py-20 border-b border-[#2d4739]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1b3d2f]/30 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-10 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold text-[#d4af37]">
            <ShieldCheck className="h-3.5 w-3.5" /> SHOP WITH CONFIDENCE
          </span>
          <h2 className="mt-3 font-serif text-2xl sm:text-4xl font-extrabold text-[#f4efe6] tracking-tight">
            Our Uncompromising <span className="text-[#d4af37]">Customer Guarantees</span>
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#c2d1c7] leading-relaxed">
            Your satisfaction and wellness are our highest priorities. We back every order of BrainBowl Superfood Makhana with ironclad service promises.
          </p>
        </div>

        {/* 3 Guarantees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guaranteeCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#2d4739] bg-gradient-to-b from-[#11241a] to-[#070f0b] p-6 text-center shadow-xl hover:border-[#d4af37]/60 transition-all duration-300"
              >
                <div>
                  {/* Icon & Badge Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d4af37]/40 bg-[#0b1711] text-[#d4af37] shadow-inner group-hover:scale-105 group-hover:bg-[#d4af37] group-hover:text-[#0b1711] transition duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-extrabold tracking-wider text-[#d4af37] uppercase bg-[#d4af37]/10 border border-[#d4af37]/20 px-2.5 py-1 rounded-full">
                      {card.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg font-bold text-[#f4efe6] group-hover:text-[#d4af37] transition text-left">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs sm:text-sm text-[#c2d1c7] leading-relaxed text-left">
                    {card.description}
                  </p>
                </div>

                {/* Footer Assurance Tag */}
                <div className="mt-6 pt-3 border-t border-[#2d4739]/50 flex items-center gap-1.5 text-[11px] font-medium text-[#8ea396]">
                  <ThumbsUp className="h-3.5 w-3.5 text-[#d4af37]" />
                  <span>Guaranteed by BrainBowl Care</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Trust Seal Strip */}
        <div className="rounded-2xl border border-[#2d4739] bg-gradient-to-r from-[#11241a]/80 via-[#0b1711] to-[#11241a]/80 p-4 text-center">
          <p className="text-xs font-semibold text-[#f4efe6] flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-[#d4af37]" />
            <span>Need help with an order or replacement? Email us anytime at <a href="mailto:support@brainbowl.in" className="text-[#d4af37] underline">support@brainbowl.in</a></span>
          </p>
        </div>

      </div>
    </section>
  );
}