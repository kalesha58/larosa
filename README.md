# Larosa — Luxury Farmhouse & Villa Booking Platform

Welcome to the **Larosa** workspace. Larosa is a comprehensive, end-to-end luxury hospitality platform connecting guests with high-end farmhouse getaways, empowering property hosts with state-of-the-art listing management, and providing platform administrators with robust command tools.

This repository is organized as a monorepo containing both the React Native/TypeScript client (powering Guest, Host, and Admin portals) and the Next.js web application.

---

## 📁 Workspace Architecture

```
Larosa Monorepo
├── client/                 # React Native mobile app (iOS, Android, & WebView)
│   ├── components/         # Shared UI Components (Inputs, Chips, Modals, Headers)
│   ├── constants/          # Brand Color Schemes & Constants
│   ├── lib/                # Theme, Alerts, & Data Context providers
│   └── screens/            # Core views: /admin, /host, & /customer
│
├── larosa-website/         # Next.js web portal & booking platform
│   ├── src/app/            # App router paths (admin dashboard, bookings, public)
│   ├── src/components/     # Responsive web components & mockups
│   └── src/lib/            # Database config, mailers, and utility functions
│
└── docs/                   # Platform architecture guides & API specs
```

---

## 🛠️ Tech Stack

- **Mobile Client**: React Native, React Navigation, TypeScript, Lucide Icons, React Native Safe Area Context.
- **Web Application**: Next.js (App Router), React, TailwindCSS, Radix UI Primitives, Lucide Icons.
- **State Management & Data**: React Context, React Query (TanStack Query) for declarative data caching.
- **Calendar Synchronization**: iCal format integrations (parsing and generating `.ics` feeds for OTA sync like Airbnb).
- **Payment Processing**: Razorpay gateway integrations with automatic fee calculation structures (10% platform commission, 90% host payout).

---

## 👥 Core Portals & User Roles

### 🏡 1. Guest Portal
- **Discovery**: Elegant visual grids to explore luxury farmhouses, filtering by capacities and pricing.
- **Interactive Calendar**: Check real-time booking availability.
- **Streamlined Bookings**: Seamless checkout flows with platform hold statuses.

### 🔑 2. Host Portal
- **Inventory Control**: Add or edit property details, highlight premium amenities, and manage uploads.
- **Sync & Settings**: Link external booking calendars (Airbnb, VRBO) via direct iCal import/export.
- **Onboarding Review**: Submit verification documents (Govt ID, Bank Details, Property Deeds) for platform approval.

### 🛡️ 3. Admin Command Dashboard
- **Villas Audit**: Walk through approval checklists (minimum 3 bedrooms, pool verification, lawn size, on-property security/staff) before publishing.
- **Verification Directory**: Review submitted host verification documents to verify safety and identity bank accounts.
- **Reservation Controls**: Oversee comprehensive check-in logs, calculate platform fees/payout schedules, and flag/resolve booking disputes.
- **Access Moderation**: Lock, suspend, or restore listings and user access instantly.

---

## 🚀 Getting Started

### 📱 Running the Mobile Client (`client/`)

The mobile client runs on iOS, Android, and Web viewports (via `react-native-web` bundles).

```bash
# 1. Navigate to the client directory
cd client

# 2. Install dependencies
npm install

# 3. Start the Metro bundler
npm run start

# 4. Launch on your desired environment
npm run ios        # For iOS simulator (macOS only)
npm run android    # For Android emulator
npm run web        # For React Native Web browser view
```

### 💻 Running the Web Application (`larosa-website/`)

```bash
# 1. Navigate to the website directory
cd larosa-website

# 2. Create local env files
cp .env.example .env.local

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## 📄 License & Terms

Copyright © 2026 Larosa. All rights reserved. Registered trademark of Larosa Hospitality Group.
