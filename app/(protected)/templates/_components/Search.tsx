"use client";

import { useState } from "react";

function Search() {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        // TODO: wire up to the templates search endpoint once the backend supports it.
        console.log("search:", query);
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto mb-4 max-w-xl">
            <div className="relative">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search notes..."
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 pr-9 text-sm text-neutral-700 shadow-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
                <button
                    type="submit"
                    aria-label="Search"
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-2.5 text-neutral-400 hover:text-neutral-600"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-4 w-4"
                    >
                        <circle cx="9" cy="9" r="6" />
                        <path strokeLinecap="round" d="m17 17-4.35-4.35" />
                    </svg>
                </button>
            </div>
        </form>
    );
}

export default Search;
