
"use client";

import { useState } from "react";
import {
    Download,
    Save,
    Mail,
    FileText,
    UserRound,
    CalendarDays,
} from "lucide-react";
import Swal from "sweetalert2";
import { saveDocument } from "@/lib/documents";
import { generateLetterPdf } from "@/lib/generate-letter-pdf";

const initialLetter = {
    title: "Formal Letter",
    senderName: "",
    senderAddress: "",
    senderEmail: "",
    senderPhone: "",
    date: new Date().toISOString().slice(0, 10),
    recipientName: "",
    recipientAddress: "",
    salutation: "Dear Sir/Madam,",
    subject: "",
    body: "",
    closing: "Sincerely,",
    signatureName: "",
    signatureTitle: "",
};

const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

function Field({ label, name, value, onChange, placeholder, type = "text" }) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-semibold text-gray-700"
            >
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={(event) => onChange(name, event.target.value)}
                placeholder={placeholder}
                className={inputClass}
            />
        </div>
    );
}

export default function CreateLetterPage() {
    const [letter, setLetter] = useState(initialLetter);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);

    function updateField(name, value) {
        setLetter((current) => ({ ...current, [name]: value }));
    }

    async function downloadPDF() {
        setDownloading(true);

        try {
            await generateLetterPdf(letter);

            await Swal.fire({
                icon: "success",
                title: "Letter downloaded!",
                text: "Your PDF is ready.",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Download failed",
                text: error.message || "Unable to generate your letter PDF.",
            });
        } finally {
            setDownloading(false);
        }
    }

    async function handleSave() {
        if (!letter.title.trim() || !letter.body.trim()) {
            await Swal.fire({
                icon: "warning",
                title: "Letter details required",
                text: "Please enter a document title and letter content before saving.",
                confirmButtonColor: "#059669",
            });
            return;
        }

        setSaving(true);

        Swal.fire({
            title: "Saving your letter",
            text: "Please wait...",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            await saveDocument({
                title: letter.title.trim(),
                type: "letter",
                data: { ...letter },
            });

            await Swal.fire({
                icon: "success",
                title: "Letter saved!",
                text: "Your letter is now in My Documents.",
                confirmButtonColor: "#059669",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Unable to save",
                text: error.message || "Please try again.",
                confirmButtonColor: "#059669",
            });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                        <Mail size={16} />
                        Letter Generator
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Write your next letter with confidence.
                    </h1>

                    <p className="mt-3 max-w-2xl text-gray-600">
                        Prepare a professional letter, preview its layout,
                        then download a PDF or save it to your workspace.
                    </p>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                        <h2 className="mb-6 text-xl font-bold text-gray-900">
                            Letter details
                        </h2>

                        <div className="space-y-6">
                            <Field
                                label="Document title"
                                name="title"
                                value={letter.title}
                                onChange={updateField}
                                placeholder="Formal Letter"
                            />

                            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                                <UserRound size={18} className="text-emerald-600" />
                                <h3 className="font-semibold text-gray-900">
                                    Sender information
                                </h3>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field
                                    label="Your name"
                                    name="senderName"
                                    value={letter.senderName}
                                    onChange={updateField}
                                    placeholder="Your full name"
                                />
                                <Field
                                    label="Email"
                                    name="senderEmail"
                                    value={letter.senderEmail}
                                    onChange={updateField}
                                    placeholder="you@example.com"
                                    type="email"
                                />
                                <Field
                                    label="Phone"
                                    name="senderPhone"
                                    value={letter.senderPhone}
                                    onChange={updateField}
                                    placeholder="+1 234 567 890"
                                />
                                <Field
                                    label="Date"
                                    name="date"
                                    value={letter.date}
                                    onChange={updateField}
                                    type="date"
                                />
                            </div>

                            <Field
                                label="Your address"
                                name="senderAddress"
                                value={letter.senderAddress}
                                onChange={updateField}
                                placeholder="Street, city, country"
                            />

                            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                                <Mail size={18} className="text-emerald-600" />
                                <h3 className="font-semibold text-gray-900">
                                    Recipient information
                                </h3>
                            </div>

                            <Field
                                label="Recipient name"
                                name="recipientName"
                                value={letter.recipientName}
                                onChange={updateField}
                                placeholder="Recipient's full name"
                            />

                            <Field
                                label="Recipient address"
                                name="recipientAddress"
                                value={letter.recipientAddress}
                                onChange={updateField}
                                placeholder="Recipient's address"
                            />

                            <Field
                                label="Greeting"
                                name="salutation"
                                value={letter.salutation}
                                onChange={updateField}
                                placeholder="Dear Sir/Madam,"
                            />

                            <div>
                                <label
                                    htmlFor="subject"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Subject (optional)
                                </label>
                                <input
                                    id="subject"
                                    value={letter.subject}
                                    onChange={(event) =>
                                        updateField("subject", event.target.value)
                                    }
                                    placeholder="Subject of the letter"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="body"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Letter content
                                </label>
                                <textarea
                                    id="body"
                                    rows={9}
                                    value={letter.body}
                                    onChange={(event) =>
                                        updateField("body", event.target.value)
                                    }
                                    placeholder={"Write your letter here.\n\nUse a blank line to separate paragraphs."}
                                    className={`${inputClass} resize-y`}
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    Leave a blank line between paragraphs.
                                </p>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field
                                    label="Closing"
                                    name="closing"
                                    value={letter.closing}
                                    onChange={updateField}
                                    placeholder="Sincerely,"
                                />
                                <Field
                                    label="Signature name"
                                    name="signatureName"
                                    value={letter.signatureName}
                                    onChange={updateField}
                                    placeholder="Your name"
                                />
                            </div>

                            <Field
                                label="Signature title (optional)"
                                name="signatureTitle"
                                value={letter.signatureTitle}
                                onChange={updateField}
                                placeholder="e.g. Project Manager"
                            />
                        </div>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={downloadPDF}
                                disabled={downloading}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-600 px-5 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-60"
                            >
                                <Download size={18} />
                                {downloading ? "Generating..." : "Download PDF"}
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                            >
                                <Save size={18} />
                                {saving ? "Saving..." : "Save Letter"}
                            </button>
                        </div>
                    </section>

                    <section className="lg:sticky lg:top-6">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">
                                Live preview
                            </h2>
                            <span className="text-xs text-gray-500">
                                Updates as you type
                            </span>
                        </div>

                        <div className="min-h-[650px] rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-9">
                            <div className="border-b border-emerald-500 pb-4">
                                <h3 className="text-2xl font-bold text-emerald-700">
                                    Formiqo
                                </h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    PROFESSIONAL DOCUMENTS
                                </p>
                            </div>

                            <h4 className="mt-7 text-xl font-bold text-gray-900">
                                {letter.title || "Formal Letter"}
                            </h4>

                            {(letter.senderName ||
                                letter.senderAddress ||
                                letter.senderEmail ||
                                letter.senderPhone) && (
                                    <div className="mt-5 space-y-1 text-sm text-gray-600">
                                        {letter.senderName && (
                                            <p className="font-semibold text-gray-900">
                                                {letter.senderName}
                                            </p>
                                        )}
                                        {letter.senderAddress && <p>{letter.senderAddress}</p>}
                                        {letter.senderEmail && <p>{letter.senderEmail}</p>}
                                        {letter.senderPhone && <p>{letter.senderPhone}</p>}
                                    </div>
                                )}

                            {letter.date && (
                                <p className="mt-5 text-sm text-gray-600">
                                    {new Date(`${letter.date}T12:00:00`).toLocaleDateString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )}
                                </p>
                            )}

                            {(letter.recipientName || letter.recipientAddress) && (
                                <div className="mt-5 text-sm text-gray-700">
                                    <p className="font-semibold text-gray-900">To:</p>
                                    {letter.recipientName && <p>{letter.recipientName}</p>}
                                    {letter.recipientAddress && <p>{letter.recipientAddress}</p>}
                                </div>
                            )}

                            {letter.subject && (
                                <p className="mt-5 text-sm font-semibold text-gray-900">
                                    Subject: {letter.subject}
                                </p>
                            )}

                            <p className="mt-6 text-sm text-gray-800">
                                {letter.salutation || "Dear Sir/Madam,"}
                            </p>

                            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">
                                {letter.body || "Your letter content will appear here as you type."}
                            </p>

                            <div className="mt-7 text-sm text-gray-700">
                                <p>{letter.closing || "Sincerely,"}</p>
                                <p className="mt-5 font-semibold text-gray-900">
                                    {letter.signatureName || letter.senderName || "Your name"}
                                </p>
                                {letter.signatureTitle && (
                                    <p className="mt-1 text-gray-500">
                                        {letter.signatureTitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
