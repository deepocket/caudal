"use client";

import { MapPin, Package, Truck } from "lucide-react";
import { AppSurface, Chip, type ChipTone } from "@/components/mocks/app-ui";
import { useDemoStep, useInView } from "@/hooks/use-in-view";
import { demoClients, demoProducts } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

// One shipment of quote C-0771: five pieces over three lines, each piece tied to its lot.
const lines = [
  { product: demoProducts[1], qty: 2, delivered: [0, 2, 2] },
  { product: demoProducts[2], qty: 2, delivered: [0, 1, 2] },
  { product: demoProducts[0], qty: 1, delivered: [0, 0, 1] },
];
const totalPieces = lines.reduce((sum, line) => sum + line.qty, 0);

const states: {
  label: string;
  tone: ChipTone;
  stripe: string;
  tracking: string;
  trackingTone: ChipTone;
}[] = [
  { label: "Pendiente", tone: "gray", stripe: "#d4d4d8", tracking: "Etiqueta creada", trackingTone: "gray" },
  { label: "Parcial", tone: "green", stripe: "#4a9d7c", tracking: "En tránsito", trackingTone: "gold" },
  { label: "Entregada", tone: "dark", stripe: "#1b3a2d", tracking: "Entregado", trackingTone: "emerald" },
];

export function EntregaDemo({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  // 0 pending · 1 partial (3/5) · 2 delivered · 3 hold
  const step = useDemoStep(4, 2000, inView);
  const phase = Math.min(step, 2);
  const state = states[phase];
  const delivered = lines.reduce((sum, line) => sum + line.delivered[phase], 0);

  const tiles = [
    { label: "Pendientes", value: phase === 0 ? 4 : 3 },
    { label: "En proceso", value: phase === 1 ? 3 : 2 },
    { label: "Entregadas", value: phase === 2 ? 10 : 9 },
  ];

  return (
    <div ref={ref} className={cn("relative h-[360px] w-full", className)}>
      <AppSurface className="absolute top-4 left-1/2 w-[312px] -translate-x-1/2 rounded-2xl bg-white p-3 shadow-[0_24px_50px_-24px_rgba(17,17,17,0.45)] ring-1 ring-black/[0.05]">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-semibold tracking-[-0.02em]">Entregas</p>
          <div className="flex rounded-lg bg-app-fill p-0.5 text-[9.5px] font-medium">
            <span className="rounded-md bg-white px-1.5 py-0.5 shadow-sm">Pendientes</span>
            <span className="px-1.5 py-0.5 text-app-muted">Entregadas</span>
            <span className="px-1.5 py-0.5 text-app-muted">Todas</span>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {tiles.map((tile) => (
            <div key={tile.label} className="rounded-lg bg-app-fill px-2 py-1.5">
              <p className="text-[9.5px] text-app-muted">{tile.label}</p>
              <p key={tile.value} className="animate-in fade-in text-[15px] font-semibold duration-500">
                {tile.value}
              </p>
            </div>
          ))}
        </div>

        <div className="relative mt-2.5 overflow-hidden rounded-xl bg-white py-2.5 pr-2.5 pl-4 ring-1 ring-black/[0.07]">
          <span
            className="absolute inset-y-0 left-0 w-[6px] transition-colors duration-500"
            style={{ backgroundColor: state.stripe }}
          />

          <div className="flex items-center gap-1.5">
            <span className="truncate text-[12px] font-semibold">{demoClients[2].name}</span>
            <Chip key={state.label} tone={state.tone} className="animate-in fade-in duration-300">
              {state.label}
            </Chip>
            <Chip tone="gray" className="ml-auto">
              <Truck className="size-2.5" /> Envío
            </Chip>
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-app-muted">
            <MapPin className="size-2.5" /> Av. Reforma 1120, Col. Centro, San Luis Potosí
          </p>

          <div className="mt-2 space-y-1.5">
            {lines.map((line) => {
              const done = line.delivered[phase];
              return (
                <div key={line.product.ref} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-md transition-colors duration-500",
                      done === line.qty ? "bg-app-green-50 text-app-primary" : "bg-app-fill text-app-faint",
                    )}
                  >
                    <Package className="size-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10.5px]">
                      <span className="font-semibold">
                        {done} de {line.qty}
                      </span>{" "}
                      · {line.product.name}
                    </p>
                    <div className="mt-0.5 flex h-[15px] items-center">
                      {done > 0 ? (
                        <span
                          key={`${line.product.ref}-${done}`}
                          className="rounded-full bg-app-green-50 px-1.5 font-mono text-[9px] text-app-primary animate-in fade-in slide-in-from-left-1 duration-300"
                        >
                          Lote {line.product.lot} · {done} pz
                        </span>
                      ) : (
                        <span className="rounded-full border border-dashed border-black/15 px-1.5 text-[9px] text-app-faint">
                          Lote al entregar
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-app-fill">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(delivered / totalPieces) * 100}%`,
                  backgroundColor: phase === 2 ? "#1b3a2d" : "#4a9d7c",
                }}
              />
            </div>
            <span className="text-[10px] font-medium text-app-muted">
              {delivered}/{totalPieces} entregado
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2 border-t border-black/[0.06] pt-2 text-[9.5px] text-app-muted">
            <span className="truncate">C-0771 · 08/09/2026 · # 7749 2210 5531</span>
            <span className="flex shrink-0 items-center gap-1">
              <span className="font-semibold text-app-ink">FedEx</span>
              <Chip
                key={state.tracking}
                tone={state.trackingTone}
                className="animate-in fade-in px-1.5 py-0 text-[9px] duration-300"
              >
                {state.tracking}
              </Chip>
            </span>
          </div>
        </div>
      </AppSurface>
    </div>
  );
}
