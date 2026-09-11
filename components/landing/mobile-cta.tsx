"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { site, hasPhone } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Phones only: once the hero is behind, a bottom bar keeps "Llamar" and
 * "Agendar demo" one tap away. It steps aside when the form or footer shows.
 */
export function MobileCta() {
  const [pastHero, setPastHero] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const targets = [document.getElementById("contacto"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el !== null,
    );
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setNearEnd(visible.size > 0);
    });
    targets.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const show = pastHero && !nearEnd;

  return (
    <div
      aria-hidden={!show}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-background/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-all duration-300 md:hidden",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <div className="flex gap-2">
        {hasPhone ? (
          <a
            href={`tel:${site.phone.e164}`}
            data-cta="llamar"
            tabIndex={show ? 0 : -1}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md border border-black/15 bg-card text-[15px] font-medium text-ink"
          >
            <Phone className="size-4" aria-hidden />
            Llamar
          </a>
        ) : null}
        <a
          href={site.demoHref}
          data-cta="agendar-demo"
          tabIndex={show ? 0 : -1}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-md bg-brand text-[15px] font-medium text-primary-foreground"
        >
          Agendar demo
        </a>
      </div>
    </div>
  );
}
