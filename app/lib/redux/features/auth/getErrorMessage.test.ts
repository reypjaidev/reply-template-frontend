import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./getErrorMessage";

// getErrorMessage takes an API error and turns it into text to show the
// user. If the error doesn't look like the expected shape, it falls back to
// a generic message instead of crashing or showing something confusing.
describe("getErrorMessage", () => {
    it("returns the backend error message when the envelope is valid", () => {
        // "envelope" here means the expected shape: { success: false, error: string }.
        const err = { data: { success: false, error: "Invalid credentials" } };
        expect(getErrorMessage(err)).toBe("Invalid credentials");
    });

    it("returns the fallback when data has no error envelope shape", () => {
        // No "success"/"error" fields, so we can't trust this shape.
        const err = { data: { message: "Invalid credentials" } };
        expect(getErrorMessage(err)).toBe(
            "Something went wrong. Please try again.",
        );
    });

    it("returns the fallback when success is not false", () => {
        // success is true here, so this isn't really an error envelope.
        const err = { data: { success: true, error: "Invalid credentials" } };
        expect(getErrorMessage(err)).toBe(
            "Something went wrong. Please try again.",
        );
    });

    it("returns the fallback when error is not a string", () => {
        // "error" should be text, not a number.
        const err = { data: { success: false, error: 123 } };
        expect(getErrorMessage(err)).toBe(
            "Something went wrong. Please try again.",
        );
    });

    it("returns the fallback when err has no data property", () => {
        expect(getErrorMessage({})).toBe(
            "Something went wrong. Please try again.",
        );
    });

    it("returns the fallback for non-object err values", () => {
        // Even weird inputs (undefined, null, plain text) should not crash
        // the function — they should just get the generic message.
        expect(getErrorMessage(undefined)).toBe(
            "Something went wrong. Please try again.",
        );
        expect(getErrorMessage(null)).toBe(
            "Something went wrong. Please try again.",
        );
        expect(getErrorMessage("network error")).toBe(
            "Something went wrong. Please try again.",
        );
    });
});
