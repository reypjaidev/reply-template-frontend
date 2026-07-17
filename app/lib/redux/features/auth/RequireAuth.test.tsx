import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RequireAuth } from "./RequireAuth";

const mockRouter = { push: vi.fn(), replace: vi.fn() };
vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

const mockUseGetCurrentUserQuery = vi.fn();
vi.mock("./authApi", () => ({
  useGetCurrentUserQuery: () => mockUseGetCurrentUserQuery(),
}));

describe("RequireAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /sign-in when the user is not authenticated", async () => {
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

    await waitFor(() =>
      expect(mockRouter.replace).toHaveBeenCalledWith("/sign-in"),
    );
    expect(screen.queryByText(/Note/i)).not.toBeInTheDocument();
  });

  it("does not redirect and renders children when the user is authenticated", () => {
    mockUseGetCurrentUserQuery.mockReturnValue({ isSuccess: true });

    render(
      <RequireAuth>
        <p>Reply Board</p>
      </RequireAuth>,
    );

    expect(screen.getByText(/Reply Board/i)).toBeInTheDocument();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("render loading component if its loading", () => {
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

    expect(screen.getByText(/Loading…/i)).toBeInTheDocument();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});
