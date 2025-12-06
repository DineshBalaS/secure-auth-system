# User Journey Specification: Secure Authentication System

## System Actors

- **User:** The end-user attempting to access the system.
- **Client (FE):** Next.js Frontend.
- **Server (BE):** Next.js API Routes / Server Actions.
- **DB:** PostgreSQL.
- **Email Service:** Resend.

---

## 1. Registration Flow (Sign Up)

### Scenario 1.1: Successful Registration (Happy Path)

- **Precondition:** User is unauthenticated.
- **Trigger:** User submits valid Email and Password on `/register`.
- **Steps:**
  1. **FE:** Validates form inputs (Zod). Sends POST request to BE.
  2. **BE:** Checks if `email` exists in DB. (Result: False).
  3. **BE:** Generates Salt + Hashes Password using **Argon2id**.
  4. **BE:** Creates User record in DB with `isVerified: false`.
  5. **BE:** Generates a crypto-random verification token + expiration date.
  6. **BE:** Stores token in DB linked to user.
  7. **BE:** Calls Email Service to send verification link.
  8. **FE:** Displays "Check your email" success message.
- **Postcondition:** User account created (Pending). Email sent.

### Scenario 1.2: Duplicate Email Registration (Edge Case)

- **Trigger:** User submits an email that already exists in DB.
- **Steps:**
  1. **BE:** Checks if `email` exists in DB. (Result: True).
  2. **BE:** Halts process. Returns 409 Conflict error.
- **Postcondition:** DB unchanged. FE displays "User already exists."

### Scenario 1.3: Weak Password / Invalid Input (Edge Case)

- **Trigger:** User submits password < 8 chars or invalid email format.
- **Steps:**
  1. **FE:** Zod validation fails immediately (Client-side).
  2. **BE:** (Double check) Zod validation fails (Server-side).
- **Postcondition:** Request blocked. FE displays specific validation error.

---

## 2. Verification Flow

### Scenario 2.1: Successful Email Verification (Happy Path)

- **Precondition:** User clicked link `domain.com/verify-email?token=xyz`.
- **Steps:**
  1. **FE:** Page loads, reads `token` param, calls BE verification endpoint.
  2. **BE:** Looks up token in `VerificationToken` table.
  3. **Logic Check:** Is token present? YES. Is token expired? NO.
  4. **BE:** Updates User record: Sets `isVerified = true`.
  5. **BE:** Deletes the used token from DB.
  6. **FE:** Redirects user to `/login` with success toast.
- **Postcondition:** User status is Active.

### Scenario 2.2: Expired or Invalid Token (Negative Path)

- **Trigger:** User clicks old link or malformed link.
- **Steps:**
  1. **BE:** Looks up token.
  2. **Logic Check:** Token not found OR `expires` < `now`.
  3. **BE:** Returns 400 Error ("Invalid or Expired Token").
  4. **FE:** Displays error page. Button provided: "Resend Verification Email."
- **Postcondition:** User remains Unverified.

---

## 3. Login Flow

### Scenario 3.1: Successful Login (Happy Path)

- **Precondition:** User is verified.
- **Trigger:** User submits correct Email and Password on `/login`.
- **Steps:**
  1. **BE:** Fetches User by email.
  2. **BE:** Verifies Password using **Argon2id**. (Result: Match).
  3. **BE:** Checks `isVerified`. (Result: True).
  4. **BE:** Generates JWT (Payload: `{ userId, email }`).
  5. **BE:** Sets HTTP-Response Header: `Set-Cookie` (HttpOnly, Secure, SameSite=Strict).
  6. **FE:** Receives 200 OK. Redirects to `/dashboard`.
- **Postcondition:** User is Authenticated. Session Cookie active.

### Scenario 3.2: Invalid Credentials (Security Path)

- **Trigger:** User submits wrong password or non-existent email.
- **Steps:**
  1. **BE:** Fetches User. (Result: Found OR Not Found).
  2. **BE:** _If User Found:_ Verify Argon2 (Result: Fail).
  3. **BE:** _If User Not Found:_ Return generic error.
  4. **BE:** Returns 401 Unauthorized with generic message: "Invalid email or password."
     _Note: We do not reveal if the email exists or if the password was wrong to prevent enumeration._
- **Postcondition:** User remains Unauthenticated.

### Scenario 3.3: Unverified User Login (Edge Case)

- **Trigger:** User tries to login before clicking email link.
- **Steps:**
  1. **BE:** Verifies Password. (Result: Match).
  2. **BE:** Checks `isVerified`. (Result: False).
  3. **BE:** Returns 403 Forbidden ("Please verify your email first").
- **Postcondition:** User remains Unauthenticated.

---

## 4. Protected Route Access (Session Management)

### Scenario 4.1: Accessing Dashboard (Happy Path)

- **Trigger:** User navigates to `/dashboard`.
- **Steps:**
  1. **Middleware:** Intercepts request.
  2. **Middleware:** Checks for Cookie `auth_token`.
  3. **Middleware:** Verifies JWT signature using `jose`. (Result: Valid).
  4. **Middleware:** Allows request to proceed to Page.
- **Postcondition:** User sees protected content.

### Scenario 4.2: Unauthorized Access (Negative Path)

- **Trigger:** User navigates to `/dashboard` without logging in.
- **Steps:**
  1. **Middleware:** Checks for Cookie. (Result: Missing or Invalid).
  2. **Middleware:** Redirects user to `/login`.
- **Postcondition:** Access denied.

---

## 5. Logout Flow

### Scenario 5.1: User Logout

- **Trigger:** User clicks "Logout" button.
- **Steps:**
  1. **BE:** Receives Logout request.
  2. **BE:** Sets HTTP-Response Header: `Set-Cookie` with `Max-Age=0` (Immediate Expiry).
  3. **FE:** Redirects to `/login`.
- **Postcondition:** Session Cookie destroyed. User is Unauthenticated.
