
import Link from "next/link";
import { FileText, ArrowUpRight, Mail } from "lucide-react";

const documentTools = [
    { label: "Invoice", href: "/create-invoice" },
    { label: "CV / Resume", href: "/create-cv" },
    { label: "Formal Letter", href: "/create-letter" },
    { label: "Quotation", href: "/create-quotation" },
    { label: "Receipt", href: "/create-receipt" },
    { label: "Formal Email", href: "/create-email" },
    { label: "Certificate", href: "/create-certificate" },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="sm:col-span-2 lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2.5">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                                <FileText size={22} strokeWidth={2.2} />
                            </span>
                            <span className="text-2xl font-extrabold tracking-tight text-gray-950">
                                Formi<span className="text-emerald-600">qo</span>
                            </span>
                        </Link>

                        <p className="mt-4 max-w-md text-sm leading-7 text-gray-600">
                            Create professional documents in one place. From invoices and
                            quotations to formal emails and certificates, Formiqo helps you
                            turn your information into polished documents.
                        </p>

                        <Link
                            href="/#tools"
                            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
                        >
                            Explore document tools
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-950">
                            Document Tools
                        </h3>

                        <ul className="mt-4 space-y-3">
                            {documentTools.map((tool) => (
                                <li key={tool.href}>
                                    <Link
                                        href={tool.href}
                                        className="text-sm text-gray-600 transition hover:text-emerald-700"
                                    >
                                        {tool.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-950">
                            Your Workspace
                        </h3>

                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link
                                    href="/"
                                    className="text-sm text-gray-600 transition hover:text-emerald-700"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/documents"
                                    className="text-sm text-gray-600 transition hover:text-emerald-700"
                                >
                                    My Documents
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/help"
                                    className="text-sm text-gray-600 transition hover:text-emerald-700"
                                >
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-sm text-gray-600 transition hover:text-emerald-700"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>

                        <a
                            href="mailto:support@formiqo.com"
                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-emerald-700"
                        >
                            <Mail size={16} />
                            Contact support
                        </a>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {currentYear} Formiqo. All rights reserved.</p>
                    <p>Make documents. Make an impression.</p>
                </div>
            </div>
        </footer>
    );
}
