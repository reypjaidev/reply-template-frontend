"use client";

import { useState } from "react";
import { NOTE_COLOR_ORDER, NOTE_COLORS, type Note } from "../_lib/types";

export function NoteCard({
  note,
  onUpdate,
  onDelete,
}: {
  note: Note;
  onUpdate: (patch: Partial<Omit<Note, "id">>) => void;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const colors = NOTE_COLORS[note.color];

  async function handleCopy() {
    await navigator.clipboard.writeText(note.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className={`group relative mb-4 break-inside-avoid rounded-lg border p-4 shadow-sm transition-colors ${colors.card}`}
    >
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete note"
        className="absolute right-2 top-2 rounded p-1 text-neutral-500 opacity-0 transition-opacity hover:bg-black/5 hover:text-neutral-800 group-hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482 41.03 41.03 0 0 0-2.365-.298V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <input
        value={note.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Title"
        className="w-full bg-transparent pr-6 text-sm font-semibold text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
      />
      <textarea
        value={note.body}
        onChange={(e) => onUpdate({ body: e.target.value })}
        placeholder="Paste your reply..."
        rows={4}
        className="mt-1 w-full resize-none bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none"
      />

      <div className="mt-2 flex items-center justify-between">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColors((v) => !v)}
            aria-label="Change color"
            className={`h-5 w-5 rounded-full ring-1 ring-black/10 ${colors.swatch}`}
          />
          {showColors && (
            <div className="absolute bottom-7 left-0 z-10 flex gap-1 rounded-full border border-neutral-200 bg-white p-1.5 shadow-md">
              {NOTE_COLOR_ORDER.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={c}
                  onClick={() => {
                    onUpdate({ color: c });
                    setShowColors(false);
                  }}
                  className={`h-5 w-5 rounded-full ring-1 ring-black/10 ${NOTE_COLORS[c].swatch} ${
                    c === note.color ? "outline outline-2 outline-neutral-400" : ""
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:bg-black/5"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
