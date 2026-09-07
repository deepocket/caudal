import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
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
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
