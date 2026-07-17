import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RedirectIfAuthed } from "./RedirectIfAuthed";

const mockRouter = { push: vi.fn(), replace: vi.fn() };
vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

const mockUseGetCurrentUserQuery = vi.fn();
vi.mock("./authApi", () => ({
  useGetCurrentUserQuery: () => mockUseGetCurrentUserQuery(),
}));

describe("RedirectIfAuthed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to / when the user is already authenticated", async () => {
    mockUseGetCurrentUserQuery.mockReturnValue({ isSuccess: true });

    render(
      <RedirectIfAuthed>
        <p>sign-in form</p>
      </RedirectIfAuthed>,
    );

    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith("/"));
  });

  it("does not redirect and renders children when the user is not authenticated", () => {
    mockUseGetCurrentUserQuery.mockReturnValue({ isSuccess: false });

    render(
      <RedirectIfAuthed>
        <p>sign-in form</p>
      </RedirectIfAuthed>,
    );

    expect(screen.getByText("sign-in form")).toBeInTheDocument();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});
