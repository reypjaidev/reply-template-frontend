import { waitFor } from "@testing-library/dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { makeStore } from "../../store";
import { authApi } from "./authApi";

const user = { id: "1", name: "Test", email: "test@example.com" };

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// fetchBaseQuery calls fetchFn(request) with an actual Request object, whose
// toString() is "[object Request]" — the URL lives on request.url instead.
function toUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function countCallsTo(fetchMock: ReturnType<typeof vi.fn>, path: string) {
  return fetchMock.mock.calls.filter((call) =>
    toUrl(call[0] as RequestInfo | URL).includes(path),
  ).length;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("authApi login/register cache invalidation", () => {
  it("refetches CurrentUser after a successful login", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = toUrl(input);
      if (url.includes("/auth/login")) {
        return jsonResponse({ success: true, data: { user } });
      }
      if (url.includes("/users")) {
        return jsonResponse({ success: true, data: user });
      }
      return new Response(null, { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const store = makeStore();

    // Mirrors AuthInitializer: a subscription that stays mounted for the
    // whole session and is never manually unsubscribed.
    await store.dispatch(authApi.endpoints.getCurrentUser.initiate());
    expect(countCallsTo(fetchMock, "/users")).toBe(1);

    await store.dispatch(
      authApi.endpoints.login.initiate({
        email: "test@example.com",
        password: "password123",
      }),
    );

    await waitFor(() => expect(countCallsTo(fetchMock, "/users")).toBe(2));
  });

  it("refetches CurrentUser after a successful register", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = toUrl(input);
      if (url.includes("/auth/register")) {
        return jsonResponse({ success: true, data: { user } });
      }
      if (url.includes("/users")) {
        return jsonResponse({ success: true, data: user });
      }
      return new Response(null, { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const store = makeStore();

    await store.dispatch(authApi.endpoints.getCurrentUser.initiate());
    expect(countCallsTo(fetchMock, "/users")).toBe(1);

    await store.dispatch(
      authApi.endpoints.register.initiate({
        name: "Test",
        email: "test@example.com",
        password: "password123",
      }),
    );

    await waitFor(() => expect(countCallsTo(fetchMock, "/users")).toBe(2));
  });
});
