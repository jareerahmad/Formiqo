
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowLeft,
    Loader2,
} from "lucide-react";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Invalid reset link",
                text: "This password-reset link is missing its token.",
                confirmButtonColor: "#059669",
            });
            return;
        }

        if (password.length < 8 || password.length > 72) {
            Swal.fire({
                icon: "warning",
                title: "Invalid password",
                text: "Your password must be between 8 and 72 characters.",
                confirmButtonColor: "#059669",
            });
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire({
                icon: "warning",
                title: "Passwords do not match",
                text: "Please enter the same password in both fields.",
                confirmButtonColor: "#059669",
            });
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to reset your password.");
            }

            await Swal.fire({
                icon: "success",
                title: "Password updated!",
                text: data.message,
                confirmButtonColor: "#059669",
            });

            router.push("/login");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Reset failed",
                text: error.message || "Please request a new reset link.",
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
                    href="/forgot-password"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-emerald-600"
                >
                    <ArrowLeft size={16} />
                    Back
                </Link>

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <LockKeyhole size={27} />
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Create a new password
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                    Choose a new password for your Formiqo account.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            New password
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                maxLength={72}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Confirm new password
                        </label>

                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                maxLength={72}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                aria-label={
                                    showConfirmPassword ? "Hide password" : "Show password"
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={19} />
                                ) : (
                                    <Eye size={19} />
                                )}
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500">
                        Use at least 8 characters. Maximum 72 characters.
                    </p>

                    <button
                        type="submit"
                        disabled={loading || !token}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Updating password...
                            </>
                        ) : (
                            "Reset password"
                        )}
                    </button>
                </form>

                {!token && (
                    <p className="mt-4 text-center text-sm text-red-600">
                        Reset token missing. Please request a new password-reset link.
                    </p>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[60vh] items-center justify-center">
                    <p className="text-sm text-gray-500">Loading...</p>
                </div>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    );
}
