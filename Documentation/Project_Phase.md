# Project Implementation & Testing Roadmap

## Phase 1: Foundation & Infrastructure

**Goal:** Initialize the environment and establish the database connection.

- [ ] **1.1 Project Initialization:**

  - Initialize Next.js 15 (App Router, TypeScript).
  - Configure `tsconfig.json` for strict mode.
  - Setup `.env` file structure (ensure `.gitignore` includes it).

- [ ] **1.2 Dependency Installation:**

  - **Core:** `prisma`, `@prisma/client`
  - **Security:** `argon2` (hashing), `jose` (JWT), `zod` (validation).
  - **Email:** `resend`.

- [ ] **1.3 Database Setup:**

  - Define `User` and `VerificationToken` models in `schema.prisma`.
  - Run `prisma migrate dev` to create tables in PostgreSQL.
  - Generate Prisma Client (`prisma generate`).

- [ ] **1.4 Global Utilities:**
  - Create `lib/db.ts` to export a singleton Prisma instance (prevents connection exhaustion in dev).

---

## Phase 2: Core Security Logic (The "Brain")

**Goal:** Implement the cryptographic and session logic in isolation. Do not write API routes yet.

- [ ] **2.1 Validation Schemas (`lib/validations.ts`):**

  - Define Zod schema for Registration (email regex, password min length).
  - Define Zod schema for Login.

- [ ] **2.2 Password Utility (`lib/auth/password.ts`):**

  - Implement `hashPassword(plain)`: Generate salt + Argon2id hash.
  - Implement `verifyPassword(hash, plain)`: Secure comparison logic.

- [ ] **2.3 Session Utility (`lib/auth/session.ts`):**
  - Implement `signToken(payload)`: Create JWT using `jose`.
  - Implement `verifyToken(token)`: Validate signature and expiry.

---

## Phase 3: API Development (Backend)

**Goal:** Build the HTTP interface. Use Postman/Curl for preliminary testing.

- [ ] **3.1 Registration Endpoint (`/api/auth/register`):**

  - Validate input -> Check duplicates -> Hash password -> Create User -> Send Email.

- [ ] **3.2 Verification Endpoint (`/api/auth/verify`):**

  - Validate token -> Update User (`isVerified: true`) -> Delete Token.

- [ ] **3.3 Login Endpoint (`/api/auth/login`):**

  - Find User -> Verify Hash -> Check Verified Status -> Set `HttpOnly` Cookie.

- [ ] **3.4 Session & Logout:**
  - `/api/auth/me`: Decrypt cookie and return user data.
  - `/api/auth/logout`: Delete cookie.

---

## Phase 4: Frontend Implementation (UI)

**Goal:** Build the user interface and connect it to the API.

- [ ] **4.1 Layouts:**

  - Create `(auth)/layout.tsx` for centered forms.
  - Create `(protected)/layout.tsx` with Navbar and Logout button.

- [ ] **4.2 Auth Forms:**

  - Build `LoginForm` and `RegisterForm` components.
  - Integrate `react-hook-form` with Zod resolvers.
  - Handle loading states and error messages (toast notifications).

- [ ] **4.3 Pages:**
  - Assemble `/login`, `/register`, and `/verify` pages.
  - Create the `/dashboard` page (shows user email).

---

## Phase 5: Middleware & Security Hardening

**Goal:** Protect routes at the edge level.

- [ ] **5.1 Middleware Implementation (`middleware.ts`):**
  - Define protected routes (`/dashboard`).
  - Define public routes (`/login`, `/register`).
  - **Logic:** If visiting protected route w/o token -> Redirect to Login.
  - **Logic:** If visiting login w/ token -> Redirect to Dashboard.

---

## Phase 6: Testing Strategy (QA)

### 6.1 Unit Testing (The Logic)

**Target:** `lib/auth/*`

- [ ] Test: Verify `hashPassword` produces a different hash for the same password (salt check).
- [ ] Test: Verify `verifyToken` rejects expired tokens.
- [ ] Test: Verify Zod schemas reject invalid emails (e.g., "user@domain").

### 6.2 Integration Testing (The Flow)

**Target:** API Routes (via Postman)

- [ ] **Scenario A (Register):** Send valid data. Expect 201 + Email sent.
- [ ] **Scenario B (Duplicate):** Send same email again. Expect 409.
- [ ] **Scenario C (Login Unverified):** Login immediately after register. Expect 403.
- [ ] **Scenario D (Login Success):** Verify email, then login. Expect 200 + Set-Cookie header.

### 6.3 Security Testing (The Attack)

**Target:** Full Application

- [ ] **XSS Check:** Try injecting `<script>alert(1)</script>` into the email field during registration.
- [ ] **Cookie Check:** Open Browser DevTools -> Application -> Cookies. Ensure `HttpOnly` flag is checked (Client JS cannot see it).
- [ ] **Brute Force:** Spam the login endpoint. (Optional: Add rate limiting if time permits).

---

## Phase 7: Deployment

**Goal:** Live production build.

- [ ] **7.1 Environment Variables:** Add `DATABASE_URL`, `JWT_SECRET`, `RESEND_API_KEY` to Vercel.
- [ ] **7.2 Build Verification:** Ensure `next build` passes without type errors.
- [ ] **7.3 Deploy:** Push to main -> Vercel Deployment.
