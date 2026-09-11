import { DemoButton } from "@/components/demo-button";
import { Wordmark } from "@/components/wordmark";

const links = [
  { href: "#pruebalo", label: "Pruébalo" },
  { href: "#producto", label: "Producto" },
  { href: "#para-quien", label: "Para quién" },
] as const;

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-rail">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-5 md:px-10">
        <div className="flex items-center gap-10">
          <Wordmark />
          <nav aria-label="Principal" className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium text-ink/80 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <DemoButton />
      </div>
    </header>
  );
}
