
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import {
    verifyEmailToken,
    deleteEmailVerificationToken,
} from "@/lib/emailVerification";

export async function POST(request) {
    try {
        const body = await request.json();

        const token =
            typeof body.token === "string" ? body.token : "";

        if (!token) {
            return NextResponse.json(
                { message: "Verification token is required." },
                { status: 400 }
            );
        }

        const savedToken = await verifyEmailToken(token);

        if (!savedToken) {
            return NextResponse.json(
                {
                    message:
                        "This verification link is invalid or has expired. Please request a new one.",
                },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const users = db.collection("users");

        const result = await users.updateOne(
            { email: savedToken.email },
            {
                $set: {
                    emailVerified: true,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: "Account not found." },
                { status: 404 }
            );
        }

        await deleteEmailVerificationToken(token);

        return NextResponse.json({
            message: "Your email has been verified successfully. You can now sign in.",
        });
    } catch (error) {
        console.error("Verify email API error:", error);

        return NextResponse.json(
            { message: "Unable to verify your email right now. Please try again." },
            { status: 500 }
        );
    }
}
