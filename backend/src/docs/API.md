# API Reference (v1)

Base: `/api/v1`

Auth
- POST `/auth/register` { name, email, password, referral? }
- POST `/auth/login` { email, password }
- POST `/auth/verify-email` { email, code }
- POST `/auth/resend-otp` { email }
- POST `/auth/refresh` { refreshToken }
- POST `/auth/logout` { refreshToken }
- POST `/auth/forgot` { email }
- POST `/auth/reset` { email, code, newPassword }

Users
- GET `/users/me` Bearer token
- PATCH `/users/me` { name?, email? }
- POST `/users/api-key` → { apiKey }

Services
- GET `/services/categories`
- GET `/services?q=&category=`
- GET `/services/:id`
- (Admin) POST `/services/categories` { name, slug }
- (Admin) POST `/services` { name, category, pricePer1000, minQty, maxQty, description? }
- (Admin) PATCH `/services/:id` { ...fields }

Orders
- POST `/orders` { serviceId, linkOrUsername, quantity }
- GET `/orders?status=&from=&to=`
- GET `/orders/:id`
- POST `/orders/:id/reorder`
- (Admin) PATCH `/orders/:id/status` { status }

Wallet
- GET `/wallet/transactions`
- POST `/wallet/deposit/order` { amount } → Razorpay order + `keyId`
- Webhook: POST `/webhooks/razorpay` (Razorpay configured URL)

Referrals
- GET `/referrals/me`
- POST `/referrals/withdraw-to-wallet` { amount? }

Withdrawals
- POST `/withdrawals` { amount, fromBalance: 'main'|'referral', method: 'upi'|'bank', account: { ... } }
- GET `/withdrawals`
- (Admin) GET `/withdrawals/admin`
- (Admin) PATCH `/withdrawals/:id/status` { status: 'Approved'|'Rejected', reason? }

Tickets
- POST `/tickets` { subject, message }
- GET `/tickets`
- POST `/tickets/:id/messages` { message }
- (Admin) POST `/tickets/:id/admin-reply` { message }
- (Admin) POST `/tickets/:id/close`

Notifications
- GET `/notifications`
- POST `/notifications/:id/read`

External API (API key via `x-api-key`)
- GET `/ext/services`
- POST `/ext/order` { serviceId, linkOrUsername, quantity }
- GET `/ext/order/:id`

Panels
- (Reseller) POST `/panels` { domain, subdomain?, plan? }
- (Reseller) GET `/panels`
- (Reseller) GET `/panels/:id`
- (Admin) PATCH `/panels/:id` { status?, plan?, settings? }

Admin
- GET `/admin/overview`, GET `/admin/analytics?days=`
- Users: GET `/admin/users`, GET `/admin/users/:id`, PATCH `/admin/users/:id/role`, PATCH `/admin/users/:id/status`, POST `/admin/users/:id/wallet-adjust`
- Orders: GET `/admin/orders`, POST `/admin/orders/manual`
- Transactions: GET `/admin/transactions`
- Withdrawals: GET `/admin/withdrawals`
- Services: DELETE `/admin/services/:id`, PATCH `/admin/services/:id/provider`
- Providers: GET/POST `/admin/providers`, PATCH/DELETE `/admin/providers/:id`
- Manual payments: GET/POST `/admin/manual-payments`, PATCH `/admin/manual-payments/:id`
- Webhook logs: GET `/admin/webhook-logs`
- Tickets: GET `/admin/tickets`
- Settings: GET/POST `/admin/settings`
- Reports: GET `/admin/reports/export?type=orders|payments&format=csv|pdf`
- Admin logs: GET `/admin/logs`

Notes
- Order status automation is simulated; adapt to provider integration as needed.
- Razorpay webhook must be configured to the exact path and use secret.
