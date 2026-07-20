# Paa O Paa!

A professional web app connecting Ghanaian artisans with people who need their services, and linking individuals with apprenticeship opportunities.

Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and a **dummy JSON backend** for demo purposes.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| `user@demo.com` | `demo123` | End user |
| `artisan@demo.com` | `demo123` | Artisan |
| `business@demo.com` | `demo123` | Business |
| `admin@demo.com` | `demo123` | Admin |

## Features

- **Landing page** — matches the polished Earth & Craft design system
- **Authentication** — login, register, OTP verify (accepts any 6-digit code)
- **Artisan discovery** — search, filter by region and trade, view profiles and reviews
- **Apprenticeships** — browse listings, apply with statement of interest
- **Profile** — edit details, view application history
- **Dummy API** — all data stored in JSON files under `src/data/`

## Project Structure

```
src/
├── app/           # Pages and API routes
├── components/    # UI components
├── data/          # JSON seed data
└── lib/           # Types, mock DB, utilities
```

## Design System

- **Fonts:** Epilogue (headings), Plus Jakarta Sans (body), JetBrains Mono (labels)
- **Colors:** Terracotta primary, Kente gold secondary, sand cream background
- **Source:** `stitch_polished_web_app_interface.zip` design export

## Next Steps (Real Backend)

Replace dummy API routes with PostgreSQL + PostGIS, JWT auth, SMS OTP (Hubtel/Arkesel), and file storage (Cloudinary/S3) per `PHASE_ONE.md`.
