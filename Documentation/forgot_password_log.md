Phase: Password Recovery Implementation
Goal: Implement a secure, token-based mechanism for users to reset lost passwords without compromising account security.

1. Database Schema Expansion

Objective: specific storage for short-lived reset tokens, separate from verification tokens.

Action: Modify secure-auth-system/schema.prisma to include a new PasswordResetToken model.

Requirements:

Model must include fields for a unique token, an expiration timestamp, and the user's identifier (email), similar to the existing VerificationToken structure.

Execute a database migration to apply changes to the PostgreSQL instance.

2. Security Validation Logic

Objective: Enforce strict input validation for the new recovery forms.

Action: Update secure-auth-system/lib/validations.ts.

Requirements:

Define ForgotPasswordSchema to validate the email input format, mirroring the email validation in RegisterSchema.

Define ResetPasswordSchema to enforce password strength (minimum 8 characters) and confirm password matching, ensuring consistency with the existing LoginSchema and RegisterSchema.

3. Email Infrastructure Extension

Objective: Enable the system to send secure, HTML-formatted reset links.

Action: Modify secure-auth-system/lib/email/send-email.ts.

Requirements:

Implement a sendPasswordResetEmail function that utilizes the existing Brevo HTTP API configuration and error handling logic.

Ensure the function validates the presence of BREVO_API_KEY and SENDER_EMAIL environment variables before attempting to send, matching the current safety checks.

4. Backend API Development

Objective: Handle the generation, verification, and consumption of reset tokens.

Action: Create new API routes in secure-auth-system/app/api/auth/.

Requirements:

Forgot Password Endpoint: specific logic to check if a user exists (without revealing existence to prevent enumeration), generate a token, save it to the new Prisma model, and trigger the Brevo email function.

Reset Password Endpoint: Specific logic to validate the incoming token against the database, verify it has not expired, hash the new password, and update the User record.

5. Frontend Integration

Objective: Provide the user interface for the recovery flow.

Action: Create new pages within secure-auth-system/app/(auth)/.

Requirements:

Request Page: A form bound to the ForgotPasswordSchema to capture the user's email.

Reset Page: A form bound to the ResetPasswordSchema that captures the new password and extracts the token from the URL query parameters.
