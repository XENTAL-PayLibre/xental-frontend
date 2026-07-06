# API Integration Tracker

This document serves as a living record of backend API endpoints integrated and tested in the Xental frontend application.

## 🟢 Authentication & Onboarding

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/developers/register` | `POST` | ✅ Integrated & Tested | `/signup` (`SignupForm.tsx`) | Captures `name`, `email`, `password`. Password validation (12 chars, 1 Upper, 1 Lower, 1 Special) enforced on frontend. Returns 201 (no tokens). Redirects to pending page. |
| `/api/v1/developers/verify-email` | `GET` | ✅ Integrated & Tested | `/verify-email` (Pending) <br> `/email-verified` (Success/Fail) | Triggered via email magic link. Backend redirects to `/email-verified?verified=true\|false`. Frontend handles UI state based on query param. |
| `/api/v1/developers/login` | `POST` | ✅ Integrated & Tested | `/login` (`LoginForm.tsx`) | Expects `{ email, password }`. Backend natively sets session cookies (`HttpOnly`) via headers. Frontend Axios uses `withCredentials: true`. Returns `403` if email is unverified. |

## 👥 Customers / Virtual Accounts

| Endpoint | Method | Status | UI Component / Route | Notes / Edge Cases |
|---|---|---|---|---|
| `/api/v1/virtual-accounts` | `POST` | ✅ Integrated & Tested | `useCreateVirtualAccount` hook | Provisions a persistent NUBAN for a customer. Expects `accountRef`, `name`, `email`, `phone`, `expectedAmountKobo`, `expiryDateUtc`, `subMerchantRef`. Returns 201 with account details. |

*(More endpoints will be added here once they are integrated and tested).*

---

## ⚙️ Development Notes
* **Base URL:** `https://api.staging.xental.online/api/v1`
* **Direct Staging Connection:** The local development environment (`http://localhost:3000`) communicates directly with the staging API URL because the backend has explicitly whitelisted `localhost:3000` in their CORS configuration.
