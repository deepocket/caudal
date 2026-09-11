import type { Metadata } from "next";

// Private: behind a password and out of search results.
export const metadata: Metadata = {
  title: "Solicitudes · Caudal",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="flex min-h-full flex-1 flex-col bg-background">{children}</div>;
}
