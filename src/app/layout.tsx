import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.brainbowl.in'),
  title: 'BrainBowl — Premium Superfood Makhana Wellness Drink',
  description:
    'Nourish your brain and body with 100% plant-based, gluten-free superfood Makhana. Packed with mental focus nutrients, immunity support, and zero added sugar.',
  keywords: [
    'Makhana',
    'Fox Nuts',
    'Wellness Drink',
    'BrainBowl',
    'Plant Based Nutrition',
    'Superfood Snack',
    'Gluten Free',
    'No Added Sugar',
  ],
  icons: {
    icon: [
      { url: '/Brain Bowl svg.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/Brain Bowl svg.svg',
    apple: '/Brain Bowl svg.svg',
  },
  openGraph: {
    title: 'BrainBowl — Premium Superfood Makhana Wellness Drink',
    description:
      'Nourish your brain and body with 100% plant-based, clean superfood nutrition.',
    url: 'https://www.brainbowl.in',
    siteName: 'BrainBowl',
    images: [
      {
        url: '/product_image.jpeg',
        width: 1200,
        height: 630,
        alt: 'BrainBowl Superfood Makhana',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrainBowl — Premium Superfood Makhana Wellness Drink',
    description: 'Nourish your brain and body with clean plant protein and zero added sugar.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/Brain Bowl svg.svg" type="image/svg+xml" />
      </head>
      <body className="bg-[#0b1711] text-[#f4efe6] font-sans antialiased selection:bg-[#d4af37] selection:text-[#0b1711]">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#11241a',
              color: '#f4efe6',
              border: '1px solid #2d4739',
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