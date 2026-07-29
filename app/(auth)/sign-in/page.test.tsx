import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SignInPage from "./page";

// Fake versions of Next.js router hooks, so the page doesn't need a real
// router to render in a test.
const mockRouter = { push: vi.fn(), replace: vi.fn() };
const mockPathname = vi.fn(() => "/sign-in");
vi.mock("next/navigation", () => ({
    useRouter: () => mockRouter,
    usePathname: () => mockPathname(),
}));

// Mock API calls
const mockLogin = vi.fn();

// Replace the real login API hook with a fake one we control in each test.
vi.mock("@/app/lib/redux/features/auth/authApi", () => ({
    useLoginMutation: () => [
        mockLogin,
        { isLoading: false, isError: false, isSuccess: false },
    ],
}));

describe("SignInPage", () => {
    // Reset all fake functions before every test, so calls from one test
    // don't affect the next one.
    beforeEach(() => {
        vi.clearAllMocks();
        mockLogin.mockReturnValue({ unwrap: vi.fn() });
    });

    it("Should render the sign-in page", () => {
        render(<SignInPage />);
        expect(
            screen.getByRole("heading", { name: "Login" }),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Please sign in to continue"),
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText("password")).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /forget password/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Login" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /don't have an account?/i }),
        ).toBeInTheDocument();
    });

    it("Should redirect to / after a successful login", async () => {
        const user = userEvent.setup();
        // Make the fake login call succeed and return a user.
        mockLogin.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                user: { id: "1", name: "Test", email: "test@example.com" },
            }),
        });

        render(<SignInPage />);

        await user.type(screen.getByLabelText(/email/i), "test@example.com");
        await user.type(screen.getByLabelText("password"), "password123");
        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(mockLogin).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "password123",
        });
        await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith("/"));
    });

    it("Should not redirect and should show an error when login fails", async () => {
        const user = userEvent.setup();
        // Make the fake login call fail, like a real server error.
        mockLogin.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue({
                status: 401,
                data: { success: false, error: "Invalid credentials" },
            }),
        });

        render(<SignInPage />);

        await user.type(screen.getByLabelText(/email/i), "test@example.com");
        await user.type(screen.getByLabelText("password"), "wrong-password");
        await user.click(screen.getByRole("button", { name: "Login" }));

        await waitFor(() =>
            expect(screen.getByText("Invalid credentials")).toBeInTheDocument(),
        );
        expect(mockRouter.push).not.toHaveBeenCalled();
    });
});
