import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ResetPasswordSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth/password";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Input Validation (Checks password strength & matching)
    const validatedFields = ResetPasswordSchema.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid data or passwords do not match" },
        { status: 400 }
      );
    }

    const { token, password } = validatedFields.data;

    // 2. Verify Token
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return NextResponse.json(
        { error: "Invalid or missing token" },
        { status: 400 }
      );
    }

    // 3. Check Expiration
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return NextResponse.json(
        { error: "Token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // 4. Find User associated with token
    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.identifier },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5. Hash New Password
    const hashedPassword = await hashPassword(password);

    // 6. Execute Transaction (Update User + Delete Token)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { id: existingToken.id },
      }),
    ]);

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
