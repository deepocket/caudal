"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Loader2, Minus, Plus, X } from "lucide-react";
import { money } from "@/components/mocks/app-ui";
import { cn } from "@/lib/utils";
import {
  TODAY,
  balance,
  total,
  type PaymentMethod,
  type Quote,
  type Shipment,
} from "./model";

// Dialogs live inside the demo window (not the page), like the real app's modals.

const focusable =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function DialogShell({
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);

  // Focus moves in on open, stays inside while open, and goes back on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>(focusable)?.focus();
    return () => previous?.focus();
  }, []);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panel.current) return;
    const items = Array.from(panel.current.querySelectorAll<HTMLElement>(focusable));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center bg-[#0f1411]/25 p-0 backdrop-blur-[1.5px] animate-in fade-in duration-200 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
        className="flex max-h-full w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_30px_80px_-20px_rgba(15,20,17,0.45)] animate-in slide-in-from-bottom-4 duration-300 sm:max-w-[420px] sm:rounded-2xl sm:zoom-in-[0.98]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-5 pt-4 pb-3">
          <div>
            <p id={titleId} className="text-[15px] font-semibold tracking-[-0.02em]">
              {title}
            </p>
            {subtitle ? <p className="mt-0.5 text-[12px] text-app-muted">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid size-7 place-items-center rounded-lg text-app-muted transition-colors hover:bg-app-fill hover:text-app-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        <div className="flex justify-end gap-2 border-t border-black/[0.06] bg-[#fafafa] px-5 py-3">
          {footer}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-medium text-app-muted">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "h-9 w-full rounded-xl bg-app-fill px-3 text-[13px] text-app-ink outline-none ring-app-accent/60 transition-shadow focus-visible:ring-2 disabled:opacity-60";

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-flow-col gap-1 rounded-xl bg-app-fill p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-8 rounded-lg px-2 text-[12px] font-medium transition-all",
            value === option.value
              ? "bg-white text-app-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
              : "text-app-muted hover:text-app-ink",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function PrimaryButton({
  tone = "primary",
  pending = false,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "accent"; pending?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || pending}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl px-3.5 text-[12.5px] font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        tone === "primary" ? "bg-app-primary hover:bg-app-primary-hover" : "bg-app-accent hover:bg-[#3e8a6b]",
        className,
      )}
    >
      {pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}

export function GhostButton({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-xl bg-white px-3.5 text-[12.5px] font-medium text-app-ink ring-1 ring-black/10 transition-colors hover:bg-app-fill",
        className,
      )}
    >
      {children}
    </button>
  );
}

// ——— Registrar cobro ———

