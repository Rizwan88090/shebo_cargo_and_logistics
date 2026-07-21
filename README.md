# Shebo Cargo and Logistics

Full-stack website + admin panel for **Shebo Cargo and Logistics** — premium air, sea & land cargo, movers & packers, car shipping, GCC trailer transport and warehouse storage.

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript
- **Backend:** NestJS 11 + Prisma 7 + PostgreSQL
- **Auth:** JWT (access + refresh), role-based (USER / ADMIN / SUPER_ADMIN)

## Features

- Public marketing site (home, services, countries, tracking, contact, quote) — bilingual EN/AR, light/dark mode, 3D animations, SEO-ready (sitemap, robots, Open Graph, JSON-LD).
- **Order flow** — bargain on WhatsApp → place order → live status. Orders land in the admin panel.
- **Admin panel** — dashboard, analytics, order management (approve / re-price / status), all driven by real order data.
- 8 services incl. Car Shipping, GCC Trailer Service (Flatbed / Curtain-Side / Box / Reefer) and Warehouse Storage.

## Project structure

```
frontend/   Next.js app (the website + admin + portal)
backend/    NestJS API + Prisma schema, migrations & seed
```

## Local setup

### 1. Backend

```bash
cd backend
npm install

# Create .env (see backend/.env.example). Minimum required:
#   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/cargo?schema=public"
#   JWT_ACCESS_SECRET="..."  JWT_REFRESH_SECRET="..."
#   FRONTEND_URL="http://localhost:3000"  PORT=3001
# NOTE: if the DB password contains @ or special chars, URL-encode it (@ = %40).

npx prisma generate
npx prisma migrate deploy   # or: npx prisma migrate dev
npx prisma db seed          # seeds admin + services + countries
npm run start:dev           # API on http://localhost:3001  (Swagger: /api)
```

### 2. Frontend

```bash
cd frontend
npm install

# frontend/.env.local (optional — see frontend/.env.example):
#   NEXT_PUBLIC_SITE_URL=http://localhost:3000
#   NEXT_PUBLIC_API_URL=http://localhost:3001   # enables the live backend order flow

npm run dev                 # http://localhost:3000
```

## Admin login

- URL: `/login`
- Email: `itxsheboo@gmail.com`
- Password: `Admin123`  *(change it from Portal → Profile → Change Password)*

## Deployment (VPS)

1. Set production env: `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_API_URL` (frontend), `FRONTEND_URL` + DB + JWT secrets (backend).
2. Backend: `npm run build` → run `dist/main.js` (PM2 recommended). Run `npx prisma migrate deploy` + `npx prisma db seed` once.
3. Frontend: `npm run build && npm run start` (PM2).
4. Nginx reverse proxy → frontend `:3000`; API on a subdomain → backend `:3001`. Add SSL (certbot).
5. Submit `sitemap.xml` in Google Search Console.

> **Secrets** (`.env`) are git-ignored and never committed. Use `.env.example` files as templates.
