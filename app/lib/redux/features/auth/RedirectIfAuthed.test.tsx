import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RedirectIfAuthed } from "./RedirectIfAuthed";

// A fake Next.js router, so we can check where the app tries to navigate to.
const mockRouter = { push: vi.fn(), replace: vi.fn() };
vi.mock("next/navigation", () => ({
    useRouter: () => mockRouter,
}));

// A fake version of the "get current user" hook, so we can control whether
// the test pretends the user is logged in or not.
const mockUseGetCurrentUserQuery = vi.fn();
vi.mock("./authApi", () => ({
    useGetCurrentUserQuery: () => mockUseGetCurrentUserQuery(),
}));

// RedirectIfAuthed wraps pages like sign-in/sign-up: if the user is already
// logged in, it should send them away instead of showing the form again.
describe("RedirectIfAuthed", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("redirects to / when the user is already authenticated", async () => {
        // Pretend the "get current user" call succeeded (user is logged in).
        mockUseGetCurrentUserQuery.mockReturnValue({ isSuccess: true });

        render(
            <RedirectIfAuthed>
                <p>sign-in form</p>
            </RedirectIfAuthed>,
        );

        // It should send the user to the home page instead of showing the form.
        await waitFor(() =>
            expect(mockRouter.replace).toHaveBeenCalledWith("/templates"),
        );
    });

    it("does not redirect and renders children when the user is not authenticated", () => {
        // Pretend the user is not logged in.
        mockUseGetCurrentUserQuery.mockReturnValue({ isSuccess: false });

        render(
            <RedirectIfAuthed>
                <p>sign-in form</p>
            </RedirectIfAuthed>,
        );

        // The sign-in form should stay visible, and no redirect happens.
        expect(screen.getByText("sign-in form")).toBeInTheDocument();
        expect(mockRouter.replace).not.toHaveBeenCalled();
    });
});
