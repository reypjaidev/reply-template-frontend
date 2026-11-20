import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import TemplateForm from "./Form";
import { toast } from "sonner";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => ({
    createTemplate: vi.fn(),
}));
vi.mock("@/app/lib/redux/features/template/templateApi", () => ({
    useCreateTemplateMutation: () => [mocks.createTemplate],
}));

describe("TemplateForm component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.createTemplate.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue(undefined),
        });
    });

    it("renders correctly when not expanded", () => {
        render(<TemplateForm />);
        expect(
            screen.getByPlaceholderText(/Take a note.../i),
        ).toBeInTheDocument();
        expect(screen.queryByPlaceholderText("Title")).not.toBeInTheDocument();
    });

    it("expands when the textarea body is focused", async () => {
        const user = userEvent.setup();
        render(<TemplateForm />);
        const textarea = screen.getByPlaceholderText(/Take a note.../i);
        await user.click(textarea);

        expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
        expect(textarea).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "gray" }),
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

    it("does not create a template when the body contains only whitespace", async () => {
        const user = userEvent.setup();

        render(
            <>
                <TemplateForm />
                <button type="button">Outside</button>
            </>,
        );

        await user.click(screen.getByPlaceholderText(/Take a note.../i));
        await user.type(screen.getByPlaceholderText(/Take a note.../i), "   ");
        await user.click(screen.getByRole("button", { name: "Outside" }));

        expect(mocks.createTemplate).not.toHaveBeenCalled();
    });

    it("creates a template with the entered values and shows a success toast", async () => {
        const user = userEvent.setup();
        render(<TemplateForm />);

        await user.click(screen.getByPlaceholderText(/Take a note.../i));
        await user.type(screen.getByPlaceholderText("Title"), "New Title");
        await user.type(
            screen.getByPlaceholderText(/Take a note.../i),
            "New Body",
        );
        await user.click(screen.getByRole("button", { name: "pink" }));
        await user.click(screen.getByRole("button", { name: "Save" }));

        expect(mocks.createTemplate).toHaveBeenCalledExactlyOnceWith({
            title: "New Title",
            body: "New Body",
            color: "pink",
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(
                "Template created successfully",
            );
        });
    });

    it("calls createTemplate mutation and toast will appear error when form is submitted", async () => {
        const user = userEvent.setup();

        mocks.createTemplate.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue(new Error("Request failed")),
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
