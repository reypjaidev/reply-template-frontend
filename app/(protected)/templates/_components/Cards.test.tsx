import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import type { Note } from "@/app/lib/types";
import Cards from "./Cards";

const mocks = vi.hoisted(() => ({
    getTemplates: vi.fn(),
    deleteTemplate: vi.fn(),
    updateTemplate: vi.fn(),
}));

vi.mock("@/app/lib/redux/features/template/templateApi", () => ({
    useGetTemplatesQuery: (...args: unknown[]) => mocks.getTemplates(...args),
    useDeleteTemplateMutation: () => [mocks.deleteTemplate],
    useUpdateTemplateMutation: () => [mocks.updateTemplate],
}));

// Run the debounced callback immediately in tests so assertions do not need
// to wait for a real timer.
vi.mock("use-debounce", () => ({
    useDebouncedCallback: (callback: (...args: unknown[]) => unknown) =>
        callback,
}));

const note: Note = {
    id: "t1",
    title: "Follow up",
    body: "Thanks for reaching out...",
    color: "yellow",
    updatedAt: 0,
};

describe("Cards component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getTemplates.mockReturnValue({
            data: [note],
            isLoading: false,
        });
        mocks.deleteTemplate.mockReturnValue({
            unwrap: vi.fn(() => Promise.resolve()),
        });
        mocks.updateTemplate.mockReturnValue({
            unwrap: vi.fn(() =>
                Promise.resolve({ ...note, title: "Updated title" }),
            ),
        });
    });

    it("shows the loader while templates are loading", () => {
        // Loading is controlled by the mocked RTK Query hook, not by timers.
        mocks.getTemplates.mockReturnValue({
            data: undefined,
            isLoading: true,
        });

        render(<Cards />);

        expect(
            screen.getByRole("status", { name: "Loading" }),
        ).toBeInTheDocument();
    });

    it("renders templates returned by the query", async () => {
        render(<Cards />);

        // Cards copies RTK Query data into local state in an effect, so wait
        // until the NoteCard fields are available instead of asserting synchronously.
        expect(
            await screen.findByDisplayValue("Follow up"),
        ).toBeInTheDocument();
        expect(
            screen.getByDisplayValue("Thanks for reaching out..."),
        ).toBeInTheDocument();
    });

    it("shows the empty state when there are no templates", () => {
        mocks.getTemplates.mockReturnValue({
            data: [],
            isLoading: false,
        });

        render(<Cards />);

        expect(
            screen.getByText(
                "No notes yet — add your first reply template above.",
            ),
        ).toBeInTheDocument();
    });

    it("updates the matching card and sends the patch to the API", async () => {
        const user = userEvent.setup();
        render(<Cards />);

        const title = await screen.findByDisplayValue("Follow up");
        await user.clear(title);
        await user.type(title, "Updated title");

        // The card should update optimistically before the mutation resolves.
        expect(title).toHaveValue("Updated title");
        await waitFor(() => {
            expect(mocks.updateTemplate).toHaveBeenCalledWith({
                id: "t1",
                title: "Updated title",
            });
        });
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(
                "Template Updated title updated",
            );
        });
    });

    it("deletes a template and shows a success toast", async () => {
        const user = userEvent.setup();
        render(<Cards />);

        await user.click(
            await screen.findByRole("button", { name: "Delete note" }),
        );

        expect(mocks.deleteTemplate).toHaveBeenCalledWith("t1");
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("Template deleted");
        });
    });
});
