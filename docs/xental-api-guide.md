# Xental API — Frontend Developer Guide

Practical guide for building against the Xental API from the frontend. For the exact request/response
schema of any endpoint, the live OpenAPI doc is the source of truth: `GET {API}/swagger/v1/swagger.json`
(Swagger UI at `{API}/swagger`).

## Base URLs

| Env | API |
|-----|-----|
| Production | `https://api.xental.online` |
| Staging | `https://api.staging.xental.online` |

All paths below are under `/api/v1` unless noted. The frontend talks to the API through its own
server-side proxy (`API_URL` / `NEXT_PUBLIC_API_URL`), so use the app's `postRequest`/`getRequest`
helpers rather than calling the API host directly.

---

## 1. Two auth planes

Every authenticated endpoint belongs to one (or both) of two planes:

| Plane | Who | How it authenticates | Use from the FE? |
|-------|-----|----------------------|------------------|
| **Dashboard** | A logged-in merchant/team user | HttpOnly cookie `xnt_access` (set on login), carries `scope=dashboard` + `team_role` | **Yes — this is what the dashboard uses** |
| **API** | A server-to-server integrator | `Authorization: Bearer <token>` from an API key, carries `scope=api` + `key_mode` | Not from the browser |

The frontend dashboard uses the **dashboard plane** — the session cookie is set at login and sent
automatically. You never handle an API key in the browser.

**Team roles** (dashboard `team_role`) gate what a user can do: `Owner`, `Admin`, `Developer`,
`Employee`. Money-out and settings actions require `Owner`/`Admin`; provisioning also allows
`Developer`; an `Employee` is read-only for sensitive actions. A 403 usually means the logged-in
user's role is too low — not a bug.

---

## 2. Auth flow (dashboard)

Login is **two steps** — password, then an emailed one-time code (mandatory email 2FA).

```
POST /developers/register   { name, email, password }        -> 201 (then verify email)
GET  /developers/verify-email?token=...                       (magic link from email)

POST /developers/login        { email, password }             -> 202  { email, otpRequired:true, expiresAtUtc }
   (a 6-digit code is emailed; NO session yet)
POST /developers/login/verify { email, code }                 -> 200  (sets session cookies)

POST /developers/refresh                                      -> 200  (rotates cookies; call on 401)
POST /developers/logout                                       -> 200  (clears session)
GET  /developers/me                                           -> profile { tenantId, email, brandName, ... }
PUT  /developers/me/brand     { brandName }                   -> updates the payer-facing brand
```

- On `POST /developers/login` → **202**, route the user to the OTP screen and call
  `POST /developers/login/verify` with the code. Only step 2 starts the session.
- `401` on `login` = wrong password; `403` = email not verified; `401` on `verify` = bad/expired code.
- Sessions are cookie-based (HttpOnly, on the API domain). The FE keeps a first-party sentinel cookie
  to gate routes; on a `401` from any call, try `POST /developers/refresh` once, then re-issue.

---

## 3. Test vs Live mode (`X-Xental-Mode`)

The dashboard can operate in **test** or **live** mode. Because a dashboard session has no built-in
mode, you declare it with a header on provisioning / money-movement requests:

```
X-Xental-Mode: test    (default if the header is absent)
X-Xental-Mode: live
```

- **Default is test.** Omit the header (or send `test`) and DVAs are simulated (sandbox NUBANs,
  prefix `99…`), no real money moves.
- **Live requires approved KYC.** Sending `X-Xental-Mode: live` before the tenant's onboarding is
  approved returns **403 "Onboarding not approved."** Gate any "Live" toggle in the UI on the
  onboarding status (see §8).
- Reads (lists, GETs) don't need the header.

---

## 4. Dedicated virtual accounts (DVA / NUBAN)

A DVA is a bank account number your customer pays into; deposits reconcile automatically.

```
POST /virtual-accounts        { accountRef, name, email?, phone?, expectedAmountKobo?, subMerchantRef? }
   headers: X-Xental-Mode: test|live
   -> 201 { reference, accountNumber, bankName, accountName, expectedAmountKobo, amountPaidKobo,
            paymentState, ... }
GET  /virtual-accounts?subMerchantRef=&take=50      -> list
GET  /virtual-accounts/{accountRef}                 -> one (balance + payment state)
```

- `accountRef` is your own unique handle for the account (idempotent — reusing it 409s).
- `expectedAmountKobo` (optional) drives reconciliation: exact → `FullyPaid`, short → `PartiallyPaid`,
  over → `Overpaid`. Omit it for a reusable/open account.
- **All money is integer kobo** (₦1 = 100 kobo). Multiply naira by 100 on the way in, divide on display.
- The bank name/`Nomba/…` prefix on the account are fixed by the provider and can't be changed; show
  the merchant's brand (from `/developers/me`) in your own UI instead.

---

## 5. Transactions & refunds

```
GET  /transactions?from=&to=&status=&reconciliation=&accountRef=&take=50   -> deposit ledger
GET  /transactions/{reference}                                             -> one deposit
POST /transactions/{reference}/refund   { accountNumber?, bankCode?, accountName? }   (Owner/Admin)
   -> 200 { status: "refunded"|"already_refunded", amountKobo, destinationAccountNumber, ... }
```

