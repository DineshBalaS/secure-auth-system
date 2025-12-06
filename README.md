# Secure Authentication System (Next.js 15)

## 📌 Project Overview
This project is a robust, security-focused authentication system built from scratch, explicitly avoiding Backend-as-a-Service (BaaS) solutions like Auth0 or Clerk. It demonstrates mastery of low-level cryptography, stateless session management, and serverless architecture using Next.js 15 (App Router) and TypeScript.

## 🛠 Tech Stack & Infrastructure

### Core Framework
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Deployment**: Vercel

### Backend & Database
- **Database**: PostgreSQL (via Neon or Supabase)
- **ORM**: Prisma
- **Validation**: Zod (Server-side validation)
- **Email Service**: Resend API

### Security & Cryptography
- **Hashing**: Argon2id (`argon2` library) – Memory-hard, resistant to GPU attacks.
- **Session Management**: Stateless JWT (`jose` library).
- **Storage**: `HttpOnly`, `Secure`, `SameSite='Strict'` Cookies.

---

## 🔐 Security Specifications
The system adheres to strict security protocols to prevent common vulnerabilities (XSS, CSRF, Session Hijacking):

1.  **Password Security**: Uses Argon2id for hashing, ensuring resistance against rainbow table and GPU-based brute-force attacks.
2.  **Cookie Policy**:
    * `HttpOnly`: Prevents client-side JavaScript from accessing the token (XSS protection).
    * `Secure`: Ensures cookies are only sent over HTTPS.
    * `SameSite='Strict'`: Prevents Cross-Site Request Forgery (CSRF).
3.  **Environment Isolation**: Strict separation of secrets (`JWT_SECRET`, `DB_URL`) via environment variables.

---

## 📂 Project Structure
The project follows a modular feature-based architecture within the Next.js App Router.

```text
/
├── app/
│   ├── (auth)/             # Public auth routes (Login, Register, Verify)
│   ├── (protected)/        # Authenticated routes (Dashboard)
│   └── api/auth/           # Backend API routes (Login, Logout, Me)
├── lib/
│   ├── auth/               # Low-level security logic (Argon2, JOSE)
│   ├── db.ts               # Global Prisma instance
│   └── validations.ts      # Zod schemas
├── prisma/                 # Database schema
└── middleware.ts           # Edge middleware for session protection
