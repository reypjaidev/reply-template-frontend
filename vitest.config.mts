import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Node's fetch (unlike a browser) needs an absolute base URL —
    // fetchBaseQuery reads this at import time in app/lib/redux/api.ts.
    env: {
      NEXT_PUBLIC_API_URL: "http://localhost:4000/api/v1",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"), // root of the project
    },
  },
});
