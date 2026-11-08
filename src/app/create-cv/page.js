
"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { generateCVPdf } from "@/lib/generate-cv-pdf";
import {
    Download,
    Save,
    FileText,
    UserRound,
    BriefcaseBusiness,
    GraduationCap,
    Sparkles,
} from "lucide-react";
import { saveDocument } from "@/lib/documents";

const initialCV = {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    projects: "",
};

const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const fields = [
    { name: "fullName", label: "Full name", placeholder: "e.g. Alex Morgan", required: true },
    { name: "jobTitle", label: "Professional title", placeholder: "e.g. Frontend Developer" },
    { name: "email", label: "Email address", placeholder: "you@example.com" },
    { name: "phone", label: "Phone number", placeholder: "+1 234 567 890" },
    { name: "location", label: "Location", placeholder: "City, Country" },
    { name: "website", label: "Portfolio or LinkedIn", placeholder: "https://..." },
];

const sections = [
    {
        name: "summary",
        label: "Professional summary",
        placeholder: "Briefly introduce your experience, strengths, and career goals...",
        rows: 4,
        icon: Sparkles,
    },
    {
        name: "experience",
        label: "Work experience",
        placeholder: "Job title — Company — Dates\nDescribe your responsibilities and achievements...",
        rows: 5,
        icon: BriefcaseBusiness,
    },
    {
        name: "education",
        label: "Education",
        placeholder: "Degree or qualification — Institution — Year",
        rows: 3,
        icon: GraduationCap,
    },
    {
        name: "skills",
        label: "Skills",
        placeholder: "JavaScript, React, Node.js, communication...",
        rows: 3,
        icon: Sparkles,
    },
    {
        name: "projects",
        label: "Projects and achievements",
        placeholder: "Project name — What you built and achieved...",
        rows: 4,
        icon: FileText,
    },
];

export default function CreateCVPage() {
    const [cv, setCV] = useState(initialCV);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    function updateField(name, value) {
        setCV((current) => ({ ...current, [name]: value }));
    }

    async function downloadCV() {
        try {
            Swal.fire({
                title: "Preparing your CV",
                text: "Please wait while your PDF is generated.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading(),
            });

            await generateCVPdf(cv);

            Swal.close();

            await Swal.fire({
                icon: "success",
                title: "CV downloaded!",
                text: "Your PDF is ready.",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.close();

            await Swal.fire({
                icon: "error",
                title: "Download failed",
                text: error.message || "Unable to generate your CV.",
            });
        }
    }

    async function handleSave() {
        if (!cv.fullName.trim()) {
            await Swal.fire({
                icon: "warning",
                title: "Name required",
                text: "Please enter your full name before saving your CV.",
            });
            return;
        }

        try {
            Swal.fire({
                title: "Saving your CV",
                text: "Please wait...",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading(),
            });

            await saveDocument({
                title: `${cv.fullName.trim()} - CV`,
                type: "cv",
                data: { ...cv },
            });

            await Swal.fire({
                icon: "success",
                title: "CV saved!",
                text: "Your CV is now available in My Documents.",
                confirmButtonColor: "#059669",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Unable to save",
                text: error.message || "Please try again.",
            });
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                        <UserRound size={16} />
                        CV / Resume Builder
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Build a CV that represents you.
                    </h1>

                    <p className="mt-3 max-w-2xl text-gray-600">
                        Add your information, preview your resume, and
                        download a professional PDF whenever you are ready.
                    </p>
                </div>

                {message && (
                    <div
                        role="status"
                        className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                    >
                        {message}
                    </div>
                )}

                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                        <h2 className="mb-6 text-xl font-bold text-gray-900">
                            Your information
                        </h2>

                        <div className="grid gap-5 sm:grid-cols-2">
                            {fields.map((field) => (
                                <div
                                    key={field.name}
                                    className={
                                        field.name === "fullName" ||
                                            field.name === "jobTitle" ||
                                            field.name === "website"
                                            ? "sm:col-span-2"
                                            : ""
                                    }
                                >
                                    <label
                                        htmlFor={field.name}
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        {field.label}
                                        {field.required && (
                                            <span className="ml-1 text-emerald-600">
                                                *
                                            </span>
                                        )}
                                    </label>

                                    <input
                                        id={field.name}
                                        required={field.required}
                                        value={cv[field.name]}
                                        onChange={(event) =>
                                            updateField(
                                                field.name,
                                                event.target.value
                                            )
                                        }
                                        placeholder={field.placeholder}
                                        className={inputClass}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-7 space-y-6">
                            {sections.map((section) => {
                                const Icon = section.icon;

                                return (
                                    <div key={section.name}>
                                        <label
                                            htmlFor={section.name}
                                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                                        >
                                            <Icon
                                                size={17}
                                                className="text-emerald-600"
                                            />
                                            {section.label}
                                        </label>

                                        <textarea
                                            id={section.name}
                                            rows={section.rows}
                                            value={cv[section.name]}
                                            onChange={(event) =>
                                                updateField(
                                                    section.name,
                                                    event.target.value
                                                )
                                            }
                                            placeholder={section.placeholder}
                                            className={`${inputClass} resize-y`}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={downloadCV}
                                disabled={downloading}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-600 px-5 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Download size={18} />
                                {downloading ? "Generating..." : "Download PDF"}
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={18} />
                                {saving ? "Saving..." : "Save CV"}
                            </button>
                        </div>
                    </section>

                    <section className="lg:sticky lg:top-6">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">
                                Live preview
                            </h2>
                            <span className="text-xs font-medium text-gray-500">
                                Updates as you type
                            </span>
                        </div>

                        <div className="min-h-[650px] overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-9">
                            <div className="border-b-2 border-emerald-500 pb-5">
                                <h3 className="break-words text-2xl font-bold text-emerald-700 sm:text-3xl">
                                    {cv.fullName || "Your Name"}
                                </h3>

                                <p className="mt-2 text-base font-medium text-gray-700">
                                    {cv.jobTitle || "Your Professional Title"}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                                    {[cv.email, cv.phone, cv.location, cv.website]
                                        .filter(Boolean)
                                        .map((value, index) => (
                                            <span key={`${index}-${value}`}>
                                                {value}
                                            </span>
                                        ))}
                                </div>
                            </div>

                            {sections.map((section) => {
                                if (!cv[section.name].trim()) return null;

                                return (
                                    <div key={section.name} className="mt-6">
                                        <h4 className="mb-2 border-b border-emerald-100 pb-2 text-sm font-bold uppercase tracking-wider text-emerald-700">
                                            {section.label === "Projects and achievements"
                                                ? "Projects & Achievements"
                                                : section.label}
                                        </h4>

                                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                                            {cv[section.name]}
                                        </p>
                                    </div>
                                );
                            })}

                            {!cv.summary &&
                                !cv.experience &&
                                !cv.education &&
                                !cv.skills &&
                                !cv.projects && (
                                    <div className="flex min-h-64 flex-col items-center justify-center text-center">
                                        <FileText
                                            size={35}
                                            className="mb-3 text-emerald-200"
                                        />
                                        <p className="font-semibold text-gray-700">
                                            Your CV preview will appear here
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Start filling in your details.
                                        </p>
                                    </div>
                                )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
