import { it, describe, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TemplateForm from "./Form";
import { useCreateTemplateMutation } from "@/app/lib/redux/features/template/templateApi";
import { toast } from "sonner";
import { Note } from "@/app/lib/types";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => ({
    createTemplate: vi.fn(),
}));
vi.mock("@/app/lib/redux/features/template/templateApi", () => ({
    useCreateTemplateMutation: () => [mocks.createTemplate],
}));

const note1: Note = {
    id: "t1",
    title: "Title 1",
    body: "Thanks for reaching out...",
    color: "yellow",
    updatedAt: 0,
};

const note2: Note = {
    id: "t2",
    title: "Title 2",
    body: "Looking forward to our meeting...",
    color: "blue",
    updatedAt: 0,
};

describe("TemplateForm component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.createTemplate.mockReturnValue({
            unwrap: vi.fn(() => Promise.resolve({ ...note1 })),
        });
    });

    it("renders correctly when not expanded", () => {
        render(<TemplateForm />);
        expect(
            screen.getByPlaceholderText(/Take a note.../i),
        ).toBeInTheDocument();
        expect(screen.queryByPlaceholderText("Title")).not.toBeInTheDocument();
    });

    it("expands when the textarea body is focused", () => {
        render(<TemplateForm />);
        const textarea = screen.getByPlaceholderText(/Take a note.../i);
        fireEvent.focus(textarea);
        expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
        expect(textarea).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "gray" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "yellow" }),
        ).toBeInTheDocument();
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
            screen.getByRole("button", { name: "purple" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Save" }),
        ).toBeInTheDocument();
    });

    it("collapses when focus moves outside the form", async () => {
        const user = userEvent.setup();

        render(
            <>
                <TemplateForm />
                <button type="button">Outside</button>
            </>,
        );

        await user.click(screen.getByPlaceholderText(/Take a note.../i));
        expect(
            screen.getByRole("button", { name: "Save" }),
        ).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Outside" }));
        expect(
            screen.queryByRole("button", { name: "Save" }),
        ).not.toBeInTheDocument();
    });

    it("calls createTemplate mutation and toast will appear success when form is submitted", async () => {
        const user = userEvent.setup();

        mocks.createTemplate.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                status: 200,
                data: {
                    success: true,
                    message: "Template created successfully",
                },
            }),
        });

        render(<TemplateForm />);

        await user.click(screen.getByPlaceholderText(/Take a note.../i));
        await user.type(screen.getByPlaceholderText("Title"), "New Title");
        await user.type(
            screen.getByPlaceholderText(/Take a note.../i),
            "New Body",
        );
        await user.click(screen.getByRole("button", { name: "Save" }));

        expect(mocks.createTemplate).toHaveBeenCalled();

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(
                "Template created successfully",
            );
        });
    });

    it("calls createTemplate mutation and toast will appear error when form is submitted", async () => {
        const user = userEvent.setup();

        mocks.createTemplate.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue({
                status: 201,
                data: {
                    success: false,
                    message: "Failed to create template",
                },
            }),
        });

        render(<TemplateForm />);

        await user.click(screen.getByPlaceholderText(/Take a note.../i));
        await user.type(screen.getByPlaceholderText("Title"), "New Title");
        await user.type(
            screen.getByPlaceholderText(/Take a note.../i),
            "New Body",
        );
        await user.click(screen.getByRole("button", { name: "Save" }));

        expect(mocks.createTemplate).toHaveBeenCalled();

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "Failed to create template",
            );
        });
    });
});
