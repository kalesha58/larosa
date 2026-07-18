# Larosa Mobile App — Luxury Farmhouse & Villa Booking Platform

**Larosa** is a luxury mobile application built with **React Native** and **TypeScript**, designed for discovering, booking, hosting, and administering premium farmhouse and villa getaways.

---

## 🌟 Overview

The Larosa platform provides a multi-role experience tailored for **Guests**, **Hosts**, and **Platform Administrators**:

- **Guests** can search luxury properties, filter by amenities, check real-time availability, select booking modes, and manage their reservations.
- **Hosts** can onboard their farmhouses, manage pricing & calendar availability (including Airbnb iCal sync), submit verification credentials, and view revenue payouts.
- **Administrators** have complete oversight through a centralized command dashboard to manage property qualification approvals, host identity verification, platform service fee calculations, booking dispute resolution, customer reviews moderation, and content control.

---

## ✨ Key Features & User Flows

### 1. Guest Experience 🏡
- **Luxury Browsing**: Rich visual presentation of villas and farmhouses with photo carousels, pricing breakdowns, and amenity badges.
- **Filter & Search**: Search by location, guest capacity, price range, and key amenities (swimming pool, lawn, Wi-Fi, etc.).
- **Booking Flow**: Flexible instant booking or request-to-book workflows with clear security deposit terms.
- **My Bookings & Profile**: Manage upcoming and past trips with cancellation and dispute options.

### 2. Host Onboarding & Management 🔑
- **Property Listing Manager**: Create and edit farmhouses with customized pricing, capacity, room counts, and photo galleries.
- **Calendar & iCal Sync**: Synchronize calendar availability with external platforms like Airbnb using iCal integration.
- **Host Verification Submission**: Submit Government ID scans, bank account details for payouts, and property ownership deeds for platform verification.

### 3. Admin Command Center 📊
- **Property Approval Checklist**: Strict quality gate engine requiring validation of minimum qualifications:
  - 🏊‍♂️ Swimming Pool present
  - 🏡 Private Landscaped Lawn present
  - 🛏️ Minimum 3 Bedrooms
  - ✨ Cleanliness standards
  - 👮‍♂️ On-property staff or security assistance
- **Host Identity Verification**: Verify host government identity documents, bank accounts, and property deeds with approval/rejection workflows.
- **Booking Oversight & Service Fees**:
  - Live tracking of all bookings across states (confirmed, pending, cancelled).
  - Automated **10% Platform Service Fee** calculation and host payout breakdown (90%).
  - Booking dispute resolution center for managing guest/host claims.
- **Content Control & Moderation**:
  - Review moderation (delete inappropriate reviews, post official admin responses).
  - Support & Disputes desk (chat history log, ticket resolution).
  - Content moderation (suspend reported properties or user accounts, dismiss reports).
- **User Directory**: Search, edit roles, suspend or restore guest and host accounts.

---

## 🛠️ Technology Stack

- **Framework**: React Native (0.76+) with TypeScript
- **Navigation**: React Navigation (`@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`)
- **Icons & UI**: Lucide React Native (`lucide-react-native`), custom UI component design system
- **State Management**: React Context API (`DataProvider`, `ThemeProvider`, `AuthProvider`) for global reactivity across all screens
- **Styling**: Vanilla CSS tokenized design system supporting sleek dark modes, gold accents, and dynamic animations

---

## 📂 Project Structure

```text
client/
├── App.tsx                    # Main navigation container & tab/stack routing
├── types.ts                   # TypeScript interfaces (Rooms, Bookings, Users, Support, Reports)
├── components/
│   ├── ui.tsx                 # Reusable UI component library (Buttons, Chips, Cards, Badges)
│   └── LinearGradient.tsx     # Custom gradient wrapper
├── constants/
│   └── colors.ts              # Theme color tokens & palettes
├── lib/
│   ├── auth-context.tsx       # User authentication context
│   ├── data-context.tsx       # Central state management (Rooms, Bookings, Reviews, Support)
│   ├── mockData.ts            # Initial seeded mock data
│   ├── theme-context.tsx      # Dark/Light theme context provider
│   └── format.ts              # Money, date, and string formatters
└── screens/                   # Application Screen Modules
    ├── Admin Screens          # VillasScreen, BookingDetailScreen, UsersScreen, FeedbackScreen, etc.
    ├── Host Screens           # HostHomeScreen, VillaEditScreen, CalendarScreen, etc.
    └── Customer Screens       # CHomeScreen, CBookingsScreen, PropertyDetailScreen, etc.
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have set up your React Native development environment:
- **Node.js**: >= 18
- **macOS** (for iOS builds): Xcode, CocoaPods
- **Android**: Android Studio & JDK

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **iOS Setup**:
   ```bash
   cd ios
   pod install
   cd ..
   ```

---

## 📱 Running the Application

### Start Metro Bundler
```bash
npm start
```

### Run on iOS
```bash
npm run ios
```

### Run on Android
```bash
npm run android
```

---

## 🧪 Demo Test Roles

The application includes predefined roles in the mock context for testing:

| Role | Email | Description |
| :--- | :--- | :--- |
| **Admin** | `admin@larosa.in` | Full access to approval checklists, dispute management, reviews, and user directory |
| **Host** | `host@larosa.in` | Access to host dashboard, property edit forms, calendar sync, and payout details |
| **Guest** | `guest@larosa.in` | Customer browsing experience, booking flows, and personal trip history |

---

## 📄 License

Copyright © 2026 Larosa. All rights reserved.
