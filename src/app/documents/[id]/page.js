
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { generateInvoicePdf } from "@/lib/generate-invoice-pdf";
import { generateCVPdf } from "@/lib/generate-cv-pdf";
import { generateLetterPdf } from "@/lib/generate-letter-pdf";
import { generateQuotationPdf } from "@/lib/generate-quotation-pdf";
import { generateReceiptPdf } from "@/lib/generate-receipt-pdf";
import { generateCoverLetterPdf } from "@/lib/generate-cover-letter-pdf";
import { generateBusinessProposalPdf } from "@/lib/generate-business-proposal-pdf";
import { generatePurchaseOrderPdf } from "@/lib/generate-purchase-order-pdf";
import { generatePaymentReminderPdf } from "@/lib/generate-payment-reminder-pdf";
import { generateExpenseReportPdf } from "@/lib/generate-expense-report-pdf";
import { generateMeetingMinutesPdf } from "@/lib/generate-meeting-minutes-pdf";
import { generateResignationLetterPdf } from "@/lib/generate-resignation-letter-pdf";
import { generateFormalEmailPdf } from "@/lib/generate-formal-email-pdf";
import { generateCertificatePdf } from "@/lib/generate-certificate-pdf";
import {
    ArrowLeft,
    Download,
    LoaderCircle,
    AlertCircle,
} from "lucide-react";
import { getDocumentById } from "@/lib/documents";

function formatMoney(value, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(Number(value) || 0);
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleDateString();
}

