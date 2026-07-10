# API Integration Tracker

This document serves as a living record of backend API endpoints integrated and tested in the Xental frontend application.

## 1. Authentication & Developer Profile

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/developers/register` | `POST` | Integrated & Tested | `/signup` | Password validation enforced on frontend. Returns 201 (no tokens). Redirects to pending page. |
| `/api/v1/developers/verify-email` | `GET` | Integrated & Tested | `/verify-email` | Triggered via email magic link. Backend redirects to `/email-verified`. |
| `/api/v1/developers/login` | `POST` | Integrated & Tested | `/login` | Step 1. Expects `{ email, password }`. Backend natively sets session cookies (`HttpOnly`) via headers. Returns `403` if email is unverified. |
| `/api/v1/developers/login/verify` | `POST` | Integrated & Tested | `/login/verify` | Step 2. Verifies OTP from email. Sets frontend sentinel session cookie on success. |
| `/api/v1/developers/logout` | `POST` | Integrated & Tested | Dashboard Sidebar | Clears HttpOnly cookies on the backend and deletes sentinel cookie locally. |
| `/api/v1/developers/change-password` | `POST` | Integrated & Tested | `/dashboard/settings` | Allows authenticated developers to update their password. |
| `/api/v1/developers/me` | `GET` | Integrated & Tested | Global Dashboard | Fetches the current developer profile. Stale time: 5 minutes. |

## 2. Onboarding (KYC/KYB)

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/onboarding` | `GET` | Integrated & Tested | `/dashboard` (Banner) | Fetches the merchant's current onboarding status. Drives the global banner state. |
| `/api/v1/onboarding/developer` | `POST` | Integrated & Tested | `/dashboard/settings/compliance` | Submits Developer KYC (BVN/NIN, DOB, personal bank account). |
| `/api/v1/onboarding/business` | `POST` | Integrated & Tested | `/dashboard/settings/compliance` | Submits Business KYB (Legal Name, Reg Number, settlement account). |
| `/api/v1/onboarding/documents` | `POST` | Integrated & Tested | `/dashboard/settings/compliance` | Uploads files (FormData) for Certificate of Incorporation or Proof of Address. |
| `/api/v1/onboarding/submit` | `POST` | Integrated & Tested | `/dashboard/settings/compliance` | Submits the attestation and locks the application for review. |

## 3. Virtual Accounts & Customers

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/virtual-accounts` | `GET` | Integrated & Tested | `/dashboard/customers` | Lists all provisioned virtual accounts. Supports filtering by `subMerchantRef`. |
| `/api/v1/virtual-accounts/{accountRef}` | `GET` | Integrated & Tested | Customer Detail View | Fetches details for a single customer/account. |
| `/api/v1/virtual-accounts` | `POST` | Integrated & Tested | `/dashboard/customers/new` | Provisions a persistent NUBAN. Expects `accountRef`, `name`, `email`, `expectedAmountKobo`, `expiryDateUtc`. Returns 201. |
| `/api/v1/virtual-accounts/{accountRef}` | `DELETE` | Integrated & Tested | Customer Detail View | Deletes a virtual account (fails with 409 if there's payment activity). |
| `/api/v1/checkout/sessions` | `POST` | Integrated & Tested | Customer Detail View | Generates a hosted checkout / payment-link session for a specific account. |

## 4. Dashboard, Transactions & Insights

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/transactions/summary` | `GET` | Integrated & Tested | `/dashboard` | Fetches transaction totals (`totalPayinsKobo`, `successful`, `failed`). |
| `/api/v1/transactions` | `GET` | Integrated & Tested | `/dashboard/transactions` | Fetches transactions list. Supports filtering by status, accountRef, dates, take. |
| `/api/v1/transactions/{reference}` | `GET` | Integrated & Tested | Transaction Detail Modal | Fetches details for a single transaction. |
| `/api/v1/transactions/{reference}/refund` | `POST` | Integrated & Tested | Transaction Detail Modal | Processes a refund. Optionally expects `{ destination }`. Invalidates relevant queries on success. |
| `/api/v1/insights` | `GET` | Integrated & Tested | `/dashboard` | Fetches global account insights overview. |
| `/api/v1/insights/aging` | `GET` | Integrated & Tested | `/dashboard/collections` | Fetches accounts receivable aging report. |
| `/api/v1/insights/forecast` | `GET` | Integrated & Tested | `/dashboard/collections` | Fetches cash flow forecast. Supports `?days=` param. |
| `/api/v1/insights/customers` | `GET` | Integrated & Tested | `/dashboard/collections` | Fetches customer payment risk scores. |
| `/api/v1/sandbox/simulate/deposit` | `POST` | Integrated & Tested | Sandbox UI | Simulates a deposit for testing in the sandbox environment. |

