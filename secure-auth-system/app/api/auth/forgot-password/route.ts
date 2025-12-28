import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ForgotPasswordSchema } from "@/lib/validations";
import { sendPasswordResetEmail } from "@/lib/email/send-email";
import { randomUUID } from "crypto"; // Native Node.js crypto

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Input Validation
    const validatedFields = ForgotPasswordSchema.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = validatedFields.data;

    // 2. User Lookup
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // SECURITY: Return success immediately if user not found to prevent enumeration
    if (!existingUser) {
      return NextResponse.json({
        message: "If an account exists, a reset email has been sent.",
      });
    }

    // 3. Token Generation
    // Clean up any existing reset tokens for this user first
    await prisma.passwordResetToken.deleteMany({
      where: { identifier: email },
    });

    const token = randomUUID();
    // Set expiry to 1 hour from now
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // 4. Send Email
    await sendPasswordResetEmail(email, token);

    return NextResponse.json({
      message: "If an account exists, a reset email has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
