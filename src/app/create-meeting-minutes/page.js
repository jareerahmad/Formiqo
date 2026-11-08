
"use client";

import { useState } from "react";
import { Plus, Trash2, Download, Save, FileText } from "lucide-react";
import Swal from "sweetalert2";
import { saveDocument } from "@/lib/documents";
import { generateMeetingMinutesPdf } from "@/lib/generate-meeting-minutes-pdf";

function Field({ label, value, onChange, type = "text", placeholder = "" }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
        </div>
    );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
            </label>
            <textarea
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
        </div>
    );
}

const initialData = {
    title: "Meeting Minutes",
    meetingNumber: "",
    meetingDate: new Date().toISOString().slice(0, 10),
    meetingTime: "",
    location: "",
    meetingType: "Team Meeting",
    organizer: "",
    chairperson: "",
    attendees: "",
    apologies: "",
    preparedBy: "",
    agenda: "",
    discussion: "",
    decisions: "",
    actionItems: [],
    nextMeeting: "",
    notes: "",
};

export default function CreateMeetingMinutesPage() {
    const [form, setForm] = useState(initialData);
    const [saving, setSaving] = useState(false);

    const update = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const addActionItem = () => {
        setForm((prev) => ({
            ...prev,
            actionItems: [
                ...prev.actionItems,
                {
                    id: Date.now(),
                    task: "",
                    assignedTo: "",
                    dueDate: "",
                    status: "Pending",
                },
            ],
        }));
    };

    const updateActionItem = (id, key, value) => {
        setForm((prev) => ({
            ...prev,
            actionItems: prev.actionItems.map((item) =>
                item.id === id ? { ...item, [key]: value } : item
            ),
        }));
    };

    const removeActionItem = (id) => {
        setForm((prev) => ({
            ...prev,
            actionItems: prev.actionItems.filter((item) => item.id !== id),
        }));
    };

    const handleDownload = () => {
        if (!form.title.trim()) {
            Swal.fire("Missing title", "Please enter a meeting title.", "warning");
            return;
        }

        generateMeetingMinutesPdf(form);
    };

    const handleSave = async () => {
        if (!form.title.trim() || !form.meetingDate) {
            Swal.fire(
                "Missing information",
                "Please enter the meeting title and date.",
                "warning"
            );
            return;
        }

        setSaving(true);

        try {
            await saveDocument({
                title: form.title.trim(),
                type: "meeting-minutes",
                data: form,
            });

            await Swal.fire(
                "Saved!",
                "Your meeting minutes have been saved successfully.",
                "success"
            );
        } catch (error) {
            console.error("Save meeting minutes error:", error);
            Swal.fire("Error", "Unable to save meeting minutes.", "error");
        } finally {
            setSaving(false);
        }
    };

    const totalActions = form.actionItems.length;

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-2 text-emerald-700">
                        <FileText size={20} />
                        <span className="text-sm font-semibold">Formiqo Document Tools</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Meeting Minutes Generator
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Record meeting details, discussions, decisions, and assigned tasks.
                    </p>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <section className="space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Meeting Information
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Meeting Title *"
                                        value={form.title}
                                        onChange={(e) => update("title", e.target.value)}
                                        placeholder="Weekly Team Meeting"
                                    />
                                </div>

                                <Field
                                    label="Meeting Number"
                                    value={form.meetingNumber}
                                    onChange={(e) => update("meetingNumber", e.target.value)}
                                    placeholder="MTG-001"
                                />

                                <Field
                                    label="Meeting Date *"
                                    type="date"
                                    value={form.meetingDate}
                                    onChange={(e) => update("meetingDate", e.target.value)}
                                />

                                <Field
                                    label="Meeting Time"
                                    type="time"
                                    value={form.meetingTime}
                                    onChange={(e) => update("meetingTime", e.target.value)}
                                />

                                <Field
                                    label="Location"
                                    value={form.location}
                                    onChange={(e) => update("location", e.target.value)}
                                    placeholder="Conference Room / Online"
                                />

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Meeting Type
                                    </label>
                                    <select
                                        value={form.meetingType}
                                        onChange={(e) => update("meetingType", e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 text-gray-900 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                                    >
                                        <option>Team Meeting</option>
                                        <option>Board Meeting</option>
                                        <option>Project Meeting</option>
                                        <option>Client Meeting</option>
                                        <option>General Meeting</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <Field
                                    label="Organizer"
                                    value={form.organizer}
                                    onChange={(e) => update("organizer", e.target.value)}
                                    placeholder="Organizer name"
                                />

                                <Field
                                    label="Chairperson"
                                    value={form.chairperson}
                                    onChange={(e) => update("chairperson", e.target.value)}
                                    placeholder="Chairperson name"
                                />

                                <Field
                                    label="Prepared By"
                                    value={form.preparedBy}
                                    onChange={(e) => update("preparedBy", e.target.value)}
                                    placeholder="Your name"
                                />

                                <div className="sm:col-span-2">
                                    <TextArea
                                        label="Attendees"
                                        value={form.attendees}
                                        onChange={(e) => update("attendees", e.target.value)}
                                        placeholder="List attendees, separated by commas..."
                                        rows={2}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <TextArea
                                        label="Apologies / Absentees"
                                        value={form.apologies}
                                        onChange={(e) => update("apologies", e.target.value)}
                                        placeholder="Names of people who could not attend..."
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Agenda & Discussion
                            </h2>

                            <div className="space-y-4">
                                <TextArea
                                    label="Meeting Agenda"
                                    value={form.agenda}
                                    onChange={(e) => update("agenda", e.target.value)}
                                    placeholder="1. Review previous tasks&#10;2. Discuss project progress&#10;3. Plan next steps"
                                />

                                <TextArea
                                    label="Discussion Summary"
                                    value={form.discussion}
                                    onChange={(e) => update("discussion", e.target.value)}
                                    placeholder="Summarize the important points discussed..."
                                />

                                <TextArea
                                    label="Key Decisions"
                                    value={form.decisions}
                                    onChange={(e) => update("decisions", e.target.value)}
                                    placeholder="Record decisions made during the meeting..."
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Action Items
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {totalActions} task{totalActions === 1 ? "" : "s"} added
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={addActionItem}
                                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
                                >
                                    <Plus size={17} />
                                    Add Task
                                </button>
                            </div>

                            {form.actionItems.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-gray-300 py-8 text-center text-sm text-gray-500">
                                    No action items yet. Click Add Task to create one.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {form.actionItems.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                                        >
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-sm font-semibold text-gray-700">
                                                    Task {index + 1}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeActionItem(item.id)}
                                                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                                                    aria-label="Remove task"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div className="sm:col-span-2">
                                                    <Field
                                                        label="Task Description"
                                                        value={item.task}
                                                        onChange={(e) =>
                                                            updateActionItem(item.id, "task", e.target.value)
                                                        }
                                                        placeholder="Describe the task..."
                                                    />
                                                </div>

                                                <Field
                                                    label="Assigned To"
                                                    value={item.assignedTo}
                                                    onChange={(e) =>
                                                        updateActionItem(
                                                            item.id,
                                                            "assignedTo",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Responsible person"
                                                />

                                                <Field
                                                    label="Due Date"
                                                    type="date"
                                                    value={item.dueDate}
                                                    onChange={(e) =>
                                                        updateActionItem(item.id, "dueDate", e.target.value)
                                                    }
                                                />

                                                <div className="sm:col-span-2">
                                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                        Status
                                                    </label>
                                                    <select
                                                        value={item.status}
                                                        onChange={(e) =>
                                                            updateActionItem(item.id, "status", e.target.value)
                                                        }
                                                        className="w-full rounded-lg border border-gray-200 text-gray-900 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                                                    >
                                                        <option>Pending</option>
                                                        <option>In Progress</option>
                                                        <option>Completed</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Follow-up Information
                            </h2>

                            <div className="space-y-4">
                                <TextArea
                                    label="Next Meeting"
                                    value={form.nextMeeting}
                                    onChange={(e) => update("nextMeeting", e.target.value)}
                                    placeholder="Proposed date, time, and agenda for the next meeting..."
                                    rows={3}
                                />

                                <TextArea
                                    label="Additional Notes"
                                    value={form.notes}
                                    onChange={(e) => update("notes", e.target.value)}
                                    placeholder="Any other important information..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-5 lg:sticky lg:top-6">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h2 className="font-semibold text-gray-900">Live Preview</h2>
                                <p className="mt-1 text-xs text-gray-500">
                                    Your meeting minutes update as you type.
                                </p>
                            </div>

                            <div className="max-h-[700px] space-y-5 overflow-y-auto p-5">
                                <div className="border-b-4 border-emerald-600 pb-4">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {form.title || "Meeting Minutes"}
                                    </h2>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Meeting No: {form.meetingNumber || "—"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Date: {form.meetingDate || "—"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {[
                                        ["Time", form.meetingTime],
                                        ["Location", form.location],
                                        ["Type", form.meetingType],
                                        ["Organizer", form.organizer],
                                        ["Chairperson", form.chairperson],
                                        ["Prepared By", form.preparedBy],
                                    ].map(([label, value]) => (
                                        <div key={label}>
                                            <p className="text-xs text-gray-400">{label}</p>
                                            <p className="mt-1 break-words font-medium text-gray-800">
                                                {value || "—"}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {[
                                    ["Attendees", form.attendees],
                                    ["Apologies", form.apologies],
                                    ["Agenda", form.agenda],
                                    ["Discussion Summary", form.discussion],
                                    ["Key Decisions", form.decisions],
                                    ["Next Meeting", form.nextMeeting],
                                    ["Additional Notes", form.notes],
                                ].map(([heading, content]) => (
                                    <div key={heading}>
                                        <h3 className="mb-1 border-b border-emerald-100 pb-1 text-sm font-semibold text-emerald-700">
                                            {heading}
                                        </h3>
                                        <p className="whitespace-pre-wrap break-words text-xs leading-5 text-gray-600">
                                            {content || "Not provided"}
                                        </p>
                                    </div>
                                ))}

                                <div>
                                    <h3 className="mb-2 border-b border-emerald-100 pb-1 text-sm font-semibold text-emerald-700">
                                        Action Items
                                    </h3>
                                    {form.actionItems.length === 0 ? (
                                        <p className="text-xs text-gray-400">No tasks added.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {form.actionItems.map((item, index) => (
                                                <div
                                                    key={item.id}
                                                    className="rounded-lg bg-gray-50 p-3 text-xs"
                                                >
                                                    <p className="font-semibold text-gray-800">
                                                        {index + 1}. {item.task || "Untitled task"}
                                                    </p>
                                                    <p className="mt-1 text-gray-500">
                                                        Assigned: {item.assignedTo || "—"}
                                                    </p>
                                                    <p className="text-gray-500">
                                                        Due: {item.dueDate || "—"} · {item.status}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <p className="border-t border-gray-100 pt-3 text-center text-xs text-gray-400">
                                    Generated with Formiqo
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <button
                                type="button"
                                onClick={handleDownload}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 px-4 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
                            >
                                <Download size={18} />
                                Download PDF
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={18} />
                                {saving ? "Saving..." : "Save Meeting Minutes"}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
