# SMM Panel – Full Stack (Node.js + Express + MongoDB + React)

This repository contains a complete backend API with a minimal React frontend scaffold for a Social Media Marketing (SMM) user panel. It covers authentication, wallet/deposits (Razorpay), services, orders, referrals, withdrawals, support tickets, notifications, and optional external API access. A reseller/child panel concept with domain records is also included.

## Structure

- `backend/` – Node.js + Express + MongoDB APIs
- `frontend/` – React (Vite) scaffold calling APIs via env `VITE_API_BASE`

## Features

- Auth: Register/Login (email+password), optional email OTP verification, JWT + refresh tokens
- Dashboard data: wallet balance, totals, recent orders
- Wallet: Add funds (Razorpay Orders + webhook), transactions history (deposits/orders/withdrawals/referrals)
- Services: Categories, filter/search, service details (name, price per 1000, min/max, description)
- Orders: Place order with validation (min/max), auto status updates (simulated), list + filters + reorder
- Referrals: Unique referral code, commission on deposits, move referral earnings to wallet or withdraw
- Withdrawals: Request withdrawals (main or referral balance), min limit, statuses + history
- Support: Tickets (create/reply), status
- Notifications: Created for order updates, payments, support replies; list and mark read
- API Access (optional): Generate API key, place/check orders via API key
- Child Panels: Reseller creates child panels with domain/subdomain records (DNS instructions documented)
 - Admin Panel: Roles (admin/staff/support), dashboard analytics, user management (ban/unban, wallet adjust), order management (status updates, manual orders), service + provider management, manual payments, withdrawals review, support tickets, settings (site/payment/SMTP/limits), reports export (CSV/PDF), admin + webhook logs

## Quick Start

1) Backend

```
cd backend
cp .env.example .env
# Fill env vars (MongoDB, JWT secrets, SMTP, Razorpay keys, etc.)
npm install
npm run dev  # or: npm start
```

2) Frontend

```
cd frontend
cp .env.example .env
# Set VITE_API_BASE to backend URL (e.g. http://localhost:4000/api/v1)
npm install
npm run dev
```

## Environment Variables (Backend)

See `backend/.env.example` for a full list:

- `PORT` – default 4000
- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `ENABLE_EMAIL_VERIFICATION` – `true`/`false`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `BASE_URL` – backend public URL (e.g. for webhooks)
- `CLIENT_URL` – frontend URL (CORS/links)
- `REFERRAL_COMMISSION_PERCENT` – e.g. 5
- `MIN_WITHDRAWAL` – e.g. 100

## API Overview

Base path: `/api/v1`

- Auth: `/auth/register`, `/auth/login`, `/auth/verify-email`, `/auth/resend-otp`, `/auth/refresh`, `/auth/logout`, `/auth/forgot`, `/auth/reset`
- Users: `/users/me` (profile), `/users/me` (PATCH), `/users/notifications`
- Services: `/services/categories`, `/services`, `/services/:id`
- Orders: `/orders` (POST place), `/orders` (GET list), `/orders/:id`, `/orders/:id/reorder`
- Wallet: `/wallet/transactions`, `/wallet/deposit/order` (create Razorpay order), webhook: `/webhooks/razorpay`
- Referrals: `/referrals/me`, `/referrals/withdraw-to-wallet`
- Withdrawals: `/withdrawals` (POST), `/withdrawals` (GET), admin approve/reject
- Tickets: `/tickets`, `/tickets/:id/messages`
- Notifications: `/notifications`, `/notifications/:id/read`
- External API: `/ext/services`, `/ext/order` (POST), `/ext/order/:id` (GET) using `x-api-key`
- Panels: `/panels` (reseller), `/panels/:id`
- Admin: `/admin/*` – manage users, services, orders, withdrawals, providers, payments, settings, reports, logs

See `backend/src/docs/API.md` for details and payload examples.

## Notes

- Order status auto-update is simulated via a background job (can be replaced with provider integrations).
- QR/UPI flows are supported via Razorpay Orders/Payment Links. Webhooks update wallet automatically.
- Child panel + DNS is represented in data model and admin workflows with guidance in docs; DNS itself is done at domain registrar.

## License

Proprietary – for your project use. Update as you wish.
