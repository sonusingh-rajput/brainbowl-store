# 🥣 BrainBowl — Premium Superfood Makhana Landing & Commerce Platform

![BrainBowl Superfood Makhana](public/product_image.jpeg)

**BrainBowl** is a high-performance, modern direct-to-consumer (D2C) e-commerce landing page and store built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Prisma (PostgreSQL)**, featuring secure online payment integration via **Razorpay**.

Designed with a luxury dark forest green (`#0b1711`), gold (`#d4af37`), and off-white (`#f4efe6`) palette, the application showcases the traditional heritage, 7-step artisanal process, health benefits, and clinical endorsements of 100% plant-based superfood Makhana.

---

## ✨ Features & Highlights

- ⚡ **Next.js 14+ App Router & React Server Components**: Optimized performance, low LCP, and server-side metadata rendering.
- 🎨 **Tailwind CSS & Framer Motion**: Custom luxury dark forest green theme with smooth animations and interactive accordions.
- 📱 **100% Responsive Design**: Engineered for mobile, tablet, and desktop viewports.
- 📦 **Next.js Image Optimization**: Built-in visual rendering optimization utilizing Next.js `<Image />` for low bandwidth usage.
- 🔐 **Authentication & Session System**: Built-in authentication API routing linked with PostgreSQL database sessions.
- 💳 **Razorpay Payment Integration**: Integrated checkout modal flow supporting UPI, Cards, Net Banking, and COD.
- 📜 **Complete Legal & Policy Suite**: Fully compliant pages for Terms & Conditions, Privacy Policy, Cancellation & Refunds, Shipping, and Contact Us.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, Server Components, API Routes)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.react.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Payment Gateway**: [Razorpay](https://razorpay.com/)
- **Toasts & Alerts**: [React Hot Toast](https://react-hot-toast.com/)

---

## 📁 Directory Structure

```text
brainbowl/
├── prisma/
│   └── schema.prisma         # Prisma ORM schema for PostgreSQL
├── public/
│   ├── Brain Bowl Logo.png   # Brand Logo
│   ├── setp1_2.jpg           # Processing Step 1 Image
│   ├── setp2.jpg             # Processing Step 2 Image
│   ├── setp3_2.jpg           # Processing Step 3 Image
│   ├── setp4_2.jpg           # Processing Step 4 Image
│   ├── setp5_2.jpg           # Processing Step 5 Image
│   └── setp6.jpg             # Processing Step 6 Image
├── src/
│   ├── app/
│   │   ├── admin/            # Admin Management Dashboard
│   │   ├── api/              # Next.js API Routes (Auth, Orders, Payment)
│   │   ├── checkout/         # Dedicated Checkout Page
│   │   ├── contact/          # Contact Us Page
│   │   ├── disclaimer/       # Nutritional Disclaimer Page
│   │   ├── privacy/          # Privacy Policy Page
│   │   ├── refund-policy/    # Cancellation & Refund Policy Page
│   │   ├── shipping-policy/  # Shipping & Delivery Policy Page
│   │   ├── terms/            # Terms & Conditions Page
│   │   ├── globals.css       # Custom Tailwind CSS & Theme Setup
│   │   ├── layout.tsx        # Root Application Layout & Font Variables
│   │   └── page.tsx          # Server Landing Page Route
│   ├── components/
│   │   ├── landing/          # Modular Landing Page Sections (01_Header to 20_Footer)
│   │   ├── AuthModal.tsx     # Authentication Dialog
│   │   ├── CheckoutModal.tsx # Razorpay Checkout Modal
│   │   ├── HomeClient.tsx    # Interactive Client Page Wrapper
│   │   └── RazorpayScript.tsx# Dynamic Razorpay SDK Loader
│   ├── hooks/                # Custom React Hooks
│   ├── lib/                  # Prisma Client & Utility Helpers
│   └── types/                # TypeScript Interface Definitions
├── .env.example              # Environment Variable Template
├── next.config.mjs           # Next.js Configuration
├── package.json              # Project Dependencies
└── README.md                 # Project Documentation