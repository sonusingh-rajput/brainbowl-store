# 🥣 BrainBowl — Premium Superfood Makhana D2C Commerce Platform

<div align="center">

![BrainBowl Superfood Makhana](public/product_image.jpeg)

[![Next.js](https://img.shields.io/badge/Next.js-16.2.12-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.9.1-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment_Gateway-0C2340?style=for-the-badge&logo=razorpay&logoColor=0284C7)](https://razorpay.com/)

**A high-performance, full-stack Direct-to-Consumer (D2C) e-commerce storefront and admin control center built for luxury health & wellness food brands.**

[Live Store](#-storefront-experience) • [Admin Control Center](#-admin-control-center-admin) • [Tech Stack](#-technology-stack) • [Database Architecture](#-database-architecture--models) • [API Reference](#-api-endpoints-reference) • [Getting Started](#-getting-started)

</div>

---

## 📖 Executive Summary & Brand Story

**BrainBowl** is a modern, full-stack D2C commerce platform engineered to deliver a seamless shopping experience for premium, 100% plant-based, slow-roasted superfood Makhana (Fox Nuts). 

Crafted with a luxury dark aesthetic—**Forest Green (`#0b1711` / `#11241a`)**, **Refined Gold (`#d4af37`)**, and **Warm Off-White (`#f4efe6`)**—the application blends editorial typography (*Playfair Display*) with clean user interface elements (*Inter*). It highlights traditional Mithila harvesting heritage, the 7-step artisanal slow-roasting process, certified clinical benefits, and seamless direct checkout.

---

## 🌟 Key Features & Ecosystem

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BRAINBOWL ECOSYSTEM                                │
├───────────────────────────────┬─────────────────────────┬───────────────────────┤
│    🛍️ D2C Storefront          │   💳 Smart Checkout     │   🛠️ Admin Hub        │
│ • 20 Modular Landing Sections │ • Instant Checkout Page │ • Live Sales Analytics│
│ • Heritage Sourcing Story     │ • India Post PIN Lookup │ • Chart.js Graphics   │
│ • Health & Nutrition Facts    │ • Dynamic Quantity      │ • Product Catalog CRUD│
│ • Comparison Table            │ • Free Shipping Rules   │ • Inline AWB Tracking │
│ • Verified Customer Reviews   │ • Razorpay Gateway      │ • Customer Directory  │
│ • Full Legal Policy Suite     │ • Webhook Reconciliation│ • Global Delivery Fees│
└───────────────────────────────┴─────────────────────────┴───────────────────────┘
```

### 🛍️ Storefront Experience
- **20 Modular Landing Sections**: 
  - Dynamic Sticky Navigation with User Session Pill & Auth Modals (`01_Header`).
  - High-impact Hero section with conversion-focused CTA (`02_HeroSection`).
  - Trust indicators, organic certifications, and brand highlights (`03_TrustBar`, `14_Certifications`).
  - Problem vs. Solution comparative storytelling (`04_ProblemSolution`).
  - Nutritional breakdowns, active micronutrients, and clean energy benefits (`05_HealthBenefits`, `06_NutritionFacts`).
  - Direct-from-farmers Mithila harvesting narrative (`08_SourcingStory`).
  - Interactive snack comparison matrix against popcorn, chips, and protein bars (`09_ComparisonTable`).
  - 7-step artisanal slow-roasting & grading process showcase (`10_HowItIsMade`).
  - Real customer ratings & verified buyer feedback (`12_CustomerReviews`).
  - Clinical endorsements & nutritionist reviews (`13_ExpertEndorsement`).
  - Interactive FAQ accordion & 100% satisfaction guarantee (`16_FAQSection`, `17_Guarantees`).
  - Comprehensive Footer with regulatory notices & brand links (`20_Footer`).

### 💳 Direct Checkout & Logistics Intelligence
- **Dedicated Checkout Flow (`/checkout`)**: Frictionless single-page checkout optimized for high conversion.
- **Dynamic Cart Quantity Selector**: Real-time quantity adjustment (`+` / `-`) with instant subtotal and tax calculation.
- **Automated Pincode Resolution**: Real-time integration with the India Post Postal API (`api.postalpincode.in`) to auto-fill District and State from 6-digit Indian PIN codes.
- **Dynamic Shipping Engine**: Automatically switches between free shipping and standard flat rates according to real-time threshold settings configured in the admin dashboard.
- **Razorpay Payment Gateway**: Supports UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, Net Banking, and Wallets with cryptographic HMAC SHA-256 signature verification.
- **Asynchronous Webhook Reconciliation (`/api/webhooks/razorpay`)**: Reliable fallback listener for `payment.captured` events using atomic Prisma transactions (`prisma.$transaction`) to guarantee payment capture and auto-decrement inventory.

### 🔐 Customer Portal & Authentication
- **Dual Authentication**: Password login and Email OTP verification powered by Nodemailer.
- **Indian Mobile Validation & Anti-Spam Heuristics**: Enforces 10-digit Indian phone regex (`^[6-9]\d{9}$`) and filters repetitive/sequential test numbers.
- **Strong Password Rules**: Enforces uppercase, lowercase, numeric, and special character combinations via Zod schemas.
- **Customer Dashboard (`/dashboard`)**: Displays user profile information, verified account badge, SMS alert configuration, and real-time order history.
- **Public Order Tracking (`/orders`)**: Fast, phone-number-based order delivery status lookup.

### 📊 Admin Control Center (`/admin`)
- **Protected Administrator Suite**: Secure session-based authentication with HTTP-Only cookies.
- **Real-Time KPI Metrics**: Instant visibility into Gross Revenue, Total Customers, Order Count, and Active Stock Inventory.
- **Interactive Visualizations**:
  - **Line Chart**: Monthly revenue trends and velocity.
  - **Doughnut Chart**: Real-time order distribution (Paid vs. Pending vs. Cancelled).
- **Product Catalog Management (CRUD)**:
  - Add / edit product titles, SKU codes, pricing (stored in paise for precision), and inventory quantities.
  - Manage CDN image URLs and custom SEO titles & meta descriptions.
- **Order Fulfillment & Logistics**:
  - Live order status toggle (`PAID`, `PENDING`, `CANCELLED`).
  - Inline editing and assignment of **AWB Numbers** and **Direct Courier Tracking URLs** (Delhivery, BlueDart, Xpressbees, etc.).
- **Customer Directory**: Paginated customer list with live multi-field search (search by customer name, email address, or phone number).
- **Global Shipping Rules Configuration**: Adjust free shipping threshold (e.g., ₹999) and standard shipping charge (e.g., ₹99) in real time without code redeployments.

### 📜 Compliance & Legal Suite
- **Terms & Conditions (`/terms`)**: Full governing commercial agreement.
- **Privacy Policy (`/privacy`)**: Data protection and cookie policies.
- **Cancellation & Refunds (`/refund-policy`)**: Transparent return and refund guidelines.
- **Shipping Policy (`/shipping-policy`)**: Standard delivery timelines, shipping rules, and transit terms.
- **Nutritional Disclaimer (`/disclaimer`)**: Comprehensive wellness and food safety disclaimer.
- **Contact Us (`/contact`)**: Customer care channels and business contact details.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16.2.12](https://nextjs.org/) | App Router, React Server Components (RSC), API Route Handlers |
| **UI Library** | [React 19.2.4](https://react.dev/) | Modern concurrent rendering engine |
| **Language** | [TypeScript 5.x](https://www.typescriptlang.org/) | End-to-end static typing across UI, backend, and database |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS framework with PostCSS |
| **Animations** | [Framer Motion 12.x](https://www.framer.com/motion/) | Smooth UI transitions, scroll animations, and interactive elements |
| **Icons** | [Lucide React](https://lucide.react.dev/) | Clean, lightweight icon suite |
| **Charts** | [Chart.js](https://www.chartjs.org/) & [React-Chartjs-2](https://react-chartjs-2.js.org/) | High-performance canvas charts for admin analytics |
| **Database ORM** | [Prisma 7.9.1](https://www.prisma.io/) | Next-generation ORM with PostgreSQL Driver Adapter (`@prisma/adapter-pg`) |
| **Database** | [PostgreSQL 16+](https://www.postgresql.org/) | Relational database (Local PostgreSQL / Prisma Postgres / Supabase / Neon) |
| **Payment Gateway** | [Razorpay SDK](https://razorpay.com/) | Seamless checkout integration with webhook signature verification |
| **Validation** | [Zod 4.x](https://zod.dev/) | Type-safe schema validation for checkout, auth, and payment requests |
| **Email Service** | [Nodemailer 9.x](https://nodemailer.com/) | Transactional SMTP email dispatcher for OTP verification |
| **Notifications** | [React Hot Toast](https://react-hot-toast.com/) | Animated toast notifications |
| **Logging** | [Pino](https://github.com/pinojs/pino) | High-speed, structured JSON logger |

---

## 📁 Directory Structure

```text
brainbowl-store/
├── .env.example                  # Environment variables template
├── next.config.ts                # Next.js runtime & compiler configuration
├── package.json                  # Dependencies and execution scripts
├── postcss.config.mjs            # PostCSS configuration for Tailwind v4
├── prisma.config.ts              # Prisma CLI configuration & seed runner
├── tsconfig.json                 # TypeScript compiler configuration
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema definitions & models
│   └── seed.ts                   # Initial product & catalog seed script
├── public/                       # Static public assets (logos, images, icons)
│   ├── Brain Bowl Logo.png       # Brand icon logo
│   ├── Brain Bowl Text logo.png  # Brand text logo
│   ├── product_image.jpeg        # Primary product packaging render
│   ├── setp1.jpg ... setp6.jpg   # Artisanal processing step imagery
│   └── ...
└── src/
    ├── app/                      # Next.js App Router
    │   ├── admin/                # Shopify-style Admin Dashboard page
    │   ├── api/                  # Next.js Serverless Route Handlers
    │   │   ├── admin/            # Admin auth, products, orders, settings, stats
    │   │   ├── auth/             # Customer login, register, OTP verification
    │   │   ├── checkout/         # Order creation & Razorpay order generation
    │   │   ├── user/dashboard/   # Customer profile & order history endpoint
    │   │   ├── verify-payment/   # Razorpay signature validation endpoint
    │   │   └── webhooks/razorpay/# Asynchronous Razorpay webhook listener
    │   ├── checkout/             # Dedicated Checkout page
    │   ├── contact/              # Contact Us page
    │   ├── dashboard/            # Customer Account Dashboard page
    │   ├── disclaimer/           # Nutritional Disclaimer page
    │   ├── orders/               # Public Order Tracking page
    │   ├── privacy/              # Privacy Policy page
    │   ├── refund-policy/        # Cancellation & Refund Policy page
    │   ├── shipping-policy/      # Shipping Policy page
    │   ├── terms/                # Terms & Conditions page
    │   ├── globals.css           # Global Tailwind CSS styles & typography variables
    │   ├── layout.tsx            # Root HTML layout, font variables, and Toaster
    │   └── page.tsx              # Server-rendered Landing Page wrapper
    ├── components/               # Reusable React components
    │   ├── landing/              # 20 Modular landing page sections
    │   │   ├── 01_Header.tsx
    │   │   ├── 02_HeroSection.tsx
    │   │   ├── 03_TrustBar.tsx
    │   │   ├── 04_ProblemSolution.tsx
    │   │   ├── 05_HealthBenefits.tsx
    │   │   ├── 06_NutritionFacts.tsx
    │   │   ├── 07_FlavorsShowcase.tsx
    │   │   ├── 08_SourcingStory.tsx
    │   │   ├── 09_ComparisonTable.tsx
    │   │   ├── 10_HowItIsMade.tsx
    │   │   ├── 11_RecipeIdeas.tsx
    │   │   ├── 12_CustomerReviews.tsx
    │   │   ├── 13_ExpertEndorsement.tsx
    │   │   ├── 14_Certifications.tsx
    │   │   ├── 15_ValueBundle.tsx
    │   │   ├── 16_FAQSection.tsx
    │   │   ├── 17_Guarantees.tsx
    │   │   ├── 18_StickyCTA.tsx
    │   │   ├── 19_Newsletter.tsx
    │   │   └── 20_Footer.tsx
    │   ├── AuthModal.tsx         # Customer sign-in & OTP registration dialog
    │   ├── CheckoutModal.tsx     # Popup checkout modal
    │   ├── HomeClient.tsx        # Client orchestrator for the storefront
    │   └── RazorpayScript.tsx    # Razorpay Checkout SDK loader
    ├── hooks/
    │   └── useResendTimer.ts     # OTP resend cooldown timer hook
    └── lib/
        ├── email.ts              # Nodemailer transport & HTML email generator
        ├── logger.ts             # Pino logger configuration
        ├── prisma.ts             # Global Prisma Client instance with PG adapter
        ├── razorpay.ts           # Razorpay client instance
        └── zod-schemas.ts        # Zod input validation schemas
```

---

## 🗄️ Database Architecture & Models

The database schema is managed via **Prisma ORM** targeting **PostgreSQL**:

```mermaid
erDiagram
    PRODUCT ||--o{ ORDER : receives
    PRODUCT {
        string id PK
        string name
        string sku UK
        int price "in paise (e.g. 29900 = ₹299.00)"
        int stock
        string imageUrl
        string description
        string seoTitle
        string seoDescription
        datetime createdAt
        datetime updatedAt
    }
    ORDER {
        string id PK
        string receiptId UK
        int amount "in paise"
        int shippingCost "in paise"
        string status "PAID | PENDING | CANCELLED"
        string customerName
        string customerEmail
        string customerPhone
        string shippingAddress
        string razorpayOrderId UK
        string razorpayPaymentId
        string awbNumber
        string courierUrl
        string productId FK
        datetime createdAt
        datetime updatedAt
    }
    USER {
        string id PK
        string name
        string email UK
        string phone UK
        string password
        datetime createdAt
        datetime updatedAt
    }
    OTP {
        string id PK
        string email
        string code
        string type "REGISTER | FORGOT_PASSWORD"
        datetime expiresAt
        datetime createdAt
    }
    STORE_SETTING {
        string id PK "global"
        int freeShippingMinAmount "in paise (e.g. 99900 = ₹999)"
        int standardShippingFee "in paise (e.g. 9900 = ₹99)"
        datetime updatedAt
    }
    AUDIT_LOG {
        string id PK
        string level "INFO | WARN | ERROR"
        string message
        json metadata
        datetime createdAt
    }
```

---

## 📡 API Endpoints Reference

### 1. Storefront & Checkout APIs
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/checkout` | Validates customer details and initializes Razorpay Order | No |
| `POST` | `/api/verify-payment` | Validates HMAC SHA-256 signature and marks order as `PAID` | No |
| `POST` | `/api/webhooks/razorpay` | Asynchronous Razorpay webhook handler for captured payments | Razorpay HMAC |
| `GET` | `/api/orders?phone=...` | Public order status & tracking lookup by phone number | No |

### 2. Customer Authentication & Account APIs
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/send-otp` | Generates and sends a 6-digit OTP code to email via SMTP | No |
| `POST` | `/api/auth/register-otp`| Verifies OTP and registers a new customer account | No |
| `POST` | `/api/auth/login` | Authenticates customer with password and sets session cookie | No |
| `GET` | `/api/auth/me` | Fetches active logged-in customer session | Session Cookie |
| `POST` | `/api/auth/logout` | Clears customer session cookie | Session Cookie |
| `POST` | `/api/auth/reset-password`| Resets customer password via verified OTP | No |
| `GET` | `/api/user/dashboard` | Returns customer profile data and order history | Session Cookie |

### 3. Administrator APIs (`/admin`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/admin/login` | Authenticates admin user and establishes admin session | No |
| `GET` | `/api/admin/me` | Validates admin session | Admin Cookie |
| `POST` | `/api/admin/logout` | Clears admin session cookie | Admin Cookie |
| `GET` | `/api/admin/stats` | Fetches KPI summary, sales data, recent orders, and users | Admin Cookie |
| `GET` | `/api/admin/products` | Retrieves all product items in the catalog | Admin Cookie |
| `POST` | `/api/admin/products` | Creates or updates a product's price, stock, and SEO | Admin Cookie |
| `PUT` | `/api/admin/orders` | Updates order status or assigns AWB tracking number & URL | Admin Cookie |
| `DELETE`| `/api/admin/orders` | Deletes an order from the database | Admin Cookie |
| `GET` | `/api/admin/settings` | Retrieves global shipping fee thresholds | Admin Cookie |
| `PUT` | `/api/admin/settings` | Updates global free shipping minimum threshold and fee | Admin Cookie |

---

## 🚀 Getting Started

### Prerequisites
Make sure your development machine has:
- **Node.js**: `v20.x` or higher installed ([Download Node.js](https://nodejs.org/))
- **npm** / **pnpm** / **yarn** package manager
- **PostgreSQL Database**: Local instance (e.g. `localhost:5432`), [Prisma Postgres](https://www.prisma.io/postgres), or a hosted provider ([Supabase](https://supabase.com/), [Neon](https://neon.tech/), [Aiven](https://aiven.io/)).

---

### Step 1: Clone the Repository & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/brainbowl-store.git

# Navigate into the project directory
cd brainbowl-store

# Install dependencies
npm install
```

---

### Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory by copying the `.env.example` template:

```bash
cp .env.example .env.local
```

Fill in your actual service credentials:

```env
# 1. DATABASE CONFIGURATION (Prisma ORM & PostgreSQL)
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/brainbowl?sslmode=disable"

# 2. ADMIN CREDENTIALS (/admin)
ADMIN_USERNAME="
ADMIN_PASSWORD=""

# 3. RAZORPAY PAYMENT GATEWAY
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
RAZORPAY_WEBHOOK_SECRET=""
NEXT_PUBLIC_RAZORPAY_KEY_ID=""

# 4. EMAIL & OTP AUTHENTICATION (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"

# 5. RUNTIME
NODE_ENV="development"
```

---

### Step 3: Initialize Database & Seed Catalog

Generate the Prisma client, push the schema to PostgreSQL, and seed the initial product catalog:

```bash
# Generate Prisma client bindings
npx prisma generate

# Push database schema to PostgreSQL
npx prisma db push

# Seed initial product data into PostgreSQL
npm run seed  # or: npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" prisma/seed.ts
```

*(Optional)* You can open **Prisma Studio** at any time to visually view and edit your database tables:

```bash
npx prisma studio
```

---

### Step 4: Run the Development Server

Start the local development server:

```bash
npm run dev
```

Open your browser and navigate to:
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Customer Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Order Tracking**: [http://localhost:3000/orders](http://localhost:3000/orders)
- **Admin Control Center**: [http://localhost:3000/admin](http://localhost:3000/admin) *(Sign in with `ADMIN_USERNAME` & `ADMIN_PASSWORD`)*

---

## ⚙️ NPM Scripts Reference

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server on `localhost:3000` |
| `npm run build` | Compiles the production build (RSC optimization, assets, routes) |
| `npm run start` | Boots the Next.js production server |
| `npm run lint` | Runs ESLint 9 to detect code smells and syntax violations |
| `npx prisma generate` | Regenerates the TypeScript Prisma Client from `schema.prisma` |
| `npx prisma db push` | Syncs the database schema directly with your PostgreSQL database |
| `npx prisma studio` | Launches an interactive database GUI at `http://localhost:5555` |

---

## 🔒 Security & Best Practices

- **Zero Client-Side Secrets**: All Razorpay secret keys, webhook secrets, database credentials, and SMTP credentials remain strictly server-side.
- **Cryptographic Verification**: Payment authenticity is checked using Node's `crypto.createHmac('sha256')` against Razorpay payment signatures.
- **HTTP-Only Cookies**: User and administrator sessions are protected against Cross-Site Scripting (XSS) via `httpOnly`, `secure` (in production), and `sameSite: 'lax'` cookie attributes.
- **Strict Input Sanitization**: All endpoint payloads are validated with Zod before database operations are executed.
- **Production Console Stripping**: `next.config.ts` is configured with `removeConsole` (retaining only `error` logs) to prevent confidential runtime data from leaking into client-side production builds.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ for BrainBowl — Nourish Your Brain & Body</sub>
</div>
