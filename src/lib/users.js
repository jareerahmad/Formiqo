
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function getUsersCollection() {
    const db = await getDatabase();
    const users = db.collection("users");

    await users.createIndex({ email: 1 }, { unique: true });

    return users;
}

export async function findUserByEmail(email) {
    if (!email) return null;

    const users = await getUsersCollection();

    return users.findOne({
        email: email.trim().toLowerCase(),
    });
}

export async function findUserById(id) {
    if (!id || !ObjectId.isValid(id)) return null;

    const users = await getUsersCollection();

    return users.findOne({
        _id: new ObjectId(id),
    });
}

export async function createUser({
    name,
    email,
    password,
}) {
    const users = await getUsersCollection();

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await users.findOne({
        email: normalizedEmail,
    });

    if (existingUser) {
        throw new Error("An account with this email already exists.");
    }

    const result = await users.insertOne({
        name: name.trim(),
        email: normalizedEmail,
        password,
        provider: "credentials",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return {
        id: result.insertedId.toString(),
        name: name.trim(),
        email: normalizedEmail,
    };
}
