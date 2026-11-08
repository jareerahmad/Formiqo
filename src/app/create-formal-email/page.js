
"use client";

import { useState } from "react";
import { Download, Save, FileText } from "lucide-react";
import Swal from "sweetalert2";
import { saveDocument } from "@/lib/documents";
import { generateFormalEmailPdf } from "@/lib/generate-formal-email-pdf";

function Field({ label, value, onChange, type = "text", placeholder = "" }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
        </div>
    );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
            </label>
            <textarea
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
        </div>
    );
}

const initialData = {
    title: "Formal Email",
    date: new Date().toISOString().slice(0, 10),
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    jobTitle: "",
    companyName: "",
    recipientName: "",
    recipientEmail: "",
    department: "",
    cc: "",
    emailType: "General Business Email",
    subject: "",
    salutation: "",
    greeting: "",
    body: "",
    additionalMessage: "",
    closing: "Best regards,",
};

export default function CreateFormalEmailPage() {
    const [form, setForm] = useState(initialData);
    const [saving, setSaving] = useState(false);

    const update = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleDownload = () => {
        if (
            !form.senderName.trim() ||
            !form.recipientName.trim() ||
            !form.subject.trim() ||
            !form.body.trim()
        ) {
            Swal.fire(
                "Missing information",
                "Please enter your name, recipient, subject, and email message.",
                "warning"
            );
            return;
        }

        generateFormalEmailPdf(form);
    };

    const handleSave = async () => {
        if (
            !form.senderName.trim() ||
            !form.recipientName.trim() ||
            !form.subject.trim() ||
            !form.body.trim()
        ) {
            Swal.fire(
                "Missing information",
                "Please complete your name, recipient, subject, and message.",
                "warning"
            );
            return;
        }

        setSaving(true);

        try {
            await saveDocument({
                title: form.subject.trim(),
                type: "formal-email",
                data: form,
            });

            await Swal.fire(
                "Saved!",
                "Your formal email has been saved successfully.",
                "success"
            );
        } catch (error) {
            console.error("Save formal email error:", error);
            Swal.fire("Error", "Unable to save your formal email.", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-2 text-emerald-700">
                        <FileText size={20} />
                        <span className="text-sm font-semibold">Formiqo Document Tools</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Formal Email Generator
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Prepare professional business emails with a clean, organized layout.
                    </p>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className="space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Email Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Document Title"
                                        value={form.title}
                                        onChange={(e) => update("title", e.target.value)}
                                        placeholder="Formal Email"
                                    />
                                </div>

                                <Field
                                    label="Email Date"
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => update("date", e.target.value)}
                                />

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Email Type
                                    </label>
                                    <select
                                        value={form.emailType}
                                        onChange={(e) => update("emailType", e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500"
                                    >
                                        <option>General Business Email</option>
                                        <option>Job Application</option>
                                        <option>Meeting Request</option>
                                        <option>Follow-up Email</option>
                                        <option>Leave Request</option>
                                        <option>Complaint Email</option>
                                        <option>Thank You Email</option>
                                        <option>Business Inquiry</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <Field
                                    label="Subject *"
                                    value={form.subject}
                                    onChange={(e) => update("subject", e.target.value)}
                                    placeholder="Enter email subject"
                                />

                                <Field
                                    label="Recipient Name *"
                                    value={form.recipientName}
                                    onChange={(e) => update("recipientName", e.target.value)}
                                    placeholder="Recipient's name"
                                />

                                <Field
                                    label="Recipient Email"
                                    type="email"
                                    value={form.recipientEmail}
                                    onChange={(e) => update("recipientEmail", e.target.value)}
                                    placeholder="recipient@example.com"
                                />

                                <Field
                                    label="CC"
                                    value={form.cc}
                                    onChange={(e) => update("cc", e.target.value)}
                                    placeholder="Optional CC email addresses"
                                />

                                <Field
                                    label="Department"
                                    value={form.department}
                                    onChange={(e) => update("department", e.target.value)}
                                    placeholder="e.g. Human Resources"
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Sender Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Your Full Name *"
                                    value={form.senderName}
                                    onChange={(e) => update("senderName", e.target.value)}
                                    placeholder="Your name"
                                />

                                <Field
                                    label="Your Email"
                                    type="email"
                                    value={form.senderEmail}
                                    onChange={(e) => update("senderEmail", e.target.value)}
                                    placeholder="you@example.com"
                                />

                                <Field
                                    label="Job Title"
                                    value={form.jobTitle}
                                    onChange={(e) => update("jobTitle", e.target.value)}
                                    placeholder="Your position"
                                />

                                <Field
                                    label="Company Name"
                                    value={form.companyName}
                                    onChange={(e) => update("companyName", e.target.value)}
                                    placeholder="Company name"
                                />

                                <div className="sm:col-span-2">
                                    <Field
                                        label="Phone Number"
                                        value={form.senderPhone}
                                        onChange={(e) => update("senderPhone", e.target.value)}
                                        placeholder="+92 300 0000000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Compose Email
                            </h2>

                            <div className="space-y-4">
                                <Field
                                    label="Salutation"
                                    value={form.salutation}
                                    onChange={(e) => update("salutation", e.target.value)}
                                    placeholder="e.g. Mr. Ahmed / Hiring Manager"
                                />

                                <TextArea
                                    label="Greeting"
                                    value={form.greeting}
                                    onChange={(e) => update("greeting", e.target.value)}
                                    placeholder="I hope this email finds you well."
                                    rows={2}
                                />

                                <TextArea
                                    label="Main Message *"
                                    value={form.body}
                                    onChange={(e) => update("body", e.target.value)}
                                    placeholder="Write your main email message here..."
                                    rows={7}
                                />

                                <TextArea
                                    label="Additional Message"
                                    value={form.additionalMessage}
                                    onChange={(e) => update("additionalMessage", e.target.value)}
                                    placeholder="Add any additional information..."
                                    rows={3}
                                />

                                <Field
                                    label="Closing Phrase"
                                    value={form.closing}
                                    onChange={(e) => update("closing", e.target.value)}
                                    placeholder="Best regards,"
                                />
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-5 lg:sticky lg:top-6">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h2 className="font-semibold text-gray-900">Live Preview</h2>
                                <p className="mt-1 text-xs text-gray-500">
                                    Your email updates as you type.
                                </p>
                            </div>

                            <div className="max-h-[750px] overflow-y-auto p-5">
                                <div className="space-y-5 text-sm text-gray-700">
                                    <div className="border-b-4 border-emerald-600 pb-4">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {form.title || "Formal Email"}
                                        </h2>
                                        <p className="mt-2 text-xs text-gray-500">
                                            {form.emailType} · {form.date || "Date"}
                                        </p>
                                    </div>

                                    <div className="space-y-2 rounded-lg bg-gray-50 p-3 text-xs">
                                        <p>
                                            <span className="font-semibold text-gray-900">From:</span>{" "}
                                            {form.senderName || "Your Name"}
                                            {form.senderEmail && ` <${form.senderEmail}>`}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-gray-900">To:</span>{" "}
                                            {form.recipientName || "Recipient"}
                                            {form.recipientEmail && ` <${form.recipientEmail}>`}
                                        </p>
                                        {form.cc && (
                                            <p>
                                                <span className="font-semibold text-gray-900">CC:</span>{" "}
                                                {form.cc}
                                            </p>
                                        )}
                                        <p>
                                            <span className="font-semibold text-gray-900">
                                                Subject:
                                            </span>{" "}
                                            {form.subject || "Email subject"}
                                        </p>
                                    </div>

                                    <div className="space-y-4 leading-6">
                                        <p>
                                            Dear {form.salutation || form.recipientName || "Recipient"},
                                        </p>

                                        {form.greeting && (
                                            <p className="whitespace-pre-wrap">{form.greeting}</p>
                                        )}

                                        <p className="whitespace-pre-wrap">
                                            {form.body || "Your email message will appear here..."}
                                        </p>

                                        {form.additionalMessage && (
                                            <p className="whitespace-pre-wrap">
                                                {form.additionalMessage}
                                            </p>
                                        )}

                                        <p>{form.closing || "Best regards,"}</p>

                                        <div className="border-t border-gray-100 pt-3">
                                            <p className="font-bold text-gray-900">
                                                {form.senderName || "Your Name"}
                                            </p>
                                            {form.jobTitle && <p>{form.jobTitle}</p>}
                                            {form.companyName && <p>{form.companyName}</p>}
                                            {form.senderPhone && <p>{form.senderPhone}</p>}
                                        </div>
                                    </div>

                                    <p className="border-t border-gray-100 pt-3 text-center text-xs text-gray-400">
                                        Generated with Formiqo
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <button
                                type="button"
                                onClick={handleDownload}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 px-4 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
                            >
                                <Download size={18} />
                                Download PDF
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={18} />
                                {saving ? "Saving..." : "Save Formal Email"}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
