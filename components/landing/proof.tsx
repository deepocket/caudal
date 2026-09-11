"use client";

import { useDemoStep, useInView } from "@/hooks/use-in-view";
import { proofStats } from "@/lib/proof";
import { cn } from "@/lib/utils";

export function Proof() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const active = useDemoStep(proofStats.length, 2600, inView);

  return (
    <section id="cifras" className="relative bg-background">
      <div className="mx-auto w-full max-w-6xl border-rail px-6 pt-16 pb-16 text-center md:border-x md:px-10 md:pt-20 md:pb-20">
        <h2 className="mx-auto max-w-3xl text-[2.4rem] leading-[1.04] font-medium tracking-[-0.04em] text-balance text-ink md:text-[4rem]">
          Probado en una distribuidora de verdad
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Cada módulo se usó primero con clientes, proveedores y el SAT de verdad. Estos
          son datos de la operación de ArtroConfort.
        </p>
      </div>
      <div ref={ref} className="border-y border-rail">
        <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 border-rail md:grid-cols-4 md:border-x">
          {proofStats.map((stat, index) => (
            <div
              key={stat.value}
              className={cn(
                "relative border-rail px-5 py-9 text-center md:px-8 md:py-12",
                index % 2 === 1 && "border-l",
                index > 1 && "border-t md:border-t-0",
                index === 2 && "md:border-l",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-moss to-transparent transition-opacity duration-700",
                  index === active ? "opacity-100" : "opacity-0",
                )}
              />
              <dt className="sr-only">{stat.short}</dt>
              <dd
                className={cn(
                  "text-[2.1rem] leading-none font-medium tracking-[-0.04em] transition-colors duration-700 md:text-[2.75rem]",
                  index === active ? "text-ink" : "text-ink-soft",
                )}
              >
                {stat.value}
              </dd>
              <dd
                aria-hidden
                className={cn(
                  "mx-auto mt-3 max-w-[15rem] text-[14px] leading-snug transition-colors duration-700 md:text-[15px]",
                  index === active ? "text-ink/80" : "text-muted-foreground",
                )}
              >
                {stat.short}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
