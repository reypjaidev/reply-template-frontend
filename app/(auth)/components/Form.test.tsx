import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Form } from "./Form";

describe("Form.Input", () => {
    it("masks a password field by default and toggles visibility", async () => {
        const user = userEvent.setup();
        render(
            <Form.Input
                placeholder="Password"
                name="password"
                type="password"
                value="secret123"
                onChange={vi.fn()}
                icon={<span />}
            />,
        );

        // A password field should hide the text at first.
        const input = screen.getByDisplayValue("secret123");
        expect(input).toHaveAttribute("type", "password");

        // Click "Show Password" and the text should become visible.
        await user.click(screen.getByRole("button", { name: "Show Password" }));
        expect(input).toHaveAttribute("type", "text");

        // Click "Hide Password" and it should go back to hidden.
        await user.click(screen.getByRole("button", { name: "Hide Password" }));
        expect(input).toHaveAttribute("type", "password");
    });

    it("gives each password field its own distinct toggle label", () => {
        // Render two password fields side by side (like password + confirm
        // password), and check each one gets its own "Show" button label.
        render(
            <>
                <Form.Input
                    placeholder="Password"
                    name="password"
                    type="password"
                    value=""
                    onChange={vi.fn()}
                    icon={<span />}
                />
                <Form.Input
                    placeholder="Confirm password"
                    name="confirmPassword"
                    type="password"
                    value=""
                    onChange={vi.fn()}
                    icon={<span />}
                />
            </>,
        );

        expect(
            screen.getByRole("button", { name: "Show Password" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Show Confirm password" }),
        ).toBeInTheDocument();
    });

    it("does not render a visibility toggle for non-password fields", () => {
        // A non-password field (like email) should have no show/hide button.
        render(
            <Form.Input
                placeholder="Email"
                name="email"
                type="email"
                value=""
                onChange={vi.fn()}
                icon={<span />}
            />,
        );

        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
});
