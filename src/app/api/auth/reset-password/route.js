
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDatabase } from "@/lib/mongodb";
import {
    verifyPasswordResetToken,
    deletePasswordResetToken,
} from "@/lib/passwordReset";

// export const runtime = "nodejs";

export async function POST(request) {
    try {
        const body = await request.json();

        const token =
            typeof body.token === "string" ? body.token : "";

        const password =
            typeof body.password === "string" ? body.password : "";

        if (!token || !password) {
            return NextResponse.json(
                { message: "Reset token and new password are required." },
                { status: 400 }
            );
        }

        if (password.length < 8 || password.length > 72) {
            return NextResponse.json(
                { message: "Password must be between 8 and 72 characters." },
                { status: 400 }
            );
        }

        const savedToken = await verifyPasswordResetToken(token);

        if (!savedToken) {
            return NextResponse.json(
                { message: "This reset link is invalid or has expired. Please request a new one." },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const db = await getDatabase();
        const users = db.collection("users");

        const result = await users.updateOne(
            { email: savedToken.email },
            {
                $set: {
                    password: hashedPassword,
                    provider: "credentials",
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: "Account not found. Please request a new reset link." },
                { status: 404 }
            );
        }

        await deletePasswordResetToken(token);

        return NextResponse.json({
            message: "Your password has been reset successfully. You can now sign in.",
        });
    } catch (error) {
        console.error("Reset password API error:", error);

        return NextResponse.json(
            { message: "Unable to reset your password right now. Please try again." },
            { status: 500 }
        );
    }
}
