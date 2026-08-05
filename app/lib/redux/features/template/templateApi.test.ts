import { waitFor } from "@testing-library/dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { makeStore } from "../../store";
import { templateApi } from "./templateApi";

// A fake template record. We use this as the "server" data in every test.
const template = {
    id: "t1",
    title: "Follow up",
    body: "Thanks for reaching out...",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
};

// Makes a fake fetch Response, like a real server would send: JSON data +
// Content-Type header. RTK Query's fetchBaseQuery needs this to read it right.
function jsonResponse(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

// fetchBaseQuery calls fetch with a real Request object, not a plain string.
// This function pulls the URL out, no matter which form fetch was called with.
function toUrl(input: RequestInfo | URL): string {
    if (typeof input === "string") return input;
    if (input instanceof URL) return input.href;
    return input.url;
}

// Test helper: counts how many fetch() calls were made to a given URL path
// (and, if given, a specific HTTP method). Used to check that RTK Query
// refetched data the right number of times, e.g. "the list was fetched twice."
function countCallsTo(
    fetchMock: ReturnType<typeof vi.fn>,
    path: string,
    method?: string,
) {
    return fetchMock.mock.calls.filter((call) => {
        // Each recorded call stores the [url/Request, options] that fetch()
        // was given.
        const [input, init] = call as [RequestInfo | URL, RequestInit?];
        // We use endsWith, not includes: "/templates" is part of the text
        // "/templates/t1", so includes would wrongly count both as matches.
        const matchesUrl = toUrl(input).endsWith(path);
        const matchesMethod = method
            ? (input instanceof Request ? input.method : init?.method) ===
              method
            : true;
        return matchesUrl && matchesMethod;
    }).length;
}

// After each test, put global.fetch back to normal, so the fake fetch from
// one test doesn't carry over into the next test.
afterEach(() => {
    vi.unstubAllGlobals();
});

// These tests don't check the data in the response. They check RTK Query's
// "cache invalidation": after we create, update, or delete something, does
// it correctly fetch fresh data again?
describe("templateApi cache invalidation", () => {
    it("refetches the template list after creating a template", async () => {
        // A fake server: it looks at the URL and method, and sends back data.
        const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
            const url = toUrl(input);
            if (url.endsWith("/templates") && input instanceof Request) {
                if (input.method === "POST") {
                    return jsonResponse({ success: true, data: template }, 201);
                }
                // Any other method on /templates (meaning GET) sends the list.
                return jsonResponse({ success: true, data: [template] });
            }
            return new Response(null, { status: 404 });
        });
        // Swap in our fake fetch so RTK Query talks to it instead of the real one.
        vi.stubGlobal("fetch", fetchMock);

        // A new, empty Redux store for this test.
        const store = makeStore();

        // Fetch the list once, and check fetch() was called exactly once.
        await store.dispatch(templateApi.endpoints.getTemplates.initiate());
        expect(countCallsTo(fetchMock, "/templates", "GET")).toBe(1);

        // Now create a new template. This is the action we're testing.
        await store.dispatch(
            templateApi.endpoints.createTemplate.initiate({
                title: "Follow up",
                body: "Thanks for reaching out...",
            }),
        );

        // waitFor: the extra fetch (caused by cache invalidation) happens a
        // little later, so we keep checking until the count reaches 2.
        await waitFor(() =>
            expect(countCallsTo(fetchMock, "/templates", "GET")).toBe(2),
        );
    });

    it("refetches the list and the single template after an update", async () => {
        const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
            const url = toUrl(input);
            // If it's not a Request object, we treat it as "GET" (that's how
            // fetch is called when no method is given).
            const method = input instanceof Request ? input.method : "GET";
            if (url.endsWith("/templates/t1")) {
                if (method === "PUT") {
                    return jsonResponse({
                        success: true,
                        data: { ...template, title: "Updated" },
                    });
                }
                return jsonResponse({ success: true, data: template });
            }
            if (url.endsWith("/templates")) {
                return jsonResponse({ success: true, data: [template] });
            }
            return new Response(null, { status: 404 });
        });
        vi.stubGlobal("fetch", fetchMock);

        const store = makeStore();

        // Fill the cache first: fetch the list, and fetch the single
        // template. This gives us a starting count (1 each) to compare
        // against after the update runs.
        await store.dispatch(templateApi.endpoints.getTemplates.initiate());
        await store.dispatch(templateApi.endpoints.getTemplate.initiate("t1"));
        expect(countCallsTo(fetchMock, "/templates", "GET")).toBe(1);
        expect(countCallsTo(fetchMock, "/templates/t1", "GET")).toBe(1);

        // Update the template. This should mark both the list and the single
        // item as outdated, because the list also contains a copy of it.
        await store.dispatch(
            templateApi.endpoints.updateTemplate.initiate({
                id: "t1",
                title: "Updated",
            }),
        );

        // Both should now have been fetched one more time (1 -> 2).
        await waitFor(() => {
            expect(countCallsTo(fetchMock, "/templates", "GET")).toBe(2);
            expect(countCallsTo(fetchMock, "/templates/t1", "GET")).toBe(2);
        });
    });

    it("refetches the template list after a delete", async () => {
        const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
            const url = toUrl(input);
            const method = input instanceof Request ? input.method : "GET";
            if (url.endsWith("/templates/t1") && method === "DELETE") {
                return jsonResponse({
                    success: true,
                    data: { message: "Template deleted" },
                });
            }
            if (url.endsWith("/templates")) {
                return jsonResponse({ success: true, data: [template] });
            }
            return new Response(null, { status: 404 });
        });
        vi.stubGlobal("fetch", fetchMock);

        const store = makeStore();

        await store.dispatch(templateApi.endpoints.getTemplates.initiate());
        expect(countCallsTo(fetchMock, "/templates", "GET")).toBe(1);

        // Deleting an item should mark the list as outdated, causing a
        // refetch. The DELETE request itself should only happen once.
        await store.dispatch(
            templateApi.endpoints.deleteTemplate.initiate("t1"),
        );

        await waitFor(() =>
            expect(countCallsTo(fetchMock, "/templates", "GET")).toBe(2),
        );
        expect(countCallsTo(fetchMock, "/templates/t1", "DELETE")).toBe(1);
    });
});
