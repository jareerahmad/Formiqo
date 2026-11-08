
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser } from "@/lib/users";
import { createEmailVerificationToken } from "@/lib/emailVerification";
import { sendEmail } from "@/lib/email";

export async function POST(request) {
    try {
        const body = await request.json();

        const name =
            typeof body.name === "string" ? body.name.trim() : "";

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        const password =
            typeof body.password === "string" ? body.password : "";

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Please fill in all required fields." },
                { status: 400 }
            );
        }

        if (name.length < 2 || name.length > 80) {
            return NextResponse.json(
                { message: "Name must be between 2 and 80 characters." },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email) || email.length > 254) {
            return NextResponse.json(
                { message: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        if (password.length < 8 || password.length > 72) {
            return NextResponse.json(
                { message: "Password must be between 8 and 72 characters." },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await createUser({
            name,
            email,
            password: hashedPassword,
        });

        const token = await createEmailVerificationToken(email);

        if (!token) {
            throw new Error("Could not create email verification token.");
        }

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

          <p>Hello ${name.replace(/[&<>"']/g, (char) => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[char])},</p>

          <p>Thank you for creating your Formiqo account.</p>

          <p>Please verify your email address by clicking below.</p>

          <a
            href="${verificationLink}"
            style="display:inline-block;background:#059669;color:white;text-decoration:none;padding:13px 24px;border-radius:8px;font-weight:bold;"
          >
            Verify Email Address
          </a>

          <p style="margin-top:25px;">
            This link expires in 24 hours.
          </p>

          <p>If you did not create this account, you can ignore this email.</p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:25px 0;" />

          <p style="font-size:12px;color:#6b7280;">
            Formiqo — Your Documents, One Workspace
          </p>
        </div>
      `,
        });

        return NextResponse.json(
            {
                message:
                    "Your account has been created! Please check your email and verify your address before signing in.",
                user,
            },
            { status: 201 }
        );
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json(
                { message: "An account with this email already exists." },
                { status: 409 }
            );
        }

        console.error("Registration API error:", error);

        return NextResponse.json(
            {
                message:
                    "Your registration could not be completed. Please try again or contact support if an account was already created.",
            },
            { status: 500 }
        );
    }
}
