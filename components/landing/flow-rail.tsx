"use client";

import { Check } from "lucide-react";
import { useDemoStep, useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

// Each stage leaves the quote in the status the app shows, with the app's colors.
const stages = [
  {
    verb: "Cotiza",
    detail: "PDF con fotos, condición y lote de cada pieza.",
    status: "Enviada",
    tone: "bg-app-fill text-app-ink ring-1 ring-black/10",
    dot: "bg-app-faint",
  },
  {
    verb: "Aparta",
    detail: "Al aceptar, el stock se reserva solo.",
    status: "Aceptada",
    tone: "bg-app-gold-50 text-app-gold-700 ring-1 ring-app-gold-100",
    dot: "bg-app-gold-700",
  },
  {
    verb: "Entrega",
    detail: "Cada pieza sale ligada a su lote.",
    status: "Entregada",
    tone: "bg-app-primary text-white",
    dot: "bg-app-green-200",
  },
  {
    verb: "Factura",
    detail: "El CFDI se timbra desde la cotización.",
    status: "Facturada",
    tone: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    dot: "bg-emerald-500",
  },
  {
    verb: "Cobra",
    detail: "Estados de cuenta en un clic.",
    status: "Cobrada",
    tone: "bg-app-green-100 text-app-primary ring-1 ring-app-green-200",
    dot: "bg-app-accent",
  },
] as const;

const completed = {
  status: "Completada",
  tone: "bg-app-gold-100 text-app-gold-700 ring-1 ring-app-gold-100",
  dot: "bg-app-gold-700",
};

const STEP_MS = 2100;

/** Where stripe.com shows its logo strip: one quote travelling the whole cauce. */
export function FlowRail() {
  const [ref, inView] = useInView<HTMLDivElement>();
  // 0–4: the folio sits on a stage · 5: the deal is complete.
  const step = useDemoStep(stages.length + 1, STEP_MS, inView);
  const complete = step === stages.length;
  const last = stages.length - 1;

  return (
    <div ref={ref} className="border-y border-rail bg-card/60 backdrop-blur-[2px]">
      <div className="mx-auto w-full max-w-6xl border-rail md:border-x">
        <ol className="flex snap-x snap-mandatory scroll-pl-6 overflow-x-auto px-6 [scrollbar-width:none] sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          {stages.map((stage, index) => {
            const active = index === step;
            const done = complete || index < step;
            const showChip = active || (complete && index === last);
            const chip = complete && index === last ? completed : stage;
            return (
              <li
                key={stage.verb}
                className="relative w-[11.5rem] shrink-0 snap-start border-rail py-7 pr-6 sm:w-auto sm:border-l sm:px-6 sm:first:border-l-0 md:py-8 md:first:pl-10"
              >
                <span
                  key={active ? `on-${step}` : "off"}
                  aria-hidden
                  className={cn(
                    "absolute top-0 right-6 left-0 h-[2px] origin-left bg-gradient-to-r from-sage via-moss to-brand sm:right-0",
                    active ? "rail-progress" : done ? "scale-x-100" : "scale-x-0",
                  )}
                  style={active ? { animationDuration: `${STEP_MS}ms` } : undefined}
                />
                <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  0{index + 1}
                  {done ? <Check className="size-3 text-moss" aria-hidden /> : null}
                </p>
                <p
                  className={cn(
                    "mt-2 text-lg font-medium tracking-tight transition-colors duration-500",
                    active || done ? "text-ink" : "text-ink-soft",
                  )}
                >
                  {stage.verb}
                </p>
                <p className="mt-1 text-[13.5px] leading-snug text-muted-foreground">
                  {stage.detail}
                </p>
                <span
                  aria-hidden
                  className={cn(
                    "mt-4 inline-flex h-6 items-center rounded-full font-app text-[11px] font-semibold transition-all duration-500",
                    chip.tone,
                    showChip ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                  )}
                >
                  {/* Keyed so every status change replays the same entrance. */}
                  <span
                    key={chip.status}
                    className="inline-flex items-center gap-1.5 px-2.5 animate-in fade-in slide-in-from-bottom-1 duration-500"
                  >
                    <span className={cn("size-1.5 rounded-full", chip.dot)} />
                    C-0771 · {chip.status}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
