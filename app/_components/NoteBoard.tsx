"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useNotes } from "../_lib/useNotes";
import { useLogoutMutation } from "../lib/redux/features/auth/authApi";
import { NoteCard } from "./NoteCard";
import { NoteComposer } from "./NoteComposer";

export function NoteBoard() {
    const { notes, loaded, addNote, updateNote, deleteNote } = useNotes();
    const [query, setQuery] = useState("");
    const router = useRouter();
    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return notes;
        return notes.filter(
            (note) =>
                note.title.toLowerCase().includes(q) ||
                note.body.toLowerCase().includes(q),
        );
    }, [notes, query]);

    async function handleLogout() {
        await logout();
        router.replace("/sign-in");
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-10">
            <header className="mb-8 text-center">
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-500 transition-colors hover:bg-black/5 hover:text-neutral-800 disabled:opacity-60"
                    >
                        {isLoggingOut ? "Logging out…" : "Log out"}
                    </button>
                </div>
                <h1 className="text-2xl font-semibold text-neutral-800">
                    Reply Board
                </h1>
                <p className="mt-1 text-sm text-neutral-500">
                    Your canned email replies, one click away.
                </p>
            </header>

            <div className="mx-auto mb-4 max-w-xl">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search notes..."
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
            </div>

            <NoteComposer onCreate={addNote} />

            {loaded && filtered.length === 0 && (
                <p className="mt-16 text-center text-sm text-neutral-400">
                    {notes.length === 0
                        ? "No notes yet — add your first reply template above."
                        : "No notes match your search."}
                </p>
            )}

            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
                {filtered.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        onUpdate={(patch) => updateNote(note.id, patch)}
                        onDelete={() => deleteNote(note.id)}
                    />
                ))}
            </div>
        </div>
    );
}
