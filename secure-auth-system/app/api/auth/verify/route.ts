import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { VerifyEmailSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    // 1. Parse and Validate Request Body
    const body = await req.json();
    const validation = VerifyEmailSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { token } = validation.data;

    // 2. Find the Token in Database
    // We look up by the 'token' field which is marked @unique in schema.prisma
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    // 3. Scenario 2.2: Token Not Found
    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      );
    }

    // 4. Scenario 2.2: Token Expired
    // Check if the expiration date has passed
    if (new Date() > verificationToken.expires) {
      return NextResponse.json(
        {
          error: "Token has expired. Please request a new verification email.",
        },
        { status: 400 }
      );
    }

    // 5. Scenario 2.1: Success (Atomic Update)
    // We update the user and delete the token in a single transaction
    await prisma.$transaction([
      // Update User status
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { isVerified: true },
      }),
      // Cleanup: Delete the used token to prevent replay attacks
      prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      }),
    ]);

    // 6. Success Response
    return NextResponse.json(
      { message: "Email verified successfully. You can now login." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[VERIFY_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
