import React from "react";
import { RequireAuth } from "../lib/redux/features/auth/RequireAuth";

function layout({ children }: { children: React.ReactNode }) {
    return <RequireAuth>{children}</RequireAuth>;
}

export default layout;
