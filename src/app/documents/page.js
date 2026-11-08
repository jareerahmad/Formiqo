
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    FileText,
    Search,
    Trash2,
    RefreshCw,
    Plus,
    FolderOpen,
} from "lucide-react";
import Swal from "sweetalert2";
import { getDocuments, deleteDocument } from "@/lib/documents";

const DOCUMENT_TYPES = [
    "all",
    "invoice",
    "cv",
    "letter",
    "quotation",
    "receipt",
    "cover-letter",
    "business-proposal",
    "purchase-order",
    "expense-report",
    "payment-reminder",
    "meeting-minutes",
    "resignation-letter",
    "formal-email",
    "certificate",
];

function formatDate(date) {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Date unavailable";

    return parsed.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function readableType(type) {
    if (!type) return "Document";

    return type
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState("");

    const loadDocuments = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const result = await getDocuments();
            setDocuments(Array.isArray(result) ? result : []);
        } catch (err) {
            setError(err.message || "Unable to load your documents.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);


    async function handleDelete(id) {
        const confirmation = await Swal.fire({
            title: "Delete this document?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            reverseButtons: true,
        });

        if (!confirmation.isConfirmed) return;

        try {
            setDeletingId(id);

            Swal.fire({
                title: "Deleting document",
                text: "Please wait...",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading(),
            });

            await deleteDocument(id);

            Swal.close();

            await Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Your document has been deleted.",
                timer: 1600,
                showConfirmButton: false,
            });

            await loadDocuments();
        } catch (error) {
            Swal.close();

            await Swal.fire({
                icon: "error",
                title: "Delete failed",
                text: error.message || "Unable to delete this document.",
            });
        } finally {
            setDeletingId(null);
        }
    }


    const filteredDocuments = documents.filter((document) => {
        const title = String(document.title || "").toLowerCase();
        const type = String(document.type || "").toLowerCase();
        const query = search.toLowerCase();

        const matchesSearch =
            title.includes(query) || type.includes(query);

        const matchesType =
            filter === "all" || type === filter;

        return matchesSearch && matchesType;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <section className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="mb-2 text-sm font-semibold text-emerald-700">
                                YOUR WORKSPACE
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                My Documents
                            </h1>

                            <p className="mt-3 max-w-xl text-gray-600">
                                View and manage documents saved to your Formiqo workspace.
                            </p>
                        </div>

                        <Link
                            href="/#tools"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                        >
                            <Plus size={18} />
                            Create a document
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search documents..."
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                    </div>

                    <button
                        onClick={loadDocuments}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
                    >
                        <RefreshCw
                            size={17}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                <div className="mb-7 flex flex-wrap gap-2">
                    {DOCUMENT_TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === type
                                ? "bg-emerald-600 text-white"
                                : "border border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-700"
                                }`}
                        >
                            {type === "all" ? "All documents" : readableType(type)}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                        <button
                            onClick={loadDocuments}
                            className="ml-2 font-semibold underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                        <RefreshCw
                            size={28}
                            className="mx-auto animate-spin text-emerald-600"
                        />
                        <p className="mt-4 font-medium text-gray-700">
                            Loading your documents...
                        </p>
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                            {documents.length === 0 ? (
                                <FolderOpen size={27} />
                            ) : (
                                <FileText size={27} />
                            )}
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-gray-900">
                            {documents.length === 0
                                ? "No saved documents yet"
                                : "No matching documents"}
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            {documents.length === 0
                                ? "Once a document is saved through Formiqo, it will appear here."
                                : "Try a different search term or document type."}
                        </p>

                        <Link
                            href="/#tools"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                        >
                            <Plus size={18} />
                            Explore document tools
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="mb-4 text-sm text-gray-500">
                            {filteredDocuments.length}{" "}
                            {filteredDocuments.length === 1 ? "document" : "documents"}
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredDocuments.map((document) => (
                                <article
                                    key={document._id}
                                    className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                            <FileText size={23} />
                                        </div>

                                        <button
                                            onClick={() => handleDelete(document._id)}
                                            disabled={deletingId === document._id}
                                            aria-label={`Delete ${document.title || "document"}`}
                                            title="Delete document"
                                            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <h2 className="mt-5 break-words text-lg font-bold text-gray-900">
                                        {document.title || "Untitled document"}
                                    </h2>

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                            {readableType(document.type)}
                                        </span>

                                        <span className="text-xs text-gray-500">
                                            {formatDate(document.createdAt)}
                                        </span>
                                    </div>

                                    <p className="mt-4 text-sm text-gray-500">
                                        Saved in your Formiqo workspace
                                    </p>

                                    <Link
                                        href={`/documents/${document._id}`}
                                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        <FileText size={17} />
                                        Open document
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
