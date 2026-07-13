import "./globals.css";
import { StoreProvider } from "./lib/redux/StoreProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen w-screen bg-neutral-900">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
