
import React from "react"
import { Inter } from "next/font/google";
import AppProviders from "./app-providers"
import "@repo/ui/globals.css"
import { Metadata} from "next";
import siteMetadata from "@/lib/config/seo-config"
import { cn } from "@repo/ui/lib/utils/cn";
import Navbar from "@/components/navbar/navbar-root";
import Footer from "@/components/footer/footer";

const inter = Inter({ subsets: ["latin"] });


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
		types: {
			"application/rss+xml": `${siteMetadata.siteUrl}/feed.xml`,
		},
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn(inter.className, "antialiased")}>
				<AppProviders>
					<Navbar />
					<main className="min-h-screen">{children}</main>
					<Footer />
				</AppProviders>
				{/* <Analytics /> */}
			</body>
		</html>
	);
}
