
"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Download,
    Save,
    FileText,
    LoaderCircle,
    CheckCircle2,
} from "lucide-react";
import { saveDocument } from "@/lib/documents";

export default function DocumentBuilder({
    title,
    description,
    type,
    fields,
}) {
    const initialValues = Object.fromEntries(
        fields.map((field) => [field.name, field.defaultValue || ""])
    );

    const [values, setValues] = useState(initialValues);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    function updateField(name, value) {
        setValues((current) => ({ ...current, [name]: value }));
        setMessage("");
        setError("");
    }

    function getDocumentText() {
        return [
            title,
            "=".repeat(Math.min(title.length, 45)),
            "",
            ...fields.map(
                (field) =>
                    `${field.label}:\n${values[field.name] || "—"}`
            ),
        ].join("\n\n");
    }

    async function downloadPDF() {
        setError("");
        setMessage("");

        try {
            const { default: jsPDF } = await import("jspdf");
            const pdf = new jsPDF();
            const margin = 18;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const usableWidth = pageWidth - margin * 2;

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(20);
            pdf.text("Formiqo", margin, 20);

            pdf.setDrawColor(16, 185, 129);
            pdf.line(margin, 25, pageWidth - margin, 25);

            pdf.setFontSize(16);
            pdf.text(title, margin, 37);

            let y = 48;

            for (const field of fields) {
                const label = field.label;
                const value = values[field.name] || "—";

                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(10);

                if (y > pageHeight - 25) {
                    pdf.addPage();
                    y = 20;
                }

                pdf.text(label, margin, y);
                y += 6;

                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(10);

                const lines = pdf.splitTextToSize(
                    String(value),
                    usableWidth
                );

                for (const line of lines) {
                    if (y > pageHeight - 18) {
                        pdf.addPage();
                        y = 20;
                    }

                    pdf.text(line, margin, y);
                    y += 5;
                }

                y += 6;
            }

            pdf.save(
                `${type || "formiqo-document"}.pdf`
            );

            setMessage("Your PDF has been downloaded.");
        } catch (err) {
            setError(err.message || "Could not generate the PDF.");
        }
    }

    async function handleSave() {
        setSaving(true);
        setMessage("");
        setError("");

        try {
            const documentTitle =
                values.documentTitle?.trim() ||
                values.fullName?.trim() ||
                values.companyName?.trim() ||
                values.subject?.trim() ||
                `${title} — ${new Date().toLocaleDateString()}`;

            await saveDocument({
                title: documentTitle,
                type,
                data: values,
            });

            setMessage("Document saved successfully.");
        } catch (err) {
            setError(
                err.message ||
                "Unable to save the document. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                    <Link
                        href="/#tools"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-emerald-700"
                    >
                        <ArrowLeft size={17} />
                        All document tools
                    </Link>

                    <div className="mt-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                <FileText size={24} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                    {title}
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                    <h2 className="text-lg font-bold text-gray-900">
                        Enter your information
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Complete the fields below, then download or save your document.
                    </p>

                    <div className="mt-6 space-y-5">
                        {fields.map((field) => (
                            <div key={field.name}>
                                <label
                                    htmlFor={field.name}
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    {field.label}
                                    {field.required && (
                                        <span className="ml-1 text-red-500">*</span>
                                    )}
                                </label>

                                {field.type === "textarea" ? (
                                    <textarea
                                        id={field.name}
                                        value={values[field.name]}
                                        onChange={(event) =>
                                            updateField(field.name, event.target.value)
                                        }
                                        placeholder={field.placeholder || ""}
                                        required={field.required || false}
                                        rows={field.rows || 4}
                                        className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    />
                                ) : field.type === "select" ? (
                                    <select
                                        id={field.name}
                                        value={values[field.name]}
                                        onChange={(event) =>
                                            updateField(field.name, event.target.value)
                                        }
                                        required={field.required || false}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    >
                                        <option value="">Select an option</option>
                                        {(field.options || []).map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        id={field.name}
                                        type={field.type || "text"}
                                        value={values[field.name]}
                                        onChange={(event) =>
                                            updateField(field.name, event.target.value)
                                        }
                                        placeholder={field.placeholder || ""}
                                        required={field.required || false}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {message && (
                        <div className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={downloadPDF}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            <Download size={18} />
                            Download PDF
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <LoaderCircle size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            {saving ? "Saving..." : "Save document"}
                        </button>
                    </div>
                </section>

                <aside className="self-start lg:sticky lg:top-6">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900">Document preview</h2>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Live preview
                        </span>
                    </div>

                    <div className="min-h-[500px] rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-9">
                        <div className="border-b-2 border-emerald-500 pb-4">
                            <p className="text-xl font-extrabold tracking-tight text-emerald-700">
                                Formiqo
                            </p>
                            <h3 className="mt-5 text-2xl font-bold text-gray-900">
                                {title}
                            </h3>
                        </div>

                        <div className="mt-6 space-y-5">
                            {fields.map((field) => (
                                <div key={field.name}>
                                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                                        {field.label}
                                    </p>
                                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">
                                        {values[field.name] || "Your information will appear here."}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 border-t border-gray-100 pt-4 text-xs text-gray-400">
                            Created with Formiqo
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
