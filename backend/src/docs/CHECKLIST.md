# Feature Checklist

- [x] Auth: Register/Login (email+password)
- [x] Optional email verification via OTP (configurable)
- [x] Dashboard data via `/users/me` and summaries (wallet, recent orders)
- [x] Wallet balance stored on user
- [x] Wallet deposits via Razorpay Orders + webhook
- [x] Transaction history (deposits/orders/withdrawals/referral)
- [x] Services categories + services list with filter/search
- [x] Service details: name, price/1000, min/max, description
- [x] Place order with validation (min/max)
- [x] Auto order status simulation (Pending→Processing→Completed)
- [x] Order history, filter by status/date, reorder
- [x] Referral system: unique code, commission on deposits
- [x] Transfer referral earnings to wallet
- [x] Withdraw system: request, min limit, statuses, history
- [x] Support tickets: create, reply, admin reply/close
- [x] Notifications: created for key events, list/mark read
- [x] API Access: generate API key, place/check orders via API key
- [x] Child panels: reseller creates records with domain/subdomain
- [x] Admin endpoints: overview, manage users/roles, orders, transactions, withdrawals

Pending/Extensions
- [ ] Integrations with external SMM providers (real fulfillment)
- [ ] Admin UI for content management and support
- [ ] More granular permissions and audit logs
- [ ] Payment methods beyond Razorpay (Paytm QR/BharatPe via provider)
- [ ] Email templates and multi-language support

