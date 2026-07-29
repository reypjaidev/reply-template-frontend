import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RequireAuth } from "./RequireAuth";

// A fake Next.js router, so we can check where the app tries to navigate to.
const mockRouter = { push: vi.fn(), replace: vi.fn() };
vi.mock("next/navigation", () => ({
    useRouter: () => mockRouter,
}));

// A fake version of the "get current user" hook, so each test can control
// whether the user is logged in, not logged in, or still loading.
const mockUseGetCurrentUserQuery = vi.fn();
vi.mock("./authApi", () => ({
    useGetCurrentUserQuery: () => mockUseGetCurrentUserQuery(),
}));

// RequireAuth wraps protected pages: only logged-in users should see them.
describe("RequireAuth", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("redirects to /sign-in when the user is not authenticated", async () => {
        // Pretend the "get current user" call failed (user is not logged in).
        mockUseGetCurrentUserQuery.mockReturnValue({
            isError: true,
            isLoading: false,
            isSuccess: false,
        });

        render(
            <RequireAuth>
                <p>Note</p>
            </RequireAuth>,
        );

        // It should send the user to the sign-in page and hide the content.
        await waitFor(() =>
            expect(mockRouter.replace).toHaveBeenCalledWith("/sign-in"),
        );
        expect(screen.queryByText(/Note/i)).not.toBeInTheDocument();
    });

    it("does not redirect and renders children when the user is authenticated", () => {
        // Pretend the user is logged in.
        mockUseGetCurrentUserQuery.mockReturnValue({ isSuccess: true });

        render(
            <RequireAuth>
                <p>Reply Board</p>
            </RequireAuth>,
        );

        // The protected content should show, with no redirect.
        expect(screen.getByText(/Reply Board/i)).toBeInTheDocument();
        expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    it("render loading component if its loading", () => {
        // Pretend we're still waiting to find out if the user is logged in.
        mockUseGetCurrentUserQuery.mockReturnValue({
            isSuccess: false,
            isLoading: true,
            isError: false,
        });

        render(
            <RequireAuth>
                <p>Reply Board</p>
            </RequireAuth>,
        );

        // While loading, show a loading message instead of content or a redirect.
        expect(screen.getByText(/Loading…/i)).toBeInTheDocument();
        expect(mockRouter.replace).not.toHaveBeenCalled();
    });
});
