
import crypto from "crypto";
import { getDatabase } from "@/lib/mongodb";

export async function createEmailVerificationToken(email) {
    const db = await getDatabase();
    const users = db.collection("users");
    const tokens = db.collection("emailVerificationTokens");

    const normalizedEmail = email.trim().toLowerCase();

    const user = await users.findOne({
        email: normalizedEmail,
    });

    if (!user || user.emailVerified === true) {
        return null;
    }

    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    await tokens.deleteMany({
        email: normalizedEmail,
    });

    await tokens.insertOne({
        email: normalizedEmail,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
    });

    return token;
}

export async function verifyEmailToken(token) {
    if (
        typeof token !== "string" ||
        !/^[a-f0-9]{64}$/i.test(token)
    ) {
        return null;
    }

    const db = await getDatabase();
    const tokens = db.collection("emailVerificationTokens");

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    return tokens.findOne({
        token: hashedToken,
        expiresAt: { $gt: new Date() },
    });
}

export async function deleteEmailVerificationToken(token) {
    const db = await getDatabase();
    const tokens = db.collection("emailVerificationTokens");

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    await tokens.deleteOne({
        token: hashedToken,
    });
}
