
import { NextResponse } from "next/server";
import { createEmailVerificationToken } from "@/lib/emailVerification";
import { sendEmail } from "@/lib/email";

export async function POST(request) {
    try {
        const body = await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        if (!email || email.length > 254) {
            return NextResponse.json(
                { message: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        const token = await createEmailVerificationToken(email);

        if (token) {
            const baseUrl =
                process.env.NEXTAUTH_URL || "http://localhost:3000";

            const verificationLink =
                `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;

            await sendEmail({
                to: email,
                subject: "Verify your Formiqo email address",
                html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:30px;color:#111827;">
            <h2 style="color:#059669;">Welcome to Formiqo!</h2>

            <p>Thank you for creating your Formiqo account.</p>

            <p>Please verify your email address by clicking the button below.</p>

            <a
              href="${verificationLink}"
              style="display:inline-block;background:#059669;color:white;text-decoration:none;padding:13px 24px;border-radius:8px;font-weight:bold;"
            >
              Verify Email Address
            </a>

            <p style="margin-top:25px;">
              This verification link expires in 24 hours.
            </p>

            <p>If you did not create a Formiqo account, you can ignore this email.</p>

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
                "If your account needs verification, a verification email will be sent shortly.",
        });
    } catch (error) {
        console.error("Send verification API error:", error);

        return NextResponse.json(
            { message: "Unable to send the verification email right now." },
            { status: 500 }
        );
    }
}
