
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

const COLLECTION_NAME = "documents";

function serializeDocument(document) {
    return {
        ...document,
        _id: document._id.toString(),
        userId: document.userId.toString(),
    };
}

async function getAuthenticatedUser() {
    const session = await auth();

    if (!session?.user?.id) {
        return null;
    }

    return session.user.id;
}

// GET /api/documents
// GET /api/documents?id=DOCUMENT_ID
export async function GET(request) {
    try {
        const userId = await getAuthenticatedUser();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Please sign in to continue." },
                { status: 401 }
            );
        }

        const db = await getDatabase();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            if (!ObjectId.isValid(id)) {
                return NextResponse.json(
                    { success: false, message: "Invalid document ID." },
                    { status: 400 }
                );
            }

            const document = await db.collection(COLLECTION_NAME).findOne({
                _id: new ObjectId(id),
                userId,
            });

            if (!document) {
                return NextResponse.json(
                    { success: false, message: "Document not found." },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                document: serializeDocument(document),
            });
        }

        const documents = await db
            .collection(COLLECTION_NAME)
            .find({ userId })
            .sort({ updatedAt: -1, createdAt: -1 })
            .limit(200)
            .toArray();

        return NextResponse.json({
            success: true,
            documents: documents.map(serializeDocument),
        });
    } catch (error) {
        console.error("GET documents error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to load documents." },
            { status: 500 }
        );
    }
}

// POST /api/documents
export async function POST(request) {
    try {
        const userId = await getAuthenticatedUser();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Please sign in to continue." },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, type, data } = body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof type !== "string" ||
            !type.trim() ||
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A title, document type, and document data are required.",
                },
                { status: 400 }
            );
        }

        if (title.length > 200 || type.length > 80) {
            return NextResponse.json(
                { success: false, message: "The title or type is too long." },
                { status: 400 }
            );
        }

        const now = new Date();
        const db = await getDatabase();

        const document = {
            userId,
            title: title.trim(),
            type: type.trim(),
            data,
            createdAt: now,
            updatedAt: now,
        };

        const result = await db
            .collection(COLLECTION_NAME)
            .insertOne(document);

        return NextResponse.json(
            {
                success: true,
                message: "Document saved successfully.",
                document: serializeDocument({
                    ...document,
                    _id: result.insertedId,
                }),
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST document error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to save document." },
            { status: 500 }
        );
    }
}

// PATCH /api/documents
export async function PATCH(request) {
    try {
        const userId = await getAuthenticatedUser();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Please sign in to continue." },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, title, type, data } = body;

        if (typeof id !== "string" || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "A valid document ID is required." },
                { status: 400 }
            );
        }

        const updates = {};

        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim() || title.length > 200) {
                return NextResponse.json(
                    { success: false, message: "Please provide a valid title." },
                    { status: 400 }
                );
            }
            updates.title = title.trim();
        }

        if (type !== undefined) {
            if (typeof type !== "string" || !type.trim() || type.length > 80) {
                return NextResponse.json(
                    { success: false, message: "Please provide a valid type." },
                    { status: 400 }
                );
            }
            updates.type = type.trim();
        }

        if (data !== undefined) {
            if (!data || typeof data !== "object" || Array.isArray(data)) {
                return NextResponse.json(
                    { success: false, message: "Document data must be an object." },
                    { status: 400 }
                );
            }
            updates.data = data;
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { success: false, message: "No changes were provided." },
                { status: 400 }
            );
        }

        updates.updatedAt = new Date();

        const db = await getDatabase();

        const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
            {
                _id: new ObjectId(id),
                userId,
            },
            { $set: updates },
            { returnDocument: "after" }
        );

        const updatedDocument = result?.value ?? result;

        if (!updatedDocument || !updatedDocument._id) {
            return NextResponse.json(
                { success: false, message: "Document not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Document updated successfully.",
            document: serializeDocument(updatedDocument),
        });
    } catch (error) {
        console.error("PATCH document error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to update document." },
            { status: 500 }
        );
    }
}

// DELETE /api/documents?id=DOCUMENT_ID
export async function DELETE(request) {
    try {
        const userId = await getAuthenticatedUser();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Please sign in to continue." },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "A valid document ID is required." },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        const result = await db.collection(COLLECTION_NAME).deleteOne({
            _id: new ObjectId(id),
            userId,
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Document not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Document deleted successfully.",
        });
    } catch (error) {
        console.error("DELETE document error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to delete document." },
            { status: 500 }
        );
    }
}
