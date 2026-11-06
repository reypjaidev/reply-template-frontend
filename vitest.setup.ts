import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { vi } from "vitest";

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
