import { NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/passwordReset";
import { sendEmail } from "@/lib/email";

// export const runtime = "nodejs";

export async function POST(request) {
    try {
        const body = await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email) || email.length > 254) {
            return NextResponse.json(
                { message: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        const token = await createPasswordResetToken(email);

        if (token) {
            const baseUrl =
                process.env.NEXTAUTH_URL || "http://localhost:3000";

            const resetLink =
                `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;

            await sendEmail({
                to: email,
                subject: "Reset your Formiqo password",
                html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:30px;color:#111827;">
            <h2 style="color:#059669;">Reset your Formiqo password</h2>

            <p>We received a request to reset your Formiqo account password.</p>

            <p>Click the button below to choose a new password.</p>

            <a
              href="${resetLink}"
              style="display:inline-block;background:#059669;color:white;text-decoration:none;padding:13px 24px;border-radius:8px;font-weight:bold;"
            >
              Reset Password
            </a>

            <p style="margin-top:25px;">
              This link expires in one hour and can only be used once.
            </p>

            <p>If you did not request this change, you can ignore this email.</p>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:25px 0;" />

            <p style="font-size:12px;color:#6b7280;">
              Formiqo — Your Documents, One Workspace
            </p>
          </div>
        `,
            });
        }

        return NextResponse.json({
            message:
                "If an account exists with that email, a password-reset link will be sent shortly.",
        });
    } catch (error) {
        console.error("Forgot password API error:", error);

        return NextResponse.json(
            { message: "Unable to process your request right now. Please try again later." },
            { status: 500 }
        );
    }
}