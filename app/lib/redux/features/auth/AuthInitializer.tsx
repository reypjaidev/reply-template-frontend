"use client";

import { useGetCurrentUserQuery } from "./authApi";

// Cookie-based auth means the client has no way to know it's logged in
// without asking. Mounted once near the root — firing this query is enough;
// onQueryStarted in authApi populates the auth slice on success, and a 401
// here is a normal "not logged in" state, not an error to surface.
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useGetCurrentUserQuery();
  return <>{children}</>;
}
