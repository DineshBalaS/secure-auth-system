import { Resend } from "resend";

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the base URL for the application
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
  if (process.env.NODE_ENV !== "production" || !process.env.RESEND_API_KEY) {
    console.log("----------------------------------------------");
    console.log("📧 [DEV MODE] Email Service Simulation");
    console.log(`To: ${email}`);
    console.log(`Link: ${confirmLink}`);
    console.log("----------------------------------------------");
    if (!process.env.RESEND_API_KEY) {
      return { success: true, id: "dev-mock-id" };
    }
  }

  try {
    // 2. Production Sending Logic with "Branded" HTML Template
    const data = await resend.emails.send({
      // Updated sender to 'noreply' as requested
      from: "Secure Auth <noreply@resend.dev>",
      to: email,
      subject: "Action Required: Verify your email address",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your email</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
          
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <tr>
                    <td style="background-color: #2E4A52; padding: 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">
                        Secure Auth
                      </h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <div style="margin-bottom: 20px;">
                        <span style="font-size: 48px;">🔒</span>
                      </div>

                      <h2 style="color: #171717; font-size: 22px; font-weight: bold; margin: 0 0 15px 0;">
                        Verify your account
                      </h2>
                      
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                        Thanks for signing up! To access your dashboard and complete the registration process, please verify your email address by clicking the button below.
                      </p>

                      <a href="${confirmLink}" style="display: inline-block; background-color: #D97757; color: #ffffff; font-weight: bold; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        Verify Email
                      </a>

                      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 40px 0 20px 0;">

                      <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
                        Or copy and paste this link into your browser:<br>
                        <a href="${confirmLink}" style="color: #2E4A52; text-decoration: underline; word-break: break-all;">
                          ${confirmLink}
                        </a>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        Need help? Visit our <a href="${domain}" style="color: #6b7280; text-decoration: underline;">Help Center</a>.
                      </p>
                      <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                        You received this email because you registered an account with Secure Auth.
                        If you didn't request this, please ignore this email.
                      </p>
                    </td>
                  </tr>

                </table>
                </td>
            </tr>
          </table>

        </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
