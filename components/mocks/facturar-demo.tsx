"use client";

import { AlertTriangle, CheckCircle2, ChevronDown, Download, Loader2, Mail } from "lucide-react";
import { AppButton, AppSurface, Chip, money } from "@/components/mocks/app-ui";
import { useDemoStep, useInView } from "@/hooks/use-in-view";
import { demoClients } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

// Quote C-0771 ($13,920 + IVA) going to the SAT. Receptor data and UUID are invented.
const total = 13920 * 1.16;
const receptor = [
  { label: "Razón social", value: `${demoClients[2].company.toUpperCase()} S.A. DE C.V.` },
  { label: "RFC", value: "HSR180523KJ4", mono: true },
  { label: "Régimen", value: "601 · General de Ley Personas Morales" },
  { label: "CP fiscal", value: "78000" },
];
const selects = [
  { label: "Uso de CFDI", value: "G03 · Gastos en general" },
  { label: "Método de pago", value: "PUE · Pago en una sola exhibición" },
  { label: "Forma de pago", value: "03 · Transferencia electrónica" },
];

function DialogHeader({ page }: { page: 1 | 2 }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[14px] font-semibold tracking-[-0.02em]">Facturar C-0771</p>
      <Chip tone="gray">Paso {page} de 2</Chip>
    </div>
  );
}

function StepOne() {
  return (
    <div className="animate-in fade-in duration-300">
      <DialogHeader page={1} />
      <div className="mt-2.5 space-y-2">
        {selects.map((select) => (
          <div key={select.label}>
            <p className="mb-0.5 text-[10px] text-app-muted">{select.label}</p>
            <div className="flex items-center justify-between rounded-lg bg-app-fill px-2.5 py-1.5 text-[11px]">
              <span className="truncate">{select.value}</span>
              <ChevronDown className="size-3 shrink-0 text-app-muted" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-app-green-50 px-2.5 py-1.5 text-[10.5px] font-medium text-app-primary">
        <CheckCircle2 className="size-3.5 shrink-0" />
        Todo listo: RFC, régimen y CP coinciden con el SAT
      </div>
      <div className="mt-1.5 flex gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10px] text-app-amber">
        <AlertTriangle className="mt-px size-3 shrink-0" />
        <span>
          <span className="font-semibold">Se puede facturar, pero conviene revisar:</span> el cliente
          no tiene correo para enviarle la factura.
        </span>
      </div>
      <div className="mt-2.5 flex justify-end gap-1.5">
        <AppButton variant="outline">Cancelar</AppButton>
        <AppButton>Continuar</AppButton>
      </div>
    </div>
  );
}

function StepTwo({ stamping }: { stamping: boolean }) {
  return (
    <div className="animate-in fade-in duration-300">
      <DialogHeader page={2} />
      <p className="mt-2.5 text-[10.5px] font-semibold">Receptor, como irá al SAT</p>
      <div className="mt-1 divide-y divide-white rounded-xl bg-app-fill">
        {receptor.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 px-2.5 py-1.5">
            <span className="shrink-0 text-[10px] text-app-muted">{row.label}</span>
            <span className={cn("truncate text-right text-[10.5px] font-medium", row.mono && "font-mono")}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between rounded-lg px-1 text-[10.5px]">
        <span className="text-app-muted">3 partidas · IVA 16%</span>
        <span className="text-[12px] font-semibold">{money(total)}</span>
      </div>
      <div className="mt-3 flex justify-end gap-1.5">
        <AppButton variant="outline">Atrás</AppButton>
        <AppButton className={cn(stamping && "bg-app-primary-hover")}>
          {stamping ? <Loader2 className="size-3 animate-spin" /> : null}
          {stamping ? "Timbrando…" : "Timbrar factura"}
        </AppButton>
      </div>
    </div>
  );
}

function CfdiPanel() {
  const rows = [
    { label: "Factura", value: "A-1042" },
    { label: "Folio fiscal", value: "3F2A9C1E-7B4D-4E8A-9C21-5D6F0A1B2C3D", mono: true },
    { label: "Total facturado", value: money(total) },
    { label: "Timbrada", value: "08/09/2026 · 11:42" },
  ];
  return (
    <div className="animate-in fade-in zoom-in-[0.98] duration-300">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-semibold tracking-[-0.02em]">Factura (CFDI)</p>
        <Chip tone="emerald">
          <CheckCircle2 className="size-2.5" /> Timbrada
        </Chip>
      </div>
      <p className="mt-0.5 text-[10px] text-app-muted">C-0771 · {demoClients[2].name}</p>
      <div className="mt-2.5 divide-y divide-white rounded-xl bg-app-fill">
        {rows.map((row) => (
          <div key={row.label} className="px-2.5 py-1.5">
            <p className="text-[9.5px] text-app-muted">{row.label}</p>
            <p className={cn("text-[11px] font-medium", row.mono && "font-mono text-[9.5px] tracking-tight break-all")}>
              {row.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex gap-1.5">
        <AppButton variant="outline">
          <Download className="size-3" /> PDF
        </AppButton>
        <AppButton variant="outline">
          <Download className="size-3" /> XML
        </AppButton>
        <AppButton className="flex-1">
          <Mail className="size-3" /> Enviar al cliente
        </AppButton>
      </div>
    </div>
  );
}

export function FacturarDemo({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  // 0 step one (checks) · 1 step two (receptor) · 2 stamping · 3 stamped CFDI panel
  const step = useDemoStep(4, 2200, inView);

  return (
    <div ref={ref} className={cn("relative h-[360px] w-full", className)}>
      <AppSurface className="absolute top-4 left-1/2 w-[312px] -translate-x-1/2 rounded-2xl bg-white p-3.5 shadow-[0_24px_50px_-24px_rgba(17,17,17,0.45)] ring-1 ring-black/[0.05]">
        {step === 0 ? <StepOne /> : null}
        {step === 1 || step === 2 ? <StepTwo stamping={step === 2} /> : null}
        {step === 3 ? <CfdiPanel /> : null}
      </AppSurface>
    </div>
  );
}
