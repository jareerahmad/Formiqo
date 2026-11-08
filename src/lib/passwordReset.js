import crypto from "crypto";
import { getDatabase } from "@/lib/mongodb";

export async function createPasswordResetToken(email) {
    const db = await getDatabase();
    const users = db.collection("users");
    const tokens = db.collection("passwordResetTokens");

    const normalizedEmail = email.trim().toLowerCase();

    const user = await users.findOne({
        email: normalizedEmail,
    });

    if (!user) {
        return null;
    }

    // Generate a secure random token.
    const token = crypto.randomBytes(32).toString("hex");

    // Store only the SHA-256 hash of the token.
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // Remove any previous reset token for this email.
    await tokens.deleteMany({
        email: normalizedEmail,
    });

    // Save the new token with a one-hour expiration.
    await tokens.insertOne({
        email: normalizedEmail,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        createdAt: new Date(),
    });

    return token;
}

export async function verifyPasswordResetToken(token) {
    if (
        typeof token !== "string" ||
        !/^[a-f0-9]{64}$/i.test(token)
    ) {
        return null;
    }

    const db = await getDatabase();
    const tokens = db.collection("passwordResetTokens");

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const savedToken = await tokens.findOne({
        token: hashedToken,
        expiresAt: { $gt: new Date() },
    });

    return savedToken || null;
}

export async function deletePasswordResetToken(token) {
    const db = await getDatabase();
    const tokens = db.collection("passwordResetTokens");

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    await tokens.deleteOne({
        token: hashedToken,
    });
}