import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SignUpPage from "./page";

// Fake versions of Next.js router hooks, so the page doesn't need a real
// router to render in a test.
const mockRouter = { push: vi.fn(), replace: vi.fn() };
const mockPathname = vi.fn(() => "/sign-up");
vi.mock("next/navigation", () => ({
    useRouter: () => mockRouter,
    usePathname: () => mockPathname(),
}));

// Mock API calls
const mockRegister = vi.fn();

// Replace the real register API hook with a fake one we control in each test.
vi.mock("@/app/lib/redux/features/auth/authApi", () => ({
    useRegisterMutation: () => [
        mockRegister,
        { isLoading: false, isError: false, isSuccess: false },
    ],
}));

describe("SignUpPage", () => {
    // Reset all fake functions before every test, so calls from one test
    // don't affect the next one.
    beforeEach(() => {
        vi.clearAllMocks();
        mockRegister.mockReturnValue({ unwrap: vi.fn() });
    });

    it("Should render the sign-up page", () => {
        render(<SignUpPage />);
        expect(
            screen.getByRole("heading", { name: "Sign up" }),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Please sign up to continue"),
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText("password")).toBeInTheDocument();
        expect(screen.getByLabelText("confirmPassword")).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Sign up" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /already have an account?/i }),
        ).toBeInTheDocument();
    });

    it("Should redirect to / after a successful sign-up", async () => {
        const user = userEvent.setup();
        // Make the fake register call succeed and return a user.
        mockRegister.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                user: { id: "1", name: "Test", email: "test@example.com" },
            }),
        });

        render(<SignUpPage />);

        await user.type(screen.getByLabelText(/name/i), "test");
        await user.type(screen.getByLabelText(/email/i), "test@example.com");
        await user.type(screen.getByLabelText("password"), "password123");
        await user.type(
            screen.getByLabelText("confirmPassword"),
            "password123",
        );
        await user.click(screen.getByRole("button", { name: "Sign up" }));

        expect(mockRegister).toHaveBeenCalledWith({
            name: "test",
            email: "test@example.com",
            password: "password123",
        });
        await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith("/"));
    });

    it("Should show an error and not call register when passwords don't match", async () => {
        const user = userEvent.setup();

        render(<SignUpPage />);

        // Type two different passwords in "password" and "confirm password".
        await user.type(screen.getByLabelText(/name/i), "test");
        await user.type(screen.getByLabelText(/email/i), "test@example.com");
        await user.type(screen.getByLabelText("password"), "password123");
        await user.type(
            screen.getByLabelText("confirmPassword"),
            "different123",
        );
        await user.click(screen.getByRole("button", { name: "Sign up" }));

        // The form should catch the mismatch itself, before calling the API.
        expect(
            await screen.findByText("Passwords do not match"),
        ).toBeInTheDocument();
        expect(mockRegister).not.toHaveBeenCalled();
        expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("Should not redirect and should show an error when Sign up fails", async () => {
        const user = userEvent.setup();
        // Make the fake register call fail, like a real server error.
        mockRegister.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue({
                status: 400,
                data: { success: false, error: "Email already in use" },
            }),
        });

        render(<SignUpPage />);
        await user.type(screen.getByLabelText(/name/i), "test");
        await user.type(screen.getByLabelText(/email/i), "test@example.com");
        await user.type(screen.getByLabelText("password"), "password123");
        await user.type(
            screen.getByLabelText("confirmPassword"),
            "password123",
        );
        await user.click(screen.getByRole("button", { name: "Sign up" }));

        await waitFor(() =>
            expect(
                screen.getByText("Email already in use"),
            ).toBeInTheDocument(),
        );
        expect(mockRouter.push).not.toHaveBeenCalled();
    });
});
