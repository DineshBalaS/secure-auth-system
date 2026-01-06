import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/auth/register/route"; // Import the route handler
import { prisma } from "@/lib/db"; // Import the actual db instance to mock it
import { VERIFICATION_TOKEN_EXPIRY } from "@/lib/auth/session";

// 1. Mock the Dependencies
vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    verificationToken: {
      findFirst: vi.fn(),
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn((ops) => ops), // Pass through operations
  },
}));

vi.mock("@/lib/auth/password", () => ({
  hashPassword: vi.fn(() => "hashed_password"),
}));

vi.mock("@/lib/email/send-email", () => ({
  sendVerificationEmail: vi.fn(),
}));

describe("POST /api/auth/register (Rate Limiting)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validRequest = {
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
  };

  const createRequest = (body: any) =>
    new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });

  it("should return 429 if a token was requested < 60 seconds ago", async () => {
    // SCENARIO: User exists, is unverified, and requested a token 30 seconds ago

    // 1. Mock: User Exists & Unverified
    (prisma.user.findUnique as any).mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      isVerified: false,
    });

    // 2. Mock: Token exists.
    // Logic: Created = Expires - 24h.
    // If we want "Created 30s ago", Expires should be Now + 24h - 30s.
    const now = Date.now();
    const mockExpires = new Date(now + VERIFICATION_TOKEN_EXPIRY - 30 * 1000);

    (prisma.verificationToken.findFirst as any).mockResolvedValue({
      expires: mockExpires,
    });

    // 3. Execute
    const response = await POST(createRequest(validRequest));
    const data = await response.json();

    // 4. Assert
    expect(response.status).toBe(429);
    expect(data.error).toContain("wait 1 minute");
  });

  it("should allow request if token was requested > 60 seconds ago", async () => {
    // SCENARIO: User exists, Unverified, requested token 2 minutes ago

    // 1. Mock: User Exists & Unverified
    (prisma.user.findUnique as any).mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      isVerified: false,
    });

    // 2. Mock: Token created 120 seconds ago
    const now = Date.now();
    const mockExpires = new Date(now + VERIFICATION_TOKEN_EXPIRY - 120 * 1000);

    (prisma.verificationToken.findFirst as any).mockResolvedValue({
      expires: mockExpires,
    });

    // 3. Execute
    const response = await POST(createRequest(validRequest));
    const data = await response.json();

    // 4. Assert: Should succeed (200 OK for re-registration)
    expect(response.status).toBe(200);
    expect(data.message).toContain("Confirmation email sent");
  });
});