function DocumentDetailsContent() {
    const params = useParams();
    const id = params.id;

    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        let cancelled = false;

        async function loadDocument() {
            setLoading(true);
            setError("");

            try {
                const result = await getDocumentById(id);

                if (!cancelled) {
                    setDocument(result);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Unable to load this document.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadDocument();

        return () => {
            cancelled = true;
        };
    }, [id]);

    async function downloadPdf() {
        if (!document) return;

        try {
            Swal.fire({
                title: "Preparing your PDF...",
                text: "Please wait while Formiqo generates your document.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            if (document.type === "invoice") {
                await generateInvoicePdf(document.data);
            } else if (document.type === "cv") {
                await generateCVPdf(document.data);
            } else if (document.type === "letter") {
                await generateLetterPdf(document.data);
            } else if (document.type === "quotation") {
                await generateQuotationPdf(document.data);
            } else if (document.type === "receipt") {
                await generateReceiptPdf(document.data);
            } else if (document.type === "cover-letter") {
                await generateCoverLetterPdf(document.data);
            } else if (document.type === "business-proposal") {
                await generateBusinessProposalPdf(document.data);
            } else if (document.type === "purchase-order") {
                await generatePurchaseOrderPdf(document.data);
            } else if (document.type === "payment-reminder") {
                await generatePaymentReminderPdf(document.data);
            } else if (document.type === "expense-report") {
                await generateExpenseReportPdf(document.data);
            } else if (document.type === "meeting-minutes") {
                await generateMeetingMinutesPdf(document.data);
            } else if (document.type === "resignation-letter") {
                await generateResignationLetterPdf(document.data);
            } else if (document.type === "formal-email") {
                await generateFormalEmailPdf(document.data);
            } else if (document.type === "certificate") {
                await generateCertificatePdf(document.data);
            } else {
                Swal.close();

                await Swal.fire({
                    icon: "info",
                    title: "PDF template unavailable",
                    text: `PDF downloading for "${document.type}" has not been connected yet.`,
                    confirmButtonColor: "#059669",
                });

                return;
            }

            Swal.close();

            await Swal.fire({
                icon: "success",
                title: "PDF downloaded!",
                text: "Your document has been downloaded successfully.",
                confirmButtonColor: "#059669",
            });
        } catch (error) {
            Swal.close();

            console.error("PDF download error:", error);

            await Swal.fire({
                icon: "error",
                title: "Download failed",
                text: error.message || "Unable to generate your PDF. Please try again.",
                confirmButtonColor: "#059669",
            });
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
                <LoaderCircle className="animate-spin text-emerald-600" size={30} />
                <p className="text-sm text-gray-500">Opening your document...</p>
            </div>
        );
    }

    if (error && !document) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                <AlertCircle className="mx-auto text-red-500" size={36} />
                <h1 className="mt-4 text-2xl font-bold text-gray-900">
                    Unable to open document
                </h1>
                <p className="mt-2 text-sm text-gray-600">{error}</p>
                <Link
                    href="/documents"
                    className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                    Back to My Documents
                </Link>
            </div>
        );
    }

    if (!document) return null;

    const data = document.data || {};
    const isInvoice = document.type === "invoice";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                    <Link
                        href="/documents"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-700"
                    >
                        <ArrowLeft size={17} />
                        Back to My Documents
                    </Link>

                    <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-semibold text-emerald-700">
                                {String(document.type || "document").toUpperCase()}
                            </p>
                            <h1 className="mt-1 wrap-break-word text-3xl font-bold text-gray-900">
                                {document.title || "Untitled document"}
                            </h1>
                            <p className="mt-2 text-sm text-gray-500">
                                Saved {formatDate(document.createdAt)}
                            </p>
                        </div>

                        <button
                            onClick={downloadPdf}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
                        >
                            <Download size={18} />
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mx-auto max-w-5xl px-4 pt-5 sm:px-6 lg:px-8">
                    <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </p>
                </div>
            )}

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
                    <div className="flex items-start justify-between gap-4 border-b-2 border-emerald-500 pb-6">
                        <div>
                            <p className="text-2xl font-extrabold text-emerald-700">
                                Formiqo
                            </p>
                            {isInvoice && (
                                <div className="mt-3 space-y-1 text-sm text-gray-600">
                                    <p>{data.businessName || "Business name not provided"}</p>
                                    <p>{data.businessEmail || "Business email not provided"}</p>
                                    {data.businessAddress && (
                                        <p className="whitespace-pre-wrap">{data.businessAddress}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="text-right">
                            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                {document.title || "Document"}
                            </h2>
                            {isInvoice && (
                                <>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Invoice: {data.invoiceNumber || "—"}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Issued: {formatDate(data.issueDate)}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Due: {formatDate(data.dueDate)}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {isInvoice ? (
                        <>
                            <div className="mt-8">
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                                    Bill to
                                </p>
                                <p className="mt-2 font-semibold text-gray-900">
                                    {data.customerName || "Customer name"}
                                </p>
                                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                                    {[data.customerEmail, data.customerAddress]
                                        .filter(Boolean)
                                        .join("\n") || "No additional customer details"}
                                </p>
                            </div>

                            <div className="mt-8 overflow-x-auto">
                                <table className="w-full min-w-110 text-left text-sm">
                                    <thead>
                                        <tr className="bg-emerald-50 text-xs uppercase text-gray-600">
                                            <th className="px-3 py-3">Description</th>
                                            <th className="px-3 py-3 text-right">Qty</th>
                                            <th className="px-3 py-3 text-right">Price</th>
                                            <th className="px-3 py-3 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data.items || []).map((item, index) => (
                                            <tr
                                                key={item.id ?? index}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="whitespace-pre-wrap px-3 py-4">
                                                    {item.description || "Item"}
                                                </td>
                                                <td className="px-3 py-4 text-right">
                                                    {Number(item.quantity) || 0}
                                                </td>
                                                <td className="px-3 py-4 text-right">
                                                    {formatMoney(item.price, data.currency)}
                                                </td>
                                                <td className="px-3 py-4 text-right font-medium">
                                                    {formatMoney(
                                                        (Number(item.quantity) || 0) *
                                                        (Number(item.price) || 0),
                                                        data.currency
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="ml-auto mt-8 max-w-xs space-y-3 text-sm">
                                <div className="flex justify-between gap-4 text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatMoney(data.subtotal, data.currency)}</span>
                                </div>
                                <div className="flex justify-between gap-4 text-gray-600">
                                    <span>Tax ({Number(data.taxRate) || 0}%)</span>
                                    <span>{formatMoney(data.tax, data.currency)}</span>
                                </div>
                                <div className="flex justify-between gap-4 border-t border-gray-200 pt-4 text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>{formatMoney(data.total, data.currency)}</span>
                                </div>
                            </div>

                            {data.notes && (
                                <div className="mt-8 border-t border-gray-100 pt-5">
                                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                                        Notes
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                                        {data.notes}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="mt-8 space-y-6">
                            {Object.entries(data).map(([key, value]) => {
                                if (
                                    value === null ||
                                    value === undefined ||
                                    value === "" ||
                                    typeof value === "object"
                                ) {
                                    return null;
                                }

                                return (
                                    <div key={key}>
                                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                                            {key.replace(/([A-Z])/g, " $1")}
                                        </p>
                                        <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-gray-800">
                                            {String(value)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-10 border-t border-gray-100 pt-5 text-center text-xs text-gray-400">
                        Created with Formiqo
                    </div>
                </article>
            </main>
        </div>
    );
}

export default function DocumentDetailsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-500">Loading document...</p>
                </div>
            }
        >
            <DocumentDetailsContent />
        </Suspense>
    );
}