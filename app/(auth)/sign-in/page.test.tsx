import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("Should redirect to / after a successful login", async () => {
    const user = userEvent.setup();
    mockLogin.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ user: { id: "1", name: "Test", email: "test@example.com" } }),
    });

    render(<SignInPage />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith("/"));
  });

  it("Should not redirect and should show an error when login fails", async () => {
    const user = userEvent.setup();
    mockLogin.mockReturnValue({
      unwrap: vi
        .fn()
        .mockRejectedValue({
          status: 401,
          data: { success: false, error: "Invalid credentials" },
        }),
    });

    render(<SignInPage />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => expect(screen.getByText("Invalid credentials")).toBeInTheDocument());
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
