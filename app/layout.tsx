import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
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
  title: `${site.name} — ${site.claim}`,
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: `${site.name} — ${site.claim}`,
    description: site.description,
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/hero-cotizaciones-kanban.png",
        width: 1536,
        height: 1024,
        alt: "Kanban de Cotizaciones en Caudal",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
