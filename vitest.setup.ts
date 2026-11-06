import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { vi } from "vitest";
import { act as reactAct } from "react";
// Tell TypeScript that 'act' exists globally
declare global {
    var act: typeof reactAct;
}

globalThis.act = reactAct; // Make act available globally for React Testing Library
vi.mock("sonner", async (importOriginal) => {
    const actual = await importOriginal<typeof import("sonner")>();
    return {
        ...actual,
        toast: {
            ...actual.toast,
            success: vi.fn(),
            error: vi.fn(),
            // Add other methods if you use them (loading, warning, etc.)
        },
    };
});

afterEach(() => {
    cleanup();
});
