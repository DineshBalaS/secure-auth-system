import { NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validations";
import { verifyPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // 1. Parse and Validate Request Body
    const body = await req.json();
    const validation = LoginSchema.safeParse(body);

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

    // 2. Find User by Email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Security Note: We use a generic error message to prevent email enumeration
    // (i.e., not revealing if the email exists or not)
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 3. Verify Password
    const isValidPassword = await verifyPassword(user.password, password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 4. SECURITY GATE: Check Verification Status
    // This is the new logic added for Phase 4
    if (!user.isVerified) {
      return NextResponse.json(
        {
          error: "Account not verified",
          details:
            "Please check your email to verify your account before logging in.",
        },
        { status: 403 } // 403 Forbidden is semantically correct here
      );
    }

    // 5. Generate Session Token (JWT)
    // Only reachable if password is correct AND user is verified
    const token = await signToken({ userId: user.id, email: user.email });

    // 6. Create the Response with HttpOnly Cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          isVerified: user.isVerified,
        },
      },
      { status: 200 }
    );

    // Set the cookie on the response object
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
