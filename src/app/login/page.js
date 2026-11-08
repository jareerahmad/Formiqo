
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
    Eye,
    EyeOff,
    FileText,
    Loader2,
    Mail,
} from "lucide-react";
import Swal from "sweetalert2";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [showVerificationMessage, setShowVerificationMessage] = useState(false);

    const inputClass =
        "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                await Swal.fire({
                    icon: "error",
                    title: "Login failed",
                    text: "Invalid email or password.",
                    confirmButtonColor: "#059669",
                });
                return;
            }

            await Swal.fire({
                icon: "success",
                title: "Welcome back!",
                text: "You have successfully logged in.",
                timer: 1500,
                showConfirmButton: false,
            });

            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Login error:", error);
            Swal.fire("Error", "Unable to log in. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);

        try {
            await signIn("google", {
                callbackUrl: "/",
            });
        } catch (error) {
            console.error("Google login error:", error);
            setGoogleLoading(false);

            Swal.fire(
                "Google login failed",
                "Unable to continue with Google. Please try again.",
                "error"
            );
        }
    };

    useEffect(() => {
        const pending = sessionStorage.getItem(
            "formiqo-registration-pending-verification"
        );

        if (pending === "true") {
            setShowVerificationMessage(true);

            sessionStorage.removeItem(
                "formiqo-registration-pending-verification"
            );
        }
    }, []);

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
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to access your Formiqo workspace.
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>

                            {showVerificationMessage && (
                                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                    <p className="font-semibold text-emerald-800">
                                        Account created successfully!
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-emerald-700">
                                        Please check your email inbox for the verification email we sent
                                        you. Open that email and click the verification link to activate
                                        your account before signing in. If you cannot find it, check your
                                        spam folder.
                                    </p>

                                    <a
                                        href="/resend-verification"
                                        className="mt-2 inline-block text-sm font-semibold text-emerald-800 underline"
                                    >
                                        Resend verification email
                                    </a>
                                </div>
                            )}

                            <div className="mb-2 flex items-center justify-between gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                            </div>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Password
                                </label>

                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
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

                        <button
                            type="submit"
                            disabled={loading || googleLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs text-gray-400">OR CONTINUE WITH</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading || googleLoading}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {googleLoading ? (
                            <Loader2 size={19} className="animate-spin" />
                        ) : (
                            <svg viewBox="0 0 48 48" className="h-5 w-5">
                                <path
                                    fill="#EA4335"
                                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                    transform="translate(0 4)"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.98 46.98 31.85 46.98 24.55z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78z"
                                    transform="translate(0 4)"
                                />
                                <path
                                    fill="#34A853"
                                    d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.9 2.3-8.18 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                    transform="translate(0 -4)"
                                />
                            </svg>
                        )}

                        {googleLoading ? "Connecting..." : "Continue with Google"}
                    </button>

                    <div className="mt-7 border-t border-gray-100 pt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    Your documents, organized in one place.
                </p>
            </div>
        </main>
    );
}
