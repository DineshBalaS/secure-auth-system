import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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
          error: "Invalid request",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // 2. Fetch User
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 3. Scenario 3.2: Invalid Credentials (Security Path)
    // We combine "User Not Found" and "Wrong Password" into one generic error
    // to prevent email enumeration.
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 4. Verify Password (Argon2id)
    const isValidPassword = await verifyPassword(user.password, password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 5. Scenario 3.3: Unverified User
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email before logging in" },
        { status: 403 }
      );
    }

    // 6. Scenario 3.1: Successful Login (Session Creation)
    const payload = { userId: user.id, email: user.email };
    const token = await signToken(payload);

    // 7. Set Secure Cookie
    // We need to await cookies() in Next.js 15
    const cookieStore = await cookies();

    cookieStore.set("auth_token", token, {
      httpOnly: true, // Prevent JS access (XSS protection)
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict", // CSRF protection
      maxAge: 60 * 60 * 24, // 1 Day (matches JWT expiry in session.ts)
      path: "/", // Available across the whole site
    });

    // 8. Success Response
    // We return the user info but NEVER the password or sensitive fields
    return NextResponse.json(
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
  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
