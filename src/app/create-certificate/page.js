
"use client";

import { useState } from "react";
import { Download, Save, FileBadge } from "lucide-react";
import Swal from "sweetalert2";
import { saveDocument } from "@/lib/documents";
import { generateCertificatePdf } from "@/lib/generate-certificate-pdf";

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
    title: "Certificate",
    certificateTitle: "CERTIFICATE OF ACHIEVEMENT",
    certificateType: "Achievement",
    organizationName: "",
    organizationSubtitle: "",
    recipientName: "",
    description: "",
    programName: "",
    issueDate: new Date().toISOString().slice(0, 10),
    certificateNumber: "",
    issuerName: "",
    issuerTitle: "",
    secondSignatoryName: "",
    secondSignatoryTitle: "",
    footerText: "",
};

export default function CreateCertificatePage() {
    const [form, setForm] = useState(initialData);
    const [saving, setSaving] = useState(false);

    const update = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleDownload = () => {
        if (!form.organizationName.trim() || !form.recipientName.trim()) {
            Swal.fire(
                "Missing information",
                "Please enter the organization name and recipient name.",
                "warning"
            );
            return;
        }

        generateCertificatePdf(form);
    };

    const handleSave = async () => {
        if (
            !form.organizationName.trim() ||
            !form.recipientName.trim() ||
            !form.certificateTitle.trim()
        ) {
            Swal.fire(
                "Missing information",
                "Please complete the organization, recipient, and certificate title.",
                "warning"
            );
            return;
        }

        setSaving(true);

        try {
            await saveDocument({
                title: `${form.certificateTitle} - ${form.recipientName}`,
                type: "certificate",
                data: form,
            });

            await Swal.fire(
                "Saved!",
                "Your certificate has been saved successfully.",
                "success"
            );
        } catch (error) {
            console.error("Save certificate error:", error);
            Swal.fire("Error", "Unable to save your certificate.", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-2 text-emerald-700">
                        <FileBadge size={20} />
                        <span className="text-sm font-semibold">Formiqo Document Tools</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Certificate Generator
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Create professional certificates for achievements, training,
                        internships, and participation.
                    </p>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className="space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Certificate Details
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Document Name"
                                        value={form.title}
                                        onChange={(e) => update("title", e.target.value)}
                                        placeholder="Certificate"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <Field
                                        label="Certificate Heading *"
                                        value={form.certificateTitle}
                                        onChange={(e) =>
                                            update("certificateTitle", e.target.value)
                                        }
                                        placeholder="CERTIFICATE OF ACHIEVEMENT"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Certificate Type
                                    </label>
                                    <select
                                        value={form.certificateType}
                                        onChange={(e) => {
                                            const type = e.target.value;
                                            update("certificateType", type);
                                            update(
                                                "certificateTitle",
                                                `CERTIFICATE OF ${type.toUpperCase()}`
                                            );
                                        }}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500"
                                    >
                                        <option>Achievement</option>
                                        <option>Completion</option>
                                        <option>Participation</option>
                                        <option>Appreciation</option>
                                        <option>Internship</option>
                                        <option>Training</option>
                                        <option>Excellence</option>
                                    </select>
                                </div>

                                <Field
                                    label="Certificate Number"
                                    value={form.certificateNumber}
                                    onChange={(e) =>
                                        update("certificateNumber", e.target.value)
                                    }
                                    placeholder="CERT-2026-001"
                                />

                                <Field
                                    label="Issue Date"
                                    type="date"
                                    value={form.issueDate}
                                    onChange={(e) => update("issueDate", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Organization Information
                            </h2>

                            <div className="space-y-4">
                                <Field
                                    label="Organization Name *"
                                    value={form.organizationName}
                                    onChange={(e) =>
                                        update("organizationName", e.target.value)
                                    }
                                    placeholder="Your organization or company"
                                />

                                <Field
                                    label="Organization Subtitle"
                                    value={form.organizationSubtitle}
                                    onChange={(e) =>
                                        update("organizationSubtitle", e.target.value)
                                    }
                                    placeholder="Your organization's tagline"
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Recipient Information
                            </h2>

                            <div className="space-y-4">
                                <Field
                                    label="Recipient Full Name *"
                                    value={form.recipientName}
                                    onChange={(e) => update("recipientName", e.target.value)}
                                    placeholder="Person receiving the certificate"
                                />

                                <Field
                                    label="Course / Program / Achievement"
                                    value={form.programName}
                                    onChange={(e) => update("programName", e.target.value)}
                                    placeholder="Full Stack Web Development"
                                />

                                <TextArea
                                    label="Certificate Description"
                                    value={form.description}
                                    onChange={(e) => update("description", e.target.value)}
                                    placeholder="Describe why this certificate is being awarded..."
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Signatories
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="First Signatory Name"
                                    value={form.issuerName}
                                    onChange={(e) => update("issuerName", e.target.value)}
                                    placeholder="Director name"
                                />

                                <Field
                                    label="First Signatory Title"
                                    value={form.issuerTitle}
                                    onChange={(e) => update("issuerTitle", e.target.value)}
                                    placeholder="Director"
                                />

                                <Field
                                    label="Second Signatory Name"
                                    value={form.secondSignatoryName}
                                    onChange={(e) =>
                                        update("secondSignatoryName", e.target.value)
                                    }
                                    placeholder="Manager name"
                                />

                                <Field
                                    label="Second Signatory Title"
                                    value={form.secondSignatoryTitle}
                                    onChange={(e) =>
                                        update("secondSignatoryTitle", e.target.value)
                                    }
                                    placeholder="Manager"
                                />

                                <div className="sm:col-span-2">
                                    <TextArea
                                        label="Footer Text"
                                        value={form.footerText}
                                        onChange={(e) => update("footerText", e.target.value)}
                                        placeholder="Optional verification or organization information..."
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-5 lg:sticky lg:top-6">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h2 className="font-semibold text-gray-900">Live Preview</h2>
                                <p className="mt-1 text-xs text-gray-500">
                                    Your certificate updates as you type.
                                </p>
                            </div>

                            <div className="overflow-x-auto p-3 sm:p-5">
                                <div className="mx-auto aspect-[1.414/1] min-w-[300px] max-w-full border-[5px] border-emerald-700 bg-[#fafcfa] p-2">
                                    <div className="flex h-full flex-col items-center justify-between border border-emerald-200 px-3 py-4 text-center sm:px-5 sm:py-6">
                                        <div className="w-full">
                                            <h3 className="break-words text-sm font-bold text-emerald-800 sm:text-lg">
                                                {form.organizationName || "Your Organization"}
                                            </h3>
                                            {form.organizationSubtitle && (
                                                <p className="mt-1 text-[9px] text-gray-500 sm:text-xs">
                                                    {form.organizationSubtitle}
                                                </p>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            <h2 className="break-words font-serif text-lg font-bold text-gray-800 sm:text-2xl">
                                                {form.certificateTitle || "CERTIFICATE"}
                                            </h2>
                                            <p className="mt-2 text-[8px] tracking-wider text-gray-500 sm:text-[10px]">
                                                THIS CERTIFICATE IS PROUDLY PRESENTED TO
                                            </p>
                                            <h3 className="mt-3 break-words font-serif text-lg font-bold text-emerald-700 sm:text-2xl">
                                                {form.recipientName || "Recipient Name"}
                                            </h3>
                                            <div className="mx-auto mt-2 h-0.5 w-2/3 bg-emerald-600" />
                                            <p className="mx-auto mt-3 max-w-sm whitespace-pre-wrap break-words text-[9px] leading-4 text-gray-600 sm:text-xs">
                                                {form.description ||
                                                    "In recognition of successful completion and dedication."}
                                            </p>
                                            {form.programName && (
                                                <p className="mt-2 break-words text-xs font-bold text-gray-800 sm:text-sm">
                                                    {form.programName}
                                                </p>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            <div className="flex items-end justify-between gap-2 text-left text-[8px] text-gray-500 sm:text-[10px]">
                                                <p className="break-words">
                                                    Date: {form.issueDate || "—"}
                                                </p>
                                                <p className="break-all text-right">
                                                    ID: {form.certificateNumber || "—"}
                                                </p>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                                                <div className="border-t border-gray-400 pt-1">
                                                    <p className="break-words text-[8px] font-bold text-gray-800 sm:text-[10px]">
                                                        {form.issuerName || "Authorized Signatory"}
                                                    </p>
                                                    <p className="text-[7px] text-gray-500 sm:text-[9px]">
                                                        {form.issuerTitle || "Signatory"}
                                                    </p>
                                                </div>

                                                <div className="border-t border-gray-400 pt-1">
                                                    <p className="break-words text-[8px] font-bold text-gray-800 sm:text-[10px]">
                                                        {form.secondSignatoryName ||
                                                            "Organization Representative"}
                                                    </p>
                                                    <p className="text-[7px] text-gray-500 sm:text-[9px]">
                                                        {form.secondSignatoryTitle || "Representative"}
                                                    </p>
                                                </div>
                                            </div>

                                            {form.footerText && (
                                                <p className="mt-2 break-words text-[7px] text-gray-400 sm:text-[9px]">
                                                    {form.footerText}
                                                </p>
                                            )}
                                        </div>
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
                                {saving ? "Saving..." : "Save Certificate"}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
