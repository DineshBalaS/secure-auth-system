import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // 1. Check for Auth Cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { isAuthenticated: false, error: "Missing session cookie" },
        { status: 401 }
      );
    }

    // 2. Verify JWT Signature & Expiry
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { isAuthenticated: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 3. Fetch Fresh User Data
    // We double-check against the DB to ensure the user wasn't deleted
    // or banned since the token was issued.
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        email: true,
        isVerified: true,
        // Exclude password!
      },
    });

    if (!user) {
      return NextResponse.json(
        { isAuthenticated: false, error: "User not found" },
        { status: 401 }
      );
    }

    // 4. Success Response
    return NextResponse.json(
      {
        isAuthenticated: true,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[AUTH_ME_ERROR]", error);
    return NextResponse.json(
      { isAuthenticated: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
