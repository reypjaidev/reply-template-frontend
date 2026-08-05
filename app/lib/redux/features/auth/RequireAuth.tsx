"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/app/_components/Loader";
import { useGetCurrentUserQuery } from "./authApi";

// Client-side gate: relies on the cross-origin getCurrentUser fetch (shared
// with AuthInitializer via RTK Query's cache, so this doesn't refire it) —
// a server-side check can't see the backend's cookie once frontend/backend
// live on different domains, so this is the one check that works in prod too.
export function RequireAuth({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isLoading, isError, isSuccess } = useGetCurrentUserQuery();

    useEffect(() => {
        if (isError) router.replace("/sign-in");
    }, [isError, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-950">
                <Loader />
            </div>
        );
    }

    if (!isSuccess) return null;

    return <>{children}</>;
}
