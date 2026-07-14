import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
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

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL, // e.g. http://localhost:4000/api/v1
  // accessToken/refreshToken are httpOnly cookies — this is what makes the
  // browser attach and update them automatically, there's nothing to store
  // or attach as a header on our end.
  credentials: "include",
});

// On a 401, hit /auth/refresh (rotates the httpOnly cookies) and retry the
// original request once before giving up and clearing the session.
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(credentialsCleared());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CurrentUser"],
  endpoints: (builder) => ({
    register: builder.mutation<{ user: AuthUser }, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (response: ApiEnvelope<{ user: AuthUser }>) =>
        response.data,
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(credentialsSet(data));
      },
    }),
    login: builder.mutation<{ user: AuthUser }, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response: ApiEnvelope<{ user: AuthUser }>) =>
        response.data,
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
      transformResponse: (response: ApiEnvelope<AuthUser>) => response.data,
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
