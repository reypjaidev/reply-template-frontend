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

        const input = screen.getByDisplayValue("secret123");
        expect(input).toHaveAttribute("type", "password");

        await user.click(screen.getByRole("button", { name: "Show Password" }));
        expect(input).toHaveAttribute("type", "text");

        await user.click(screen.getByRole("button", { name: "Hide Password" }));
        expect(input).toHaveAttribute("type", "password");
    });

    it("gives each password field its own distinct toggle label", () => {
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
