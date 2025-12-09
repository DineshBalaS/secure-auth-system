import { Resend } from "resend";

// Initialize Resend with the API key from environment variables
// In production, this must be set. In dev, we can handle its absence gracefully.
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the base URL for the application
// Standard Next.js practice: use the env var or fallback to localhost
const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Sends a verification email to the user.
 *
 * @param email - The recipient's email address.
 * @param token - The unique verification token generated during registration.
 * @returns A promise that resolves to the email provider's response or checks for success.
 */
export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}/verify?token=${token}`;

  // 1. Development Fallback:
  // If no API key is present (or we are strictly in development), log to console.
  // This prevents the app from crashing if you haven't set up Resend yet.
  if (!process.env.RESEND_API_KEY) {
    console.log("----------------------------------------------");
    console.log("📧 [DEV MODE] Email Service Simulation");
    console.log(`To: ${email}`);
    console.log(`Link: ${confirmLink}`);
    console.log("----------------------------------------------");
    return { success: true, id: "dev-mock-id" };
  }

  try {
    // 2. Production Sending Logic
    const data = await resend.emails.send({
      from: "Secure Auth <onboarding@resend.dev>", // Change this to your verified domain in Prod
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify your account</h2>
          <p>Click the button below to verify your email address and complete your registration:</p>
          <a href="${confirmLink}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Verify Email
          </a>
          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            Or copy and paste this link into your browser:<br>
            <a href="${confirmLink}">${confirmLink}</a>
          </p>
          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    // Log the error for observability but don't crash the main thread
    console.error("❌ Failed to send verification email:", error);
    // Throwing ensures the calling function knows the process failed
    throw new Error("Failed to send verification email");
  }
}