## 5. Billing & Subscriptions

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/billing/schedules` | `GET` | Integrated & Tested | `/dashboard/billing` | Lists all active and inactive billing schedules. |
| `/api/v1/billing/schedules` | `POST` | Integrated & Tested | `/dashboard/billing/new` | Creates a new billing schedule (`accountRef`, `interval`, `amountKobo`, `dueOffsetDays`). |
| `/api/v1/billing/schedules/{id}` | `GET` | Integrated & Tested | Billing Detail View | Fetches a single billing schedule. |
| `/api/v1/billing/schedules/{id}/periods` | `GET` | Integrated & Tested | Billing Detail View | Fetches historical billing periods/invoices for a schedule. |
| `/api/v1/billing/schedules/{id}/next-amount` | `PUT` | Integrated & Tested | Billing Detail View | Overrides the amount for the upcoming billing cycle. |
| `/api/v1/billing/schedules/{id}/pause` | `POST` | Integrated & Tested | Billing Detail View | Pauses a billing schedule. |
| `/api/v1/billing/schedules/{id}/resume` | `POST` | Integrated & Tested | Billing Detail View | Resumes a paused billing schedule. |
| `/api/v1/billing/schedules/{id}/cancel` | `POST` | Integrated & Tested | Billing Detail View | Cancels a billing schedule permanently. |

## 6. Transfers & Payouts

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/transfers/banks` | `GET` | Integrated & Tested | Transfer Form | Lists supported destination banks. Stale time: 24h. |
| `/api/v1/transfers/bank/lookup` | `POST` | Integrated & Tested | Transfer Form | Resolves an account name from an account number + bank code before sending a payout. |
| `/api/v1/transfers/bank` | `POST` | Integrated & Tested | Transfer Form | Initiates a transfer/payout. Expects `merchantTxRef`, `amountKobo`, `accountNumber`, `bankCode`. |
| `/api/v1/transfers` | `GET` | Integrated & Tested | `/dashboard/transfers` | Lists transfer history. |

## 7. Settlement & Splits

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/settings/settlement` | `GET` | Integrated & Tested | `/dashboard/settings/settlement` | Fetches global settlement configuration. |
| `/api/v1/settings/settlement` | `PUT` | Integrated & Tested | `/dashboard/settings/settlement` | Updates global config (`autoSettle`, `minPayoutKobo`, payout account details). |
| `/api/v1/settings/splits` | `GET` | Integrated & Tested | `/dashboard/settings/settlement` | Lists global split-settlement rules (multi-beneficiary splits). |
| `/api/v1/settings/splits` | `PUT` | Integrated & Tested | `/dashboard/settings/settlement` | Updates global split-settlement rules. |
| `/api/v1/settings/splits/{accountRef}/hold` | `POST` | Integrated & Tested | Customer Detail View | Places an escrow hold on a specific customer's settlements. |
| `/api/v1/settings/splits/{accountRef}/release`| `POST` | Integrated & Tested | Customer Detail View | Releases a held settlement for a specific customer. |

## 8. Sub-Merchants (Platforms)

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/sub-merchants` | `GET` | Integrated & Tested | `/dashboard/sub-merchants` | Lists all sub-merchants. |
| `/api/v1/sub-merchants` | `POST` | Integrated & Tested | `/dashboard/sub-merchants/new` | Creates a new sub-merchant (`name`, `reference`). |
| `/api/v1/sub-merchants/{id}/balance` | `GET` | Integrated & Tested | Sub-Merchant Detail View | Fetches the ledger balance for a specific sub-merchant. |
| `/api/v1/sub-merchants/{id}/payout` | `PUT` | Integrated & Tested | Sub-Merchant Detail View | Sets payout account details and `platformFeeBps` for a sub-merchant. |

