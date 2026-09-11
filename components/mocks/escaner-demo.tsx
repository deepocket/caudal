"use client";

import { Check, ChevronLeft, ScanLine, ShieldCheck } from "lucide-react";
import { AppButton, AppSurface, Chip, PhoneFrame } from "@/components/mocks/app-ui";
import { useDemoStep, useInView } from "@/hooks/use-in-view";
import { demoProducts } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const product = demoProducts[1];
// Invented GS1 data: (01) GTIN · (17) expiry YYMMDD · (10) lot.
const gtin = "00812345670019";
const expiryCode = "270331";
const expiry = "31/03/2027";

// A DataMatrix-looking grid: solid "L" finder on the left and bottom edges,
// alternating timing pattern on the top and right, a fixed fill inside.
const SIZE = 14;
const matrix = Array.from({ length: SIZE * SIZE }, (_, i) => {
  const x = i % SIZE;
  const y = Math.floor(i / SIZE);
  if (x === 0 || y === SIZE - 1) return true;
  if (y === 0) return x % 2 === 0;
  if (x === SIZE - 1) return y % 2 === 1;
  return (x * 7 + y * 13 + x * y) % 5 < 2;
});

function DataMatrix() {
  return (
    <div
      className="grid size-[46px] shrink-0"
      style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
    >
      {matrix.map((on, i) => (
        <span key={i} className={on ? "bg-[#111]" : "bg-transparent"} />
      ))}
    </div>
  );
}

function Corners({ read }: { read: boolean }) {
  const tone = read ? "border-app-accent" : "border-white/80";
  return (
    <>
      <span className={cn("absolute top-2.5 left-2.5 size-4 rounded-tl-md border-t-2 border-l-2 transition-colors duration-300", tone)} />
      <span className={cn("absolute top-2.5 right-2.5 size-4 rounded-tr-md border-t-2 border-r-2 transition-colors duration-300", tone)} />
      <span className={cn("absolute bottom-2.5 left-2.5 size-4 rounded-bl-md border-b-2 border-l-2 transition-colors duration-300", tone)} />
      <span className={cn("absolute right-2.5 bottom-2.5 size-4 rounded-br-md border-r-2 border-b-2 transition-colors duration-300", tone)} />
    </>
  );
}

