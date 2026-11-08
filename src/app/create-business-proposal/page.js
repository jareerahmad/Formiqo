
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Download,
    Save,
    FileText,
    Building2,
} from "lucide-react";
import Swal from "sweetalert2";
import { saveDocument } from "@/lib/documents";
import { generateBusinessProposalPdf } from "@/lib/generate-business-proposal-pdf";

const initialProposal = {
    title: "Business Proposal",
    subtitle: "",
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    clientName: "",
    date: new Date().toISOString().slice(0, 10),
    validUntil: "",
    executiveSummary: "",
    objectives: "",
    scopeOfWork: "",
    deliverables: "",
    timeline: "",
    pricing: "",
    terms: "",
    notes: "",
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

export default function CreateBusinessProposalPage() {
    const [proposal, setProposal] = useState(initialProposal);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const updateField = (field, value) => {
        setProposal((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const previewDate = useMemo(() => {
        if (!proposal.date) return "";
        return new Date(`${proposal.date}T00:00:00`).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "long", day: "numeric" }
        );
    }, [proposal.date]);

    const handleDownload = async () => {
        if (
            !proposal.title.trim() ||
            !proposal.businessName.trim() ||
            !proposal.clientName.trim() ||
            !proposal.executiveSummary.trim()
        ) {
            Swal.fire({
                icon: "warning",
                title: "Missing information",
                text: "Please enter the proposal title, your business name, client name, and executive summary.",
            });
            return;
        }

        try {
            setDownloading(true);
            await generateBusinessProposalPdf(proposal);

            Swal.fire({
                icon: "success",
                title: "PDF downloaded",
                text: "Your business proposal has been generated successfully.",
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
        if (
            !proposal.title.trim() ||
            !proposal.businessName.trim() ||
            !proposal.clientName.trim() ||
            !proposal.executiveSummary.trim()
        ) {
            Swal.fire({
                icon: "warning",
                title: "Missing information",
                text: "Please enter the proposal title, your business name, client name, and executive summary.",
            });
            return;
        }

        try {
            setSaving(true);

            await saveDocument({
                title: proposal.title.trim(),
                type: "business-proposal",
                data: { ...proposal },
            });

            await Swal.fire({
                icon: "success",
                title: "Proposal saved",
                text: "Your proposal is now available in My Documents.",
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

    const sections = [
        ["Executive Summary", proposal.executiveSummary],
        ["Project Objectives", proposal.objectives],
        ["Scope of Work", proposal.scopeOfWork],
        ["Deliverables", proposal.deliverables],
        ["Project Timeline", proposal.timeline],
        ["Investment & Pricing", proposal.pricing],
        ["Terms & Conditions", proposal.terms],
        ["Additional Notes", proposal.notes],
    ];

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
                            <Building2 size={20} />
                            <span className="text-sm font-semibold">Document Generator</span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Business Proposal Generator
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Prepare professional proposals for your clients and business partners.
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
                            {saving ? "Saving..." : "Save Proposal"}
                        </button>
                    </div>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-2">
                    {/* Form */}
                    <section className="space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 font-bold text-gray-900">
                                Proposal Details
                            </h2>

                            <div className="space-y-4">
                                <Field
                                    label="Proposal Title *"
                                    value={proposal.title}
                                    onChange={(v) => updateField("title", v)}
                                    placeholder="Website Development Proposal"
                                />

                                <Field
                                    label="Subtitle"
                                    value={proposal.subtitle}
                                    onChange={(v) => updateField("subtitle", v)}
                                    placeholder="A proposal for your next project"
                                />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field
                                        label="Proposal Date"
                                        value={proposal.date}
                                        onChange={(v) => updateField("date", v)}
                                        type="date"
                                    />

                                    <Field
                                        label="Valid Until"
                                        value={proposal.validUntil}
                                        onChange={(v) => updateField("validUntil", v)}
                                        type="date"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900">
                                        Your Business Information
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        Details of the proposal sender
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Business Name *"
                                    value={proposal.businessName}
                                    onChange={(v) => updateField("businessName", v)}
                                    placeholder="Your company name"
                                />

                                <Field
                                    label="Business Email"
                                    value={proposal.businessEmail}
                                    onChange={(v) => updateField("businessEmail", v)}
                                    placeholder="company@example.com"
                                    type="email"
                                />

                                <Field
                                    label="Phone Number"
                                    value={proposal.businessPhone}
                                    onChange={(v) => updateField("businessPhone", v)}
                                    placeholder="+92 300 1234567"
                                />

                                <Field
                                    label="Business Address"
                                    value={proposal.businessAddress}
                                    onChange={(v) => updateField("businessAddress", v)}
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 font-bold text-gray-900">
                                Client Information
                            </h2>

                            <Field
                                label="Client / Company Name *"
                                value={proposal.clientName}
                                onChange={(v) => updateField("clientName", v)}
                                placeholder="Client or company name"
                            />
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-2 font-bold text-gray-900">
                                Proposal Content
                            </h2>

                            <p className="mb-5 text-sm text-gray-500">
                                Add the details your client needs to understand the proposed project.
                            </p>

                            <div className="space-y-5">
                                <TextArea
                                    label="Executive Summary *"
                                    value={proposal.executiveSummary}
                                    onChange={(v) => updateField("executiveSummary", v)}
                                    placeholder="Introduce the project, the client's needs, and your proposed solution..."
                                    rows={5}
                                />

                                <TextArea
                                    label="Project Objectives"
                                    value={proposal.objectives}
                                    onChange={(v) => updateField("objectives", v)}
                                    placeholder="Describe the main goals and expected outcomes..."
                                />

                                <TextArea
                                    label="Scope of Work"
                                    value={proposal.scopeOfWork}
                                    onChange={(v) => updateField("scopeOfWork", v)}
                                    placeholder="Explain the work, services, and responsibilities included..."
                                />

                                <TextArea
                                    label="Deliverables"
                                    value={proposal.deliverables}
                                    onChange={(v) => updateField("deliverables", v)}
                                    placeholder="List the products, services, or results you will deliver..."
                                />

                                <TextArea
                                    label="Project Timeline"
                                    value={proposal.timeline}
                                    onChange={(v) => updateField("timeline", v)}
                                    placeholder="Describe project phases, milestones, and estimated completion dates..."
                                />

                                <TextArea
                                    label="Investment & Pricing"
                                    value={proposal.pricing}
                                    onChange={(v) => updateField("pricing", v)}
                                    placeholder="Describe your pricing, payment schedule, and any additional costs..."
                                />

                                <TextArea
                                    label="Terms & Conditions"
                                    value={proposal.terms}
                                    onChange={(v) => updateField("terms", v)}
                                    placeholder="Enter payment terms, revision policy, responsibilities, and conditions..."
                                />

                                <TextArea
                                    label="Additional Notes"
                                    value={proposal.notes}
                                    onChange={(v) => updateField("notes", v)}
                                    placeholder="Any other important information..."
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 font-bold text-gray-900">
                                Signature Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Your Name"
                                    value={proposal.signatureName}
                                    onChange={(v) => updateField("signatureName", v)}
                                    placeholder="Your full name"
                                />

                                <Field
                                    label="Your Position"
                                    value={proposal.signatureTitle}
                                    onChange={(v) => updateField("signatureTitle", v)}
                                    placeholder="e.g. Managing Director"
                                />
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
                                            {proposal.title || "Business Proposal"}
                                        </h2>

                                        {proposal.subtitle && (
                                            <p className="mt-2 text-sm text-gray-500">
                                                {proposal.subtitle}
                                            </p>
                                        )}
                                    </div>

                                    <div className="my-6 border-t border-gray-200" />

                                    <div className="space-y-2 text-sm text-gray-700">
                                        <p>
                                            <strong>Prepared by:</strong>{" "}
                                            {proposal.businessName || "Your Business"}
                                        </p>

                                        <p>
                                            <strong>Prepared for:</strong>{" "}
                                            {proposal.clientName || "Client Name"}
                                        </p>

                                        <p>
                                            <strong>Date:</strong> {previewDate || "Proposal Date"}
                                        </p>

                                        {proposal.validUntil && (
                                            <p>
                                                <strong>Valid until:</strong> {proposal.validUntil}
                                            </p>
                                        )}
                                    </div>

                                    {(proposal.businessEmail ||
                                        proposal.businessPhone ||
                                        proposal.businessAddress) && (
                                            <p className="mt-4 break-words text-xs leading-6 text-gray-500">
                                                {[
                                                    proposal.businessEmail,
                                                    proposal.businessPhone,
                                                    proposal.businessAddress,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" | ")}
                                            </p>
                                        )}

                                    <div className="mt-7 space-y-6">
                                        {sections.map(([heading, content], index) => (
                                            <div key={heading}>
                                                <h3 className="mb-2 text-sm font-bold text-emerald-700">
                                                    {index + 1}. {heading}
                                                </h3>

                                                <p className="whitespace-pre-wrap break-words text-justify text-sm leading-7 text-gray-700">
                                                    {content || `Your ${heading.toLowerCase()} will appear here...`}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {(proposal.signatureName || proposal.signatureTitle) && (
                                        <div className="mt-10 border-t border-gray-200 pt-5 text-sm">
                                            <p className="font-bold text-gray-900">
                                                {proposal.signatureName}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {proposal.signatureTitle}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-10 border-t border-gray-200 pt-4 text-xs text-gray-400">
                                        {proposal.businessName || "Business Proposal"}
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
