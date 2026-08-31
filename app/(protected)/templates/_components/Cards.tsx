"use client";

import Loader from "@/app/components/Loader";
import { NoteCard } from "@/app/components/NoteCard";
import { Note } from "@/app/lib/types";
import {
    useDeleteTemplateMutation,
    useGetTemplatesQuery,
    useUpdateTemplateMutation,
} from "@/app/lib/redux/features/template/templateApi";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

function Cards() {
    const [cards, setCards] = useState<Note[]>([]);
    const { data, isLoading } = useGetTemplatesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (data && !isLoading) {
            setCards(data);
        }
    }, [data, isLoading]);

    const [deleteTemplate] = useDeleteTemplateMutation();
    const [updateTemplate] = useUpdateTemplateMutation();
    const debounced = useDebouncedCallback((value) => {
        updateTemplate(value)
            .unwrap()
            .then((data) => {
                console.log("Updated template:", data);
            })
            .catch((error) => {
                console.error("Failed to update template:", error);
            });
    }, 1000);
    const updateNote = (id: string, patch: Partial<Note>) => {
        setCards((prev) =>
            prev.map((note) => (note.id === id ? { ...note, ...patch } : note)),
        );
        debounced({ id, ...patch });
    };
    const deleteNote = (id: string) => {
        deleteTemplate(id);
    };
    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {!isLoading && cards.length === 0 && (
                <p className="text-center text-sm text-neutral-200">
                    {cards.length === 0
                        ? "No notes yet — add your first reply template above."
                        : "No notes match your search."}
                </p>
            )}
            {cards?.map((note) => (
                <NoteCard
                    key={note.id}
                    note={note}
                    onUpdate={(patch) => updateNote(note.id, patch)}
                    onDelete={() => deleteNote(note.id)}
                />
            ))}
        </div>
    );
}

export default Cards;
