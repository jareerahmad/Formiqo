
"use client";

import Swal from "sweetalert2";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Calculator } from "lucide-react";
import { generateInvoicePdf } from "@/lib/generate-invoice-pdf";

export default function CreateInvoicePage() {
    useEffect(() => {
        const today = new Date();

        setInvoice((current) => ({
            ...current,
            invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
            issueDate: today.toISOString().slice(0, 10),
        }));
    }, []);

    const [invoice, setInvoice] = useState({
        documentTitle: "Invoice",
        invoiceNumber: "",
        issueDate: "",
        dueDate: "",
        businessName: "",
        businessEmail: "",
        businessAddress: "",
        customerName: "",
        customerEmail: "",
        customerAddress: "",
        taxRate: "0",
        notes: "Thank you for your business!",
    });

    const [items, setItems] = useState([
        { id: 1, description: "", quantity: "1", price: "0" },
    ]);

    const subtotal = useMemo(
        () =>
            items.reduce(
                (sum, item) =>
                    sum +
                    Math.max(0, Number(item.quantity) || 0) *
                    Math.max(0, Number(item.price) || 0),
                0
            ),
        [items]
    );

    const tax = subtotal * Math.max(0, Number(invoice.taxRate) || 0) / 100;
    const total = subtotal + tax;

    function updateInvoice(name, value) {
        setInvoice((current) => ({ ...current, [name]: value }));
    }

    function updateItem(id, name, value) {
        setItems((current) =>
            current.map((item) =>
                item.id === id ? { ...item, [name]: value } : item
            )
        );
    }

    function addItem() {
        setItems((current) => [
            ...current,
            {
                id: Date.now() + Math.random(),
                description: "",
                quantity: "1",
                price: "0",
            },
        ]);
    }

    function removeItem(id) {
        setItems((current) =>
            current.length > 1
                ? current.filter((item) => item.id !== id)
                : current
        );
    }

    function money(value) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);
    }

    async function downloadInvoice() {
        await generateInvoicePdf({
            ...invoice,
            items,
            subtotal,
            tax,
            total,
            currency: "USD",
        });
    }

    async function saveInvoice() {
        const { saveDocument } = await import("@/lib/documents");

        return saveDocument({
            title: invoice.documentTitle || invoice.invoiceNumber,
            type: "invoice",
            data: {
                ...invoice,
                items,
                subtotal,
                tax,
                total,
                currency: "USD",
            },
        });
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                        Formiqo document studio
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Invoice Generator
                    </h1>
                    <p className="mt-3 max-w-2xl text-gray-600">
                        Create a professional invoice, calculate totals automatically,
                        and download a PDF for your customer.
                    </p>
                </div>

                <div className="grid items-start gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="text-lg font-bold text-gray-900">
                                Invoice information
                            </h2>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                {[
                                    ["documentTitle", "Document title", "text"],
                                    ["invoiceNumber", "Invoice number", "text"],
                                    ["issueDate", "Issue date", "date"],
                                    ["dueDate", "Due date", "date"],
                                ].map(([name, label, type]) => (
                                    <div key={name}>
                                        <label
                                            htmlFor={name}
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            {label}
                                        </label>
                                        <input
                                            id={name}
                                            type={type}
                                            value={invoice[name]}
                                            onChange={(event) =>
                                                updateInvoice(name, event.target.value)
                                            }
                                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="text-lg font-bold text-gray-900">
                                Your business
                            </h2>

                            <div className="mt-5 space-y-4">
                                {[
                                    ["businessName", "Business name", "text"],
                                    ["businessEmail", "Business email", "email"],
                                    ["businessAddress", "Business address", "textarea"],
                                ].map(([name, label, type]) => (
                                    <div key={name}>
                                        <label
                                            htmlFor={name}
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            {label}
                                        </label>
                                        {type === "textarea" ? (
                                            <textarea
                                                id={name}
                                                rows={2}
                                                value={invoice[name]}
                                                onChange={(event) =>
                                                    updateInvoice(name, event.target.value)
                                                }
                                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                            />
                                        ) : (
                                            <input
                                                id={name}
                                                type={type}
                                                value={invoice[name]}
                                                onChange={(event) =>
                                                    updateInvoice(name, event.target.value)
                                                }
                                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="text-lg font-bold text-gray-900">
                                Customer details
                            </h2>

                            <div className="mt-5 space-y-4">
                                {[
                                    ["customerName", "Customer name", "text"],
                                    ["customerEmail", "Customer email", "email"],
                                    ["customerAddress", "Customer address", "textarea"],
                                ].map(([name, label, type]) => (
                                    <div key={name}>
                                        <label
                                            htmlFor={name}
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            {label}
                                        </label>
                                        {type === "textarea" ? (
                                            <textarea
                                                id={name}
                                                rows={2}
                                                value={invoice[name]}
                                                onChange={(event) =>
                                                    updateInvoice(name, event.target.value)
                                                }
                                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                            />
                                        ) : (
                                            <input
                                                id={name}
                                                type={type}
                                                value={invoice[name]}
                                                onChange={(event) =>
                                                    updateInvoice(name, event.target.value)
                                                }
                                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Invoice items
                                </h2>

                                <button
                                    onClick={addItem}
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                                >
                                    <Plus size={16} />
                                    Add item
                                </button>
                            </div>

                            <div className="mt-5 space-y-4">
                                {items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="rounded-xl border border-gray-200 p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <p className="text-sm font-semibold text-gray-700">
                                                Item {index + 1}
                                            </p>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                disabled={items.length === 1}
                                                aria-label={`Remove item ${index + 1}`}
                                                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>

                                        <label
                                            htmlFor={`description-${item.id}`}
                                            className="mb-2 block text-sm text-gray-600"
                                        >
                                            Description
                                        </label>
                                        <input
                                            id={`description-${item.id}`}
                                            value={item.description}
                                            onChange={(event) =>
                                                updateItem(item.id, "description", event.target.value)
                                            }
                                            placeholder="e.g. Website development"
                                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />

                                        <div className="mt-3 grid grid-cols-2 gap-3">
                                            <div>
                                                <label
                                                    htmlFor={`quantity-${item.id}`}
                                                    className="mb-2 block text-sm text-gray-600"
                                                >
                                                    Quantity
                                                </label>
                                                <input
                                                    id={`quantity-${item.id}`}
                                                    type="number"
                                                    min="0"
                                                    step="any"
                                                    value={item.quantity}
                                                    onChange={(event) =>
                                                        updateItem(item.id, "quantity", event.target.value)
                                                    }
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor={`price-${item.id}`}
                                                    className="mb-2 block text-sm text-gray-600"
                                                >
                                                    Unit price ($)
                                                </label>
                                                <input
                                                    id={`price-${item.id}`}
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.price}
                                                    onChange={(event) =>
                                                        updateItem(item.id, "price", event.target.value)
                                                    }
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                                />
                                            </div>
                                        </div>

                                        <p className="mt-3 text-right text-sm font-semibold text-gray-800">
                                            Amount:{" "}
                                            {money(
                                                Math.max(0, Number(item.quantity) || 0) *
                                                Math.max(0, Number(item.price) || 0)
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5">
                                <label
                                    htmlFor="taxRate"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Tax rate (%)
                                </label>
                                <input
                                    id="taxRate"
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={invoice.taxRate}
                                    onChange={(event) =>
                                        updateInvoice("taxRate", event.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                            </div>

                            <div className="mt-5">
                                <label
                                    htmlFor="notes"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Notes / payment terms
                                </label>
                                <textarea
                                    id="notes"
                                    rows={3}
                                    value={invoice.notes}
                                    onChange={(event) =>
                                        updateInvoice("notes", event.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                            </div>
                        </section>
                    </div>

                    <aside className="lg:sticky lg:top-6">
                        <div className="mb-3 flex items-center gap-2">
                            <Calculator size={19} className="text-emerald-700" />
                            <h2 className="font-bold text-gray-900">Invoice preview</h2>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                            <div className="flex items-start justify-between gap-3 border-b-2 border-emerald-500 pb-5">
                                <div>
                                    <p className="text-2xl font-extrabold text-emerald-700">
                                        Formiqo
                                    </p>
                                    <div className="mt-2 space-y-1 text-xs text-gray-700">
                                        <p className="font-semibold">
                                            {invoice.businessName || "Your business name"}
                                        </p>
                                        <p>
                                            {invoice.businessEmail || "Your business email"}
                                        </p>
                                        {invoice.businessAddress && (
                                            <p className="whitespace-pre-wrap">
                                                {invoice.businessAddress}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {invoice.documentTitle || "INVOICE"}
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {invoice.invoiceNumber}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs font-bold uppercase text-gray-400">
                                        Bill to
                                    </p>
                                    <p className="mt-2 font-semibold text-gray-900">
                                        {invoice.customerName || "Customer name"}
                                    </p>
                                    <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-gray-500">
                                        {invoice.customerEmail}
                                        {invoice.customerAddress
                                            ? `\n${invoice.customerAddress}`
                                            : ""}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs font-bold uppercase text-gray-400">
                                        Dates
                                    </p>
                                    <p className="mt-2 text-gray-700">
                                        Issued: {invoice.issueDate || "—"}
                                    </p>
                                    <p className="mt-1 text-gray-500">
                                        Due: {invoice.dueDate || "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-7 overflow-x-auto">
                                <table className="w-full min-w-[330px] text-left text-sm">
                                    <thead>
                                        <tr className="bg-emerald-50 text-xs uppercase text-gray-600">
                                            <th className="rounded-l-lg px-2 py-3">Item</th>
                                            <th className="px-2 py-3 text-right">Qty</th>
                                            <th className="px-2 py-3 text-right">Price</th>
                                            <th className="rounded-r-lg px-2 py-3 text-right">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {items.map((item) => (
                                            <tr key={item.id} className="border-b border-gray-100">
                                                <td className="text-gray-700 max-w-[130px] break-words px-2 py-3">
                                                    {item.description || "Item"}
                                                </td>
                                                <td className="text-gray-700 px-2 py-3 text-right">
                                                    {Number(item.quantity) || 0}
                                                </td>
                                                <td className="text-gray-700 px-2 py-3 text-right">
                                                    {money(Number(item.price) || 0)}
                                                </td>
                                                <td className="text-gray-700 px-2 py-3 text-right font-medium">
                                                    {money(
                                                        Math.max(0, Number(item.quantity) || 0) *
                                                        Math.max(0, Number(item.price) || 0)
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="ml-auto mt-6 max-w-xs space-y-3 text-sm">
                                <div className="flex justify-between gap-4 text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{money(subtotal)}</span>
                                </div>
                                <div className="flex justify-between gap-4 text-gray-600">
                                    <span>Tax ({Number(invoice.taxRate) || 0}%)</span>
                                    <span>{money(tax)}</span>
                                </div>
                                <div className="flex justify-between gap-4 border-t border-gray-200 pt-3 text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>{money(total)}</span>
                                </div>
                            </div>

                            {invoice.notes && (
                                <div className="mt-8 border-t border-gray-100 pt-4">
                                    <p className="text-xs font-bold uppercase text-gray-400">
                                        Notes
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                                        {invoice.notes}
                                    </p>
                                </div>
                            )}

                            <p className="mt-8 border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
                                Created with Formiqo
                            </p>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <button
                                onClick={async () => {
                                    try {
                                        await downloadInvoice();

                                        await Swal.fire({
                                            icon: "success",
                                            title: "PDF Downloaded!",
                                            text: "Your invoice PDF has been downloaded successfully.",
                                            confirmButtonColor: "#059669",
                                        });
                                    } catch (error) {
                                        await Swal.fire({
                                            icon: "error",
                                            title: "Download Failed!",
                                            text: error.message || "Unable to download the invoice. Please try again.",
                                            confirmButtonColor: "#059669",
                                        });
                                    }
                                }}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Download invoice PDF
                            </button>

                            <button
                                onClick={async () => {
                                    try {
                                        await saveInvoice();

                                        await Swal.fire({
                                            icon: "success",
                                            title: "Invoice Saved!",
                                            text: "Your invoice has been saved successfully.",
                                            confirmButtonColor: "#059669",
                                        });
                                    } catch (error) {
                                        await Swal.fire({
                                            icon: "error",
                                            title: "Save Failed!",
                                            text: error.message || "Unable to save invoice. Please try again.",
                                            confirmButtonColor: "#059669",
                                        });
                                    }
                                }}
                                className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
                            >
                                Save invoice
                            </button>
                        </div>

                        <p className="mt-3 text-xs leading-5 text-gray-500">
                            Currency is currently USD. Saving requires your MongoDB API to
                            be running and reachable. Do not use this unauthenticated API
                            for real customer documents on a public deployment.
                        </p>
                    </aside>
                </div>
            </div>
        </div>
    );
}
