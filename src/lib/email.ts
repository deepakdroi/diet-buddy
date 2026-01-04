/**
 * Email utility for sending password reset emails.
 * Configure your email provider (Nodemailer, SendGrid, Resend, etc.) here.
 */

interface PasswordResetData {
  user: {
    id: string;
    email: string;
    name?: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  url: string;
  token: string;
}

/**
 * Send password reset email to the user.
 * Logs to console in development.
 */
export async function sendResetPasswordEmail(
  data: PasswordResetData
): Promise<void> {
  const { user, url } = data;

  console.log(`[Email] Sending password reset email to ${user.email}`);
  console.log(`[Email] Reset URL: ${url}`);

  if (process.env.NODE_ENV === "development") {
    console.log(`[DEV] Click here to reset password: ${url}`);
  }

  // TODO: Replace with actual email sending (Resend, SendGrid, Nodemailer, etc.)
  // Example with Resend:
  // const resendKey = process.env.RESEND_API_KEY;
  // if (resendKey) {
  //   await fetch("https://api.resend.com/emails", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${resendKey}`,
  //     },
  //     body: JSON.stringify({
  //       from: process.env.RESEND_FROM || "noreply@example.com",
  //       to: user.email,
  //       subject: "Reset your password",
  //       html: `
  //         <h2>Password Reset</h2>
  //         <p>Click the link below to reset your password:</p>
  //         <a href="${url}">Reset Password</a>
  //       `,
  //     }),
  //   });
  // }
}
