
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Download,
    Save,
    Plus,
    Trash2,
    ShoppingCart,
} from "lucide-react";
import Swal from "sweetalert2";
import { saveDocument } from "@/lib/documents";
import { generatePurchaseOrderPdf } from "@/lib/generate-purchase-order-pdf";

const initialOrder = {
    title: "Purchase Order",
    orderNumber: `PO-${Date.now().toString().slice(-6)}`,
    orderDate: new Date().toISOString().slice(0, 10),
    currency: "USD",
    buyerName: "",
    buyerAddress: "",
    buyerEmail: "",
    buyerPhone: "",
    supplierName: "",
    supplierAddress: "",
    supplierEmail: "",
    supplierPhone: "",
    deliveryDate: "",
    shippingAddress: "",
    paymentTerms: "Due on receipt",
    items: [{ id: 1, description: "", quantity: 1, price: 0 }],
    taxRate: 0,
    notes: "",
};

const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const labelClass = "mb-2 block text-sm font-medium text-gray-700";

function Field({ label, value, onChange, type = "text", placeholder = "" }) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <input
                type={type}
                value={value ?? ""}
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

export default function CreatePurchaseOrderPage() {
    const [order, setOrder] = useState(initialOrder);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const updateField = (field, value) => {
        setOrder((prev) => ({ ...prev, [field]: value }));
    };

    const updateItem = (id, field, value) => {
        setOrder((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        }));
    };

    const addItem = () => {
        setOrder((prev) => ({
            ...prev,
            items: [
                ...prev.items,
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
        setOrder((prev) => ({
            ...prev,
            items:
                prev.items.length > 1
                    ? prev.items.filter((item) => item.id !== id)
                    : prev.items,
        }));
    };

    const totals = useMemo(() => {
        const subtotal = order.items.reduce(
            (sum, item) =>
                sum + Number(item.quantity || 0) * Number(item.price || 0),
            0
        );

        const tax = subtotal * (Number(order.taxRate || 0) / 100);

        return { subtotal, tax, total: subtotal + tax };
    }, [order.items, order.taxRate]);

    const formatMoney = (amount) =>
        `${order.currency} ${Number(amount || 0).toFixed(2)}`;

    const handleDownload = async () => {
        try {
            setDownloading(true);
            await generatePurchaseOrderPdf({
                ...order,
                ...totals,
            });

            await Swal.fire({
                icon: "success",
                title: "PDF downloaded",
                text: "Your purchase order PDF is ready.",
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
        if (!order.title.trim()) {
            return Swal.fire({
                icon: "warning",
                title: "Title required",
                text: "Please enter a purchase order title.",
                confirmButtonColor: "#059669",
            });
        }

        if (!order.buyerName.trim() || !order.supplierName.trim()) {
            return Swal.fire({
                icon: "warning",
                title: "Missing details",
                text: "Please enter both buyer and supplier names.",
                confirmButtonColor: "#059669",
            });
        }

        if (
            order.items.some(
                (item) =>
                    !item.description.trim() ||
                    Number(item.quantity) <= 0 ||
                    Number(item.price) < 0
            )
        ) {
            return Swal.fire({
                icon: "warning",
                title: "Check your items",
                text: "Each item needs a description, a positive quantity, and a valid price.",
                confirmButtonColor: "#059669",
            });
        }

        try {
            setSaving(true);

            await saveDocument({
                title: order.title.trim(),
                type: "purchase-order",
                data: {
                    ...order,
                    ...totals,
                },
            });

            await Swal.fire({
                icon: "success",
                title: "Purchase order saved",
                text: "You can find it in My Documents.",
                confirmButtonColor: "#059669",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Save failed",
                text: error.message || "Unable to save your purchase order.",
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

                <div className="mb-8">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                            <ShoppingCart size={25} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                Purchase Order Generator
                            </h1>
                            <p className="text-sm text-gray-500">
                                Create a professional purchase order for your business.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid items-start gap-7 lg:grid-cols-2">
                    <section className="space-y-6">
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Order Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Document Title"
                                    value={order.title}
                                    onChange={(v) => updateField("title", v)}
                                />
                                <Field
                                    label="Purchase Order Number"
                                    value={order.orderNumber}
                                    onChange={(v) => updateField("orderNumber", v)}
                                />
                                <Field
                                    label="Order Date"
                                    type="date"
                                    value={order.orderDate}
                                    onChange={(v) => updateField("orderDate", v)}
                                />
                                <Field
                                    label="Expected Delivery Date"
                                    type="date"
                                    value={order.deliveryDate}
                                    onChange={(v) => updateField("deliveryDate", v)}
                                />

                                <div>
                                    <label className={labelClass}>Currency</label>
                                    <select
                                        value={order.currency}
                                        onChange={(e) => updateField("currency", e.target.value)}
                                        className={inputClass}
                                    >
                                        {["USD", "PKR", "EUR", "GBP", "AED", "SAR"].map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Payment Terms</label>
                                    <select
                                        value={order.paymentTerms}
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
                                            "50% advance",
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
                                Buyer Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Buyer / Company Name"
                                    value={order.buyerName}
                                    onChange={(v) => updateField("buyerName", v)}
                                    placeholder="Your company name"
                                />
                                <Field
                                    label="Buyer Email"
                                    type="email"
                                    value={order.buyerEmail}
                                    onChange={(v) => updateField("buyerEmail", v)}
                                />
                                <Field
                                    label="Buyer Phone"
                                    value={order.buyerPhone}
                                    onChange={(v) => updateField("buyerPhone", v)}
                                />
                                <Field
                                    label="Buyer Address"
                                    value={order.buyerAddress}
                                    onChange={(v) => updateField("buyerAddress", v)}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Supplier Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Supplier / Company Name"
                                    value={order.supplierName}
                                    onChange={(v) => updateField("supplierName", v)}
                                    placeholder="Supplier company name"
                                />
                                <Field
                                    label="Supplier Email"
                                    type="email"
                                    value={order.supplierEmail}
                                    onChange={(v) => updateField("supplierEmail", v)}
                                />
                                <Field
                                    label="Supplier Phone"
                                    value={order.supplierPhone}
                                    onChange={(v) => updateField("supplierPhone", v)}
                                />
                                <Field
                                    label="Supplier Address"
                                    value={order.supplierAddress}
                                    onChange={(v) => updateField("supplierAddress", v)}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            <div className="mb-5 flex items-center justify-between gap-3">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Order Items
                                </h2>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                                >
                                    <Plus size={16} />
                                    Add Item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="rounded-xl border border-gray-200 p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <p className="text-sm font-semibold text-gray-700">
                                                Item {index + 1}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                                title="Remove item"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-3">
                                            <div className="sm:col-span-3">
                                                <Field
                                                    label="Description"
                                                    value={item.description}
                                                    onChange={(v) =>
                                                        updateItem(item.id, "description", v)
                                                    }
                                                    placeholder="Product or service description"
                                                />
                                            </div>

                                            <Field
                                                label="Quantity"
                                                type="number"
                                                value={item.quantity}
                                                onChange={(v) =>
                                                    updateItem(item.id, "quantity", v)
                                                }
                                            />
                                            <Field
                                                label="Unit Price"
                                                type="number"
                                                value={item.price}
                                                onChange={(v) =>
                                                    updateItem(item.id, "price", v)
                                                }
                                            />

                                            <div>
                                                <label className={labelClass}>Line Total</label>
                                                <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800">
                                                    {formatMoney(
                                                        Number(item.quantity || 0) *
                                                        Number(item.price || 0)
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Delivery & Additional Details
                            </h2>

                            <div className="space-y-4">
                                <TextArea
                                    label="Shipping Address"
                                    value={order.shippingAddress}
                                    onChange={(v) => updateField("shippingAddress", v)}
                                    placeholder="Where should the order be delivered?"
                                />

                                <Field
                                    label="Tax Rate (%)"
                                    type="number"
                                    value={order.taxRate}
                                    onChange={(v) => updateField("taxRate", v)}
                                />

                                <TextArea
                                    label="Notes / Special Instructions"
                                    value={order.notes}
                                    onChange={(v) => updateField("notes", v)}
                                    placeholder="Additional instructions, terms, or remarks..."
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={downloading || saving}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-white px-5 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-60"
                            >
                                <Download size={18} />
                                {downloading ? "Generating PDF..." : "Download PDF"}
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving || downloading}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                            >
                                <Save size={18} />
                                {saving ? "Saving..." : "Save Purchase Order"}
                            </button>
                        </div>
                    </section>

                    <aside className="lg:sticky lg:top-6">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                                <h2 className="font-semibold text-gray-900">Live Preview</h2>
                                <p className="text-xs text-gray-500">
                                    Updates as you edit the form.
                                </p>
                            </div>

                            <div className="space-y-6 p-5 sm:p-7">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                                            Purchase Order
                                        </p>
                                        <h3 className="mt-2 text-xl font-bold text-gray-900">
                                            {order.title || "Purchase Order"}
                                        </h3>
                                    </div>
                                    <ShoppingCart className="text-emerald-600" size={30} />
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-400">PO Number</p>
                                        <p className="font-semibold text-gray-800">
                                            {order.orderNumber || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Order Date</p>
                                        <p className="font-semibold text-gray-800">
                                            {order.orderDate || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Delivery Date</p>
                                        <p className="font-semibold text-gray-800">
                                            {order.deliveryDate || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Payment Terms</p>
                                        <p className="font-semibold text-gray-800">
                                            {order.paymentTerms || "—"}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-5 text-sm">
                                    <div>
                                        <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                                            Buyer
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {order.buyerName || "Buyer name"}
                                        </p>
                                        <p className="whitespace-pre-line text-xs text-gray-500">
                                            {order.buyerAddress || "Buyer address"}
                                        </p>
                                        <p className="break-all text-xs text-gray-500">
                                            {order.buyerEmail}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                                            Supplier
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {order.supplierName || "Supplier name"}
                                        </p>
                                        <p className="whitespace-pre-line text-xs text-gray-500">
                                            {order.supplierAddress || "Supplier address"}
                                        </p>
                                        <p className="break-all text-xs text-gray-500">
                                            {order.supplierEmail}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-3 text-sm font-semibold text-gray-800">
                                        Ordered Items
                                    </h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="border-b border-gray-200 text-gray-400">
                                                <tr>
                                                    <th className="py-2 pr-2">Description</th>
                                                    <th className="px-2 py-2 text-right">Qty</th>
                                                    <th className="px-2 py-2 text-right">Price</th>
                                                    <th className="py-2 pl-2 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items.map((item) => (
                                                    <tr key={item.id} className="border-b border-gray-100">
                                                        <td className="py-3 pr-2 text-gray-700">
                                                            {item.description || "Item description"}
                                                        </td>
                                                        <td className="px-2 py-3 text-right text-gray-600">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-2 py-3 text-right text-gray-600">
                                                            {formatMoney(item.price)}
                                                        </td>
                                                        <td className="py-3 pl-2 text-right font-medium text-gray-800">
                                                            {formatMoney(
                                                                Number(item.quantity || 0) *
                                                                Number(item.price || 0)
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="ml-auto max-w-xs space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span>{formatMoney(totals.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Tax ({order.taxRate || 0}%)</span>
                                        <span>{formatMoney(totals.tax)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
                                        <span>Total</span>
                                        <span className="text-emerald-700">
                                            {formatMoney(totals.total)}
                                        </span>
                                    </div>
                                </div>

                                {order.shippingAddress && (
                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="mb-1 text-xs font-bold uppercase text-gray-400">
                                            Shipping Address
                                        </p>
                                        <p className="whitespace-pre-line text-sm text-gray-700">
                                            {order.shippingAddress}
                                        </p>
                                    </div>
                                )}

                                {order.notes && (
                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="mb-1 text-xs font-bold uppercase text-gray-400">
                                            Notes
                                        </p>
                                        <p className="whitespace-pre-line text-sm text-gray-600">
                                            {order.notes}
                                        </p>
                                    </div>
                                )}

                                <p className="border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
                                    Thank you for your business.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
