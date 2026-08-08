'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is the shelf life of BrainBowl Superfood Makhana?",
      answer:
        "Our food-grade, moisture-proof barrier packaging guarantees a shelf life of 9 months from the date of manufacturing. Once opened, store in an airtight container to retain maximum crunchiness.",
      category: "Product & Freshness",
    },
    {
      question: "Is BrainBowl Makhana truly sugar-free and non-fried?",
      answer:
        "Yes, 100%! We slow-roast our Jumbo Grade Fox Nuts without deep frying in palm oil or hydrogenated fats. We do not use refined white sugar or artificial sweeteners — any subtle sweetness comes from natural date and ripe banana ingredients.",
      category: "Nutrition & Ingredients",
    },
    {
      question: "How long does shipping take across India?",
      answer:
        "All orders are dispatched from our facility within 24 hours. Express delivery takes 2 to 4 business days for metro cities, and 4 to 6 days for other regions across India.",
      category: "Delivery & Shipping",
    },
    {
      question: "Is this suitable for children, pregnant women, and the elderly?",
      answer:
        "Absolutely. Makhana (Fox Nuts) is an ancient Ayurvedic superfood known for its high calcium, magnesium, and plant-based protein content. It is gluten-free, light on the stomach, and easy to digest for all age groups.",
      category: "Health & Suitability",
    },
    {
      question: "What makes BrainBowl different from standard store-bought Makhana?",
      answer:
        "We source directly from traditional wetland farmers in Bihar, selecting only Jumbo Grade (4+ Suta) kernels. Unlike commercial brands that use palm oil frying or artificial preservatives, BrainBowl is 100% clean, non-GMO, and slow-roasted.",
      category: "Brand Quality",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We support all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash on Delivery (COD) through our secure Razorpay gateway.",
      category: "Payment & Orders",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#0b1711] py-16 sm:py-24 border-b border-[#2d4739]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[550px] w-[550px] rounded-full bg-[#1b3d2f]/30 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-[#d4af37]/10 blur-[110px] pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold text-[#d4af37]">
            <HelpCircle className="h-3.5 w-3.5" /> GOT QUESTIONS? WE'VE GOT ANSWERS
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-extrabold text-[#f4efe6] tracking-tight">
            Frequently Asked <span className="text-[#d4af37]">Questions</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#c2d1c7] leading-relaxed">
            Everything you need to know about our superfood Makhana, clean sourcing, shipping timelines, and health benefits.
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-[#d4af37] bg-gradient-to-b from-[#11241a] to-[#070f0b] shadow-xl"
                    : "border-[#2d4739] bg-[#0b1711]/90 hover:border-[#2d4739]/80 hover:bg-[#11241a]/50"
                }`}
              >
                {/* Question Header Button */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition"
                >
                  <div className="space-y-1 pr-2">
                    <span className="text-[10px] font-extrabold tracking-wider text-[#d4af37] uppercase bg-[#d4af37]/10 border border-[#d4af37]/20 px-2.5 py-0.5 rounded-full inline-block">
                      {faq.category}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#f4efe6]">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Toggle Indicator */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                      isOpen
                        ? "border-[#d4af37] bg-[#d4af37] text-[#0b1711] rotate-180"
                        : "border-[#2d4739] bg-[#0b1711] text-[#d4af37]"
                    }`}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </button>

                {/* Accordion Answer Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="border-t border-[#2d4739]/60 px-5 pb-5 pt-4 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#c2d1c7] leading-relaxed">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-[#d4af37] shrink-0 mt-0.5" />
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Support Callout Banner */}
        <div className="rounded-3xl border border-[#2d4739] bg-gradient-to-r from-[#11241a] via-[#070f0b] to-[#11241a] p-6 text-center sm:flex sm:items-center sm:justify-between sm:text-left shadow-xl">
          <div className="space-y-1">
            <h4 className="font-serif text-base font-bold text-[#f4efe6]">
              Still have questions about BrainBowl?
            </h4>
            <p className="text-xs text-[#8ea396]">
              Our customer support team is available Monday to Saturday to assist you.
            </p>
          </div>

          <a
            href="mailto:support@brainbowl.in"
            className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-5 py-2.5 text-xs font-bold text-[#0b1711] shadow-md hover:bg-[#c39e2e] transition"
          >
            <MessageCircle className="h-4 w-4" /> Contact Support
          </a>
        </div>

      </div>
    </section>
  );
}