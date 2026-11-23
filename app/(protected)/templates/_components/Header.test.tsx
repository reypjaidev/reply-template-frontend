// These helpers let the tests render the component, find elements in the page,
// wait for asynchronous updates, and simulate user actions.
import { render, screen, waitFor } from "@testing-library/react";
import Header from "./Header";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

// Shared controls for the fake logout hook. vi.hoisted makes them available to
// the mock below, which Vitest sets up before the tests run.
const mocks = vi.hoisted(() => ({
    // A fake logout function whose result each test can set.
    logout: vi.fn(),
    // The loading value returned by the fake hook.
    isLoggingOut: false,
}));

// Return this fake router instead of Next.js's real router. The spies record
// navigation calls so the tests can check whether and where the Header navigates.
const mockRouter = { push: vi.fn(), replace: vi.fn() };
vi.mock("next/navigation", () => ({
    useRouter: () => mockRouter,
}));

// Match the hook's normal return shape: a logout function and its loading state.
// This keeps the tests independent of the real API and network.
vi.mock("@/app/lib/redux/features/auth/authApi", () => ({
    useLogoutMutation: () => [mocks.logout, { isLoading: mocks.isLoggingOut }],
}));

describe("Header", () => {
    beforeEach(() => {
        // Start each test with clean call history and a successful logout.
        // Tests that need a failure or a pending request replace this default.
        vi.clearAllMocks();
        mocks.isLoggingOut = false;
        // RTK Query's trigger returns an object with unwrap(); resolve it here
        // to represent a successful response.
        mocks.logout.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({ message: "Logged out" }),
        });
    });

    // render mounts Header in a simulated page. The screen queries check the
    // content users can find by its accessible role or visible text.
    it("renders correctly", () => {
        render(<Header />);
        expect(
            screen.getByRole("button", { name: "Log out" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: "Reply Board" }),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Your canned email replies, one click away."),
        ).toBeInTheDocument();
    });

    // userEvent simulates a user clicking the button. Then verify that logout
    // was called and the router was told to navigate to the sign-in page.
    it("calls logout function when clicked and redirects to sign-in page", async () => {
        const user = userEvent.setup();
        render(<Header />);
        const logoutButton = screen.getByRole("button", { name: "Log out" });
        await user.click(logoutButton);
        expect(mocks.logout).toHaveBeenCalledTimes(1);
        expect(mockRouter.replace).toHaveBeenCalledWith("/sign-in");
    });

    // This test controls when the logout promise finishes. It first checks that
    // there is no redirect, then resolves the promise and checks that redirect.
    it("waits for logout to succeed before redirecting", async () => {
        const user = userEvent.setup();
        // Save the promise's resolve function so the test can finish logout later.
        let resolveLogout!: () => void;
        const logoutPromise = new Promise<void>((resolve) => {
            resolveLogout = resolve;
        });
        // Make unwrap() return the still-pending promise instead of the default
        // successful result configured in beforeEach.
        mocks.logout.mockReturnValue({
            unwrap: vi.fn(() => logoutPromise),
        });

        render(<Header />);
        await user.click(screen.getByRole("button", { name: "Log out" }));

        expect(mockRouter.replace).not.toHaveBeenCalled();

        resolveLogout();
        // waitFor retries this assertion until the async handler navigates.
        await waitFor(() => {
            expect(mockRouter.replace).toHaveBeenCalledWith("/sign-in");
        });
    });

    // Make unwrap() reject to represent a failed API request. The Header should
    // show an error and should not navigate as if logout succeeded.
    it("shows an error and does not redirect when logout fails", async () => {
        const user = userEvent.setup();
        mocks.logout.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue(new Error("Request failed")),
        });

        render(<Header />);
        await user.click(screen.getByRole("button", { name: "Log out" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Failed to log out");
        });
        expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    // Set the hook's loading state before rendering. The Header should display
    // its progress label and disable the button while the request is running.
    it("disables the logout button while logout is in progress", () => {
        mocks.isLoggingOut = true;

        render(<Header />);

        expect(
            screen.getByRole("button", { name: "Logging out…" }),
        ).toBeDisabled();
    });
});
