import { CallLink } from "@/components/landing/call-link";
import { FlowLines } from "@/components/landing/flow-lines";
import { Wordmark } from "@/components/wordmark";
import { site } from "@/lib/site";

const footerLinks = [
  { href: "#pruebalo", label: "Pruébalo" },
  { href: "#producto", label: "Producto" },
  { href: "#para-quien", label: "Para quién" },
  { href: "#preguntas", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
] as const;

// Same ribbon as the hero, re-tinted for the dark ground.
const nightRiver = {
  "--mint": "#2c4a26",
  "--sage": "#4d7a43",
  "--moss": "#9fc08e",
  "--brand": "#e6efd9",
} as React.CSSProperties;

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-brand text-primary-foreground">
      {/* Re-tint only the ribbon: these variables must not reach the footer's own bg-brand. */}
      <div aria-hidden className="absolute inset-0 opacity-60" style={nightRiver}>
        <FlowLines id="night-river" className="h-full w-full" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl border-white/10 px-6 md:border-x md:px-10">
        <div className="flex flex-col gap-10 py-14 md:flex-row md:items-end md:justify-between md:py-20">
          <div>
            <Wordmark className="[&_img]:h-8 [&_img]:brightness-0 [&_img]:invert md:[&_img]:h-9" />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-primary-foreground/65">
              {site.claim}
            </p>
          </div>
          <nav aria-label="Pie de página" className="flex flex-wrap gap-x-7 gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-2 border-t border-white/10 py-7 text-[13px] text-primary-foreground/50 md:flex-row md:justify-between">
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <CallLink className="transition-colors hover:text-primary-foreground" />
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-primary-foreground">
              {site.email}
            </a>
          </p>
          <p>
            © 2026 {site.name} · {site.domain}
          </p>
        </div>
      </div>
    </footer>
  );
}
