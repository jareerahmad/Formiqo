
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Download,
    Save,
    Plus,
    Trash2,
    FileText,
} from "lucide-react";
import Swal from "sweetalert2";
import { saveDocument } from "@/lib/documents";
import { generateQuotationPdf } from "@/lib/generate-quotation-pdf";

const initialQuotation = {
    title: "Business Quotation",
    quotationNumber: `QUO-${Date.now().toString().slice(-6)}`,
    issueDate: new Date().toISOString().slice(0, 10),
    validUntil: "",
    businessName: "",
    businessAddress: "",
    businessEmail: "",
    businessPhone: "",
    customerName: "",
    customerAddress: "",
    customerEmail: "",
    customerPhone: "",
    taxRate: "0",
    currency: "USD",
    notes: "",
    items: [
        {
            id: 1,
            description: "",
            quantity: 1,
            price: 0,
        },
    ],
};

export default function CreateQuotationPage() {
    const [quotation, setQuotation] = useState(initialQuotation);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const updateField = (field, value) => {
        setQuotation((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const updateItem = (id, field, value) => {
        setQuotation((previous) => ({
            ...previous,
            items: previous.items.map((item) =>
                item.id === id
                    ? { ...item, [field]: value }
                    : item
            ),
        }));
    };

    const addItem = () => {
        setQuotation((previous) => ({
            ...previous,
            items: [
                ...previous.items,
                {
                    id: Date.now(),
                    description: "",
                    quantity: 1,
                    price: 0,
                },
            ],
        }));
    };

    const removeItem = (id) => {
        setQuotation((previous) => ({
            ...previous,
            items:
                previous.items.length === 1
                    ? previous.items
                    : previous.items.filter((item) => item.id !== id),
        }));
    };

    const { subtotal, tax, total } = useMemo(() => {
        const subtotal = quotation.items.reduce(
            (sum, item) =>
                sum +
                (Number(item.quantity) || 0) *
                (Number(item.price) || 0),
            0
        );

        const tax =
            subtotal * ((Number(quotation.taxRate) || 0) / 100);

        return {
            subtotal,
            tax,
            total: subtotal + tax,
        };
    }, [quotation.items, quotation.taxRate]);

    const formatMoney = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: quotation.currency,
        }).format(amount || 0);

    const handleDownload = async () => {
        if (
            !quotation.businessName.trim() ||
            !quotation.customerName.trim() ||
            !quotation.items.some(
                (item) => item.description.trim()
            )
        ) {
            await Swal.fire({
                icon: "warning",
                title: "Complete your quotation",
                text: "Enter your business name, customer name, and at least one item description.",
                confirmButtonColor: "#059669",
            });
            return;
        }

        setDownloading(true);

        try {
            Swal.fire({
                title: "Preparing quotation...",
                text: "Your PDF is being generated.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading(),
            });

            await generateQuotationPdf({
                ...quotation,
                subtotal,
                tax,
                total,
            });

            Swal.close();

            await Swal.fire({
                icon: "success",
                title: "PDF downloaded!",
                text: "Your quotation has been downloaded.",
                confirmButtonColor: "#059669",
            });
        } catch (error) {
            Swal.close();
            console.error("Quotation PDF error:", error);

            await Swal.fire({
                icon: "error",
                title: "Download failed",
                text: error.message || "Could not generate the quotation PDF.",
                confirmButtonColor: "#059669",
            });
        } finally {
            setDownloading(false);
        }
    };

    const handleSave = async () => {
        if (
            !quotation.title.trim() ||
            !quotation.businessName.trim() ||
            !quotation.customerName.trim() ||
            !quotation.items.some(
                (item) => item.description.trim()
            )
        ) {
            await Swal.fire({
                icon: "warning",
                title: "Missing information",
                text: "Add a document title, business name, customer name, and at least one item description.",
                confirmButtonColor: "#059669",
            });
            return;
        }

        setSaving(true);

        try {
            Swal.fire({
                title: "Saving quotation...",
                text: "Please wait.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading(),
            });

            await saveDocument({
                title: quotation.title.trim(),
                type: "quotation",
                data: {
                    ...quotation,
                    subtotal,
                    tax,
                    total,
                },
            });

            Swal.close();

            await Swal.fire({
                icon: "success",
                title: "Quotation saved!",
                text: "Your quotation is now available in My Documents.",
                confirmButtonColor: "#059669",
            });
        } catch (error) {
            Swal.close();
            console.error("Quotation save error:", error);

            await Swal.fire({
                icon: "error",
                title: "Could not save",
                text: error.message || "Please try saving your quotation again.",
                confirmButtonColor: "#059669",
            });
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

    const labelClass = "block text-sm font-medium text-gray-700";

    const sectionClass =
        "rounded-2xl border border-gray-200 bg-white p-5 sm:p-6";

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-emerald-600"
                >
                    <ArrowLeft size={17} />
                    Back to Dashboard
                </Link>

                <div className="mb-8">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <FileText size={24} />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Quotation Generator
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                        Prepare professional quotations for your clients,
                        calculate totals automatically, and download or save
                        your document.
                    </p>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="space-y-6">
                        <section className={sectionClass}>
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Quotation Details
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className={labelClass}>
                                    Document Title *
                                    <input
                                        className={inputClass}
                                        value={quotation.title}
                                        onChange={(e) =>
                                            updateField("title", e.target.value)
                                        }
                                        placeholder="Business Quotation"
                                    />
                                </label>

                                <label className={labelClass}>
                                    Quotation Number
                                    <input
                                        className={inputClass}
                                        value={quotation.quotationNumber}
                                        onChange={(e) =>
                                            updateField("quotationNumber", e.target.value)
                                        }
                                    />
                                </label>

                                <label className={labelClass}>
                                    Issue Date
                                    <input
                                        type="date"
                                        className={inputClass}
                                        value={quotation.issueDate}
                                        onChange={(e) =>
                                            updateField("issueDate", e.target.value)
                                        }
                                    />
                                </label>

                                <label className={labelClass}>
                                    Valid Until
                                    <input
                                        type="date"
                                        className={inputClass}
                                        value={quotation.validUntil}
                                        onChange={(e) =>
                                            updateField("validUntil", e.target.value)
                                        }
                                    />
                                </label>

                                <label className={labelClass}>
                                    Currency
                                    <select
                                        className={inputClass}
                                        value={quotation.currency}
                                        onChange={(e) =>
                                            updateField("currency", e.target.value)
                                        }
                                    >
                                        <option value="USD">USD — US Dollar</option>
                                        <option value="PKR">PKR — Pakistani Rupee</option>
                                        <option value="EUR">EUR — Euro</option>
                                        <option value="GBP">GBP — British Pound</option>
                                        <option value="AED">AED — UAE Dirham</option>
                                        <option value="SAR">SAR — Saudi Riyal</option>
                                    </select>
                                </label>

                                <label className={labelClass}>
                                    Tax Rate (%)
                                    <input
                                        type="number"
                                        min="0"
                                        className={inputClass}
                                        value={quotation.taxRate}
                                        onChange={(e) =>
                                            updateField("taxRate", e.target.value)
                                        }
                                    />
                                </label>
                            </div>
                        </section>

                        <section className={sectionClass}>
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Your Business
                            </h2>

                            <div className="space-y-4">
                                <label className={labelClass}>
                                    Business Name *
                                    <input
                                        className={inputClass}
                                        value={quotation.businessName}
                                        onChange={(e) =>
                                            updateField("businessName", e.target.value)
                                        }
                                        placeholder="Your company name"
                                    />
                                </label>

                                <label className={labelClass}>
                                    Business Address
                                    <textarea
                                        rows={2}
                                        className={inputClass}
                                        value={quotation.businessAddress}
                                        onChange={(e) =>
                                            updateField("businessAddress", e.target.value)
                                        }
                                        placeholder="Street, city, country"
                                    />
                                </label>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className={labelClass}>
                                        Business Email
                                        <input
                                            type="email"
                                            className={inputClass}
                                            value={quotation.businessEmail}
                                            onChange={(e) =>
                                                updateField("businessEmail", e.target.value)
                                            }
                                            placeholder="you@example.com"
                                        />
                                    </label>

                                    <label className={labelClass}>
                                        Business Phone
                                        <input
                                            className={inputClass}
                                            value={quotation.businessPhone}
                                            onChange={(e) =>
                                                updateField("businessPhone", e.target.value)
                                            }
                                            placeholder="+92..."
                                        />
                                    </label>
                                </div>
                            </div>
                        </section>

                        <section className={sectionClass}>
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Customer Details
                            </h2>

                            <div className="space-y-4">
                                <label className={labelClass}>
                                    Customer Name *
                                    <input
                                        className={inputClass}
                                        value={quotation.customerName}
                                        onChange={(e) =>
                                            updateField("customerName", e.target.value)
                                        }
                                        placeholder="Client or company name"
                                    />
                                </label>

                                <label className={labelClass}>
                                    Customer Address
                                    <textarea
                                        rows={2}
                                        className={inputClass}
                                        value={quotation.customerAddress}
                                        onChange={(e) =>
                                            updateField("customerAddress", e.target.value)
                                        }
                                        placeholder="Customer address"
                                    />
                                </label>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className={labelClass}>
                                        Customer Email
                                        <input
                                            type="email"
                                            className={inputClass}
                                            value={quotation.customerEmail}
                                            onChange={(e) =>
                                                updateField("customerEmail", e.target.value)
                                            }
                                            placeholder="client@example.com"
                                        />
                                    </label>

                                    <label className={labelClass}>
                                        Customer Phone
                                        <input
                                            className={inputClass}
                                            value={quotation.customerPhone}
                                            onChange={(e) =>
                                                updateField("customerPhone", e.target.value)
                                            }
                                            placeholder="Customer phone"
                                        />
                                    </label>
                                </div>
                            </div>
                        </section>

                        <section className={sectionClass}>
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Quotation Items
                                </h2>

                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                >
                                    <Plus size={17} />
                                    Add Item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {quotation.items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-gray-700">
                                                Item {index + 1}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                disabled={quotation.items.length === 1}
                                                className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                                                aria-label={`Remove item ${index + 1}`}
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>

                                        <label className={labelClass}>
                                            Description *
                                            <input
                                                className={inputClass}
                                                value={item.description}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.id,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Website design, consulting, etc."
                                            />
                                        </label>

                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <label className={labelClass}>
                                                Quantity
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="any"
                                                    className={inputClass}
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            item.id,
                                                            "quantity",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </label>

                                            <label className={labelClass}>
                                                Unit Price
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="any"
                                                    className={inputClass}
                                                    value={item.price}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            item.id,
                                                            "price",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>

                                        <p className="mt-3 text-right text-sm font-semibold text-gray-800">
                                            Amount:{" "}
                                            {formatMoney(
                                                (Number(item.quantity) || 0) *
                                                (Number(item.price) || 0)
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className={sectionClass}>
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                Notes & Terms
                            </h2>

                            <textarea
                                rows={4}
                                className={inputClass}
                                value={quotation.notes}
                                onChange={(e) =>
                                    updateField("notes", e.target.value)
                                }
                                placeholder="Add payment terms, delivery details, or other conditions..."
                            />
                        </section>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={downloading || saving}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Download size={18} />
                                {downloading ? "Generating..." : "Download PDF"}
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving || downloading}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={18} />
                                {saving ? "Saving..." : "Save Quotation"}
                            </button>
                        </div>
                    </div>

                    <aside className="lg:sticky lg:top-6">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                                    Live Preview
                                </p>
                                <h2 className="mt-1 text-lg font-bold text-gray-900">
                                    {quotation.title || "Business Quotation"}
                                </h2>
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="flex items-start justify-between gap-3 border-b border-gray-200 pb-5">
                                    <div>
                                        <p className="text-xl font-bold text-emerald-700">
                                            Formiqo
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Professional Documents
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">
                                            QUOTATION
                                        </p>
                                        <p className="mt-1 break-all text-xs text-gray-500">
                                            {quotation.quotationNumber}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-5 text-sm">
                                    <div className="min-w-0">
                                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">
                                            From
                                        </p>
                                        <p className="break-words font-semibold text-gray-900">
                                            {quotation.businessName || "Your Business"}
                                        </p>
                                        <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-gray-500">
                                            {quotation.businessAddress}
                                        </p>
                                        <p className="mt-1 break-words text-xs text-gray-500">
                                            {quotation.businessEmail}
                                        </p>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">
                                            Prepared For
                                        </p>
                                        <p className="break-words font-semibold text-gray-900">
                                            {quotation.customerName || "Customer Name"}
                                        </p>
                                        <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-gray-500">
                                            {quotation.customerAddress}
                                        </p>
                                        <p className="mt-1 break-words text-xs text-gray-500">
                                            {quotation.customerEmail}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3 text-xs">
                                    <div>
                                        <p className="text-gray-500">Issue Date</p>
                                        <p className="mt-1 font-semibold text-gray-800">
                                            {quotation.issueDate || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Valid Until</p>
                                        <p className="mt-1 font-semibold text-gray-800">
                                            {quotation.validUntil || "—"}
                                        </p>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[280px] text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-emerald-100 text-emerald-800">
                                                <th className="py-3 pr-2 font-semibold">
                                                    Item
                                                </th>
                                                <th className="px-1 py-3 text-right font-semibold">
                                                    Qty
                                                </th>
                                                <th className="py-3 pl-2 text-right font-semibold">
                                                    Amount
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {quotation.items.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-b border-gray-100"
                                                >
                                                    <td className="max-w-[120px] break-words py-3 pr-2 text-gray-700">
                                                        {item.description || "Item description"}
                                                    </td>
                                                    <td className="px-1 py-3 text-right text-gray-600">
                                                        {item.quantity || 0}
                                                    </td>
                                                    <td className="py-3 pl-2 text-right text-gray-800">
                                                        {formatMoney(
                                                            (Number(item.quantity) || 0) *
                                                            (Number(item.price) || 0)
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-5 space-y-3 border-t border-gray-200 pt-4 text-sm">
                                    <div className="flex justify-between gap-3 text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatMoney(subtotal)}</span>
                                    </div>

                                    <div className="flex justify-between gap-3 text-gray-600">
                                        <span>Tax ({quotation.taxRate || 0}%)</span>
                                        <span>{formatMoney(tax)}</span>
                                    </div>

                                    <div className="flex justify-between gap-3 border-t border-emerald-100 pt-3 text-base font-bold text-emerald-700">
                                        <span>Total</span>
                                        <span>{formatMoney(total)}</span>
                                    </div>
                                </div>

                                {quotation.notes.trim() && (
                                    <div className="mt-5 rounded-xl bg-gray-50 p-3">
                                        <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
                                            Notes & Terms
                                        </p>
                                        <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-5 text-gray-600">
                                            {quotation.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                            This is a live preview. Download the PDF to see the printable document.
                        </p>
                    </aside>
                </div>
            </div>
        </main>
    );
}
