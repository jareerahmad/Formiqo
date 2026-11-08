
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";

import {
    FileText,
    LayoutDashboard,
    Files,
    Menu,
    X,
    ChevronRight,
    ChevronDown,
    UserRound,
    LogOut,
} from "lucide-react";

const navigation = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "My Documents", href: "/documents", icon: Files },
];

export default function Header() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const profileRef = useRef(null);

    const isLoggedIn = status === "authenticated";

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileMenuOpen(false);
            }
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setProfileMenuOpen(false);
                setMobileMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    function isActive(item) {
        if (item.href === "/") return pathname === "/";
        if (item.href === "/documents") {
            return pathname.startsWith("/documents");
        }
        return false;
    }

    async function handleLogout() {
        setProfileMenuOpen(false);
        setMobileMenuOpen(false);

        await signOut({ callbackUrl: "/login" });
    }

    const userName =
        session?.user?.name ||
        session?.user?.email?.split("@")[0] ||
        "My Account";

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-xl">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex shrink-0 items-center gap-2.5"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 transition group-hover:bg-emerald-700">
                        <FileText size={22} strokeWidth={2.2} />
                    </span>

                    <span className="text-2xl font-extrabold tracking-tight text-gray-950">
                        Formi<span className="text-emerald-600">qo</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
                                    }`}
                            >
                                <Icon size={17} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        href="/#tools"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                        Create a document
                        <ChevronRight size={17} />
                    </Link>

                    {status === "unauthenticated" && (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-xl border border-emerald-600 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                            >
                                Register
                            </Link>
                        </div>
                    )}

                    {isLoggedIn && (
                        <div className="relative" ref={profileRef}>
                            <button
                                type="button"
                                onClick={() =>
                                    setProfileMenuOpen((open) => !open)
                                }
                                aria-expanded={profileMenuOpen}
                                className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 transition hover:bg-gray-50"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                    <UserRound size={17} />
                                </span>

                                <span className="max-w-27.5 truncate text-sm font-semibold text-gray-800">
                                    My Profile
                                </span>

                                <ChevronDown
                                    size={16}
                                    className={`text-gray-500 transition ${profileMenuOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {profileMenuOpen && (
                                <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                                    <div className="border-b border-gray-100 px-4 py-4">
                                        <p className="text-sm font-bold text-gray-900">
                                            {userName}
                                        </p>
                                        <p className="mt-1 truncate text-xs text-gray-500">
                                            {session?.user?.email}
                                        </p>
                                    </div>

                                    <div className="p-2">
                                        <Link
                                            href="/profile"
                                            onClick={() =>
                                                setProfileMenuOpen(false)
                                            }
                                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                                        >
                                            <UserRound size={18} />
                                            My Profile
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileMenuOpen}
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:bg-gray-100 md:hidden"
                >
                    {mobileMenuOpen ? (
                        <X size={21} />
                    ) : (
                        <Menu size={21} />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <nav className="border-t border-gray-100 bg-white px-4 py-4 shadow-lg md:hidden">
                    <div className="mx-auto flex max-w-7xl flex-col gap-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Link>
                            );
                        })}

                        <Link
                            href="/#tools"
                            onClick={() => setMobileMenuOpen(false)}
                            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                        >
                            Create a document
                            <ChevronRight size={17} />
                        </Link>

                        <div className="my-2 border-t border-gray-100" />

                        {status === "unauthenticated" && (
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    href="/login"
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className="rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-emerald-700"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        {isLoggedIn && (
                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setProfileMenuOpen((open) => !open)
                                    }
                                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800"
                                >
                                    <span className="flex items-center gap-3">
                                        <UserRound
                                            size={18}
                                            className="text-emerald-600"
                                        />
                                        My Profile
                                    </span>

                                    <ChevronDown
                                        size={17}
                                        className={`transition ${profileMenuOpen
                                            ? "rotate-180"
                                            : ""
                                            }`}
                                    />
                                </button>

                                {profileMenuOpen && (
                                    <div className="border-t border-gray-100 p-2">
                                        <p className="truncate px-3 py-2 text-xs text-gray-500">
                                            {session?.user?.email}
                                        </p>

                                        <Link
                                            href="/profile"
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                setProfileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                                        >
                                            <UserRound size={17} />
                                            View Profile
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut size={17} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
}
