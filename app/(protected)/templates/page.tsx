"use client";

import { useLogoutMutation } from "@/app/lib/redux/features/auth/authApi";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
    async function handleLogout() {
        await logout();
        router.replace("/sign-in");
    }
    return (
        <div>
            <button onClick={handleLogout}> Logout </button>{" "}
        </div>
    );
}
