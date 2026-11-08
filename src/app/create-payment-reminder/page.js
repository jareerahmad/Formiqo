
"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Download,
    Save,
    BellRing,
    FileText,
} from "lucide-react";
import Swal from "sweetalert2";
import { saveDocument } from "@/lib/documents";
import { generatePaymentReminderPdf } from "@/lib/generate-payment-reminder-pdf";

const initialReminder = {
    title: "Payment Reminder",
    reminderNumber: `REM-${Date.now().toString().slice(-6)}`,
    reminderDate: new Date().toISOString().slice(0, 10),
    businessName: "",
    businessAddress: "",
    businessEmail: "",
    customerName: "",
    customerAddress: "",
    customerEmail: "",
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    paymentTerms: "Due on receipt",
    paymentStatus: "Overdue",
    amountDue: "",
    currency: "USD",
    subject: "Friendly Reminder: Outstanding Payment",
    message:
        "This is a friendly reminder that the payment for the invoice mentioned above is still outstanding. Kindly arrange payment at your earliest convenience.",
    paymentInstructions: "",
    signatureName: "",
    signatureTitle: "",
};

const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const labelClass = "mb-2 block text-sm font-medium text-gray-700";

function Field({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    min,
    step,
}) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <input
                type={type}
                value={value ?? ""}
                min={min}
                step={step}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={inputClass}
            />
        </div>
    );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <textarea
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className={`${inputClass} resize-y`}
            />
        </div>
    );
}

