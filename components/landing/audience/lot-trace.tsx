"use client";

import { Boxes, Check, FileText, History, ScanBarcode, ShoppingCart, Truck } from "lucide-react";
import { AppSurface, Avatar, Chip } from "@/components/mocks/app-ui";
import { useDemoStep, useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

// One lot, followed from the supplier's invoice to the hospital. Every hop is
// something the app records: the purchase creates the lot, the accepted quote
// reserves it, the delivery requires it.
const hops = [
  { icon: ShoppingCart, title: "Compra", detail: "Factura del proveedor · 10 pz", date: "02/09", who: "AL", tone: 1 },
  { icon: Boxes, title: "Inventario", detail: "Caduca el 31/01/2027", date: "02/09", who: "AL", tone: 1 },
  { icon: FileText, title: "Cotización C-0771", detail: "Hospital San Rafael · aceptada", date: "05/09", who: "BD", tone: 0 },
  { icon: Truck, title: "Entrega · 2 pz", detail: "Hospital San Rafael · FedEx", date: "08/09", who: "JM", tone: 2 },
] as const;

const log = [
  { who: "Ana", what: "cambió C-0771 a Aceptada", when: "05/09 09:12" },
  { who: "Jorge", what: "entregó 2 pz · L24A117", when: "08/09 12:40" },
] as const;

// 0–3 reveal each hop, 4 adds the log, 5–6 hold the complete trail.
const STEPS = 7;

export function LotTrace() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const step = useDemoStep(STEPS, 1200, inView);
  const revealed = Math.min(step + 1, hops.length);
  const showLog = step >= hops.length;

  return (
    <div ref={ref} className="absolute inset-0">
      <AppSurface className="absolute top-5 left-1/2 w-[296px] -translate-x-1/2 rounded-2xl bg-white p-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.75)]">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-app-green-50 text-app-primary">
            <ScanBarcode className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2">
              <span className="font-mono text-[12.5px] font-semibold">Lote L24A117</span>
              <Chip tone="emerald">Vigente</Chip>
            </p>
            <p className="truncate text-[10.5px] text-app-muted">
              Punta de radiofrecuencia 90° · AR-9401
            </p>
          </div>
        </div>

        <ol className="mt-3">
          {hops.map((hop, index) => {
            const on = index < revealed;
            const last = index === hops.length - 1;
            return (
              <li key={hop.title} className="relative flex gap-2.5 pb-2 last:pb-0">
                {!last ? (
                  <span
                    className={cn(
                      "absolute top-6 bottom-0 left-[11px] w-px transition-colors duration-500",
                      index < revealed - 1 ? "bg-app-accent" : "bg-black/10",
                    )}
                  />
                ) : null}
                <span
                  className={cn(
                    "relative grid size-6 shrink-0 place-items-center rounded-full transition-all duration-500",
                    on ? "bg-app-accent text-white" : "bg-app-fill text-app-faint",
                  )}
                >
                  {on ? <Check className="size-3.5" strokeWidth={3} /> : <hop.icon className="size-3" />}
                </span>
                <div
                  className={cn(
                    "flex min-w-0 flex-1 items-start justify-between gap-2 transition-opacity duration-500",
                    on ? "opacity-100" : "opacity-35",
                  )}
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[11.5px] font-semibold">
                      <hop.icon className="size-3 text-app-muted" />
                      {hop.title}
                    </p>
                    <p className="truncate text-[10.5px] text-app-muted">{hop.detail}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-[10px] text-app-faint">{hop.date}</span>
                    <Avatar initials={hop.who} tone={hop.tone} className="size-[18px] text-[7.5px]" />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div
          className={cn(
            "mt-2.5 rounded-xl bg-app-fill px-3 py-2 transition-all duration-500",
            showLog ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
          )}
        >
          <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-app-muted">
            <History className="size-3" />
            Bitácora de C-0771
          </p>
          <ul className="mt-1.5 space-y-1">
            {log.map((entry) => (
              <li key={entry.when} className="flex justify-between gap-2 text-[10.5px]">
                <span className="truncate">
                  <span className="font-medium">{entry.who}</span>{" "}
                  <span className="text-app-muted">{entry.what}</span>
                </span>
                <span className="shrink-0 text-app-faint">{entry.when}</span>
              </li>
            ))}
          </ul>
        </div>
      </AppSurface>
    </div>
  );
}
