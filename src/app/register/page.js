
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, FileText, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const update = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            Swal.fire("Password mismatch", "Your passwords do not match.", "warning");
            return;
        }

        if (form.password.length < 8) {
            Swal.fire(
                "Weak password",
                "Your password must contain at least 8 characters.",
                "warning"
            );
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Registration failed.");
            }

            await Swal.fire({
                icon: "success",
                title: "Account created!",
                text: "Your Formiqo account has been created. You can now sign in.",
                confirmButtonColor: "#059669",
            });

            sessionStorage.setItem(
                "formiqo-registration-pending-verification",
                "true"
            );

            router.push("/login");
        } catch (error) {
            Swal.fire("Registration failed", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
            <div className="w-full max-w-md">
                <div className="mb-7 text-center">
                    <Link
                        href="/"
                        className="mb-5 inline-flex items-center justify-center gap-2"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                            <FileText size={23} />
                        </span>
                        <span className="text-2xl font-bold tracking-tight text-gray-900">
                            Formiqo<span className="text-emerald-600">.</span>
                        </span>
                    </Link>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Create your account
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Join Formiqo and manage your documents easily.
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                minLength={2}
                                maxLength={80}
                                autoComplete="name"
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                                placeholder="Enter your full name"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                maxLength={254}
                                autoComplete="email"
                                value={form.email}
                                onChange={(e) => update("email", e.target.value)}
                                placeholder="you@example.com"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    maxLength={72}
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={(e) => update("password", e.target.value)}
                                    placeholder="Create a password"
                                    className={`${inputClass} pr-12`}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    maxLength={72}
                                    autoComplete="new-password"
                                    value={form.confirmPassword}
                                    onChange={(e) =>
                                        update("confirmPassword", e.target.value)
                                    }
                                    placeholder="Confirm your password"
                                    className={`${inputClass} pr-12`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs text-gray-400">OR</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-emerald-700 hover:text-emerald-800"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    By creating an account, you agree to Formiqo's Terms and Privacy Policy.
                </p>
            </div>
        </main>
    );
}
