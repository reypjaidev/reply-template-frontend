"use client";

import { useEffect, useState } from "react";
import type { Note, NoteColor } from "./types";

const STORAGE_KEY = "email-reply-notes";

function loadNotes(): Note[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Note[]) : [];
    } catch {
        return [];
    }
}

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setNotes(loadNotes());
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (!loaded) return;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }, [notes, loaded]);

    function addNote(input: { title: string; body: string; color: NoteColor }) {
        const note: Note = {
            id: crypto.randomUUID(),
            title: input.title,
            body: input.body,
            color: input.color,
            updatedAt: Date.now(),
        };
        setNotes((prev) => [note, ...prev]);
    }

    function updateNote(id: string, patch: Partial<Omit<Note, "id">>) {
        setNotes((prev) =>
            prev.map((note) =>
                note.id === id
                    ? { ...note, ...patch, updatedAt: Date.now() }
                    : note,
            ),
        );
    }

    function deleteNote(id: string) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
    }

    return { notes, loaded, addNote, updateNote, deleteNote };
}
