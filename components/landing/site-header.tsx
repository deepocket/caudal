import { Phone } from "lucide-react";
import { DemoButton } from "@/components/demo-button";
import { CallLink } from "@/components/landing/call-link";
import { Wordmark } from "@/components/wordmark";
import { site } from "@/lib/site";

const links = [
  { href: "#pruebalo", label: "Pruébalo" },
  { href: "#producto", label: "Producto" },
  { href: "#para-quien", label: "Para quién" },
  { href: "#preguntas", label: "Preguntas" },
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
        <div className="flex items-center gap-2 md:gap-5">
          {/* Call leads: the number on wide screens, a tap-to-call button on phones. */}
          <CallLink className="hidden items-center gap-2 text-[15px] font-medium text-ink/80 transition-colors hover:text-ink lg:inline-flex">
            <Phone className="size-4" aria-hidden />
            {site.phone.display}
          </CallLink>
          <CallLink className="grid size-9 place-items-center rounded-md border border-black/15 bg-card/70 text-ink lg:hidden">
            <Phone className="size-4" aria-hidden />
          </CallLink>
          <DemoButton />
        </div>
      </div>
    </header>
  );
}
