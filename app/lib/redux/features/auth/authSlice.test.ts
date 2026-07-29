import { describe, expect, it } from "vitest";
import authReducer, {
    credentialsCleared,
    credentialsSet,
    type AuthUser,
} from "./authSlice";

const user: AuthUser = { id: "1", name: "Test", email: "test@example.com" };

describe("authSlice", () => {
    it("returns the initial state", () => {
        // Before anything happens, no user should be logged in yet.
        expect(authReducer(undefined, { type: "unknown" })).toEqual({
            user: null,
        });
    });

    it("credentialsSet stores the user", () => {
        // The credentialsSet action should save the user into the state.
        const state = authReducer({ user: null }, credentialsSet({ user }));
        expect(state.user).toEqual(user);
    });

    it("credentialsCleared resets the user to null", () => {
        // The credentialsCleared action (like on logout) should remove the user.
        const state = authReducer({ user }, credentialsCleared());
        expect(state.user).toBeNull();
    });
});
