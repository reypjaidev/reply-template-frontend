import {
    createApi,
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { credentialsCleared } from "./features/auth/authSlice";

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
            extraOptions,
        );

        if (refreshResult.data) {
            result = await rawBaseQuery(args, api, extraOptions);
        } else {
            api.dispatch(credentialsCleared());
        }
    }

    return result;
};

// Shared base API — features inject their endpoints into this via
// api.injectEndpoints() instead of calling createApi() themselves, so
// every feature shares one cache/middleware and the same reauth flow.
export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["CurrentUser"],
    endpoints: () => ({}),
});
