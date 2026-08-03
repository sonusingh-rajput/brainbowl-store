import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'BrainBowl — Premium Organic Roasted Superfood Makhana',
  description:
    'Handpicked Phool Makhana roasted in cold-pressed olive oil. 100% organic, high protein, low GI, and zero cholesterol. Order online for fast delivery across India.',
  keywords: [
    'Makhana',
    'Fox Nuts',
    'Healthy Snacks',
    'BrainBowl',
    'Organic Superfood',
    'Protein Snack',
  ],
  openGraph: {
    title: 'BrainBowl — Premium Organic Roasted Superfood Makhana',
    description:
      'Nourish your brain and body with 100% plant-based, gluten-free superfood snacks.',
    url: 'https://www.brainbowl.in',
    siteName: 'BrainBowl',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'BrainBowl Makhana Pack',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrainBowl — Premium Organic Roasted Superfood Makhana',
    description: 'Nourish your brain and body with clean plant protein.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="bg-[#0a0a0a] text-white font-sans antialiased selection:bg-[#22c55e] selection:text-black">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#141414',
              color: '#ffffff',
              border: '1px solid #262626',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}