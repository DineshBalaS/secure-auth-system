import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    // 1. Input Validation
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid token" },
        { status: 400 }
      );
    }

    // 2. Find the token in the database
    const existingToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // 3. Check for Expiration
    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      // Optional: Cleanup expired token immediately to keep DB clean
      await prisma.verificationToken.delete({
        where: { id: existingToken.id },
      });

      return NextResponse.json(
        { error: "Token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // 4. Find the user associated with this token
    // We use the identifier (email) stored in the token to link back to the user
    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.identifier },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User associated with this token no longer exists" },
        { status: 404 }
      );
    }

    // 5. Atomic Transaction: Verify User & Delete Token
    // We do this in a transaction to prevent race conditions or partial updates
    await prisma.$transaction([
      prisma.user.update({
        where: { id: existingUser.id },
        data: {
          isVerified: true,
          // If you decide to add emailVerified DateTime later, add it here:
          // emailVerified: new Date()
        },
      }),
      prisma.verificationToken.delete({
        where: { id: existingToken.id },
      }),
    ]);

    // 6. Success Response
    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[VERIFY_EMAIL_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
