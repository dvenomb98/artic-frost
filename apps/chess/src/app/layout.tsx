import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@repo/ui/lib/utils/cn";
import AppProviders from "./app-providers";
import "@repo/ui/globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer"

const inter = Inter({ subsets: ["latin"] });

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
      <body className={cn(inter.className, "antialiased")}>
        <AppProviders>
          <Navbar />
          <main className="min-h-[80dvh]">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
