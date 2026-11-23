import { beforeEach, describe, it, vi, expect } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NoteCard } from "./NoteCard";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { type NoteColor } from "@/app/lib/types";

const note = {
    id: "1",
    title: "Test Note",
    body: "This is a test note.",
    color: "blue" as NoteColor,
    updatedAt: Number(new Date()),
};

const mocks = vi.hoisted(() => ({
    onUpdate: vi.fn(),
    handleCopy: vi.fn(),
    onDelete: vi.fn(),
}));
describe("NoteCard component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders note card component in default state correctly", () => {
        render(
            <NoteCard
                note={note}
                onUpdate={mocks.onUpdate}
                onDelete={mocks.onDelete}
            />,
        );
        expect(
            screen.getByRole("button", { name: /delete note/i }),
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/title/i)).toHaveValue(note.title);
        expect(screen.getByPlaceholderText(/paste your reply/i)).toHaveValue(
            note.body,
        );
        expect(
            screen.getByRole("button", { name: /change color/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /copy/i }),
        ).toBeInTheDocument();
    });
    it('shows "Copied to clipboard" and copy the body to clipboard toast when copy button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <NoteCard
                note={note}
                onUpdate={mocks.onUpdate}
                onDelete={mocks.onDelete}
            />,
        );
        const copyButton = screen.getByRole("button", { name: /copy/i });
        user.click(copyButton);

        await waitFor(() =>
            expect(toast.success).toHaveBeenCalledWith("Copied to clipboard"),
        );
        const clipboardText = await navigator.clipboard.readText();
        expect(clipboardText).toBe(note.body);
    });
    it('shows the other colors when the "Change color" button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <NoteCard
                note={note}
                onUpdate={mocks.onUpdate}
                onDelete={mocks.onDelete}
            />,
        );

        const changeColorButton = screen.getByRole("button", {
            name: /change color/i,
        });
        // The color buttons appear after opening the color picker.
        await user.click(changeColorButton);
        expect(
            screen.getByRole("button", { name: "pink" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "blue" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "green" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "yellow" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "purple" }),
        ).toBeInTheDocument();
        // Use queryByRole because these buttons should no longer be present.
        await user.click(changeColorButton);
        expect(
            screen.queryByRole("button", { name: "pink" }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "blue" }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "green" }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "yellow" }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "purple" }),
        ).not.toBeInTheDocument();
    });

    it('calls onDelete when the "Delete note" button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <NoteCard
                note={note}
                onUpdate={mocks.onUpdate}
                onDelete={mocks.onDelete}
            />,
        );
        const deleteButton = screen.getByRole("button", {
            name: /delete note/i,
        });
        await user.click(deleteButton);
        expect(mocks.onDelete).toHaveBeenCalledTimes(1);
    });

    it("calls onUpdate with the selected color", async () => {
        const user = userEvent.setup();
        render(
            <NoteCard
                note={note}
                onUpdate={mocks.onUpdate}
                onDelete={mocks.onDelete}
            />,
        );

        const changeColorButton = screen.getByRole("button", {
            name: /change color/i,
        });
        await user.click(changeColorButton);
        const pinkButton = screen.getByRole("button", { name: "pink" });
        await user.click(pinkButton);

        expect(mocks.onUpdate).toHaveBeenCalledWith({ color: "pink" });
    });

    it("calls onUpdate with the updated title", () => {
        render(
            <NoteCard
                note={note}
                onUpdate={mocks.onUpdate}
                onDelete={mocks.onDelete}
            />,
        );

        const titleInput = screen.getByPlaceholderText("Title");
        fireEvent.change(titleInput, { target: { value: "Updated" } });

        expect(mocks.onUpdate).toHaveBeenLastCalledWith({ title: "Updated" });
    });

    it("calls onUpdate with the updated body", () => {
        render(
            <NoteCard
                note={note}
                onUpdate={mocks.onUpdate}
                onDelete={mocks.onDelete}
            />,
        );

        const bodyInput = screen.getByPlaceholderText("Paste your reply...");
        fireEvent.change(bodyInput, { target: { value: "Updated reply" } });

        expect(mocks.onUpdate).toHaveBeenLastCalledWith({
            body: "Updated reply",
        });
    });
});
