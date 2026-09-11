import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The product UI is set in Inter; the demos use it so they read as the real app.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl =
  process.env.VERCEL_ENV === "production"
    ? site.url
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : site.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.seo.title,
  description: site.seo.description,
  applicationName: site.name,
  keywords: [...site.seo.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "business",
  alternates: {
    canonical: "/",
    languages: { "es-MX": "/", "x-default": "/" },
    // The same page for agents: full Markdown and the llms.txt summary.
    types: { "text/markdown": "/index.md", "text/plain": "/llms.txt" },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Set GOOGLE_SITE_VERIFICATION to the token from Search Console to verify the domain.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#f4f2eb",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.locale}
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        {/* Vercel Web Analytics: page views without cookies, only counted on Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
