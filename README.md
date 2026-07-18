# Larosa — Luxury Farmhouse & Villa Booking Platform

Welcome to the **Larosa** monorepo workspace. Larosa is an end-to-end luxury hospitality platform connecting guests with high-end farmhouse getaways, empowering property hosts, and providing platform administrators with powerful management tools.

---

## 📁 Repository Overview

This repository contains the following core sub-modules:

| Directory | Component | Description |
| :--- | :--- | :--- |
| **[`client/`](./client)** | **Mobile Application** | React Native mobile app for iOS and Android serving Guests, Hosts, and Administrators. |
| **`larosa-website/`** | **Web Application** | Web portal for property showcases and web bookings. |
| **`docs/`** | **Documentation** | Platform architecture, API specs, and onboarding guides. |

---

## 📱 Mobile App (`client/`)

The mobile application is built with **React Native** and **TypeScript** and features:

- 🏡 **Guest Booking Portal**: Property discovery, interactive availability calendars, and booking requests.
- 🔑 **Host Portal**: Villa listings management, pricing rules, calendar availability sync (Airbnb iCal), and verification submissions.
- 🛡️ **Admin Command Dashboard**: Property qualification approval checklists (pool, lawn, >=3 bedrooms, staff), host identity & document verification, booking oversight & 10% platform fee calculations, dispute resolutions, and content moderation (reviews & suspensions).

For full mobile app setup and developer instructions, refer to **[`client/README.md`](./client/README.md)**.

---

## 🚀 Quick Start (Mobile App)

```bash
# Navigate to the mobile app directory
cd client

# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on iOS (macOS only)
npm run ios

# Run on Android
npm run android
```

---

## 📄 License

Copyright © 2026 Larosa. All rights reserved.
