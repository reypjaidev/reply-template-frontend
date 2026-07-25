import { describe, expect, it } from "vitest";
import { signInSchema, signUpSchema } from "./authSchemas";

describe("signInSchema", () => {
    it("accepts a valid email and password", () => {
        const result = signInSchema.safeParse({
            email: "test@example.com",
            password: "password123",
        });
        expect(result.success).toBe(true);
    });

    it("rejects an empty email", () => {
        const result = signInSchema.safeParse({
            email: "",
            password: "password123",
        });
        expect(result.success).toBe(false);
    });

    it("rejects a malformed email", () => {
        const result = signInSchema.safeParse({
            email: "not-an-email",
            password: "password123",
        });
        expect(result.success).toBe(false);
    });

    it("rejects an empty password", () => {
        const result = signInSchema.safeParse({
            email: "test@example.com",
            password: "",
        });
        expect(result.success).toBe(false);
    });
});

describe("signUpSchema", () => {
    const validInput = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
    };

    it("accepts valid, matching input", () => {
        const result = signUpSchema.safeParse(validInput);
        expect(result.success).toBe(true);
    });

    it("rejects an empty name", () => {
        const result = signUpSchema.safeParse({ ...validInput, name: "  " });
        expect(result.success).toBe(false);
    });

    it("rejects a malformed email", () => {
        const result = signUpSchema.safeParse({
            ...validInput,
            email: "not-an-email",
        });
        expect(result.success).toBe(false);
    });

    it("rejects a password shorter than 8 characters", () => {
        const result = signUpSchema.safeParse({
            ...validInput,
            password: "short",
            confirmPassword: "short",
        });
        expect(result.success).toBe(false);
    });

    it("rejects when confirmPassword does not match password", () => {
        const result = signUpSchema.safeParse({
            ...validInput,
            confirmPassword: "different123",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
            expect(result.error.issues[0].message).toBe(
                "Passwords do not match",
            );
        }
    });
});
