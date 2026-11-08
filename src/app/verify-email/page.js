
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
    MailCheck,
    Loader2,
    CircleCheck,
    CircleX,
} from "lucide-react";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token") || "";

    const [status, setStatus] = useState("verifying");

    useEffect(() => {
        let cancelled = false;

        async function verifyEmail() {
            if (!token) {
                setStatus("error");
                return;
            }

            try {
                const response = await fetch("/api/auth/verify-email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Verification failed.");
                }

                if (!cancelled) {
                    setStatus("success");

                    await Swal.fire({
                        icon: "success",
                        title: "Email verified!",
                        text: data.message,
                        confirmButtonColor: "#059669",
                    });

                    router.replace("/login");
                }
            } catch (error) {
                if (!cancelled) {
                    setStatus("error");
                    console.error("Email verification error:", error);
                }
            }
        }

        verifyEmail();

        return () => {
            cancelled = true;
        };
    }, [token, router]);

    return (
        <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm sm:p-9">
                {status === "verifying" && (
                    <>
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <Loader2 size={32} className="animate-spin" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900">
                            Verifying your email
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-gray-500">
                            Please wait while we verify your Formiqo account.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <CircleCheck size={34} />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900">
                            Email verified!
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-gray-500">
                            Your email address has been successfully verified.
                            You can now sign in to Formiqo.
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                            <CircleX size={34} />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900">
                            Verification unsuccessful
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-gray-500">
                            This verification link may be invalid, expired, or already used.
                            Please request a new verification email.
                        </p>

                        <Link
                            href="/resend-verification"
                            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
                        >
                            Request new verification email
                        </Link>
                    </>
                )}

                {status === "verifying" && (
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                        <MailCheck size={17} />
                        Formiqo account verification
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[60vh] items-center justify-center">
                    <p className="text-sm text-gray-500">Loading...</p>
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}
