
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { findUserById } from "@/lib/users";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileLogoutButton from "@/components/ProfileLogoutButton";

import {
    UserRound,
    Mail,
    CalendarDays,
    ShieldCheck,
    FileText,
    ArrowLeft,
    LogOut,
} from "lucide-react";

function formatDate(date) {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

async function ProfileContent() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const user = await findUserById(session.user.id);

    if (!user) {
        redirect("/login");
    }

    const initial = user.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">

                {/* Back Navigation */}
                <Link
                    href="/"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-emerald-700"
                >
                    <ArrowLeft size={17} />
                    Back to Dashboard
                </Link>

                {/* Page Heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-950">
                        My Profile
                    </h1>

                    <p className="mt-2 text-sm text-gray-500 sm:text-base">
                        Manage and view your Formiqo account information.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

                    {/* Profile Header */}
                    <div className="bg-linear-to-r from-emerald-700 to-emerald-500 px-6 py-8 sm:px-9 sm:py-10">
                        <div className="flex flex-col items-center gap-5 sm:flex-row">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white/30 bg-white text-4xl font-extrabold text-emerald-700 shadow-lg">
                                {initial}
                            </div>

                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl font-bold text-white">
                                    {user.name}
                                </h2>

                                <p className="mt-1 text-sm text-emerald-50">
                                    {user.email}
                                </p>

                                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                                    <ShieldCheck size={14} />
                                    Formiqo Account
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="p-6 sm:p-9">
                        <h3 className="mb-6 text-lg font-bold text-gray-900">
                            Account Information
                        </h3>

                        <div className="grid gap-5 sm:grid-cols-2">

                            {/* Full Name */}
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                                <div className="mb-3 flex items-center gap-2 text-emerald-700">
                                    <UserRound size={19} />
                                    <span className="text-sm font-semibold">
                                        Full Name
                                    </span>
                                </div>

                                <p className="wrap-break-word font-bold text-gray-900">
                                    {user.name || "Not available"}
                                </p>
                            </div>

                            {/* Email */}
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                                <div className="mb-3 flex items-center gap-2 text-emerald-700">
                                    <Mail size={19} />
                                    <span className="text-sm font-semibold">
                                        Email Address
                                    </span>
                                </div>

                                <p className="break-all font-bold text-gray-900">
                                    {user.email}
                                </p>

                                <p className="mt-2 text-xs text-gray-500">
                                    {user.emailVerified
                                        ? "Email verified"
                                        : "Email not verified"}
                                </p>
                            </div>

                            {/* Account Created */}
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                                <div className="mb-3 flex items-center gap-2 text-emerald-700">
                                    <CalendarDays size={19} />
                                    <span className="text-sm font-semibold">
                                        Account Created
                                    </span>
                                </div>

                                <p className="font-bold text-gray-900">
                                    {formatDate(user.createdAt)}
                                </p>
                            </div>

                            {/* Login Method */}
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                                <div className="mb-3 flex items-center gap-2 text-emerald-700">
                                    <ShieldCheck size={19} />
                                    <span className="text-sm font-semibold">
                                        Login Method
                                    </span>
                                </div>

                                <p className="font-bold capitalize text-gray-900">
                                    {user.provider || "Credentials"}
                                </p>
                            </div>
                        </div>

                        {/* Documents Link */}
                        <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 sm:flex sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="rounded-xl bg-white p-2.5 text-emerald-700">
                                    <FileText size={21} />
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-900">
                                        Your Documents
                                    </h4>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Access your saved documents anytime.
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/documents"
                                className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 sm:mt-0"
                            >
                                My Documents
                            </Link>
                        </div>

                        {/* Logout */}
                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <p className="mb-4 text-sm text-gray-500">
                                Want to leave your account?
                            </p>

                            <ProfileLogoutButton />
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    Your account information is private and securely stored.
                </p>
            </div>
        </main>
    );
}

export default function ProfilePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-500">Loading profile...</p>
                </div>
            }
        >
            <ProfileContent />
        </Suspense>
    );
}