- Each deposit is one immutable transaction. `reconciliation` ∈ `Reconciled | Underpaid | Overpaid |
  PendingReview | Reversed`. An overpayment (customer paid twice / too much) shows `Overpaid`.
- **Refund** returns an overpayment surplus to the payer. It sends only the amount still held (never
  double-spends against settlement); on a billing account it draws from carried credit. If the payer's
  source account was captured it's pre-filled; otherwise pass `accountNumber`+`bankCode`. Idempotent —
  a second call returns `already_refunded`.

---

## 6. Recurring billing (push model)

Bind a reusable DVA to a schedule; the customer pays into it each cycle and Xental attributes deposits
to periods and sends reminders.

```
POST /billing/schedules            { accountRef, interval, amountKobo, dueOffsetDays?, description? }
   interval: Weekly | Monthly | Quarterly | Yearly
GET  /billing/schedules?take=50
GET  /billing/schedules/{id}
GET  /billing/schedules/{id}/periods
PUT  /billing/schedules/{id}/next-amount   { amountKobo }     (variable per-cycle amount)
POST /billing/schedules/{id}/pause | resume | cancel
```

Webhook events you can subscribe to: `billing.period.due`, `billing.period.paid`,
`billing.period.overdue`, `billing.period.reopened`.

---

## 7. Checkout (live payment status for a payer)

Mint a session for one DVA, then show the payer a live-updating status without them logging in.

```
POST /checkout/sessions   { accountRef, ttlSeconds? }   -> { token, snapshotUrl, streamUrl, snapshot }
GET  /checkout/{token}                                  -> snapshot { brand, accountNumber, bankName,
                                                            paymentState, amountPaidKobo, ... }  (anonymous)
GET  /checkout/{token}/stream                           -> Server-Sent Events; emits on each status change
```

Use the SSE `streamUrl` to flip the UI to "Payment received ✓" in real time. `brand` is the merchant's
display name — show it to the payer.

---

## 8. Onboarding, settings, team, keys, webhooks (dashboard-only)

```
GET  /onboarding                          -> status + { canIssueLiveKeys, tier }   (gate the Live toggle on this)
POST /onboarding/developer | business | documents | submit
GET/PUT /settings/settlement              { settlementAccountNumber, settlementBankCode,
                                            settlementAccountName, autoSettle, minPayoutKobo }  (Owner/Admin)
GET/PUT /settings/splits                  (split settlement plan)          (Owner/Admin)
GET/POST/DELETE /rules                    (money rules, e.g. Overpaid -> Hold/Notify)  (Owner/Admin)
GET/POST/PUT/DELETE /team, /team/{id}     (Owner/Admin)      POST /team/accept  (invitee, anonymous)
GET/POST/DELETE /api-keys, /api-keys/{id}/rotate                (Owner/Admin/Developer)
GET/POST/DELETE /webhook-endpoints, /webhook-endpoints/{id}     (Owner/Admin/Developer)
GET  /webhook-endpoints/deliveries  ·  POST /webhook-endpoints/deliveries/{id}/replay
   (note: /webhooks/nomba is the inbound provider receiver — not called from the FE)
GET  /insights                            -> dashboard metrics
```

These are dashboard-plane endpoints (session cookie). Configure a `settings/settlement` account before
expecting deposits to pay out.

---

## 9. Money movement & sub-merchants

```
POST /transfers/bank      { merchantTxRef, amountKobo, accountNumber, bankCode, accountName?, narration? }  (Owner/Admin)
POST /transfers/bank/lookup   { accountNumber, bankCode }   -> resolved account name (verify before sending)
GET  /transfers?take=50
POST /sub-merchants  { name, reference }   ·  PUT /sub-merchants/{id}/payout  ·  GET /sub-merchants/{id}/balance
POST /settlements/{accountRef}/hold  ·  POST /settlements/{accountRef}/release   (escrow; Owner/Admin)
```

`transfers/bank` is idempotent on `merchantTxRef` — reuse the same ref to avoid double-paying. Always
`lookup` the destination name first and show it for confirmation.

---

## 10. Errors

RFC-7807-ish JSON: `{ "detail": "...", "title": "...", "status": 4xx }` (read `detail` for the
message; `409` uses `detail`). Common codes:

| Code | Meaning | FE handling |
|------|---------|-------------|
| 400 | Validation failed | Show `detail`; check body shape |
| 401 | Not authenticated / expired session | Try `refresh` once, else send to login |
| 403 | Wrong plane, insufficient role, or live-without-KYC | Hide/disable the action for this user; gate Live on onboarding |
| 404 | Not found | — |
| 409 | Conflict (duplicate ref, in-progress) | Treat as already-done where sensible |
| 429 | Rate limited | Back off; auth endpoints are 10/min/IP |

---

## Quick reference — plane & role per action

| Action | Plane(s) | Min dashboard role |
|--------|----------|--------------------|
| Read ledgers/accounts/billing/sub-merchants | API + dashboard | any |
| Provision DVA, checkout session, sandbox sim | API + dashboard | Developer |
| Transfer, refund, escrow hold/release | API + dashboard | Admin |
| Settlement config, splits, rules | dashboard | Admin |
| Team, API keys, webhooks | dashboard | Developer/Admin |
| Onboarding, profile, insights, brand | dashboard | any |

_Last updated for the dual-plane + email-2FA + refunds release._
