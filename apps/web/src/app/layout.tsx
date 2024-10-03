import { Metadata } from "next";
import localFont from "next/font/local";

import siteMetadata from "@/lib/seo-config";
import { cn } from "@ui/lib";
import { Analytics } from "@vercel/analytics/react";

import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer";

import AppProviders from "./app-providers";
import "@repo/ui/globals.css";
import { CONTAINER_CLASSES } from "@/lib/classNames";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: "./",
    siteName: siteMetadata.title,
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
    title: siteMetadata.title,
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "font-sans antialiased min-h-screen flex flex-col"
        )}
      >
        <AppProviders>
          <div
            className={cn(
              CONTAINER_CLASSES,
              "flex-grow flex flex-col py-5 md:py-20 gap-20"
            )}
          >
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
