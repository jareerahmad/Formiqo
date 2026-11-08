
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Download,
    Save,
    Plus,
    Trash2,
    ReceiptText,
} from "lucide-react";
import Swal from "sweetalert2";
import { saveDocument } from "@/lib/documents";
import { generateExpenseReportPdf } from "@/lib/generate-expense-report-pdf";

const initialReport = {
    title: "Expense Report",
    reportNumber: `EXP-${Date.now().toString().slice(-6)}`,
    reportDate: new Date().toISOString().slice(0, 10),
    employeeName: "",
    department: "",
    employeeEmail: "",
    reportingPeriod: "",
    currency: "USD",
    expenses: [
        {
            id: 1,
            date: new Date().toISOString().slice(0, 10),
            category: "Travel",
            description: "",
            amount: 0,
        },
    ],
    notes: "",
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

function TextArea({ label, value, onChange, placeholder = "", rows = 3 }) {
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

export default function CreateExpenseReportPage() {
    const [report, setReport] = useState(initialReport);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const updateField = (field, value) => {
        setReport((prev) => ({ ...prev, [field]: value }));
    };

    const updateExpense = (id, field, value) => {
        setReport((prev) => ({
            ...prev,
            expenses: prev.expenses.map((expense) =>
                expense.id === id ? { ...expense, [field]: value } : expense
            ),
        }));
    };

    const addExpense = () => {
        setReport((prev) => ({
            ...prev,
            expenses: [
                ...prev.expenses,
                {
                    id: Date.now(),
                    date: new Date().toISOString().slice(0, 10),
                    category: "Other",
                    description: "",
                    amount: 0,
                },
            ],
        }));
    };

    const removeExpense = (id) => {
        setReport((prev) => ({
            ...prev,
            expenses:
                prev.expenses.length > 1
                    ? prev.expenses.filter((expense) => expense.id !== id)
                    : prev.expenses,
        }));
    };

    const total = useMemo(
        () =>
            report.expenses.reduce(
                (sum, expense) => sum + Number(expense.amount || 0),
                0
            ),
        [report.expenses]
    );

    const formatMoney = (amount) =>
        `${report.currency} ${Number(amount || 0).toFixed(2)}`;

    const handleDownload = async () => {
        try {
            setDownloading(true);

            await generateExpenseReportPdf({
                ...report,
                total,
            });

            await Swal.fire({
                icon: "success",
                title: "PDF downloaded",
                text: "Your expense report is ready.",
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
        if (!report.title.trim() || !report.employeeName.trim()) {
            return Swal.fire({
                icon: "warning",
                title: "Missing information",
                text: "Please enter the document title and employee name.",
                confirmButtonColor: "#059669",
            });
        }

        if (
            report.expenses.some(
                (expense) =>
                    !expense.description.trim() ||
                    !expense.date ||
                    Number(expense.amount) < 0
            )
        ) {
            return Swal.fire({
                icon: "warning",
                title: "Check your expenses",
                text: "Each expense needs a date, description, and valid amount.",
                confirmButtonColor: "#059669",
            });
        }

        try {
            setSaving(true);

            await saveDocument({
                title: report.title.trim(),
                type: "expense-report",
                data: {
                    ...report,
                    total,
                },
            });

            await Swal.fire({
                icon: "success",
                title: "Expense report saved",
                text: "You can find it in My Documents.",
                confirmButtonColor: "#059669",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Save failed",
                text: error.message || "Unable to save your expense report.",
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
                        <ReceiptText size={25} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Expense Report Generator
                        </h1>
                        <p className="text-sm text-gray-500">
                            Record, organize, and summarize business expenses.
                        </p>
                    </div>
                </div>

                <div className="grid items-start gap-7 lg:grid-cols-2">
                    <section className="space-y-6">
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Report Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Document Title"
                                    value={report.title}
                                    onChange={(v) => updateField("title", v)}
                                />
                                <Field
                                    label="Report Number"
                                    value={report.reportNumber}
                                    onChange={(v) => updateField("reportNumber", v)}
                                />
                                <Field
                                    label="Report Date"
                                    type="date"
                                    value={report.reportDate}
                                    onChange={(v) => updateField("reportDate", v)}
                                />
                                <Field
                                    label="Reporting Period"
                                    value={report.reportingPeriod}
                                    onChange={(v) => updateField("reportingPeriod", v)}
                                    placeholder="e.g. October 2026"
                                />
                                <Field
                                    label="Employee Name"
                                    value={report.employeeName}
                                    onChange={(v) => updateField("employeeName", v)}
                                />
                                <Field
                                    label="Department"
                                    value={report.department}
                                    onChange={(v) => updateField("department", v)}
                                />
                                <Field
                                    label="Employee Email"
                                    type="email"
                                    value={report.employeeEmail}
                                    onChange={(v) => updateField("employeeEmail", v)}
                                />

                                <div>
                                    <label className={labelClass}>Currency</label>
                                    <select
                                        value={report.currency}
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
                            <div className="mb-5 flex items-center justify-between gap-3">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Expense Entries
                                </h2>
                                <button
                                    type="button"
                                    onClick={addExpense}
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                                >
                                    <Plus size={16} />
                                    Add Expense
                                </button>
                            </div>

                            <div className="space-y-4">
                                {report.expenses.map((expense, index) => (
                                    <div
                                        key={expense.id}
                                        className="rounded-xl border border-gray-200 p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <p className="text-sm font-semibold text-gray-700">
                                                Expense {index + 1}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => removeExpense(expense.id)}
                                                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                                title="Remove expense"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <Field
                                                label="Expense Date"
                                                type="date"
                                                value={expense.date}
                                                onChange={(v) =>
                                                    updateExpense(expense.id, "date", v)
                                                }
                                            />

                                            <div>
                                                <label className={labelClass}>Category</label>
                                                <select
                                                    value={expense.category}
                                                    onChange={(e) =>
                                                        updateExpense(
                                                            expense.id,
                                                            "category",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={inputClass}
                                                >
                                                    {[
                                                        "Travel",
                                                        "Meals",
                                                        "Accommodation",
                                                        "Transportation",
                                                        "Office Supplies",
                                                        "Software",
                                                        "Utilities",
                                                        "Marketing",
                                                        "Other",
                                                    ].map((category) => (
                                                        <option key={category}>{category}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="sm:col-span-2">
                                                <Field
                                                    label="Description"
                                                    value={expense.description}
                                                    onChange={(v) =>
                                                        updateExpense(
                                                            expense.id,
                                                            "description",
                                                            v
                                                        )
                                                    }
                                                    placeholder="Describe the expense"
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <Field
                                                    label={`Amount (${report.currency})`}
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={expense.amount}
                                                    onChange={(v) =>
                                                        updateExpense(expense.id, "amount", v)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            <TextArea
                                label="Additional Notes"
                                value={report.notes}
                                onChange={(v) => updateField("notes", v)}
                                placeholder="Add explanations, comments, or reimbursement details..."
                            />
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
                                {saving ? "Saving..." : "Save Expense Report"}
                            </button>
                        </div>
                    </section>

                    <aside className="lg:sticky lg:top-6">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                                <h2 className="font-semibold text-gray-900">Live Preview</h2>
                                <p className="text-xs text-gray-500">
                                    Updates as you edit the report.
                                </p>
                            </div>

                            <div className="space-y-6 p-5 sm:p-7">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                                            Expense Report
                                        </p>
                                        <h3 className="mt-2 text-xl font-bold text-gray-900">
                                            {report.title || "Expense Report"}
                                        </h3>
                                    </div>
                                    <ReceiptText size={30} className="text-emerald-600" />
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-400">Report Number</p>
                                        <p className="font-semibold text-gray-800">
                                            {report.reportNumber || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Report Date</p>
                                        <p className="font-semibold text-gray-800">
                                            {report.reportDate || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Employee</p>
                                        <p className="font-semibold text-gray-800">
                                            {report.employeeName || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Department</p>
                                        <p className="font-semibold text-gray-800">
                                            {report.department || "—"}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-400">Reporting Period</p>
                                        <p className="font-semibold text-gray-800">
                                            {report.reportingPeriod || "—"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-3 text-sm font-semibold text-gray-800">
                                        Expense Summary
                                    </h4>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="border-b border-gray-200 text-gray-400">
                                                <tr>
                                                    <th className="py-2 pr-2">Description</th>
                                                    <th className="px-2 py-2">Category</th>
                                                    <th className="py-2 pl-2 text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {report.expenses.map((expense) => (
                                                    <tr
                                                        key={expense.id}
                                                        className="border-b border-gray-100"
                                                    >
                                                        <td className="py-3 pr-2 text-gray-700">
                                                            {expense.description || "Expense description"}
                                                            <span className="mt-1 block text-gray-400">
                                                                {expense.date || "—"}
                                                            </span>
                                                        </td>
                                                        <td className="px-2 py-3 text-gray-600">
                                                            {expense.category}
                                                        </td>
                                                        <td className="py-3 pl-2 text-right font-medium text-gray-800">
                                                            {formatMoney(expense.amount)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
                                    <span>Total Expenses</span>
                                    <span className="text-emerald-700">
                                        {formatMoney(total)}
                                    </span>
                                </div>

                                {report.notes && (
                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="mb-1 text-xs font-bold uppercase text-gray-400">
                                            Additional Notes
                                        </p>
                                        <p className="whitespace-pre-line text-sm text-gray-600">
                                            {report.notes}
                                        </p>
                                    </div>
                                )}

                                <p className="border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
                                    Generated with Formiqo
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
