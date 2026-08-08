'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Star,
  Quote,
  Sparkles,
  ShieldCheck,
  ThumbsUp,
} from 'lucide-react';

export default function CustomerReviews() {
  const reviews = [
    {
      id: 1,
      name: "Ananya Sharma",
      role: "Software Engineer",
      city: "Delhi NCR",
      rating: 5,
      title: "Perfect for Late-Night Coding Sessions!",
      review:
        "I used to reach for fried chips or sugary biscuits during late work hours, which always led to energy slumps. Switching to BrainBowl Makhana gave me a light, crispy crunch without the heavy feeling. Love that there's zero added sugar!",
      date: "2 days ago",
    },
    {
      id: 2,
      name: "Rahul Verma",
      role: "Fitness & Nutrition Coach",
      city: "Bengaluru",
      rating: 5,
      title: "Top-Tier Plant Protein & Natural Sweetness",
      review:
        "As a trainer, I constantly check ingredient labels. BrainBowl's commitment to no preservatives, no palm oil, and natural date/banana sweetness makes it one of the cleanest superfood snacks on the Indian market.",
      date: "1 week ago",
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "Product Designer",
      city: "Mumbai",
      rating: 5,
      title: "Jumbo Size & Unmatched Freshness",
      review:
        "The size of the Makhana kernels is genuinely Jumbo grade compared to local store brands. It's incredibly crunchy, light on the stomach, and keeps me focused throughout long design sprints.",
      date: "2 weeks ago",
    },
    {
      id: 4,
      name: "Dr. Vikramaditya Rao",
      role: "Ayurvedic Practitioner",
      city: "Hyderabad",
      rating: 5,
      title: "Authentic Sourcing & Great Digestion",
      review:
        "Makhana has been praised in traditional wellness for centuries. BrainBowl respects this tradition by slow roasting instead of deep frying. My digestion feels great and energy levels stay balanced.",
      date: "3 weeks ago",
    },
    {
      id: 5,
      name: "Kavita Krishnan",
      role: "Working Mother & Yogi",
      city: "Pune",
      rating: 5,
      title: "Whole Family Loves It!",
      review:
        "Finding a snack that both my kids and parents enjoy without worrying about preservatives was tough. BrainBowl is 100% natural, easy to digest for elders, and delicious for kids.",
      date: "1 month ago",
    },
    {
      id: 6,
      name: "Siddharth Mehta",
      role: "Financial Analyst",
      city: "Gurgaon",
      rating: 5,
      title: "Noticeable Boost in Mindful Energy",
      review:
        "Ordered the 500g Wellness Pack and I am thoroughly impressed. It satisfies mid-day hunger cravings instantly without causing any brain fog. Worth every rupee!",
      date: "1 month ago",
    },
  ];

  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-[#0b1711] py-16 sm:py-24 border-b border-[#2d4739]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[550px] w-[550px] rounded-full bg-[#1b3d2f]/30 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold text-[#d4af37]">
            <Sparkles className="h-3.5 w-3.5" /> VERIFIED CUSTOMER REVIEWS
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-extrabold text-[#f4efe6] tracking-tight">
            Loved By <span className="text-[#d4af37]">10,000+ Health Enthusiasts</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#c2d1c7] leading-relaxed">
            Discover why professionals, fitness coaches, and families across India are switching to BrainBowl Superfood Makhana for clean, guilt-free nutrition.
          </p>
        </div>

        {/* Rating Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center rounded-3xl border border-[#2d4739] bg-gradient-to-r from-[#11241a] via-[#070f0b] to-[#11241a] p-6 sm:p-8 shadow-2xl">
          
          {/* Overall Rating Score */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#2d4739] pb-6 md:pb-0 md:pr-6">
            <span className="font-serif text-5xl sm:text-6xl font-black text-[#f4efe6]">
              4.9<span className="text-2xl sm:text-3xl text-[#d4af37]">/5</span>
            </span>
            <div className="flex items-center gap-1 my-2 text-[#d4af37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-[#d4af37]" />
              ))}
            </div>
            <span className="text-xs font-bold text-[#8ea396] uppercase tracking-wider">
              Based on 10,240+ Verified Reviews
            </span>
          </div>

          {/* Key Metrics */}
          <div className="md:col-span-5 grid grid-cols-2 gap-4 text-center sm:text-left">
            <div className="bg-[#0b1711] p-3.5 rounded-2xl border border-[#2d4739]">
              <span className="block font-serif text-2xl font-bold text-[#d4af37]">98%</span>
              <span className="text-[11px] font-medium text-[#c2d1c7]">Would Recommend to Friends</span>
            </div>
            <div className="bg-[#0b1711] p-3.5 rounded-2xl border border-[#2d4739]">
              <span className="block font-serif text-2xl font-bold text-[#d4af37]">100%</span>
              <span className="text-[11px] font-medium text-[#c2d1c7]">Clean Plant-Based Ingredients</span>
            </div>
          </div>

          {/* Product Brand Badge */}
          <div className="md:col-span-3 flex justify-center">
            <div className="relative h-28 w-28 rounded-full border-2 border-[#d4af37]/40 bg-[#0b1711] p-2 shadow-xl flex items-center justify-center">
              <Image
                src="/Brain Bowl Logo.png"
                alt="BrainBowl Superfood"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </div>

        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-[#2d4739] bg-gradient-to-b from-[#11241a] to-[#070f0b] p-6 sm:p-7 shadow-xl hover:border-[#d4af37]/60 transition-all duration-300"
            >
              <div>
                {/* Card Top: Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#d4af37]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#d4af37]" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-[#d4af37]/30 group-hover:text-[#d4af37]/60 transition" />
                </div>

                {/* Review Title */}
                <h3 className="font-serif text-base font-bold text-[#f4efe6] group-hover:text-[#d4af37] transition">
                  &ldquo;{item.title}&rdquo;
                </h3>

                {/* Review Paragraph */}
                <p className="mt-2.5 text-xs sm:text-sm text-[#c2d1c7] leading-relaxed">
                  {item.review}
                </p>
              </div>

              {/* Reviewer Details Footer */}
              <div className="mt-6 pt-4 border-t border-[#2d4739]/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Optimized Avatar Image */}
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#d4af37]/40 bg-[#0b1711]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-[#d4af37]">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif text-xs font-bold text-[#f4efe6]">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-[#8ea396]">
                      {item.role} • <span className="text-[#d4af37]">{item.city}</span>
                    </p>
                  </div>
                </div>

                {/* Verified Buyer Badge */}
                <div
                  className="flex items-center gap-1 text-[10px] font-bold text-[#d4af37] bg-[#d4af37]/10 px-2 py-1 rounded-full border border-[#d4af37]/20"
                  title="Verified Buyer"
                >
                  <ShieldCheck className="h-3 w-3" />
                  <span className="hidden sm:inline">Verified</span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Bottom Callout Banner */}
        <div className="rounded-2xl border border-[#2d4739] bg-[#0b1711]/80 p-4 text-center">
          <p className="text-xs sm:text-sm font-semibold text-[#c2d1c7] flex items-center justify-center gap-2">
            <ThumbsUp className="h-4 w-4 text-[#d4af37]" />
            <span>Join 10,000+ happy customers across India enjoying clean, slow-roasted superfood nutrition daily.</span>
          </p>
        </div>

      </div>
    </section>
  );
}