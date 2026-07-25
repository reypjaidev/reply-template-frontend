import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./getErrorMessage";

describe("getErrorMessage", () => {
    it("returns the backend error message when the envelope is valid", () => {
        const err = { data: { success: false, error: "Invalid credentials" } };
        expect(getErrorMessage(err)).toBe("Invalid credentials");
    });

    it("returns the fallback when data has no error envelope shape", () => {
        const err = { data: { message: "Invalid credentials" } };
        expect(getErrorMessage(err)).toBe(
            "Something went wrong. Please try again.",
        );
    });

    it("returns the fallback when success is not false", () => {
        const err = { data: { success: true, error: "Invalid credentials" } };
        expect(getErrorMessage(err)).toBe(
            "Something went wrong. Please try again.",
        );
    });

    it("returns the fallback when error is not a string", () => {
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
