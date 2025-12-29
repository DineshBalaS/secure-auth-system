import { describe, expect, it } from "vitest";
import { ForgotPasswordSchema, ResetPasswordSchema } from "@/lib/validations";

describe("Forgot Password Validation", () => {
  it("should accept a valid email", () => {
    const input = { email: "test@example.com" };
    const result = ForgotPasswordSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should reject an invalid email format", () => {
    const input = { email: "not-an-email" };
    const result = ForgotPasswordSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("valid email");
    }
  });

  it("should reject empty email", () => {
    const input = { email: "" };
    const result = ForgotPasswordSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe("Reset Password Validation", () => {
  it("should accept valid matching passwords with token", () => {
    const input = {
      token: "some-uuid-token",
      password: "strongPassword123",
      confirmPassword: "strongPassword123",
    };
    const result = ResetPasswordSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should reject when passwords do not match", () => {
    const input = {
      token: "some-uuid-token",
      password: "passwordA",
      confirmPassword: "passwordB",
    };
    const result = ResetPasswordSchema.safeParse(input);
    expect(result.success).toBe(false);
    // Zod 'refine' errors often appear at the path or root
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Passwords do not match");
    }
  });

  it("should reject short passwords (< 8 chars)", () => {
    const input = {
      token: "some-uuid-token",
      password: "short",
      confirmPassword: "short",
    };
    const result = ResetPasswordSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("at least 8 characters");
    }
  });

  it("should reject missing token", () => {
    const input = {
      token: "",
      password: "validPassword123",
      confirmPassword: "validPassword123",
    };
    const result = ResetPasswordSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
