import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../auth/password";

describe("Password Utility (Argon2)", () => {
  it("should hash a password and return a different string", async () => {
    const plain = "mySuperSecretPassword";
    const hash = await hashPassword(plain);

    expect(hash).not.toBe(plain);
    expect(hash).toContain("$argon2id"); // Verify correct algorithm usage
  });

  it("should correctly verify a valid password", async () => {
    const plain = "correct-password";
    const hash = await hashPassword(plain);
    const isValid = await verifyPassword(hash, plain);

    expect(isValid).toBe(true);
  });

  it("should fail verification for a wrong password", async () => {
    const plain = "original-password";
    const hash = await hashPassword(plain);
    const isValid = await verifyPassword(hash, "wrong-password");

    expect(isValid).toBe(false);
  });
});
