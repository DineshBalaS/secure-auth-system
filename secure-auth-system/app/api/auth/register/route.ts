import { NextResponse } from "next/server";
import crypto from "crypto";
import { RegisterSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email/send-email";
import { VERIFICATION_TOKEN_EXPIRY } from "@/lib/auth/session";

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

    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { error: "User with this email already exists" }, // Privacy note: In strict security, use generic msg
        { status: 409 }
      );
    }

    // 3. Hash Password (Argon2id)
    const hashedPassword = await hashPassword(password);

    // 4. Generate Verification Token
    // 32 bytes of random data converted to a hex string (64 chars)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    // Set expiration to 24 hours from now
    const expires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY);

    // BRANCH A: Handle Unverified User (Idempotent Re-registration)
    if (existingUser && !existingUser.isVerified) {
      // RATE LIMIT CHECK: Prevent email bombing
      // 1. Find the most recent token for this user
      const latestToken = await prisma.verificationToken.findFirst({
        where: { identifier: email },
        orderBy: { expires: "desc" }, // The one expiring latest was created latest
      });

      if (latestToken) {
        // 2. Reverse-engineer creation time (Expires - 24h)
        const tokenBornAt =
          latestToken.expires.getTime() - VERIFICATION_TOKEN_EXPIRY;
        const timeSinceLastRequest = Date.now() - tokenBornAt;

        // 3. Throttle: Limit to 1 request per 60 seconds
        if (timeSinceLastRequest < 60 * 1000) {
          return NextResponse.json(
            { error: "Please wait 1 minute before requesting another email." },
            { status: 429 } // Too Many Requests
          );
        }
      }

      // Transaction: Update Password + Cycle Tokens
      await prisma.$transaction([
        prisma.user.update({
          where: { email },
          data: { password: hashedPassword }, // Overwrite with NEW password
        }),
        prisma.verificationToken.deleteMany({
          where: { identifier: email }, // Remove old/expired tokens
        }),
        prisma.verificationToken.create({
          data: {
            identifier: email,
            token: verificationToken,
            expires,
            userId: existingUser.id, // Link to existing user ID
          },
        }),
      ]);

      // Send the email again
      await sendVerificationEmail(email, verificationToken);

      return NextResponse.json(
        { message: "Confirmation email sent." },
        { status: 200 }
      );
    }

    // BRANCH B: New User Creation (Standard Flow)

    // 5. Atomic Creation (Transaction)
    // We create the User and the VerificationToken in a single database call.
    // If the token creation fails, the user will not be created.
    console.log("[REGISTER_DEBUG] Creating DB User...");
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
    await sendVerificationEmail(email, verificationToken);

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
