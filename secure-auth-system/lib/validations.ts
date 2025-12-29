import { z } from "zod";

/**
 * Registration Schema
 * Used for: POST /api/auth/register
 * Constraints: Valid email, Password min 8 chars
 */
export const RegisterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

// Infer the TypeScript type from the schema
export type RegisterInput = z.infer<typeof RegisterSchema>;

/**
 * Login Schema
 * Used for: POST /api/auth/login
 * Constraints: Valid email, Password required
 */
export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * Verification Schema
 * Used for: POST /api/auth/verify
 */
export const VerifyEmailSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
});

export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;

/**
 * Forgot Password Schema
 * Used for: POST /api/auth/forgot-password
 */
export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

/**
 * Reset Password Schema
 * Used for: POST /api/auth/reset-password
 * Constraints: Password min 8 chars, Confirm Password match
 */
export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: "Token is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
