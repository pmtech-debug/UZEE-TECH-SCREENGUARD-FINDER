# UZEE TECH ScreenGuard Finder

> **Production-Ready Internal Search & Compatibility Management Application for UZEE TECH**

![UZEE TECH Logo](public/uzee_tech_official_logo.png)

A high-performance, Apple-inspired Next.js 15 web application built for UZEE TECH employees to instantly look up phone models and retrieve exact screen protector **BOX NUMBERS** along with all compatible models inside each box.

---

## 🌟 Key Features

- **⚡ Instant Fuzzy Search (Fuse.js)**: Fast search while typing without pressing submit buttons. Supports partial model matches (`A06`, `Redmi 13C`, `IP 15 Pro Max`) and box number shortcuts (`BOX 01`, `49`).
- **☁️ Supabase-Powered Database**: All 106 compatibility boxes stored in Supabase PostgreSQL. Every Admin change persists immediately — no more JSON file hacks.
- **🎨 Premium Apple-Inspired UI**: Minimalist glassmorphic design, smooth typography, rich micro-interactions, dark mode support, and brand color palette (`#b01d23`) extracted directly from the official logo.
- **⚙️ Complete Admin Management Panel**: Accessible via the gear icon in the header. Supports adding new boxes, editing existing boxes, deleting boxes, managing individual/bulk model tags — all saved directly to Supabase.
- **📋 1-Click Copy Actions**: Quick copy buttons for Box Numbers and complete compatible model lists with copy feedback toasts.
- **🏷️ Interactive Recent Searches**: Saves search history locally in `localStorage` for rapid 1-click re-searching.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Search Engine**: [Fuse.js](https://www.fusejs.io/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

---

## 📁 Folder Structure

```text
UZEE-TECH-SCREENGUARD-FINDER/
├── public/
│   ├── uzee_tech_official_logo.png   # Official UZEE TECH Logo
│   └── logo.png                      # Favicon / Logo Alias
├── scripts/
│   └── seed-supabase.ts              # One-time seeder: JSON → Supabase
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx              # Admin CRUD Management Page
│   │   ├── api/
│   │   │   └── screenguards/
│   │   │       └── route.ts          # API Route → Supabase (GET / POST)
│   │   ├── globals.css               # Global glassmorphism & theme CSS
│   │   ├── layout.tsx                # Root layout with ThemeProvider
│   │   └── page.tsx                  # Home Search Page
│   ├── components/
│   │   ├── AdminBoxModal.tsx         # Modal dialog for box/model editing
│   │   ├── Header.tsx                # Navbar with logo, theme toggle & gear
│   │   ├── ResultCard.tsx            # Apple-style compatibility result card
│   │   ├── SearchBar.tsx             # Hero search bar with recent search chips
│   │   └── ThemeProvider.tsx         # Next-themes wrapper
│   ├── data/
│   │   └── screenguards.json         # Seed source — NOT read at runtime
│   ├── lib/
│   │   ├── db.ts                     # Supabase data access layer
│   │   ├── search.ts                 # Fuse.js fuzzy search engine
│   │   ├── supabase.ts               # Supabase JS client singleton
│   │   └── utils.ts                  # Tailwind class merge helper
│   └── types/
│       └── screenguard.ts            # TypeScript interfaces
├── schema.sql                        # Supabase SQL schema (run once)
├── .env.local.example                # Environment variable template
├── compatible-lists.pdf              # Source compatibility PDF
├── tailwind.config.ts                # Tailwind design tokens & brand colors
├── tsconfig.json                     # TypeScript strict configuration
└── package.json                      # Project dependencies & scripts
```

---

## ☁️ Supabase Setup (Required Before Running)

### Step 1 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in or create a free account.
2. Click **New Project** and fill in:
   - **Project name**: `uzee-tech-screenguard`
   - **Database password**: Choose a strong password
   - **Region**: Select the closest region to your users
3. Wait ~2 minutes for the project to be created.

### Step 2 — Run the SQL Schema

1. In your Supabase project, go to **SQL Editor** → **New Query**.
2. Copy the entire contents of [`schema.sql`](./schema.sql) from this repository.
3. Paste it into the SQL Editor and click **Run**.
4. You should see: `Success. No rows returned.`

### Step 3 — Get Your API Credentials

1. In your Supabase project, go to **Settings** → **API**.
2. Copy:
   - **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
   - **anon / public** key (long JWT string)

### Step 4 — Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Never commit `.env.local` to git.** It is already in `.gitignore`.

### Step 5 — Seed the Database (One Time Only)

This imports all 106 compatibility boxes from the local JSON file into Supabase:

```bash
npx tsx scripts/seed-supabase.ts
```

You should see output like:
```
📦  Seeding 106 boxes into Supabase…
  ✓  50/106 rows upserted
  ✓  100/106 rows upserted
  ✓  106/106 rows upserted

✅  Seeding complete!
```

---

## 🛠️ Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm
- A Supabase project (see setup above)

### Installation

```bash
# Clone the repository
git clone https://github.com/pmtech-debug/UZEE-TECH-SCREENGUARD-FINDER.git
cd UZEE-TECH-SCREENGUARD-FINDER

# Install dependencies
npm install

# Configure environment (see Supabase Setup above)
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build & Verification

```bash
# Type check
npx tsc --noEmit

# ESLint check
npm run lint

# Production build
npm run build

# Start production server
npm start
```

---

## ☁️ Deployment to Vercel

1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com/new).
3. In Vercel project settings → **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.

> ⚠️ **Do not deploy without setting the Supabase environment variables in Vercel.** The app will load but show an empty/error state at runtime without them.

---

## 📄 License & Credits

Built exclusively for **UZEE TECH**. All compatibility datasets derived from official manufacturer lists.
