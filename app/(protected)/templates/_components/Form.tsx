"use client";

import { useRef, useState } from "react";
import {
    NOTE_COLOR_ORDER,
    NOTE_COLORS,
    type NoteColor,
} from "@/app/_lib/types";
import { useCreateTemplateMutation } from "@/app/lib/redux/features/template/templateApi";

function TemplateForm() {
    const [expanded, setExpanded] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [color, setColor] = useState<NoteColor>("gray");
    const containerRef = useRef<HTMLDivElement>(null);

    const [create] = useCreateTemplateMutation();

    function reset() {
        setTitle("");
        setBody("");
        setColor("gray");
        setExpanded(false);
    }
    function handleSave() {
        if (!title.trim() && !body.trim()) {
            reset();
            return;
        }
        create({ title, body, color });
        reset();
    }

    function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            handleSave();
        }
    }

    return (
        <div
            ref={containerRef}
            onBlur={handleBlur}
            className="mx-auto mb-8 max-w-xl rounded-lg border border-neutral-200 bg-white p-3 shadow-sm"
        >
            {expanded && (
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="mb-1 w-full bg-transparent text-sm font-semibold text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                />
            )}
            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onFocus={() => setExpanded(true)}
                placeholder="Take a note... paste a reply template"
                rows={expanded ? 4 : 1}
                className="w-full resize-none bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none"
            />

            {expanded && (
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-1.5">
                        {NOTE_COLOR_ORDER.map((c) => (
                            <button
                                key={c}
                                type="button"
                                aria-label={c}
                                onClick={() => setColor(c)}
                                className={`h-5 w-5 cursor-pointer rounded-full ring-1 ring-black/10 ${NOTE_COLORS[c].swatch} ${
                                    c === color
                                        ? "outline-2 outline-neutral-400"
                                        : ""
                                }`}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="cursor-pointer rounded-md bg-neutral-800 px-3 py-1 text-xs font-medium text-white hover:bg-neutral-700"
                    >
                        Save
                    </button>
                </div>
            )}
        </div>
    );
}

export default TemplateForm;
