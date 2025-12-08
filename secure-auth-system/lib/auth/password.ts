import argon2 from "argon2";

/**
 * Hashes a plain text password using Argon2id.
 * * @param plainTextPassword - The raw password input by the user.
 * @returns A Promise that resolves to the hashed string (including algorithm, salt, and parameters).
 */
export async function hashPassword(plainTextPassword: string): Promise<string> {
  try {
    // We explicitly use argon2id as per security specs
    return await argon2.hash(plainTextPassword, {
      type: argon2.argon2id,
    });
  } catch (error) {
    // In production, you might want to log this error to an observability tool
    throw new Error("Password hashing failed");
  }
}

/**
 * Verifies a plain text password against a stored hash.
 * * @param hash - The stored hash from the database.
 * @param plainTextPassword - The raw password input by the user.
 * @returns A Promise that resolves to true if valid, false otherwise.
 */
export async function verifyPassword(
  hash: string,
  plainTextPassword: string
): Promise<boolean> {
  try {
    // argon2.verify extracts the salt and params from the hash string automatically
    return await argon2.verify(hash, plainTextPassword);
  } catch (error) {
    // If the hash is malformed or verification fails internally
    console.error("Password verification error:", error);
    return false;
  }
}
