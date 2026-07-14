"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetCurrentUserQuery } from "./authApi";

// Bounces an already-logged-in visitor away from /sign-in or /sign-up.
// No loading gate here — showing the form briefly for the common
// (logged-out) case beats blocking every visit with a spinner.
export function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isSuccess } = useGetCurrentUserQuery();

  useEffect(() => {
    if (isSuccess) router.replace("/");
  }, [isSuccess, router]);

  return <>{children}</>;
}
