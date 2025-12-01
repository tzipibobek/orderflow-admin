# Bobek — Admin Panel

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)
![Status](https://img.shields.io/badge/Status-Active-success)

> **Status**: Actively developed. Public demo and private production.

## 🚀 Overview

Admin panel for managing **orders**, **customers**, and **products** of a real distribuition business. Includes authentication, i18n (ES/EN), dashboard metrics, global search, toasts, confirm dialogs, and responsive tables.

## ✨ Features

* Orders: create/edit, update status, line totals, delivered filter.
* Customers: add/edit, balance and debt overview, sortable.
* Products: active/inactive toggle, variations, pricing.
* Dashboard: KPIs (7d), top products (30d), highest-debt customers.
* Global search (⌘/Ctrl + K), toast notifications, confirm modals.
* i18n: ES/EN (runtime), demo defaults to English.
* Responsive design: fixed sidebar on desktop, off-canvas on mobile.

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Orders
![Orders](./screenshots/orders.png)

### Customers
![Customers](./screenshots/customers.png)

### Products
![Products](./screenshots/products.png)

## 🧰 Tech Stack

* **Next.js 15 (App Router)** · **React 19** · **TypeScript** · **Tailwind CSS v4**
* **Supabase (Postgres + Auth)** · **Prisma ORM**
* UI: **lucide-react**, **sonner**

## 🏗️ Architecture

* `src/modules/*`: domain modules (orders, customers, products, shared)
* `src/app/(protected)/*`: protected routes
* `src/app/(public)/auth/*`: public auth (sign-in)
* `src/modules/shared/lib/*`: Supabase SSR, authz, helpers

## 🔐 Environments

Uses **two Supabase projects**:

* **Production (ES)**: real data, owner-only access.
* **Demo (EN)**: fake data, public portfolio showcase.

## 🔑 Environment Variables

Create `.env` (local) and configure the same in Vercel (prod/demo).

```ini
# Supabase (client)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=""


# Database (for Prisma)
DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public
OWNER_EMAILS=tu-email@dominio.com


# App mode: "demo" | "prod"
APP_MODE=demo
NEXT_PUBLIC_APP_MODE=demo
```

## 🧪 Local Development

```bash
# 1) Install deps
pnpm i  # or npm i / yarn

# 2) Env vars
cp .env.example .env  # fill keys

# 3) Prisma (first time)
pnpm run prisma:migrate -- --name init

# or later, just:
# pnpm run prisma:migrate

# 4) Run app
pnpm dev
```

## 🗄️ Database

* Prisma schema in `prisma/schema.prisma` (Orders, OrderItem, Customer, Product, ProductVariant, etc.)
* Migrations in `prisma/migrations/*`
* Optional seed for demo data.

## 🔒 Auth & RLS

* Login via Supabase Auth (email/password). Owner access restricted by role or whitelist.
* RLS enabled for sensitive tables (if queried client-side) or use server-side API access.

## 🌍 i18n

* Dictionaries in `src/modules/shared/i18n/*`
* Semantic keys (`orders`, `customers`, `newOrder`, etc.)
* Demo defaults to English; production uses Spanish.

## 🚢 Deploy (Vercel)

1. Import repo → New Project.
2. Set environment variables (Production/Preview).
3. Assign domain for **Prod**, subdomain for **Demo**.
4. Protect `/auth/*` and private routes with middleware/SSR.

## 🧪 Live Demo

🔹 **Public demo (English):** https://bobek-admin-demo.vercel.app  
