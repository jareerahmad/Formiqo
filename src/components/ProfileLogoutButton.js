"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function ProfileLogoutButton() {
    return (
        <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
            <LogOut size={17} />
            Logout
        </button>
    );
}