export function CobroDialog({
  quote,
  onClose,
  onConfirm,
}: {
  quote: Quote;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}) {
  const owed = balance(quote);
  const [kind, setKind] = useState<"total" | "abono">("total");
  const [method, setMethod] = useState("Transferencia");
  const amount = kind === "total" ? owed : Math.round((owed / 2) * 100) / 100;

  return (
    <DialogShell
      title={`Registrar cobro · ${quote.folio}`}
      subtitle={`${quote.client} · Total ${money(total(quote))}`}
      onClose={onClose}
      footer={
        <>
          <GhostButton onClick={onClose}>Cancelar</GhostButton>
          <PrimaryButton onClick={() => onConfirm(amount)}>
            {kind === "total" ? "Registrar cobro" : "Registrar abono"}
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-3.5">
        <Segmented
          label="Tipo de cobro"
          value={kind}
          onChange={setKind}
          options={[
            { value: "total", label: "Pago completo" },
            { value: "abono", label: "Abono parcial" },
          ]}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field label={kind === "total" ? "Monto pagado" : "Monto a abonar"}>
            <input className={inputClass} value={money(amount)} readOnly />
          </Field>
          <Field label="Fecha de pago">
            <input className={inputClass} value={TODAY} readOnly />
          </Field>
        </div>
        <Field label="Forma de pago">
          <select className={inputClass} value={method} onChange={(event) => setMethod(event.target.value)}>
            <option>Transferencia</option>
            <option>Efectivo</option>
            <option>Cheque</option>
            <option>Tarjeta</option>
          </select>
        </Field>
        <div className="flex items-center justify-between rounded-xl bg-app-green-50 px-3 py-2.5 text-[12.5px]">
          <span className="text-app-primary">Saldo pendiente tras este cobro</span>
          <span key={amount} className="font-semibold text-app-primary animate-in fade-in">
            {money(Math.max(0, owed - amount))}
          </span>
        </div>
        {quote.invoice?.method === "PPD" && kind === "total" ? (
          <p className="text-[11.5px] leading-snug text-app-amber">
            La factura es PPD: al registrar el cobro, Caudal te pedirá el complemento de pago.
          </p>
        ) : null}
      </div>
    </DialogShell>
  );
}

// ——— Facturar ———

const usages = [
  { value: "G01", label: "G01 · Adquisición de mercancías" },
  { value: "G03", label: "G03 · Gastos en general" },
];

export function FacturaDialog({
  quote,
  onClose,
  onConfirm,
}: {
  quote: Quote;
  onClose: () => void;
  onConfirm: (method: PaymentMethod, usage: string) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [usage, setUsage] = useState("G01");
  const [method, setMethod] = useState<PaymentMethod>(balance(quote) > 0 ? "PPD" : "PUE");
  const [form, setForm] = useState("03");
  const [stamping, setStamping] = useState(false);
  // Same rule as the app: PPD forces forma de pago 99 (por definir).
  const paymentForm = method === "PPD" ? "99" : form;

  function stamp() {
    setStamping(true);
    window.setTimeout(() => onConfirm(method, usage), 900);
  }

  return (
    <DialogShell
      title={`Facturar ${quote.folio}`}
      subtitle={step === 1 ? "Paso 1 de 2 · Datos del CFDI" : "Paso 2 de 2 · Revisa antes de timbrar"}
      onClose={onClose}
      footer={
        step === 1 ? (
          <>
            <GhostButton onClick={onClose}>Cancelar</GhostButton>
            <PrimaryButton onClick={() => setStep(2)}>Continuar</PrimaryButton>
          </>
        ) : (
          <>
            <GhostButton onClick={() => setStep(1)} disabled={stamping}>
              Atrás
            </GhostButton>
            <PrimaryButton onClick={stamp} pending={stamping}>
              {stamping ? "Timbrando…" : "Timbrar factura"}
            </PrimaryButton>
          </>
        )
      }
    >
      {step === 1 ? (
        <div className="space-y-3.5">
          <Field label="Uso de CFDI">
            <select className={inputClass} value={usage} onChange={(event) => setUsage(event.target.value)}>
              {usages.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Método de pago">
            <select
              className={inputClass}
              value={method}
              onChange={(event) => setMethod(event.target.value as PaymentMethod)}
            >
              <option value="PUE">PUE · Pago en una sola exhibición</option>
              <option value="PPD">PPD · Pago en parcialidades o diferido</option>
            </select>
          </Field>
          <Field label="Forma de pago">
            <select
              className={inputClass}
              value={paymentForm}
              disabled={method === "PPD"}
              onChange={(event) => setForm(event.target.value)}
            >
              <option value="03">03 · Transferencia electrónica</option>
              <option value="01">01 · Efectivo</option>
              <option value="99">99 · Por definir</option>
            </select>
          </Field>
          {method === "PPD" ? (
            <p className="text-[11.5px] leading-snug text-app-muted">
              Con PPD la forma de pago va como 99 y cada cobro pedirá su complemento.
            </p>
          ) : null}
          <div className="flex items-start gap-2 rounded-xl bg-app-green-50 px-3 py-2.5 text-[12px] text-app-primary">
            <Check className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Todo listo: RFC, régimen y CP coinciden con el SAT.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[11.5px] font-medium tracking-wide text-app-muted uppercase">
            Receptor, como irá al SAT
          </p>
          <dl className="divide-y divide-black/[0.06] rounded-xl bg-app-fill text-[12.5px]">
            {[
              ["Razón social", quote.company.toUpperCase()],
              ["RFC", quote.rfc],
              ["Régimen", "601 · General de Ley Personas Morales"],
              ["CP fiscal", "78000"],
              ["Uso · Método · Forma", `${usage} · ${method} · ${paymentForm}`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 px-3 py-2">
                <dt className="text-app-muted">{label}</dt>
                <dd className={cn("text-right font-medium", label === "RFC" && "font-mono text-[12px]")}>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex items-center justify-between px-1 text-[13px]">
            <span className="text-app-muted">Total con IVA</span>
            <span className="font-semibold">{money(total(quote))}</span>
          </div>
        </div>
      )}
    </DialogShell>
  );
}

// ——— Entregar ———

const carriers = ["FedEx", "DHL Express", "Estafeta", "Paquetexpress"];

export function EntregaDialog({
  quote,
  onClose,
  onConfirm,
}: {
  quote: Quote;
  onClose: () => void;
  onConfirm: (quantities: number[], shipment: Shipment) => void;
}) {
  const remaining = quote.lines.map((line, i) => line.qty - quote.delivered[i]);
  const [quantities, setQuantities] = useState(remaining);
  const [kind, setKind] = useState<Shipment["kind"]>(quote.shipment?.kind ?? "envio");
  const [carrier, setCarrier] = useState(quote.shipment?.kind === "envio" ? quote.shipment.carrier : "FedEx");
  const [tracking, setTracking] = useState(quote.shipment?.tracking || "7749 2210 5531");

  const sending = quantities.reduce((sum, n) => sum + n, 0);
  const pending = remaining.reduce((sum, n) => sum + n, 0);
  const complete = sending === pending;
  const deliveredSoFar = quote.delivered.reduce((sum, n) => sum + n, 0);
  const allPieces = quote.lines.reduce((sum, line) => sum + line.qty, 0);

  function change(index: number, delta: number) {
    setQuantities((current) =>
      current.map((n, i) => (i === index ? Math.min(remaining[i], Math.max(0, n + delta)) : n)),
    );
  }

  return (
    <DialogShell
      title={`Entrega · ${quote.folio}`}
      subtitle={`${quote.client} · Se entregan ${sending} de ${allPieces - deliveredSoFar} piezas pendientes`}
      onClose={onClose}
      footer={
        <>
          <GhostButton onClick={onClose}>Cancelar</GhostButton>
          <PrimaryButton
            tone={complete ? "primary" : "accent"}
            disabled={sending === 0}
            onClick={() =>
              onConfirm(quantities, {
                kind,
                carrier: kind === "envio" ? carrier : "Entrega local",
                tracking: kind === "envio" ? tracking : "",
              })
            }
          >
            {complete ? "Marcar como entregada" : "Guardar entrega parcial"}
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-3.5">
        <Segmented
          label="Tipo de entrega"
          value={kind}
          onChange={setKind}
          options={[
            { value: "envio", label: "Envío (guía)" },
            { value: "local", label: "Entrega local" },
          ]}
        />
        {kind === "envio" ? (
          <div className="grid grid-cols-[1fr_1.3fr] gap-3">
            <Field label="Paquetería">
              <select className={inputClass} value={carrier} onChange={(event) => setCarrier(event.target.value)}>
                {carriers.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </Field>
            <Field label="Número de guía">
              <input
                className={inputClass}
                value={tracking}
                onChange={(event) => setTracking(event.target.value)}
                inputMode="numeric"
              />
            </Field>
          </div>
        ) : null}
        <div>
          <p className="mb-1.5 text-[11.5px] font-medium text-app-muted">
            Productos · cada pieza sale con su lote
          </p>
          <ul className="divide-y divide-black/[0.06] rounded-xl bg-app-fill">
            {quote.lines.map((line, i) =>
              remaining[i] > 0 ? (
                <li key={line.ref} className="flex items-center gap-3 px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-medium">{line.name}</p>
                    <p className="mt-1 inline-flex rounded-md bg-white px-1.5 py-0.5 font-mono text-[10.5px] text-app-primary ring-1 ring-black/[0.06]">
                      {line.lot.startsWith("SN") ? line.lot : `Lote ${line.lot}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Una pieza menos de ${line.name}`}
                      onClick={() => change(i, -1)}
                      className="grid size-7 place-items-center rounded-lg bg-white ring-1 ring-black/10 hover:bg-app-green-50"
                    >
                      <Minus className="size-3" aria-hidden />
                    </button>
                    <span className="w-9 text-center text-[12.5px] font-semibold">
                      {quantities[i]}/{remaining[i]}
                    </span>
                    <button
                      type="button"
                      aria-label={`Una pieza más de ${line.name}`}
                      onClick={() => change(i, 1)}
                      className="grid size-7 place-items-center rounded-lg bg-white ring-1 ring-black/10 hover:bg-app-green-50"
                    >
                      <Plus className="size-3" aria-hidden />
                    </button>
                  </div>
                </li>
              ) : null,
            )}
          </ul>
        </div>
      </div>
    </DialogShell>
  );
}
