
const API_URL = "/api/documents";

async function requestDocuments(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const result = await response.json().catch(() => ({}));

    if (response.status === 401) {
        throw new Error("Please sign in to access your documents.");
    }

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || `Request failed with status ${response.status}`
        );
    }

    return result;
}

export async function getDocuments() {
    const result = await requestDocuments(API_URL);
    return result.documents;
}

export async function getDocumentById(id) {
    if (!id) {
        throw new Error("A document ID is required.");
    }

    const result = await requestDocuments(
        `${API_URL}?id=${encodeURIComponent(id)}`
    );

    return result.document;
}

export async function saveDocument({ title, type, data }) {
    if (!title?.trim() || !type?.trim() || !data) {
        throw new Error("Title, document type, and data are required.");
    }

    const result = await requestDocuments(API_URL, {
        method: "POST",
        body: JSON.stringify({ title, type, data }),
    });

    return result.document;
}

export async function updateDocument({ id, title, type, data }) {
    if (!id) {
        throw new Error("A document ID is required.");
    }

    const updates = { id };

    if (title !== undefined) updates.title = title;
    if (type !== undefined) updates.type = type;
    if (data !== undefined) updates.data = data;

    const result = await requestDocuments(API_URL, {
        method: "PATCH",
        body: JSON.stringify(updates),
    });

    return result.document;
}

export async function deleteDocument(id) {
    if (!id) {
        throw new Error("A document ID is required.");
    }

    return requestDocuments(
        `${API_URL}?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
    );
}
