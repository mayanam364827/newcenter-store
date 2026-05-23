# NEWCENTER.STORE

> **Chuyên mua bán iPhone chính hãng giá tốt tại TP HCM**

A production-ready full-stack Next.js 14 storefront for NEWCENTER.STORE — featuring a customer-facing iPhone catalog and a full admin dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| ORM | Prisma |
| Database | PostgreSQL |
| Image Storage | Cloudinary |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Customer-facing homepage
│   ├── globals.css
│   ├── admin/
│   │   └── page.tsx        # Admin dashboard
│   └── api/
│       ├── series/route.ts
│       ├── series/[key]/models/route.ts
│       ├── models/route.ts
│       ├── models/[id]/route.ts
│       ├── upload/route.ts
│       └── auth/verify/route.ts
└── lib/
    ├── prisma.ts           # Prisma client singleton
    └── auth.ts             # Admin token helper
prisma/
├── schema.prisma
└── seed.ts
```

---

## Local Development Setup

### 1. Clone and install dependencies

```bash
git clone https://github.com/mayanam364827/newcenter-store.git
cd newcenter-store
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your real values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/newcenter_store"
ADMIN_TOKEN="your-secure-admin-token-here"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_TOKEN` | Secret token for admin authentication |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## Database Setup

### Push schema and seed data

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (dev/initial setup)
npm run db:push

# Or run migrations
npm run db:migrate

# Seed with sample iPhone data
npm run db:seed
```

---

## Running the App

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) for the storefront.

Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

---

## Admin Dashboard

Navigate to `/admin`. You will be prompted for the admin password (your `ADMIN_TOKEN` value).

Features:
- Browse and filter models by iPhone series
- Search across all models
- Add / Edit / Delete models
- Upload product images via Cloudinary
- Real-time status management (Còn hàng / Hết hàng / Đặt trước)

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/series` | No | List all iPhone series |
| GET | `/api/series/[key]/models` | No | Models for a series |
| GET | `/api/models/[id]` | No | Single model |
| POST | `/api/models` | Yes | Create model |
| PUT | `/api/models/[id]` | Yes | Update model |
| DELETE | `/api/models/[id]` | Yes | Delete model |
| POST | `/api/upload` | Yes | Upload image to Cloudinary |
| GET | `/api/auth/verify` | Yes | Verify admin token |

Admin endpoints require either:
- `Authorization: Bearer <ADMIN_TOKEN>` header, or
- `x-admin-token: <ADMIN_TOKEN>` header

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Add all environment variables from your `.env` file in the Vercel dashboard
4. Deploy

### 3. Database on Vercel

Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or any PostgreSQL provider (Neon, Supabase, Railway):

```bash
# After adding DATABASE_URL to Vercel env vars, run migrations:
npx prisma migrate deploy

# Seed production data:
npm run db:seed
```

---

## Connecting Custom Domain newcenter.store

1. In **Vercel** → your project → **Settings** → **Domains**
2. Add `newcenter.store` and `www.newcenter.store`
3. In your domain registrar DNS settings, add:
   - Type `A` → `76.76.21.21` (Vercel's IP)
   - Type `CNAME` → `www` → `cname.vercel-dns.com`
4. Wait for DNS propagation (up to 48 hours)

---

## Contact

- Zalo: [0826 000 291](https://zalo.me/0826000291)
- Zalo: [0377 324 973](https://zalo.me/0377324973)
- Address: 13, NE8 Phường Thới Hòa, TP HCM