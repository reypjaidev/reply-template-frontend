import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
    id: string;
    name: string;
    email: string;
};

type AuthState = {
    user: AuthUser | null;
};

const initialState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // accessToken/refreshToken are httpOnly cookies the browser manages —
        // the only auth state the client ever holds is the user profile.
        credentialsSet(state, action: PayloadAction<{ user: AuthUser }>) {
            state.user = action.payload.user;
        },
        credentialsCleared(state) {
            state.user = null;
        },
    },
});

export const { credentialsSet, credentialsCleared } = authSlice.actions;
export default authSlice.reducer;
