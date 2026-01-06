import { SignJWT, jwtVerify } from "jose";

// Time constants
export const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds
export const VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Defines the structure of the data stored inside the JWT.
 * Based on API Docs Scenario 3.1: Payload contains userId and email.
 */
export interface SessionPayload {
  userId: string;
  email: string;
  // We can add roles or other claims here later if needed
  [key: string]: any;
}

// Ensure the secret exists to prevent insecure signing
const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Jose requires the key to be a Uint8Array (Web Crypto API standard)
const key = new TextEncoder().encode(secretKey);

/**
 * Signs a new JWT with the user's payload.
 * * @param payload - The user data to embed in the token.
 * @returns A Promise that resolves to the signed JWT string.
 */
export async function signToken(payload: SessionPayload): Promise<string> {
  return (
    new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" }) // HMAC SHA-256
      .setIssuedAt()
      // Sets expiration time using current time + session duration (standard claim 'exp')
      .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE)
      .sign(key)
  );
}

/**
 * Verifies a JWT and returns the payload if valid.
 * * @param token - The JWT string from the cookie.
 * @returns A Promise that resolves to the payload if valid, or null if invalid/expired.
 */
export async function verifyToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"], // Strictly allow only our signing algorithm
    });

    return payload as SessionPayload;
  } catch (error) {
    // Token is expired, malformed, or signature is invalid
    return null;
  }
}
