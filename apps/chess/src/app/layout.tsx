import type { Metadata } from "next";
import { cn } from "@repo/ui/lib/utils/cn";
import AppProviders from "./app-providers";
import "@repo/ui/globals.css";
import { geist } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Chess",
  description: "Created by Daniel Bílek for personal use",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(geist.className, "antialiased")}>
        <AppProviders>
          <main className="min-h-screen w-full">
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
