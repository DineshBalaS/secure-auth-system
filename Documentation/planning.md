# Project Plan: Secure Authentication System (Next.js)

## 1. Project Objective

Build a robust, security-focused authentication system from scratch without using BaaS (Backend-as-a-Service like Auth0/Clerk). The project demonstrates mastery of cryptography, session management, and serverless architecture.

## 2. Tech Stack & Infrastructure

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (via Neon or Supabase)
- **ORM:** Prisma
- **Cryptography (Hashing):** Argon2id (`argon2` library)
- **Session Management:** Stateless JWT (`jose` library) stored in HttpOnly Cookies
- **Email Service:** Resend API
- **Validation:** Zod
- **Deployment:** Vercel

## 3. User Journey & Data Flow

1. **Visitor:** Lands on `/login`.
2. **Sign Up:**
   - User navigates to `/register`.
   - Submits Email + Password.
   - **Backend:** Validates input (Zod) -> Generates Salt -> Hashes Password (Argon2) -> Creates DB Record (Verified: False) -> Generates Crypto-random Token -> Sends Email.
3. **Verification:**
   - User clicks link in email (`/verify?token=xyz`).
   - **Backend:** Validates token -> Updates User DB (Verified: True) -> Redirects to Login.
4. **Login:**
   - User submits credentials on `/login`.
   - **Backend:** Fetches User -> Verifies Hash (Argon2) -> Checks Verified Status -> Generates JWT -> Sets `HttpOnly` Cookie.
   - **Frontend:** Redirects to `/dashboard` (Placeholder protected route).
5. **Session State:**
   - Middleware intercepts requests to `/dashboard`.
   - Verifies JWT in cookie. If invalid/missing -> Redirect to `/login`.
6. **Logout:**
   - User clicks Logout.
   - **Backend:** Destroys Cookie (MaxAge: 0).
   - Redirects to `/login`.

## 4. Security Specifications (Strict)

- **Password Hashing:** Argon2id (Memory hard, resistant to GPU attacks).
- **Cookie Policy:**
  - `HttpOnly`: True (Prevents XSS JS access).
  - `Secure`: True (HTTPS only).
  - `SameSite`: 'Strict' (Prevents CSRF).
- **Validation:** Server-side Zod validation for all inputs.
- **Environment:** strict separation of secrets (`JWT_SECRET`, `DB_URL`) in `.env`.

## 5. Database Schema Strategy (Prisma)

**Model: User**

- `id`: String (UUID, PK)
- `email`: String (Unique)
- `password`: String (Hashed)
- `isVerified`: Boolean (Default: false)
- `createdAt`: DateTime

**Model: VerificationToken**

- `identifier`: String (Email)
- `token`: String (Unique)
- `expires`: DateTime

## 6. Implementation Phases

- **Phase 1: Setup** - Initialize Next.js, Setup Prisma + Postgres, Install dependencies.
- **Phase 2: Database & Backend Utilities** - Define Schema, Create `hash.ts` (Argon2 helper), Create `token.ts` (JWT helper).
- **Phase 3: Registration Flow** - Create Zod schemas, API Route for Signup, Resend Email integration.
- **Phase 4: Login & Session Flow** - API Route for Login, Cookie logic, Middleware for protection.
- **Phase 5: Frontend Integration** - Build Forms (React Hook Form), Connect to APIs.
- **Phase 6: Deployment** - Deploy to Vercel, Set Env Variables, Verify Production Build.
