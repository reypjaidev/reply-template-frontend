"use client";

import { useLogoutMutation } from "@/app/lib/redux/features/auth/authApi";
import { useRouter } from "next/dist/client/components/navigation";

const TemplateHeader = () => {
    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
    const router = useRouter();
    const handleLogout = async () => {
        await logout();
        router.replace("/sign-in");
    };
    return (
        <header className="mb-8 text-center">
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-black/5 hover:text-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoggingOut ? "Logging out…" : "Log out"}
                </button>
            </div>
            <h1 className="text-2xl font-semibold text-white">Reply Board</h1>
            <p className="mt-1 text-sm text-neutral-300">
                Your canned email replies, one click away.
            </p>
        </header>
    );
};

export default TemplateHeader;
