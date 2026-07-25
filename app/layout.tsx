import Background from "./_components/Background";
import "./globals.css";
import { StoreProvider } from "./lib/redux/StoreProvider";
import { AuthInitializer } from "./lib/redux/features/auth/AuthInitializer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="h-screen w-screen bg-neutral-900">
                <StoreProvider>
                    <AuthInitializer>{children}</AuthInitializer>
                </StoreProvider>
                <Background />
            </body>
        </html>
    );
}
