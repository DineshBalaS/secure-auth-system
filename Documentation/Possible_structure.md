```text
/
├── .env                       # Environment variables (DB_URL, JWT_SECRET, RESEND_KEY)
├── package.json               # Dependencies
├── middleware.ts              # Edge Middleware for protecting routes
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── prisma/
│   └── schema.prisma          # Database models (User, VerificationToken)
├── public/                    # Static assets (images, fonts)
├── app/                       # App Router (FileSystem Routing)
│   ├── layout.tsx             # Root Layout (Fonts, Providers)
│   ├── page.tsx               # Landing Page (Public)
│   ├── (auth)/                # Route Group (doesn't affect URL path)
│   │   ├── layout.tsx         # Auth-specific layout (Centered cards)
│   │   ├── login/
│   │   │   └── page.tsx       # Login Page
│   │   ├── register/
│   │   │   └── page.tsx       # Registration Page
│   │   └── verify/
│   │       └── page.tsx       # Email Verification Page (?token=...)
│   ├── (protected)/           # Route Group for authenticated users
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Protected Dashboard
│   │   └── layout.tsx         # Protected Layout (Navbar with Logout)
│   └── api/                   # API Routes (Backend Logic)
│       └── auth/
│           ├── register/
│           │   └── route.ts   # POST: Registration logic
│           ├── login/
│           │   └── route.ts   # POST: Login logic
│           ├── verify/
│           │   └── route.ts   # POST: Verification logic
│           ├── logout/
│           │   └── route.ts   # POST: Logout logic
│           └── me/
│               └── route.ts   # GET: Session validation
├── components/                # React Components
│   ├── ui/                    # Reusable UI elements (Buttons, Inputs)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   └── auth/                  # Auth-specific components
│       ├── login-form.tsx
│       ├── register-form.tsx
│       └── logout-button.tsx
└── lib/                       # Shared Utilities & Logic
    ├── db.ts                  # Global PrismaClient instance
    ├── validations.ts         # Zod Schemas (LoginSchema, RegisterSchema)
    ├── auth/
    │   ├── password.ts        # Argon2id hashing/verification logic
    │   └── session.ts         # JOSE JWT generation/verification logic
    └── email/
        └── send-email.ts      # Resend API integration
```
