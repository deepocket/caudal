"use client";

import { Check, FileText, Sparkles } from "lucide-react";
import { AppButton, AppSurface, money } from "@/components/mocks/app-ui";
import { useDemoStep, useInView } from "@/hooks/use-in-view";
import { demoProducts } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

// An invented US supplier invoice and the rows Caudal builds from it.
const exchangeRate = 18.25;
const lines = [
  { original: "RF Ablation Probe 90°", product: demoProducts[0], exp: "01/31/27", expiry: "31/01/2027", qty: 2, usd: 185 },
  { original: "Shaver Blade 4.0 mm", product: demoProducts[1], exp: "03/31/27", expiry: "31/03/2027", qty: 5, usd: 62 },
  { original: "Suture Anchor 5.5 mm", product: demoProducts[2], exp: "02/29/28", expiry: "29/02/2028", qty: 4, usd: 140 },
];
const totalUsd = lines.reduce((sum, line) => sum + line.qty * line.usd, 0);
const usd = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 });

function Invoice({ reading, highlight }: { reading: boolean; highlight: number }) {
  return (
    <div className="absolute top-5 left-4 w-[258px] -rotate-[2.5deg] rounded-md bg-white px-3 pt-2.5 pb-2 shadow-[0_14px_34px_-14px_rgba(17,17,17,0.35)] ring-1 ring-black/[0.05]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-bold tracking-[0.08em]">INVOICE</p>
          <p className="text-[7.5px] text-app-muted">Bayline Surgical, Inc. · Miami, FL</p>
        </div>
        <div className="text-right text-[7.5px] text-app-muted">
          <p>No. 4471</p>
          <p>Sep 2, 2026</p>
        </div>
      </div>
      <div className="mt-1.5 grid grid-cols-[1fr_38px_40px_16px_32px] gap-x-1.5 border-b border-black/10 pb-0.5 text-[6.5px] font-semibold text-app-muted uppercase">
        <span>Description</span>
        <span>Lot</span>
        <span>Exp.</span>
        <span>Qty</span>
        <span className="text-right">Unit</span>
      </div>
      {lines.map((line, i) => (
        <div
          key={line.original}
          className={cn(
            "-mx-1 grid grid-cols-[1fr_38px_40px_16px_32px] gap-x-1.5 rounded px-1 py-[3px] text-[7.5px] transition-colors duration-300",
            highlight === i ? "bg-app-gold-50" : "bg-transparent",
          )}
        >
          <span className="truncate">{line.original}</span>
          <span className="font-mono">{line.product.lot}</span>
          <span>{line.exp}</span>
          <span>{line.qty}</span>
          <span className="text-right">{usd.format(line.usd)}</span>
        </div>
      ))}
      <p className="mt-1 text-right text-[7.5px] font-semibold">Total USD {usd.format(totalUsd)}</p>

      {reading ? (
        <span className="absolute -top-2 right-2 flex items-center gap-1 rounded-full bg-app-primary px-2 py-0.5 text-[9px] font-medium text-white shadow-md animate-in fade-in">
          <Sparkles className="size-2.5 text-app-gold-100" />
          Leyendo con IA…
        </span>
      ) : null}
    </div>
  );
}

export function ComprasDemo({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  // 0 reading the PDF · 1–3 one reviewed row per step · 4 saved, lots created
  const step = useDemoStep(5, 1600, inView);
  const shown = Math.min(step, 3);
  const saved = step === 4;

  return (
    <div ref={ref} className={cn("relative h-[360px] w-full", className)}>
      <AppSurface className="absolute inset-0">
        <Invoice reading={step === 0} highlight={step >= 1 && step <= 3 ? step - 1 : -1} />

        <div className="absolute top-[118px] right-3 w-[300px] rounded-2xl bg-white p-3 shadow-[0_24px_50px_-24px_rgba(17,17,17,0.45)] ring-1 ring-black/[0.05]">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold tracking-[-0.02em]">Nueva compra</p>
            <div className="flex items-center gap-1 text-[9.5px] font-medium">
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 transition-colors duration-300",
                  step === 0 ? "bg-app-primary text-white" : "bg-app-fill text-app-muted",
                )}
              >
                1 Subir PDF
              </span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 transition-colors duration-300",
                  step >= 1 ? "bg-app-primary text-white" : "bg-app-fill text-app-muted",
                )}
              >
                2 Revisar y guardar
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-app-fill px-2 py-1 text-[10px] text-app-muted">
            <FileText className="size-3" />
            <span className="truncate">invoice-4471.pdf · Bayline Surgical · USD</span>
          </div>

          <div className="mt-1.5 space-y-0.5">
            {lines.map((line, i) =>
              i < shown ? (
                <div
                  key={line.original}
                  className="h-[34px] rounded-lg px-1 py-0.5 animate-in fade-in slide-in-from-bottom-1 duration-300"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[11px] font-semibold">{line.product.name}</span>
                    <span className="shrink-0 text-[11px] font-semibold">
                      {money(line.usd * exchangeRate)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-[9.5px] text-app-muted">
                    <span className="truncate italic">{line.original}</span>
                    <span className="shrink-0 rounded-full bg-app-green-50 px-1.5 font-mono text-app-primary">
                      {line.product.lot}
                    </span>
                    <span className="shrink-0">{line.expiry}</span>
                    <span className="shrink-0">×{line.qty}</span>
                  </div>
                </div>
              ) : (
                <div key={line.original} className="flex h-[34px] flex-col justify-center gap-1.5 px-1">
                  <span className="h-2 w-40 rounded-full bg-black/[0.06]" />
                  <span className="h-1.5 w-28 rounded-full bg-black/[0.04]" />
                </div>
              ),
            )}
          </div>

          <div className="mt-1.5 flex items-center justify-between border-t border-black/[0.06] pt-1.5 text-[10px] text-app-muted">
            <span className={cn("transition-opacity duration-300", step >= 3 ? "opacity-100" : "opacity-0")}>
              Tipo de cambio {money(exchangeRate)} por USD
            </span>
            {step >= 3 ? (
              <span className="text-[11px] font-semibold text-app-ink animate-in fade-in">
                {money(totalUsd * exchangeRate)}
              </span>
            ) : (
              <span className="h-2 w-14 rounded-full bg-black/[0.06]" />
            )}
          </div>
          <AppButton
            variant={saved ? "accent" : "primary"}
            className={cn("mt-1.5 w-full py-2", step === 3 && "ring-2 ring-app-accent/40")}
          >
            {saved ? (
              <>
                <Check className="size-3" strokeWidth={3} /> Compra guardada · 3 lotes creados en inventario
              </>
            ) : (
              <>
                Guardar compra <span className="font-normal text-white/70">· crea 3 lotes en inventario</span>
              </>
            )}
          </AppButton>
        </div>
      </AppSurface>
    </div>
  );
}
