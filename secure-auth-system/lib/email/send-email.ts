// lib/email/send-email.ts

// Define the base URL (Env var or localhost fallback)
const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Sends a verification email via Brevo (formerly Sendinblue) HTTP API.
 * This method is firewall-friendly and works on all serverless platforms.
 */
export async function sendVerificationEmail(email: string, token: string) {
  // 1. Validate Configuration (Fail fast if secrets are missing)
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    console.error(
      "❌ [EMAIL ERROR] Missing BREVO_API_KEY or SENDER_EMAIL env variables."
    );
    throw new Error("Email service is not configured properly.");
  }

  const confirmLink = `${domain}/verify?token=${token}`;

  // Log attempt (privacy-safe)
  console.log(`📧 [BREVO] Preparing to send verification email to: ${email}`);

  // 2. Build the HTML Content
  // We use a responsive HTML template matching your project's aesthetic
  const htmlContent = `
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
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Secure Auth</h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <h2 style="color: #171717; font-size: 22px; font-weight: bold; margin: 0 0 15px 0;">Verify your account</h2>
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Thank you for signing up! Please verify your email address to access the dashboard.
                  </p>
                  
                  <a href="${confirmLink}" style="display: inline-block; background-color: #D97757; color: #ffffff; font-weight: bold; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-size: 16px;">
                    Verify Email
                  </a>

                  <p style="margin-top: 30px; font-size: 13px; color: #6b7280;">
                    Or copy this link: <br>
                    <a href="${confirmLink}" style="color: #2E4A52;">${confirmLink}</a>
                  </p>
                </td>
              </tr>
              
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">This email was sent securely via Brevo API.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // 3. Send Request via Native Fetch
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Secure Auth App",
          email: senderEmail,
        },
        to: [
          {
            email: email,
          },
        ],
        subject: "Action Required: Verify your email address",
        htmlContent: htmlContent,
      }),
    });

    // 4. Handle API Errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ [BREVO API ERROR]", JSON.stringify(errorData, null, 2));
      throw new Error(`Email service rejected request: ${response.statusText}`);
    }

    // 5. Handle Success
    const data = await response.json();
    console.log(
      "✅ Email sent successfully via Brevo. Message ID:",
      data.messageId
    );
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    // Throwing ensures the calling function (register route) knows this failed
    throw new Error("Failed to send verification email");
  }
}
