import nodemailer from "nodemailer";

// Define the base URL (Env var or localhost)
const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// 1. Configure the Transporter (The Mailman)
// We create this outside the function to reuse the configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  // DEBUG CONFIGURATION
  logger: true, // Log SMTP traffic to console
  debug: true, // Include detailed debug info
  connectionTimeout: 5000, // Fail after 5 seconds (don't hang forever)
  greetingTimeout: 5000, // Fail if server doesn't say "Hello" in 5s
  socketTimeout: 5000, // Fail if socket hangs
});

/**
 * Sends a verification email via Gmail SMTP.
 */
export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}/verify?token=${token}`;

  // 2. Development Logging
  if (process.env.NODE_ENV !== "production") {
    console.log("----------------------------------------------");
    console.log("📧 [DEV MODE] Sending email via Gmail SMTP");
    console.log(`To: ${email}`);
    console.log(`Link: ${confirmLink}`);
    console.log("----------------------------------------------");
  } else {
    // Production Logging Sanity Check
    console.log("📧 [PROD MODE] Attempting to send email...");
    console.log(
      `📧 Configured Sender: ${process.env.GMAIL_USER ? "Set" : "MISSING"}`
    );
  }

  try {
    // 3. Send the Email
    // The 'from' address uses your GMAIL_USER env var
    const info = await transporter.sendMail({
      from: `"Secure Auth Service" <${process.env.GMAIL_USER}>`,
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
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Secure Auth</h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <h2 style="color: #171717; font-size: 22px; font-weight: bold; margin: 0 0 15px 0;">Verify your account</h2>
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                        Thank you for testing my portfolio project! Please verify your email to access the dashboard.
                      </p>
                      
                      <a href="${confirmLink}" style="display: inline-block; background-color: #D97757; color: #ffffff; font-weight: bold; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-size: 16px;">
                        Verify Email
                      </a>

                      <p style="margin-top: 30px; font-size: 13px; color: #6b7280;">
                        Or copy this link: <a href="${confirmLink}" style="color: #2E4A52;">${confirmLink}</a>
                      </p>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #9ca3af; font-size: 12px; margin: 0;">This is a demo project by DineshbalaS.</p>
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

    console.log(
      "✅ Email sent successfully via Nodemailer. Message ID:",
      info.messageId
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    // In a real app we might throw, but here we log and throw to ensure the API knows it failed
    throw new Error("Failed to send verification email");
  }
}
