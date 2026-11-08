"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Download,
    Save,
    FileText,
    UserRound,
    Plus,
} from "lucide-react";
import Swal from "sweetalert2";
import { saveDocument } from "@/lib/documents";
import { generateCoverLetterPdf } from "@/lib/generate-cover-letter-pdf";

const initialLetter = {
    title: "Cover Letter",
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    date: new Date().toISOString().slice(0, 10),
    recipientName: "",
    recipientTitle: "",
    companyName: "",
    companyAddress: "",
    subject: "",
    greeting: "Dear Hiring Manager,",
    body: "",
    closing: "Sincerely,",
    signatureName: "",
    signatureTitle: "",
};


const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

function Field({ label, value, onChange, placeholder, type = "text" }) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className={inputClass}
            />
        </div>
    );
}

function TextArea({ label, value, onChange, placeholder, rows = 4 }) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                rows={rows}
                className={`${inputClass} resize-y`}
            />
        </div>
    );
}


export default function CreateCoverLetterPage() {
    const [letter, setLetter] = useState(initialLetter);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const updateField = (field, value) => {
        setLetter((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const previewDate = useMemo(() => {
        if (!letter.date) return "";
        return new Date(`${letter.date}T00:00:00`).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "long", day: "numeric" }
        );
    }, [letter.date]);

    const handleDownload = async () => {
        if (!letter.fullName.trim() || !letter.body.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Missing information",
                text: "Please enter your name and cover letter body before downloading.",
            });
            return;
        }

        try {
            setDownloading(true);
            await generateCoverLetterPdf(letter);

            Swal.fire({
                icon: "success",
                title: "PDF downloaded",
                text: "Your cover letter PDF has been generated successfully.",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Download failed",
                text: error.message || "Unable to generate your PDF.",
            });
        } finally {
            setDownloading(false);
        }
    };

    const handleSave = async () => {
        if (!letter.fullName.trim() || !letter.body.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Missing information",
                text: "Please enter your name and cover letter body before saving.",
            });
            return;
        }

        try {
            setSaving(true);

            await saveDocument({
                title: `${letter.fullName.trim()} - Cover Letter`,
                type: "cover-letter",
                data: { ...letter },
            });

            await Swal.fire({
                icon: "success",
                title: "Cover letter saved",
                text: "Your document is now available in My Documents.",
                confirmButtonColor: "#10b981",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Unable to save",
                text: error.message || "Something went wrong while saving.",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-emerald-600"
                >
                    <ArrowLeft size={17} />
                    Back to dashboard
                </Link>

                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-emerald-600">
                            <FileText size={20} />
                            <span className="text-sm font-semibold">Document Generator</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Cover Letter Generator
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Create a professional cover letter for your next job application.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleDownload}
                            disabled={downloading || saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Download size={17} />
                            {downloading ? "Generating..." : "Download PDF"}
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving || downloading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={17} />
                            {saving ? "Saving..." : "Save Document"}
                        </button>
                    </div>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-2">
                    {/* Form */}
                    <section className="space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                                    <UserRound size={20} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900">Your Information</h2>
                                    <p className="text-xs text-gray-500">Your contact details</p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Full Name *"
                                    value={letter.fullName}
                                    onChange={(v) => updateField("fullName", v)}
                                    placeholder="Your full name"
                                />
                                <Field
                                    label="Professional Title"
                                    value={letter.jobTitle}
                                    onChange={(v) => updateField("jobTitle", v)}
                                    placeholder="e.g. Frontend Developer"
                                />
                                <Field
                                    label="Email Address"
                                    value={letter.email}
                                    onChange={(v) => updateField("email", v)}
                                    placeholder="you@example.com"
                                    type="email"
                                />
                                <Field
                                    label="Phone Number"
                                    value={letter.phone}
                                    onChange={(v) => updateField("phone", v)}
                                    placeholder="+92 300 1234567"
                                />
                                <Field
                                    label="Location"
                                    value={letter.location}
                                    onChange={(v) => updateField("location", v)}
                                    placeholder="City, Country"
                                />
                                <Field
                                    label="Website / Portfolio"
                                    value={letter.website}
                                    onChange={(v) => updateField("website", v)}
                                    placeholder="www.example.com"
                                />
                                <Field
                                    label="Date"
                                    value={letter.date}
                                    onChange={(v) => updateField("date", v)}
                                    type="date"
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 font-bold text-gray-900">
                                Recipient Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Recipient Name"
                                    value={letter.recipientName}
                                    onChange={(v) => updateField("recipientName", v)}
                                    placeholder="Hiring manager's name"
                                />
                                <Field
                                    label="Recipient Position"
                                    value={letter.recipientTitle}
                                    onChange={(v) => updateField("recipientTitle", v)}
                                    placeholder="e.g. HR Manager"
                                />
                                <Field
                                    label="Company Name"
                                    value={letter.companyName}
                                    onChange={(v) => updateField("companyName", v)}
                                    placeholder="Company name"
                                />
                                <Field
                                    label="Company Address"
                                    value={letter.companyAddress}
                                    onChange={(v) => updateField("companyAddress", v)}
                                    placeholder="Company address"
                                />
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Subject"
                                        value={letter.subject}
                                        onChange={(v) => updateField("subject", v)}
                                        placeholder="Application for Frontend Developer Position"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Greeting"
                                        value={letter.greeting}
                                        onChange={(v) => updateField("greeting", v)}
                                        placeholder="Dear Hiring Manager,"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-2 font-bold text-gray-900">
                                Cover Letter Content
                            </h2>
                            <p className="mb-5 text-sm text-gray-500">
                                Write a personalized message explaining why you are suitable
                                for the position.
                            </p>

                            <TextArea
                                label="Letter Body *"
                                value={letter.body}
                                onChange={(v) => updateField("body", v)}
                                placeholder={`I am writing to express my interest in the position...

Explain your experience, skills, achievements, and why you would be a good fit for the company.

Thank you for considering my application.`}
                                rows={12}
                            />

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Closing"
                                    value={letter.closing}
                                    onChange={(v) => updateField("closing", v)}
                                    placeholder="Sincerely,"
                                />
                                <Field
                                    label="Signature Name"
                                    value={letter.signatureName}
                                    onChange={(v) => updateField("signatureName", v)}
                                    placeholder="Your full name"
                                />
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Signature Title (Optional)"
                                        value={letter.signatureTitle}
                                        onChange={(v) => updateField("signatureTitle", v)}
                                        placeholder="e.g. Frontend Developer"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Live Preview */}
                    <section className="lg:sticky lg:top-6">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                                <div>
                                    <h2 className="font-bold text-gray-900">Live Preview</h2>
                                    <p className="text-xs text-gray-500">
                                        Updates as you type
                                    </p>
                                </div>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    A4 Document
                                </span>
                            </div>

                            <div className="overflow-x-auto bg-gray-100 p-3 sm:p-5">
                                <div className="mx-auto min-h-[900px] w-full max-w-[595px] bg-white p-6 shadow-md sm:p-10">
                                    <div className="border-t-4 border-emerald-500 pt-6">
                                        <h2 className="break-words text-2xl font-bold text-gray-900">
                                            {letter.fullName || "Your Name"}
                                        </h2>

                                        {letter.jobTitle && (
                                            <p className="mt-1 text-sm text-gray-500">
                                                {letter.jobTitle}
                                            </p>
                                        )}

                                        <p className="mt-3 break-words text-xs leading-6 text-gray-500">
                                            {[
                                                letter.email,
                                                letter.phone,
                                                letter.location,
                                                letter.website,
                                            ]
                                                .filter(Boolean)
                                                .join("  |  ") || "Your contact information"}
                                        </p>
                                    </div>

                                    <div className="my-6 border-t border-gray-200" />

                                    <p className="text-sm text-gray-700">
                                        {previewDate || "Date"}
                                    </p>

                                    <div className="mt-6 space-y-1 text-sm text-gray-700">
                                        {letter.recipientName && <p>{letter.recipientName}</p>}
                                        {letter.recipientTitle && <p>{letter.recipientTitle}</p>}
                                        {letter.companyName && (
                                            <p className="font-semibold">{letter.companyName}</p>
                                        )}
                                        {letter.companyAddress && <p>{letter.companyAddress}</p>}
                                    </div>

                                    {letter.subject && (
                                        <p className="mt-6 break-words text-sm font-semibold text-gray-900">
                                            Subject: {letter.subject}
                                        </p>
                                    )}

                                    <p className="mt-6 text-sm text-gray-800">
                                        {letter.greeting || "Dear Hiring Manager,"}
                                    </p>

                                    <div className="mt-4 min-h-48 whitespace-pre-wrap break-words text-justify text-sm leading-7 text-gray-700">
                                        {letter.body || "Your cover letter content will appear here..."}
                                    </div>

                                    <div className="mt-8 space-y-2 text-sm text-gray-800">
                                        <p>{letter.closing || "Sincerely,"}</p>
                                        <p className="pt-4 font-bold">
                                            {letter.signatureName || letter.fullName || "Your Name"}
                                        </p>
                                        {letter.signatureTitle && (
                                            <p className="text-xs text-gray-500">
                                                {letter.signatureTitle}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mt-3 text-center text-xs text-gray-400">
                            Preview is for guidance. Download the PDF for the final document.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
