import { api } from "../../api";
import { credentialsSet, credentialsCleared, type AuthUser } from "./authSlice";

// Matches backend's utils/response.ts sendSuccess() envelope.
type ApiEnvelope<T> = { success: true; data: T };

type RegisterRequest = {
    name: string;
    email: string;
    password: string;
};

type LoginRequest = {
    email: string;
    password: string;
};

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<{ user: AuthUser }, RegisterRequest>({
            query: (body) => ({ url: "/auth/register", method: "POST", body }),
            transformResponse: (response: ApiEnvelope<{ user: AuthUser }>) =>
                response.data,
            // Forces any mounted getCurrentUser subscriber (RequireAuth,
            // RedirectIfAuthed, AuthInitializer) to refetch instead of reading a
            // stale cached result from before this login/register — e.g. the
            // errored state left behind by a previous logout.
            invalidatesTags: ["CurrentUser"],
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled;
                dispatch(credentialsSet(data));
            },
        }),
        login: builder.mutation<{ user: AuthUser }, LoginRequest>({
            query: (body) => ({ url: "/auth/login", method: "POST", body }),
            transformResponse: (response: ApiEnvelope<{ user: AuthUser }>) =>
                response.data,
            invalidatesTags: ["CurrentUser"],
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled;
                dispatch(credentialsSet(data));
            },
        }),
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({ url: "/auth/logout", method: "POST" }),
            transformResponse: (response: ApiEnvelope<{ message: string }>) =>
                response.data,
            // forces any mounted getCurrentUser subscriber (RequireAuth,
            // RedirectIfAuthed) to refetch and see the logged-out state —
            // without this the cached "success" result would stick around
            invalidatesTags: ["CurrentUser"],
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                await queryFulfilled;
                dispatch(credentialsCleared());
            },
        }),
        // Session bootstrap — call this once on app load. Cookie-based auth
        // means the client has no way to know it's "logged in" otherwise;
        // a 401 here just means there's no valid session.
        getCurrentUser: builder.query<AuthUser, void>({
            query: () => ({ url: "/users", method: "GET" }),
            transformResponse: (response: ApiEnvelope<AuthUser>) =>
                response.data,
            providesTags: ["CurrentUser"],
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled;
                dispatch(credentialsSet({ user: data }));
            },
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
} = authApi;
