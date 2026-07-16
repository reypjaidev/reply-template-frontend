import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SignInPage from "./page";

const mockRouter = { push: vi.fn(), replace: vi.fn() };
const mockPathname = vi.fn(() => "/sign-in");
vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname(),
}));

// Mock API calls
const mockLogin = vi.fn();

vi.mock("@/app/lib/redux/features/auth/authApi", () => ({
  useLoginMutation: () => [
    mockLogin,
    { isLoading: false, isError: false, isSuccess: false },
  ],
}));

describe("SignInPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockReturnValue({ unwrap: vi.fn() });
  });

  it("Should render the sign-in page", () => {
    render(<SignInPage />);
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByText("Please sign in to continue")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /forget password/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /don't have an account?/i }),
    ).toBeInTheDocument();
  });
});
