
"use client";

import { useState } from "react";
import { Download, Save, FileText } from "lucide-react";
import Swal from "sweetalert2";
import { saveDocument } from "@/lib/documents";
import { generateResignationLetterPdf } from "@/lib/generate-resignation-letter-pdf";

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
    title: "Resignation Letter",
    employeeName: "",
    employeeAddress: "",
    employeeEmail: "",
    employeePhone: "",
    date: new Date().toISOString().slice(0, 10),
    managerName: "",
    companyName: "",
    companyAddress: "",
    jobTitle: "",
    lastWorkingDate: "",
    opening: "",
    reason: "",
    handover: "",
    appreciation: "",
    closing: "",
};

export default function CreateResignationLetterPage() {
    const [form, setForm] = useState(initialData);
    const [saving, setSaving] = useState(false);

    const update = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleDownload = () => {
        if (!form.employeeName.trim() || !form.companyName.trim()) {
            Swal.fire(
                "Missing information",
                "Please enter your name and company name.",
                "warning"
            );
            return;
        }

        generateResignationLetterPdf(form);
    };

    const handleSave = async () => {
        if (
            !form.employeeName.trim() ||
            !form.companyName.trim() ||
            !form.jobTitle.trim()
        ) {
            Swal.fire(
                "Missing information",
                "Please enter your name, company name, and job title.",
                "warning"
            );
            return;
        }

        setSaving(true);

        try {
            await saveDocument({
                title: `${form.title} - ${form.employeeName}`,
                type: "resignation-letter",
                data: form,
            });

            await Swal.fire(
                "Saved!",
                "Your resignation letter has been saved successfully.",
                "success"
            );
        } catch (error) {
            console.error("Save resignation letter error:", error);
            Swal.fire("Error", "Unable to save your resignation letter.", "error");
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
                        Resignation Letter Generator
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Prepare a professional resignation letter with a personalized message.
                    </p>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className="space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Employee Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Document Title"
                                        value={form.title}
                                        onChange={(e) => update("title", e.target.value)}
                                        placeholder="Resignation Letter"
                                    />
                                </div>

                                <Field
                                    label="Your Full Name *"
                                    value={form.employeeName}
                                    onChange={(e) => update("employeeName", e.target.value)}
                                    placeholder="Your full name"
                                />

                                <Field
                                    label="Job Title *"
                                    value={form.jobTitle}
                                    onChange={(e) => update("jobTitle", e.target.value)}
                                    placeholder="Software Developer"
                                />

                                <div className="sm:col-span-2">
                                    <Field
                                        label="Your Address"
                                        value={form.employeeAddress}
                                        onChange={(e) => update("employeeAddress", e.target.value)}
                                        placeholder="Your address"
                                    />
                                </div>

                                <Field
                                    label="Email Address"
                                    type="email"
                                    value={form.employeeEmail}
                                    onChange={(e) => update("employeeEmail", e.target.value)}
                                    placeholder="you@example.com"
                                />

                                <Field
                                    label="Phone Number"
                                    value={form.employeePhone}
                                    onChange={(e) => update("employeePhone", e.target.value)}
                                    placeholder="+92 300 0000000"
                                />

                                <Field
                                    label="Letter Date"
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => update("date", e.target.value)}
                                />

                                <Field
                                    label="Last Working Day"
                                    type="date"
                                    value={form.lastWorkingDate}
                                    onChange={(e) => update("lastWorkingDate", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Company Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Company Name *"
                                    value={form.companyName}
                                    onChange={(e) => update("companyName", e.target.value)}
                                    placeholder="Company name"
                                />

                                <Field
                                    label="Manager / Recipient Name"
                                    value={form.managerName}
                                    onChange={(e) => update("managerName", e.target.value)}
                                    placeholder="Manager name"
                                />

                                <div className="sm:col-span-2">
                                    <Field
                                        label="Company Address"
                                        value={form.companyAddress}
                                        onChange={(e) => update("companyAddress", e.target.value)}
                                        placeholder="Company address"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Letter Content
                            </h2>

                            <div className="space-y-4">
                                <TextArea
                                    label="Opening Paragraph"
                                    value={form.opening}
                                    onChange={(e) => update("opening", e.target.value)}
                                    placeholder="Please accept this letter as formal notice of my resignation..."
                                />

                                <TextArea
                                    label="Reason for Resignation"
                                    value={form.reason}
                                    onChange={(e) => update("reason", e.target.value)}
                                    placeholder="Optionally explain your reason for leaving..."
                                />

                                <TextArea
                                    label="Handover / Transition Plan"
                                    value={form.handover}
                                    onChange={(e) => update("handover", e.target.value)}
                                    placeholder="I will ensure a smooth transition by..."
                                />

                                <TextArea
                                    label="Appreciation Message"
                                    value={form.appreciation}
                                    onChange={(e) => update("appreciation", e.target.value)}
                                    placeholder="I appreciate the opportunities and experience..."
                                />

                                <TextArea
                                    label="Closing Paragraph"
                                    value={form.closing}
                                    onChange={(e) => update("closing", e.target.value)}
                                    placeholder="Thank you for your understanding..."
                                />
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-5 lg:sticky lg:top-6">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h2 className="font-semibold text-gray-900">Live Preview</h2>
                                <p className="mt-1 text-xs text-gray-500">
                                    Your letter updates as you type.
                                </p>
                            </div>

                            <div className="max-h-[750px] overflow-y-auto p-6">
                                <div className="mx-auto max-w-md space-y-4 text-sm leading-6 text-gray-700">
                                    <div className="border-b-4 border-emerald-600 pb-4">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {form.title || "Resignation Letter"}
                                        </h2>
                                    </div>

                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {form.employeeName || "Your Name"}
                                        </p>
                                        {form.employeeAddress && <p>{form.employeeAddress}</p>}
                                        {form.employeeEmail && <p>{form.employeeEmail}</p>}
                                        {form.employeePhone && <p>{form.employeePhone}</p>}
                                    </div>

                                    <p>{form.date || "Letter Date"}</p>

                                    <div>
                                        {form.managerName && <p>{form.managerName}</p>}
                                        <p className="font-semibold">
                                            {form.companyName || "Company Name"}
                                        </p>
                                        {form.companyAddress && <p>{form.companyAddress}</p>}
                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        Subject: Resignation from Position
                                    </p>

                                    <p>Dear {form.managerName || "Manager"},</p>

                                    <p className="whitespace-pre-wrap">
                                        {form.opening ||
                                            `Please accept this letter as formal notice of my resignation from my position as ${form.jobTitle || "[Job Title]"} at ${form.companyName || "[Company Name]"}.`}
                                    </p>

                                    {form.lastWorkingDate && (
                                        <p>
                                            My intended last working day will be {form.lastWorkingDate}.
                                        </p>
                                    )}

                                    {form.reason && (
                                        <p className="whitespace-pre-wrap">{form.reason}</p>
                                    )}

                                    {form.handover && (
                                        <p className="whitespace-pre-wrap">{form.handover}</p>
                                    )}

                                    {form.appreciation && (
                                        <p className="whitespace-pre-wrap">{form.appreciation}</p>
                                    )}

                                    <p className="whitespace-pre-wrap">
                                        {form.closing ||
                                            "Thank you for the opportunities and experience I have gained during my time with the organization. I wish the company continued success."}
                                    </p>

                                    <div className="pt-2">
                                        <p>Sincerely,</p>
                                        <p className="mt-3 font-bold text-gray-900">
                                            {form.employeeName || "Your Name"}
                                        </p>
                                        <p>{form.jobTitle}</p>
                                    </div>
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
                                {saving ? "Saving..." : "Save Resignation Letter"}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
