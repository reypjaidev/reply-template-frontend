"use client";

import Loader from "@/app/_components/Loader";
import { NoteCard } from "@/app/_components/NoteCard";
import { Note } from "@/app/_lib/types";
import {
    useDeleteTemplateMutation,
    useGetTemplatesQuery,
} from "@/app/lib/redux/features/template/templateApi";

function Cards() {
    const { data, isLoading } = useGetTemplatesQuery();
    const [deleteTemplate] = useDeleteTemplateMutation();
    const updateNote = (id: string, patch: Partial<Note>) => {};
    const deleteNote = (id: string) => {
        deleteTemplate(id);
    };
    if (isLoading) {
        return <Loader />;
    }
    return (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {data?.map((note) => (
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