export default function CreatePaymentReminderPage() {
    const [reminder, setReminder] = useState(initialReminder);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const updateField = (field, value) => {
        setReminder((prev) => ({ ...prev, [field]: value }));
    };

    const formatMoney = (amount) =>
        `${reminder.currency} ${Number(amount || 0).toFixed(2)}`;

    const handleDownload = async () => {
        try {
            setDownloading(true);
            await generatePaymentReminderPdf(reminder);

            await Swal.fire({
                icon: "success",
                title: "PDF downloaded",
                text: "Your payment reminder is ready.",
                confirmButtonColor: "#059669",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Download failed",
                text: error.message || "Unable to generate the PDF.",
                confirmButtonColor: "#059669",
            });
        } finally {
            setDownloading(false);
        }
    };

    const handleSave = async () => {
        if (
            !reminder.title.trim() ||
            !reminder.businessName.trim() ||
            !reminder.customerName.trim()
        ) {
            return Swal.fire({
                icon: "warning",
                title: "Missing information",
                text: "Please enter the title, business name, and customer name.",
                confirmButtonColor: "#059669",
            });
        }

        if (!reminder.amountDue || Number(reminder.amountDue) < 0) {
            return Swal.fire({
                icon: "warning",
                title: "Invalid amount",
                text: "Please enter a valid outstanding payment amount.",
                confirmButtonColor: "#059669",
            });
        }

        try {
            setSaving(true);

            await saveDocument({
                title: reminder.title.trim(),
                type: "payment-reminder",
                data: { ...reminder },
            });

            await Swal.fire({
                icon: "success",
                title: "Reminder saved",
                text: "You can find it in My Documents.",
                confirmButtonColor: "#059669",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Save failed",
                text: error.message || "Unable to save your payment reminder.",
                confirmButtonColor: "#059669",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-7xl">
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-emerald-600"
                >
                    <ArrowLeft size={17} />
                    Back to Dashboard
                </Link>

                <div className="mb-8 flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                        <BellRing size={25} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Payment Reminder Generator
                        </h1>
                        <p className="text-sm text-gray-500">
                            Create professional reminders for outstanding customer payments.
                        </p>
                    </div>
                </div>

                <div className="grid items-start gap-7 lg:grid-cols-2">
                    <section className="space-y-6">
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Reminder Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Document Title"
                                    value={reminder.title}
                                    onChange={(v) => updateField("title", v)}
                                />
                                <Field
                                    label="Reminder Number"
                                    value={reminder.reminderNumber}
                                    onChange={(v) => updateField("reminderNumber", v)}
                                />
                                <Field
                                    label="Reminder Date"
                                    type="date"
                                    value={reminder.reminderDate}
                                    onChange={(v) => updateField("reminderDate", v)}
                                />
                                <Field
                                    label="Invoice Number"
                                    value={reminder.invoiceNumber}
                                    onChange={(v) => updateField("invoiceNumber", v)}
                                />
                                <Field
                                    label="Invoice Date"
                                    type="date"
                                    value={reminder.invoiceDate}
                                    onChange={(v) => updateField("invoiceDate", v)}
                                />
                                <Field
                                    label="Payment Due Date"
                                    type="date"
                                    value={reminder.dueDate}
                                    onChange={(v) => updateField("dueDate", v)}
                                />

                                <div>
                                    <label className={labelClass}>Payment Status</label>
                                    <select
                                        value={reminder.paymentStatus}
                                        onChange={(e) =>
                                            updateField("paymentStatus", e.target.value)
                                        }
                                        className={inputClass}
                                    >
                                        {["Pending", "Overdue", "Partially Paid"].map((status) => (
                                            <option key={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Payment Terms</label>
                                    <select
                                        value={reminder.paymentTerms}
                                        onChange={(e) =>
                                            updateField("paymentTerms", e.target.value)
                                        }
                                        className={inputClass}
                                    >
                                        {[
                                            "Due on receipt",
                                            "Net 7 days",
                                            "Net 15 days",
                                            "Net 30 days",
                                            "Net 60 days",
                                            "Other",
                                        ].map((term) => (
                                            <option key={term}>{term}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Business Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Business Name"
                                    value={reminder.businessName}
                                    onChange={(v) => updateField("businessName", v)}
                                />
                                <Field
                                    label="Business Email"
                                    type="email"
                                    value={reminder.businessEmail}
                                    onChange={(v) => updateField("businessEmail", v)}
                                />
                                <div className="sm:col-span-2">
                                    <TextArea
                                        label="Business Address"
                                        value={reminder.businessAddress}
                                        onChange={(v) => updateField("businessAddress", v)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Customer Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Customer Name"
                                    value={reminder.customerName}
                                    onChange={(v) => updateField("customerName", v)}
                                />
                                <Field
                                    label="Customer Email"
                                    type="email"
                                    value={reminder.customerEmail}
                                    onChange={(v) => updateField("customerEmail", v)}
                                />
                                <div className="sm:col-span-2">
                                    <TextArea
                                        label="Customer Address"
                                        value={reminder.customerAddress}
                                        onChange={(v) => updateField("customerAddress", v)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Outstanding Payment
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Amount Due"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={reminder.amountDue}
                                    onChange={(v) => updateField("amountDue", v)}
                                    placeholder="0.00"
                                />

                                <div>
                                    <label className={labelClass}>Currency</label>
                                    <select
                                        value={reminder.currency}
                                        onChange={(e) => updateField("currency", e.target.value)}
                                        className={inputClass}
                                    >
                                        {["USD", "PKR", "EUR", "GBP", "AED", "SAR"].map((c) => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Reminder Message
                            </h2>

                            <div className="space-y-4">
                                <Field
                                    label="Subject"
                                    value={reminder.subject}
                                    onChange={(v) => updateField("subject", v)}
                                />

                                <TextArea
                                    label="Message"
                                    value={reminder.message}
                                    onChange={(v) => updateField("message", v)}
                                    rows={6}
                                />

                                <TextArea
                                    label="Payment Instructions"
                                    value={reminder.paymentInstructions}
                                    onChange={(v) => updateField("paymentInstructions", v)}
                                    placeholder="Bank details, transfer instructions, or payment link..."
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Signature
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Your Name"
                                    value={reminder.signatureName}
                                    onChange={(v) => updateField("signatureName", v)}
                                />
                                <Field
                                    label="Your Position"
                                    value={reminder.signatureTitle}
                                    onChange={(v) => updateField("signatureTitle", v)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={downloading || saving}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-white px-5 py-3 font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                            >
                                <Download size={18} />
                                {downloading ? "Generating PDF..." : "Download PDF"}
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving || downloading}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                                <Save size={18} />
                                {saving ? "Saving..." : "Save Reminder"}
                            </button>
                        </div>
                    </section>

                    <aside className="lg:sticky lg:top-6">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                                <h2 className="font-semibold text-gray-900">Live Preview</h2>
                                <p className="text-xs text-gray-500">
                                    Your reminder updates as you type.
                                </p>
                            </div>

                            <div className="space-y-6 p-5 sm:p-7">
                                <div className="rounded-xl bg-emerald-700 p-5 text-white">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">
                                                Payment Notice
                                            </p>
                                            <h3 className="mt-2 text-xl font-bold">
                                                {reminder.title || "Payment Reminder"}
                                            </h3>
                                        </div>
                                        <BellRing size={28} />
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-emerald-50">
                                        <p>Reminder: {reminder.reminderNumber || "—"}</p>
                                        <p className="text-right">
                                            Date: {reminder.reminderDate || "—"}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                                            From
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {reminder.businessName || "Business name"}
                                        </p>
                                        <p className="break-all text-xs text-gray-500">
                                            {reminder.businessEmail}
                                        </p>
                                        <p className="whitespace-pre-line text-xs text-gray-500">
                                            {reminder.businessAddress}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                                            To
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {reminder.customerName || "Customer name"}
                                        </p>
                                        <p className="break-all text-xs text-gray-500">
                                            {reminder.customerEmail}
                                        </p>
                                        <p className="whitespace-pre-line text-xs text-gray-500">
                                            {reminder.customerAddress}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-4 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-400">Invoice Number</p>
                                        <p className="font-semibold text-gray-800">
                                            {reminder.invoiceNumber || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Due Date</p>
                                        <p className="font-semibold text-gray-800">
                                            {reminder.dueDate || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Payment Status</p>
                                        <p className="font-semibold text-amber-600">
                                            {reminder.paymentStatus}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Payment Terms</p>
                                        <p className="font-semibold text-gray-800">
                                            {reminder.paymentTerms}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-emerald-50 p-5">
                                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                                        Outstanding Amount
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-emerald-800">
                                        {formatMoney(reminder.amountDue)}
                                    </p>
                                </div>

                                {reminder.subject && (
                                    <div>
                                        <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                                            Subject
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {reminder.subject}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                                        Message
                                    </p>
                                    <p className="whitespace-pre-line text-sm leading-6 text-gray-600">
                                        {reminder.message}
                                    </p>
                                </div>

                                {reminder.paymentInstructions && (
                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                                            Payment Instructions
                                        </p>
                                        <p className="whitespace-pre-line text-sm text-gray-600">
                                            {reminder.paymentInstructions}
                                        </p>
                                    </div>
                                )}

                                {(reminder.signatureName || reminder.signatureTitle) && (
                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="font-semibold text-gray-900">
                                            {reminder.signatureName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {reminder.signatureTitle}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center justify-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400">
                                    <FileText size={14} />
                                    Generated with Formiqo
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
