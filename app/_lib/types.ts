export type NoteColor =
    "yellow" | "pink" | "blue" | "green" | "purple" | "gray";

export type Note = {
    id: string;
    color: NoteColor;
    title: string;
    body: string;
    updatedAt: number;
};

export const NOTE_COLORS: Record<NoteColor, { swatch: string; card: string }> =
    {
        yellow: {
            swatch: "bg-amber-200",
            card: "bg-amber-100 border-amber-200 hover:border-amber-300",
        },
        pink: {
            swatch: "bg-rose-200",
            card: "bg-rose-100 border-rose-200 hover:border-rose-300",
        },
        blue: {
            swatch: "bg-sky-200",
            card: "bg-sky-100 border-sky-200 hover:border-sky-300",
        },
        green: {
            swatch: "bg-emerald-200",
            card: "bg-emerald-100 border-emerald-200 hover:border-emerald-300",
        },
        purple: {
            swatch: "bg-violet-200",
            card: "bg-violet-100 border-violet-200 hover:border-violet-300",
        },
        gray: {
            swatch: "bg-neutral-200",
            card: "bg-neutral-50 border-neutral-200 hover:border-neutral-300",
        },
    };

export const NOTE_COLOR_ORDER: NoteColor[] = [
    "gray",
    "yellow",
    "pink",
    "blue",
    "green",
    "purple",
];
