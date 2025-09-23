import type {Metadata} from "next";
import {cn} from "@artic-frost/ui/lib";
import AppProviders from "./app-providers";
import localFont from "next/font/local";
import "@artic-frost/ui/globals.css";

export const metadata: Metadata = {
  title: "x",
  description: "x",
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
        )}>
        <AppProviders>
          <main className="min-h-screen w-full">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