## 9. Team Management

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/team` | `GET` | Integrated & Tested | `/dashboard/settings/team` | Lists all team members. |
| `/api/v1/team` | `POST` | Integrated & Tested | `/dashboard/settings/team` | Invites a new team member (`email`, `role`, `name`). |
| `/api/v1/team/{id}` | `PUT` | Integrated & Tested | `/dashboard/settings/team` | Updates a team member's role or details. |
| `/api/v1/team/{id}` | `DELETE` | Integrated & Tested | `/dashboard/settings/team` | Removes a team member. |
| `/api/v1/team/{id}/resend` | `POST` | Integrated & Tested | `/dashboard/settings/team` | Rotates the token and re-sends a pending invitation. |
| `/api/v1/team/accept` | `POST` | Integrated & Tested | `/team/accept` | Anonymous endpoint to accept an invite by setting a password (`token`, `password`). |

## 10. Developer Settings & Webhooks

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/api-keys` | `GET` | Integrated & Tested | `/dashboard/settings/developer` | Lists generated API keys for the current environment. |
| `/api/v1/api-keys` | `POST` | Integrated & Tested | `/dashboard/settings/developer` | Creates a new API key (`label`, `mode`). Secret only shown once. |
| `/api/v1/api-keys/{id}/rotate` | `POST` | Integrated & Tested | `/dashboard/settings/developer` | Rotates a specific API key (revokes old, returns new secret). |
| `/api/v1/api-keys/{id}` | `DELETE` | Integrated & Tested | `/dashboard/settings/developer` | Revokes an API key entirely. |
| `/api/v1/webhook-endpoints` | `GET` | Integrated & Tested | `/dashboard/settings/developer` | Lists configured webhook URLs. |
| `/api/v1/webhook-endpoints` | `POST` | Integrated & Tested | `/dashboard/settings/developer` | Registers a new webhook endpoint. Returns signing secret once. |
| `/api/v1/webhook-endpoints/{id}` | `DELETE` | Integrated & Tested | `/dashboard/settings/developer` | Deletes a webhook endpoint. |
| `/api/v1/webhook-endpoints/deliveries` | `GET` | Integrated & Tested | `/dashboard/settings/developer` | Fetches webhook delivery logs. Supports filtering by status. |
| `/api/v1/webhook-endpoints/deliveries/{id}/replay` | `POST`| Integrated & Tested | `/dashboard/settings/developer` | Queues a failed webhook delivery for replay. |

## 11. Workflow Automation (Rules & Flows)

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/rules` | `GET` | Integrated & Tested | `/dashboard/rules` | Lists configured automation rules. |
| `/api/v1/rules` | `POST` | Integrated & Tested | `/dashboard/rules/new` | Creates a new rule (`trigger`, `action`, `thresholdKobo`, `minRiskScore`). |
| `/api/v1/rules/{id}` | `DELETE` | Integrated & Tested | `/dashboard/rules` | Deletes a rule. |
| `/api/v1/flows` | `GET` | Integrated & Tested | `/dashboard/flows` | Lists advanced automation flows. |
| `/api/v1/flows` | `POST` | Integrated & Tested | `/dashboard/flows/new` | Creates a flow (multi-action workflows). |
| `/api/v1/flows/{id}` | `PUT` | Integrated & Tested | Flow Detail View | Updates an existing flow. |
| `/api/v1/flows/{id}/enabled` | `POST` | Integrated & Tested | `/dashboard/flows` | Toggles a flow on/off. |
| `/api/v1/flows/{id}` | `DELETE` | Integrated & Tested | `/dashboard/flows` | Deletes a flow. |
| `/api/v1/flows/runs` | `GET` | Integrated & Tested | `/dashboard/flows/logs` | Fetches execution logs for flows. |

## 12. Copilot (AI)

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/copilot/ask` | `POST` | Integrated & Tested | Copilot Chat Widget | Submits a prompt to the AI assistant. |

## 13. Admin Portal

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/admin/auth/login` | `POST` | Integrated & Tested | `/admin/login` (`AdminLoginForm.tsx`) | Expects `{ email, password }`. Returns `accessToken` and `role`. Sets `xnt_admin_access` and `xnt_admin_role` cookies. |
| `/api/v1/admin/onboarding` | `GET` | Integrated & Tested | `/admin/onboarding` (`OnboardingView.tsx`) | Fetches the onboarding queue. Supports filtering by `?status=`. Handles missing `submittedAtUtc` dates gracefully. |
| `/api/v1/admin/onboarding/{tenantId}` | `GET` | Integrated & Tested | `/admin/onboarding/[tenantId]` (`OnboardingDetailView.tsx`) | Fetches details, KYB/KYC checks, and submitted documents for a specific tenant. |
| `/api/v1/admin/onboarding/{tenantId}/approve` | `POST` | Integrated & Tested | `/admin/onboarding/[tenantId]` | (Also covers `/reject` and `/request-info`). Submits review action. Expects `{ reason, track }` payload (`track` dropdown added). Invalidates query cache on success. |
| `/api/v1/admin/reconciliation/summary` | `GET` | Integrated & Tested | `/admin/reconciliation` (`ReconciliationView.tsx`) | Fetches overview of reconciliation buckets (review, overpaid, underpaid, etc.). |
| `/api/v1/admin/admins` | `GET` | Integrated & Tested | `/admin/admins` (`AdminsView.tsx`) | Lists all internal admins. Table UI layout fixed. |
| `/api/v1/admin/mfa/enroll` | `POST` | Integrated & Tested | `/admin/settings` (`SettingsView.tsx`) | Returns `otpAuthUri` to generate a QR code for MFA setup. |

---

## Development Notes
* **Base URL:** `https://api.staging.xental.online/api/v1`
* **Direct Staging Connection:** The local development environment (`http://localhost:3000`) communicates directly with the staging API URL because the backend has explicitly whitelisted `localhost:3000` in their CORS configuration.
