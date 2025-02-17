import type { Metadata } from "next";
import localFont from "next/font/local";

import { cn } from "@artic-frost/ui/lib";
import {
  Separator,
  SidebarInset,
  SidebarTrigger,
  ThemeGlobalManager,
} from "@artic-frost/ui/components";

import { AppSidebar } from "@/components/sidebar/sidebar";

import { AppProviders } from "./app-providers";

import "@artic-frost/ui/globals.css";

export const metadata: Metadata = {
  title: "Wild-cherry",
  description: "Drawing app",
};

const geistSans = localFont({
  src: "../../../../packages/ui/src/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../../../packages/ui/src/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} font-sans`,
          "antialiased"
        )}
      >
        <AppProviders>
          <main className="min-h-screen w-full">
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 justify-between">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1">{null}</SidebarTrigger>
                  <Separator orientation="vertical" className="mr-2 h-4" />
                </div>
                <ThemeGlobalManager />
              </header>
              <section className="flex-1">{children}</section>
            </SidebarInset>
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
