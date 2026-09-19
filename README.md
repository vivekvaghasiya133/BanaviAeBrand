# Up Digital — AI Marketing Agency (React + Node.js Clone)

A high-performance full-stack 1:1 replication of **[Up Digital](https://www.helloupdigital.com/)** built with **React**, **Vite**, **Tailwind CSS**, and a **Node.js Express** backend.

---

## 🚀 Features

- **Cosmic Hero Solar System**:
  - Deep space dark UI (`#050507`) with 4 drifting procedural color nebulas, twinkling starfield, and sweeping shooting stars.
  - Interactive procedural SVG planets (Pongbot, Gateway Counseling, Slavista, @dr.remina, Savants AI) with orbital moons, Saturn rings, and hover metric tooltips (`5.2× ROAS`, `$120K granted`).
- **Celestial Crystal Vision**:
  - Floating crystal sphere with glancing all-seeing digital eye (`cv-eye-look`, `cv-eye-blink`), energy aura rings, and an interactive prediction modal ("See Your Future →").
- **In-House Marketing Team Section**:
  - Creative storytelling meets AI velocity.
- **Trusted By Marquee**:
  - Infinite smooth ticker featuring luxury & enterprise brands (Supermicro, Avant Gallery, Bayer, Mauboussin, Villeroy & Boch, Dorchester, Four Seasons, Sephora, Ritz-Carlton).
- **Interactive 3D Services Cards**:
  - 6 services with hover/flip cards (Web Design, Social Media & UGC, Meta & Google Ads, AI SEO, AI Assistants, Non-Profit Management).
- **Portfolio Cockpit Pods**:
  - HUD telemetry console with active mission pods (`UPD-01` through `UPD-05`).
- **Selected Work Showcase**:
  - Horizontal drag & scroll case study carousel featuring `@dr.remina` (+417K followers, Forbes), `Pongbot` (5.2x ROAS), `Savants AI` (320% growth), `Slavista` (0→1), and `Gateway Counseling` ($120K Google Grants).
- **What We've Delivered Metrics**:
  - High-impact stat counters.
- **Launch Sequence Comparison**:
  - Detailed breakdown of what makes Up Digital different from traditional slow agencies.
- **Meet Maya (AI Marketing Strategist)**:
  - Real-time interactive AI chatbot console connected to the Node.js backend (`/api/chat`).
- **Project Onboarding Modal**:
  - Multi-step interactive brief submission modal connected to backend (`/api/onboarding`).
- **Cosmic Footer**:
  - Animated comet streaks, Miami and New York office locations, phone, email, and social channels.
- **Custom Cursor**:
  - Trailing magnetic cursor with dynamic reactive labels ("Visit", "Let's Go", "Reveal").

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 19 + Vite 8
  - Tailwind CSS + PostCSS
  - Lucide React Icons
  - Google Fonts (`Space Grotesk` & `Fraunces`)
- **Backend**:
  - Node.js + Express
  - CORS, JSON Body Parser, Dotenv
  - In-memory lead store + dynamic case studies dataset

---

## 💻 Quick Start

### 1. Run Everything Concurrently (Recommended)

From the root directory:
```bash
npm run dev
```
This runs:
- **Backend API**: `http://localhost:5001`
- **React Frontend**: `http://localhost:5173` (with `/api` proxied to backend)

### 2. Run Independently

**Start Backend**:
```bash
cd server
npm run dev
```

**Start Frontend**:
```bash
cd client
npm run dev
```

### 3. Production Build

```bash
npm run build
npm start
```
The Express server will serve the production bundle directly on `http://localhost:5001`.

---

## 📂 Project Structure

```
banaviaebrand/
├── package.json               # Root scripts & concurrently config
├── server/
│   ├── package.json
│   ├── index.js               # Express API (/api/chat, /api/onboarding, /api/contact)
│   └── data/
│       └── caseStudies.json   # Full case study data
└── client/
    ├── index.html             # Google Fonts & SEO metadata
    ├── vite.config.js         # Vite configuration with proxy to port 5001
    ├── tailwind.config.js
    ├── public/                # 100% original Up Digital assets, logos, and case studies
    │   ├── logo-transparent.png
    │   ├── logo-mark-lime.png
    │   ├── maya-v4.png
    │   ├── remina/
    │   ├── pongbot/
    │   └── work/
    └── src/
        ├── index.css          # Cosmic keyframes & styling
        ├── App.jsx            # Main app container
        └── components/
            ├── Navbar.jsx
            ├── HeroSolarSystem.jsx
            ├── CrystalVision.jsx
            ├── AboutTeam.jsx
            ├── TrustedByMarquee.jsx
            ├── ServicesCards.jsx
            ├── PortfolioCockpit.jsx
            ├── SelectedWorkSlider.jsx
            ├── DeliveredMetrics.jsx
            ├── LaunchSequence.jsx
            ├── MayaAiChat.jsx
            ├── ProjectOnboardingModal.jsx
            ├── Footer.jsx
            └── CustomCursor.jsx
```
