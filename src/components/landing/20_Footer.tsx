"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUp,
  Globe,
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#070f0b] border-t border-[#2d4739] text-[#c2d1c7] pt-16 pb-8 overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#1b3d2f]/20 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2d4739]/60">
          {/* Column 1: Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-full border border-[#d4af37]/40 bg-[#0b1711] p-1 flex items-center justify-center">
                <Image
                  src="/Brain Bowl Logo.png"
                  alt="BrainBowl Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#f4efe6]">
                Brain<span className="text-[#d4af37]">Bowl</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#8ea396] leading-relaxed max-w-sm">
              Nourish Your Brain & Body. 100% plant-based, slow-roasted
              superfood Makhana harvested from traditional wetlands. Clean,
              gluten-free nutrition with zero added sugar and zero artificial
              preservatives.
            </p>

            {/* FSSAI & Quality Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-semibold text-[#d4af37]">
              <div className="flex items-center gap-1.5 bg-[#0b1711] px-3 py-1.5 rounded-lg border border-[#2d4739]">
                <Award className="h-3.5 w-3.5" />
                <span>FSSAI Certified</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#0b1711] px-3 py-1.5 rounded-lg border border-[#2d4739]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>ISO 22000 Compliant</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#d4af37]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="hover:text-[#d4af37] transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#d4af37] transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="hover:text-[#d4af37] transition"
                >
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="hover:text-[#d4af37] transition"
                >
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="hover:text-[#d4af37] transition"
                >
                  Nutritional Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#d4af37] transition"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#d4af37]">
              Legal & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/terms" className="hover:text-[#d4af37] transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-[#d4af37] transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/refund-policy"
                  className="hover:text-[#d4af37] transition"
                >
                  Cancellation & Refund Policy
                </a>
              </li>
              <li>
                <a
                  href="/shipping-policy"
                  className="hover:text-[#d4af37] transition"
                >
                  Shipping & Delivery Policy
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  className="hover:text-[#d4af37] transition"
                >
                  Nutritional Disclaimer
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#d4af37] transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#d4af37]">
              Get in Touch
            </h4>
            <div className="space-y-2.5 text-xs text-[#8ea396]">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>BrainBowl Wellness Inc., Bihar & New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#d4af37] shrink-0" />
                <a
                  href="mailto:support@brainbowl.in"
                  className="hover:text-[#f4efe6] transition"
                >
                  support@brainbowl.in
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#d4af37] shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-[#f4efe6] transition"
                >
                  +91 98765 43210
                </a>
              </div>
            </div>

            {/* Social Links (Inline SVGs) */}
            <div className="pt-2 flex items-center gap-3">
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2d4739] bg-[#0b1711] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0b1711] transition"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2d4739] bg-[#0b1711] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0b1711] transition"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2d4739] bg-[#0b1711] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0b1711] transition"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2d4739] bg-[#0b1711] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0b1711] transition"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Scroll To Top Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8ea396] text-center sm:text-left">
          <div>
            <p>
              © 2026 BrainBowl Inc. All rights reserved. •{" "}
              <a
                href="https://www.brainbowl.in"
                className="text-[#d4af37] hover:underline"
              >
                www.brainbowl.in
              </a>
            </p>
            <p className="text-[10px] text-[#8ea396]/70 mt-0.5">
              Designed with{" "}
              <Heart className="h-3 w-3 text-red-500 inline mx-0.5" /> for
              clean, mindful nutrition across India.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 rounded-xl border border-[#2d4739] bg-[#0b1711] px-3.5 py-2 text-xs font-bold text-[#d4af37] hover:bg-[#11241a] hover:border-[#d4af37] transition shadow-md"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
