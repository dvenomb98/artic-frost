import {Metadata} from "next";
import localFont from "next/font/local";

import {cn} from "@artic-frost/ui/lib";
import {Analytics} from "@vercel/analytics/react";

import {AppProviders} from "./app-providers";
import {Navbar} from "@/components/navbar/navbar";
import {Footer} from "@/components/footer";
import {CONTAINER_CLASSES} from "@/lib/classes";

import "@artic-frost/ui/globals.css";

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

const metadata: Metadata = {
  metadataBase: new URL("https://danielbilek.com"),
  title: {
    default: "Daniel Bílek",
    template: `%s | Daniel Bílek`,
  },
  description: "Writing code and sharing insights.",
  openGraph: {
    title: "Daniel Bílek",
    description: "Writing code and sharing insights.",
    url: "./",
    siteName: "Daniel Bílek",
    locale: "en",
    type: "website",
  },
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Daniel Bílek",
    card: "summary_large_image",
  },
};

function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "font-sans antialiased"
        )}>
        <AppProviders>
          <div
            className={cn(
              CONTAINER_CLASSES,
              "flex flex-col min-h-screen py-5 md:py-20 gap-20"
            )}>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}

export {metadata};
export default RootLayout;
