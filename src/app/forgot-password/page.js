
"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!email.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Email required",
                text: "Please enter your email address.",
                confirmButtonColor: "#059669",
            });
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            await Swal.fire({
                icon: "success",
                title: "Check your email",
                text: data.message,
                confirmButtonColor: "#059669",
            });

            setEmail("");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Request failed",
                text: error.message || "Please try again later.",
                confirmButtonColor: "#059669",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-sm sm:p-9">
                <Link
                    href="/login"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-emerald-600"
                >
                    <ArrowLeft size={16} />
                    Back to login
                </Link>

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Mail size={27} />
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Forgot your password?
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                    Enter the email address associated with your Formiqo account.
                    We&apos;ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Email address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Sending link...
                            </>
                        ) : (
                            "Send reset link"
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
