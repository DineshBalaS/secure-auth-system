import { describe, it, expect } from "vitest";
import { RegisterSchema } from "../validations";

describe("Validation Schemas", () => {
  describe("RegisterSchema", () => {
    it("should validate a correct registration request", () => {
      const input = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      };
      const result = RegisterSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("should reject invalid emails", () => {
      const input = {
        email: "not-an-email",
        password: "password123",
        confirmPassword: "password123",
      };
      const result = RegisterSchema.safeParse(input);

      expect(result.success).toBe(false);

      // Robust Fix: Use flatten() to access field-specific errors safely
      if (!result.success) {
        const { fieldErrors } = result.error.flatten();
        expect(fieldErrors.email).toBeDefined();
        // Check that the specific error message for 'email' contains our expected text
        expect(fieldErrors.email?.[0]).toContain("valid email");
      }
    });

    it("should reject passwords shorter than 8 characters", () => {
      const input = {
        email: "test@example.com",
        password: "short",
        confirmPassword: "short",
      };
      const result = RegisterSchema.safeParse(input);

      expect(result.success).toBe(false);

      if (!result.success) {
        const { fieldErrors } = result.error.flatten();
        expect(fieldErrors.password).toBeDefined();
        // Check that the specific error message for 'password' contains our expected text
        expect(fieldErrors.password?.[0]).toContain("at least 8 characters");
      }
    });

    it("should reject when passwords do not match", () => {
      const input = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password456",
      };
      const result = RegisterSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        const { fieldErrors } = result.error.flatten();
        expect(fieldErrors.confirmPassword?.[0]).toBe("Passwords do not match");
      }
    });
  });
});
