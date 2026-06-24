# HMART Enterprise E-Commerce Platform

A production-ready B2B/B2C e-commerce platform for Housekeeping, Stationery, Safety, Security, Office Pantry, and Sports products.

## Architecture

```
├── server/       Express.js API (TypeScript) — Auth, Catalog, Cart, Orders, Admin, Delivery
├── frontend/     Next.js 15 (TypeScript) — Buyer, Admin, Delivery Partner portals
├── supabase/     PostgreSQL migrations & seed data
└── docker-compose.yml
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Redux Toolkit, React Query |
| Backend | Express.js, TypeScript, Zod validation |
| Database | PostgreSQL (Supabase) |
| Cache | Upstash Redis |
| Auth | JWT + Refresh Tokens (httpOnly cookies) |
| Deployment | Docker, Vercel (frontend), Render/Railway (backend) |

## Prerequisites

- Node.js 20+
- npm 10+
- Supabase account (with service_role key)
- Upstash Redis account (optional, for caching)

## Local Development

### 1. Clone & install

```bash
git clone <repo-url>
cd Hmart_Web

# Install server deps
cd server && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Configure environment

**Server** (`server/.env`):
```env
PORT=4000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key
JWT_SECRET=your-random-string-minimum-32-characters
JWT_REFRESH_SECRET=another-random-string-minimum-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 3. Seed the database

Go to Supabase Dashboard → SQL Editor and run `supabase/seed.sql`.

### 4. Start development servers

```bash
# Terminal 1 — Backend
cd server
npm run dev
# Runs on http://localhost:4000

# Terminal 2 — Frontend
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### 5. Test the API

```bash
# Health check
curl http://localhost:4000/api/health

# Get categories
curl http://localhost:4000/api/categories

# Get products
curl http://localhost:4000/api/products

# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","fullName":"Test User"}'
```

## API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/categories` | All categories (cached) |
| GET | `/api/products` | Product listing (search, filter, paginate) |
| GET | `/api/products/:slug` | Product detail (cached) |

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout (clear cookies) |
| GET | `/api/auth/me` | Current user profile |

### Buyer (requires auth)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cart` | Get cart |
| POST | `/api/cart/items` | Add item to cart |
| PATCH | `/api/cart/items/:variantId` | Update quantity |
| DELETE | `/api/cart/items/:variantId` | Remove item |
| GET | `/api/addresses` | List addresses |
| POST | `/api/addresses` | Create address |
| POST | `/api/checkout` | Place order |
| GET | `/api/orders` | Order history |
| GET | `/api/orders/:id` | Order detail |

### Admin (requires admin role)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET/POST | `/api/admin/products` | List/Create products |
| PATCH/DELETE | `/api/admin/products/:id` | Update/Delete product |
| GET/POST | `/api/admin/categories` | List/Create categories |
| PATCH/DELETE | `/api/admin/categories/:id` | Update/Delete category |
| GET | `/api/admin/orders` | All orders |
| PATCH | `/api/admin/orders/:id/status` | Update order status |
| GET | `/api/admin/users` | List users |

### Delivery Partner (requires delivery_partner role)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/delivery/dashboard` | Delivery stats |
| GET | `/api/delivery/orders` | Assigned orders |
| PATCH | `/api/delivery/orders/:id/status` | Update delivery status |

## Deployment

### Docker (recommended)

```bash
docker-compose up --build
```

### Manual

**Backend** (Render/Railway):
```bash
cd server
npm run build
npm start
```

**Frontend** (Vercel):
```bash
cd frontend
# Set NEXT_PUBLIC_API_URL to your deployed backend URL
# Deploy via Vercel CLI or GitHub integration
```

### Environment Variables for Production

- Set `NODE_ENV=production` on the server
- Set `FRONTEND_URL` to your production frontend domain
- Use strong, unique JWT secrets (generate with `openssl rand -hex 32`)
- Configure Upstash Redis for production caching

## Project Structure

```
server/src/
├── index.ts              Entry point
├── app.ts                Express app + middleware
├── config/env.ts         Env validation (Zod)
├── lib/
│   ├── supabase.ts       Supabase client (service_role)
│   └── redis.ts          Upstash Redis client
├── middleware/
│   ├── auth.ts           JWT authentication + RBAC
│   ├── error-handler.ts  Central error handler
│   └── validate.ts       Zod request validation
├── routes/               Route definitions
├── controllers/          Request handlers
├── services/             Business logic + DB queries
├── types/                TypeScript interfaces
└── utils/jwt.ts          Token sign/verify helpers
```

## User Roles

| Role | Access |
|------|--------|
| buyer | Storefront, cart, checkout, orders |
| admin | Full admin panel, product/order management |
| delivery_partner | Delivery dashboard, order status updates |
