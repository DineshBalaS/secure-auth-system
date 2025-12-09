import { NextResponse } from "next/server";
import crypto from "crypto";
import { RegisterSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email/send-email";

export async function POST(req: Request) {
  try {
    // 1. Parse and Validate Request Body
    const body = await req.json();
    const validation = RegisterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // 2. Check for Duplicate Email
    // We check existence before hashing to save CPU resources on Argon2
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // 3. Hash Password (Argon2id)
    const hashedPassword = await hashPassword(password);

    // 4. Generate Verification Token
    // 32 bytes of random data converted to a hex string (64 chars)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    // Set expiration to 24 hours from now
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 5. Atomic Creation (Transaction)
    // We create the User and the VerificationToken in a single database call.
    // If the token creation fails, the user will not be created.
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isVerified: false, // Explicitly set, though default is false
        verificationTokens: {
          create: {
            identifier: email,
            token: verificationToken,
            expires,
          },
        },
      },
    });

    // 6. Send Verification Email (Side Effect)
    // We await this to ensure the user isn't left wondering if it worked,
    // though in high-scale apps this might be offloaded to a background queue.
    await sendVerificationEmail(newUser.email, verificationToken);

    // 7. Success Response
    return NextResponse.json(
      {
        message:
          "Account created successfully. Please check your email to verify.",
        userId: newUser.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
