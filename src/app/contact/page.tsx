import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us — BrainBowl',
  description: 'Get in touch with the BrainBowl customer support team.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0b1711] text-[#f4efe6] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8 bg-[#11241a] p-8 sm:p-12 rounded-3xl border border-[#2d4739] shadow-2xl">
        <Link href="/" className="text-xs font-bold text-[#d4af37] hover:underline">
          ← Back to Home
        </Link>
        
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#f4efe6]">
            Get In Touch
          </h1>
          <p className="mt-2 text-sm text-[#c2d1c7]">
            Have questions about your order or our products? We are here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b1711] border border-[#d4af37] text-[#d4af37] shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-[#f4efe6]">Email Support</h3>
                <p className="text-xs text-[#8ea396]">support@brainbowl.in</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b1711] border border-[#d4af37] text-[#d4af37] shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-[#f4efe6]">Phone & WhatsApp</h3>
                <p className="text-xs text-[#8ea396]">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b1711] border border-[#d4af37] text-[#d4af37] shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-[#f4efe6]">Support Hours</h3>
                <p className="text-xs text-[#8ea396]">Mon – Sat: 9:00 AM – 7:00 PM IST</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#2d4739] bg-[#0b1711] p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-[#d4af37]">Head Office</h3>
            <div className="flex items-start gap-3 text-xs text-[#c2d1c7] leading-relaxed">
              <MapPin className="h-5 w-5 text-[#d4af37] shrink-0 mt-0.5" />
              <span>
                BrainBowl Wellness Private Limited<br />
                Mithila Sourcing Hub, Bihar &<br />
                Corporate Office: New Delhi, 110001, India
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}