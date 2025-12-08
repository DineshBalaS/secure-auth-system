import { describe, it, expect, vi } from "vitest";
import { signToken, verifyToken } from "../auth/session";

describe("Session Utility (JWT)", () => {
  const payload = { userId: "123", email: "test@example.com" };

  it("should sign and verify a valid token", async () => {
    const token = await signToken(payload);
    expect(typeof token).toBe("string");

    const decoded = await verifyToken(token);
    expect(decoded).toBeTruthy();
    expect(decoded?.userId).toBe(payload.userId);
  });

  it("should return null for an invalid token", async () => {
    const result = await verifyToken("invalid.token.string");
    expect(result).toBeNull();
  });

  it("should return null for an expired token", async () => {
    // 1. Create a token
    const token = await signToken(payload);

    // 2. Mock system time to advance by 25 hours (expiration is set to 24h)
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.now() + 25 * 60 * 60 * 1000));

    // 3. Verify it fails
    const result = await verifyToken(token);
    expect(result).toBeNull();

    // Cleanup
    vi.useRealTimers();
  });
});