export function EscanerDemo({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  // 0 scanning · 1 code read, fields fill · 2 found in the FDA registry · 3 lot registered
  const step = useDemoStep(4, 2000, inView);
  const read = step >= 1;

  const fields = [
    {
      label: "Producto",
      value: (
        <span className="flex min-w-0 items-center gap-1">
          <span className="truncate">{product.name}</span>
        </span>
      ),
    },
    { label: "Lote", value: <span className="font-mono text-[10.5px]">{product.lot}</span> },
    {
      label: "Caducidad",
      value: (
        <span className="flex items-center gap-1">
          {expiry}
          <Chip tone="green" className="px-1.5 py-0 text-[9px]">
            Vigente
          </Chip>
        </span>
      ),
    },
    { label: "GTIN", value: <span className="font-mono text-[10.5px]">{gtin}</span> },
  ];

  return (
    <div ref={ref} className={cn("relative h-[360px] w-full", className)}>
      <style href="escaner-demo-scan" precedence="default">
        {`@keyframes escaner-scan{0%,100%{transform:translateY(0)}50%{transform:translateY(80px)}}`}
      </style>
      <PhoneFrame className="absolute top-3 left-1/2 -translate-x-1/2">
        <AppSurface className="h-[430px] bg-white">
          <div className="flex items-center justify-between px-5 pt-2.5 pb-1 text-[10px] font-semibold">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-3 rounded-[2px] bg-app-ink/80" />
              <span className="h-2 w-4 rounded-[3px] border border-app-ink/60 p-px">
                <span className="block h-full w-2/3 rounded-[1px] bg-app-ink/80" />
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 pt-1.5 pb-1.5">
            <ChevronLeft className="size-4 text-app-muted" />
            <div>
              <p className="text-[13px] font-semibold tracking-[-0.02em]">Registrar lotes</p>
              <p className="text-[10px] text-app-muted">Escanea el código de la caja</p>
            </div>
          </div>

          <div className="relative mx-2.5 h-[110px] overflow-hidden rounded-xl bg-[radial-gradient(120%_90%_at_30%_20%,#3a443d_0%,#161b18_70%)]">
            <div className="absolute top-[12px] left-1/2 w-[150px] -translate-x-1/2 -rotate-[4deg] rounded-md bg-[#f6f4ee] p-2 shadow-[0_8px_20px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between text-[6.5px] font-semibold text-[#222]">
                <span className="rounded-[2px] border border-[#222] px-0.5">REF</span>
                <span>{product.ref}</span>
                <span className="rounded-[2px] border border-[#222] px-0.5">LOT</span>
                <span>{product.lot}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <DataMatrix />
                <div className="space-y-0.5 font-mono text-[6.5px] leading-tight text-[#222]">
                  <p>(01) {gtin}</p>
                  <p>(17) {expiryCode}</p>
                  <p>(10) {product.lot}</p>
                  <p className="pt-0.5 font-sans text-[6px] font-semibold tracking-wide">
                    STERILE R · 2
                  </p>
                </div>
              </div>
            </div>

            <Corners read={read} />

            {!read ? (
              <span className="absolute top-[14px] right-4 left-4 h-0.5 rounded-full bg-app-accent shadow-[0_0_12px_2px_rgba(74,157,124,0.8)] motion-safe:animate-[escaner-scan_1.9s_ease-in-out_infinite]" />
            ) : null}

            <span
              className={cn(
                "absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-medium whitespace-nowrap transition-colors duration-300",
                read ? "bg-app-accent text-white" : "bg-black/50 text-white/85",
              )}
            >
              {read ? <Check className="size-2.5" strokeWidth={3} /> : <ScanLine className="size-2.5" />}
              {read ? "Código GS1 leído" : "Apunta al código de la caja"}
            </span>

            {step === 3 ? (
              <div className="absolute inset-0 grid place-items-center bg-app-primary/85 animate-in fade-in duration-300">
                <div className="text-center text-white">
                  <span className="mx-auto grid size-8 place-items-center rounded-full bg-app-accent">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  <p className="mt-1.5 text-[12px] font-semibold">Lote registrado</p>
                  <p className="text-[10px] text-white/70">{product.lot} · 2 piezas</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mx-2.5 mt-2 divide-y divide-white rounded-xl bg-app-fill">
            {fields.map((field, i) => (
              <div key={field.label} className="flex h-[25px] items-center justify-between gap-2 px-2.5">
                <span className="shrink-0 text-[10px] text-app-muted">{field.label}</span>
                {read ? (
                  <span
                    className="min-w-0 animate-in fade-in slide-in-from-right-2 fill-mode-both text-[11px] font-medium duration-300"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    {field.value}
                  </span>
                ) : (
                  <span className="h-2 w-16 rounded-full bg-black/[0.07]" />
                )}
              </div>
            ))}
          </div>

          <p
            className={cn(
              "mx-3 mt-1.5 flex items-center gap-1 text-[10px] font-medium text-app-accent transition-opacity duration-300",
              step >= 2 ? "opacity-100" : "opacity-0",
            )}
          >
            <ShieldCheck className="size-3" />
            Encontrado en el registro de la FDA
          </p>

          <div className="mx-2.5 mt-2">
            <AppButton
              variant={step === 3 ? "accent" : "primary"}
              className="w-full py-2 text-[11.5px]"
            >
              {step === 3 ? (
                <>
                  <Check className="size-3" strokeWidth={3} /> Lote registrado
                </>
              ) : (
                "Registrar lote"
              )}
            </AppButton>
          </div>
        </AppSurface>
      </PhoneFrame>
    </div>
  );
}
