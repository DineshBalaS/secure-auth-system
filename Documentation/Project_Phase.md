# Project Implementation & Testing Roadmap

## Phase 1: Foundation & Infrastructure

**Goal:** Initialize the environment and establish the database connection.

- [x] **1.1 Project Initialization:**

  - Initialize Next.js 15 (App Router, TypeScript).
  - Configure `tsconfig.json` for strict mode.
  - Setup `.env` file structure (ensure `.gitignore` includes it).

- [x] **1.2 Dependency Installation:**

  - **Core:** `prisma`, `@prisma/client`, `@prisma/adapter-pg`.
  - **Security:** `argon2` (hashing), `jose` (JWT), `zod` (validation).
  - **Email:** `nodemailer` (installed), `fetch` (used for Brevo API).

- [x] **1.3 Database Setup:**

  - Define `User` and `VerificationToken` models in `schema.prisma`.
  - Run `prisma migrate dev` to create tables in PostgreSQL.
  - Generate Prisma Client (`prisma generate`).

- [x] **1.4 Global Utilities:**
  - Create `lib/db.ts` to export a Prisma instance with PG Adapter.

---

## Phase 2: Core Security Logic (The "Brain")

**Goal:** Implement the cryptographic and session logic in isolation. Do not write API routes yet.

- [x] **2.1 Validation Schemas (`lib/validations.ts`):**

  - Define Zod schema for Registration (email regex, password min length, confirm password match).
  - Define Zod schema for Login.
  - **Update:** Added `ForgotPasswordSchema` and `ResetPasswordSchema` for recovery flow.

- [x] **2.2 Password Utility (`lib/auth/password.ts`):**

  - Implement `hashPassword(plain)`: Generate salt + Argon2id hash.
  - Implement `verifyPassword(hash, plain)`: Secure comparison logic.

- [x] **2.3 Session Utility (`lib/auth/session.ts`):**

  - Implement `signToken(payload)`: Create JWT using `jose`.
  - Implement `verifyToken(token)`: Validate signature and expiry.

- [x] **2.4 Email Utility (Enhanced) (`lib/email/send-email.ts`):**
  - **Unplanned Addition:** Replaced raw text emails with a branded, responsive HTML template using `Brevo HTTP API`.
  - Added `sendPasswordResetEmail` function for recovery flow.
  - Implemented development mode fallback (logs to console).

---

## Phase 3: API Development (Backend)

**Goal:** Build the HTTP interface. Use Postman/Curl for preliminary testing.

- [x] **3.1 Registration Endpoint (`/api/auth/register`):**

  - Validate input -> Check duplicates -> Hash password -> Create User -> Send Email.
  - **Update:** Integrated with the new HTML email template via Brevo.

- [x] **3.2 Verification Endpoint (`/api/auth/verify`):**

  - Validate token -> Update User (`isVerified: true`) -> Delete Token.

- [x] **3.3 Login Endpoint (`/api/auth/login`):**

  - Find User -> Verify Hash -> Check Verified Status -> Set `HttpOnly` Cookie.

- [x] **3.4 Session & Logout:**
  - `/api/auth/me`: Decrypt cookie and return user data.
  - `/api/auth/logout`: Delete cookie.

---

## Phase 4: Frontend Implementation (UI)

**Goal:** Build the user interface and connect it to the API.

- [x] **4.1 Layouts:**

  - Create `(auth)/layout.tsx` for centered forms.
  - Create `(protected)/layout.tsx` with Navbar and Logout button.

- [x] **4.2 Auth Forms:**

  - Build `LoginForm` and `RegisterForm` components.
  - **Update:** Added "Confirm Password" field to Registration and Reset forms.
  - Integrate `react-hook-form` with Zod resolvers.
  - Handle loading states and error messages (toast notifications).

- [x] **4.3 Pages:**
  - Assemble `/login`, `/register`, and `/verify` pages.
  - Create the `/dashboard` page (shows user email).

---

## Phase 5: Password Recovery System

**Goal:** Enable users to reset lost passwords securely via email.

- [x] **5.1 Database Schema:**

  - Create `PasswordResetToken` model in `schema.prisma`.
  - Ensure fields for `email`, `token`, `expires`, and composite unique key.

- [x] **5.2 API Endpoints:**

  - `/api/auth/forgot-password`: Generates token & sends HTML email via Brevo.
  - `/api/auth/reset-password`: Validates token & updates user password.

- [x] **5.3 Frontend Pages:**
  - `/forgot-password`: Request link form.
  - `/reset-password`: Set new password form (with token validation).

---

## Phase 6: Middleware & Security Hardening

**Goal:** Protect routes at the edge level.

- [ ] **6.1 Middleware Implementation (`middleware.ts`):**
  - Define protected routes (`/dashboard`).
  - Define public routes (`/login`, `/register`, `/forgot-password`, `/reset-password`).
  - **Logic:** If visiting protected route w/o token -> Redirect to Login.
  - **Logic:** If visiting login w/ token -> Redirect to Dashboard.

---

## Phase 7: Testing Strategy (QA)

### 7.1 Unit Testing (The Logic)

**Target:** `lib/auth/*` and `lib/__tests__/*`

- [x] **Test Files Created:**
  - `lib/__tests__/password.test.ts`
  - `lib/__tests__/session.test.ts`
  - `lib/__tests__/validations.test.ts`
- [x] Test: Verify `hashPassword` produces a different hash for the same password (salt check).
- [x] Test: Verify `verifyToken` rejects expired tokens.
- [x] Test: Verify Zod schemas reject invalid emails (e.g., "user@domain").

### 7.2 Integration Testing (The Flow)

**Target:** API Routes

- [ ] **Scenario A (Register):** Send valid data. Expect 201 + Email sent.
- [ ] **Scenario B (Duplicate):** Send same email again. Expect 409.
- [ ] **Scenario C (Login Unverified):** Login immediately after register. Expect 403.
- [ ] **Scenario D (Login Success):** Verify email, then login. Expect 200 + Set-Cookie header.
- [ ] **Scenario E (Password Reset):** Request link -> Reset password -> Login with new password.

### 7.3 Security Testing (The Attack)

**Target:** Full Application

- [ ] **XSS Check:** Try injecting `<script>alert(1)</script>` into the email field.
- [ ] **Cookie Check:** Check `HttpOnly` flag on session cookies.
- [ ] **Rate Limiting:** (Future) Ensure password reset can't be spammed.

---

## Phase 8: Deployment

**Goal:** Live production build.

- [ ] **8.1 Environment Variables:** Add `DATABASE_URL`, `JWT_SECRET`, `BREVO_API_KEY`, `SENDER_EMAIL` to Vercel/Production.
- [ ] **8.2 Build Verification:** Ensure `next build` passes without type errors.
- [ ] **8.3 Deploy:** Push to main -> Deployment.
