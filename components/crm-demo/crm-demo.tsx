"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import {
  Boxes,
  Check,
  ChevronLeft,
  CircleDollarSign,
  FileCheck2,
  FileText,
  LayoutDashboard,
  Lightbulb,
  MessageCircle,
  PackageCheck,
  Receipt,
  RotateCcw,
  Search,
  Send,
  ShoppingCart,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import { money } from "@/components/mocks/app-ui";
import { cn } from "@/lib/utils";
import { CobroDialog, EntregaDialog, FacturaDialog, GhostButton, PrimaryButton } from "./dialogs";
import {
  balance,
  cobro,
  complementDeadline,
  completada,
  counts,
  deliveredPieces,
  entrega,
  facturada,
  initialState,
  iva,
  nextStep,
  pieces,
  reducer,
  subtotal,
  total,
  type Action,
  type Progress,
  type Quote,
} from "./model";

type OpenDialog = { kind: "cobro" | "factura" | "entrega"; folio: string } | null;
type Toast = { id: number; title: string; detail: string; tone: "green" | "gold" };

const FIRST = "C-0771";

// ——— Small pieces ———

function StatusChip({ quote }: { quote: Quote }) {
  if (completada(quote)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-app-gold-100 px-2 py-0.5 text-[10.5px] font-semibold text-app-gold-700">
        <Sparkles className="size-3" aria-hidden /> Completada
      </span>
    );
  }
  const styles = {
    borrador: "bg-white text-app-muted ring-1 ring-black/10",
    enviada: "bg-slate-100 text-slate-600",
    aceptada: "bg-app-gold-50 text-app-gold-700",
  } as const;
  const labels = { borrador: "Borrador", enviada: "Enviada", aceptada: "Aceptada" } as const;
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-medium", styles[quote.status])}>
      {labels[quote.status]}
    </span>
  );
}

const progressTone: Record<Progress, string> = {
  pendiente: "text-app-faint",
  parcial: "text-app-accent",
  hecho: "text-app-primary",
};

function Trackers({ quote }: { quote: Quote }) {
  if (quote.status !== "aceptada") return null;
  const items = [
    { icon: CircleDollarSign, state: cobro(quote), label: "Cobro" },
    { icon: FileCheck2, state: facturada(quote) ? ("hecho" as const) : ("pendiente" as const), label: "Factura" },
    { icon: Truck, state: entrega(quote), label: "Entrega" },
  ];
  return (
    <span className="flex items-center gap-1" aria-label={items.map((item) => `${item.label}: ${item.state}`).join(", ")}>
      {items.map((item) => (
        <item.icon key={item.label} className={cn("size-3.5", progressTone[item.state])} aria-hidden />
      ))}
    </span>
  );
}

function Counter({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof Send; tone: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-app-fill px-3 py-2">
      <div>
        <p className="text-[10.5px] text-app-muted">{label}</p>
        <p key={value} className="text-[17px] font-semibold animate-in fade-in slide-in-from-bottom-1 duration-500">
          {value}
        </p>
      </div>
      <span className={cn("grid size-7 place-items-center rounded-full", tone)}>
        <Icon className="size-3.5" aria-hidden />
      </span>
    </div>
  );
}

function TrackerCard({
  icon: Icon,
  title,
  state,
  detail,
  active,
}: {
  icon: typeof Send;
  title: string;
  state: string;
  detail: string;
  active: boolean;
}) {
  const done = state === "Cobrada" || state === "Timbrada" || state === "Entregada";
  const partial = state === "Parcial";
  return (
    <div
      className={cn(
        "rounded-xl px-3 py-2.5 transition-colors duration-500",
        !active ? "bg-app-fill/70" : done ? "bg-app-green-50" : partial ? "bg-[#eef6f2]" : "bg-app-fill",
      )}
    >
      <p className="flex items-center gap-1.5 text-[11px] text-app-muted">
        <Icon className={cn("size-3.5", done ? "text-app-primary" : partial ? "text-app-accent" : "text-app-faint")} aria-hidden />
        {title}
      </p>
      <p
        key={state}
        className={cn(
          "mt-1 flex items-center gap-1 text-[13px] font-semibold animate-in fade-in duration-500",
          !active ? "text-app-faint" : done ? "text-app-primary" : "text-app-ink",
        )}
      >
        {done ? <Check className="size-3.5" aria-hidden /> : null}
        {state}
      </p>
      <p className="mt-0.5 truncate text-[11px] text-app-muted">{detail}</p>
    </div>
  );
}

const nav = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Users, label: "Clientes" },
  { icon: FileText, label: "Cotizaciones", badge: "abiertas" as const, active: true },
  { icon: ShoppingCart, label: "Compras" },
  { icon: Boxes, label: "Inventario" },
  { icon: Truck, label: "Entregas", badge: "porEntregar" as const },
  { icon: Receipt, label: "Facturación", badge: "porFacturar" as const },
  { icon: MessageCircle, label: "Chat" },
];

// ——— The demo ———

export function CrmDemo() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [selected, setSelected] = useState(FIRST);
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [query, setQuery] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [touched, setTouched] = useState(false);
  const toastId = useRef(0);
  const timers = useRef(new Set<number>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const tally = counts(state.quotes);
  const quote = state.quotes.find((q) => q.folio === selected) ?? state.quotes[0];
  const visible = state.quotes.filter((q) =>
    `${q.folio} ${q.client} ${q.company}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function toast(item: Omit<Toast, "id">) {
    const id = ++toastId.current;
    setToasts((current) => [...current.slice(-1), { ...item, id }]);
    const timer = window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
      timers.current.delete(timer);
    }, 3800);
    timers.current.add(timer);
  }

  function act(action: Exclude<Action, { type: "reiniciar" }>, message: Omit<Toast, "id">) {
    const before = state.quotes.find((q) => q.folio === action.folio);
    const after = reducer(state, action).quotes.find((q) => q.folio === action.folio);
    dispatch(action);
    setDialog(null);
    setTouched(true);
    toast(message);
    if (before && after && completada(after) && !completada(before)) {
      toast({ title: `¡${after.folio} completada!`, detail: "Cobrada, facturada y entregada.", tone: "gold" });
    }
  }

  function reset() {
    dispatch({ type: "reiniciar" });
    setSelected(FIRST);
    setDialog(null);
    setToasts([]);
    setQuery("");
    setMobileView("list");
    setTouched(false);
  }

  function select(folio: string) {
    setSelected(folio);
    setMobileView("detail");
  }

  const open = dialog ? state.quotes.find((q) => q.folio === dialog.folio) : null;
  const accepted = quote.status === "aceptada";
  const cobroState = cobro(quote);
  const entregaState = entrega(quote);

  return (
    <div
      role="region"
      aria-label="Demo interactiva de Caudal"
      className="overflow-hidden rounded-2xl bg-white font-app text-[12px] leading-snug tracking-[-0.011em] text-app-ink tabular-nums shadow-[0_50px_120px_-50px_rgba(17,40,17,0.55),0_0_0_1px_rgba(17,17,17,0.08)]"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-black/[0.06] bg-[#f7f6f2] px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="mx-auto hidden text-[12px] font-medium text-app-muted sm:block">Caudal · Cotizaciones</p>
        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <span className="rounded-full bg-app-gold-50 px-2 py-0.5 text-[10.5px] font-medium text-app-gold-700">
            Datos de ejemplo
          </span>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-7 items-center gap-1.5 rounded-lg px-2 text-[11.5px] font-medium text-app-muted transition-colors hover:bg-black/5 hover:text-app-ink"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Reiniciar
          </button>
        </div>
      </div>

      <div className="relative flex h-[680px] md:h-[640px]">
        {/* Sidebar */}
        <aside className="hidden w-[196px] shrink-0 flex-col border-r border-black/[0.06] bg-[#fbfbfa] px-3 py-4 lg:flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/caudal-wordmark.svg" alt="" className="ml-2 h-5 w-auto self-start" />
          <nav aria-label="Módulos de la demo" className="mt-6 space-y-0.5">
            {nav.map((item) => (
              <div
                key={item.label}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px]",
                  item.active ? "bg-app-green-50 font-medium text-app-primary" : "text-app-muted",
                )}
              >
                <item.icon className="size-4" aria-hidden />
                {item.label}
                {item.badge && tally[item.badge] > 0 ? (
                  <span
                    key={tally[item.badge]}
                    className={cn(
                      "ml-auto rounded-full px-1.5 text-[10px] font-semibold animate-in zoom-in-75 duration-300",
                      item.active ? "bg-app-primary text-white" : "bg-app-fill text-app-ink",
                    )}
                  >
                    {tally[item.badge]}
                  </span>
                ) : null}
              </div>
            ))}
          </nav>
          <div className="mt-auto flex items-center gap-2 rounded-xl bg-white px-2.5 py-2 ring-1 ring-black/[0.06]">
            <span className="grid size-7 place-items-center rounded-full bg-app-primary text-[10px] font-semibold text-white">
              TÚ
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-medium">Tu distribuidora</p>
              <p className="text-[10.5px] text-app-muted">Administrador</p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Counters */}
          <div className="grid grid-cols-2 gap-2 border-b border-black/[0.06] p-3 md:grid-cols-4">
            <Counter label="Por aceptar" value={tally.porAceptar} icon={Send} tone="bg-app-gold-50 text-app-gold-700" />
            <Counter label="Por cobrar" value={tally.porCobrar} icon={CircleDollarSign} tone="bg-app-green-50 text-app-accent" />
            <Counter label="Por facturar" value={tally.porFacturar} icon={FileCheck2} tone="bg-app-green-100 text-app-primary-hover" />
            <Counter label="Por entregar" value={tally.porEntregar} icon={Truck} tone="bg-app-green-200/70 text-app-primary" />
          </div>

          <div className="flex min-h-0 flex-1">
            {/* Quote list */}
            <div
              className={cn(
                "min-h-0 w-full shrink-0 flex-col border-r border-black/[0.06] md:flex md:w-[300px]",
                mobileView === "list" ? "flex" : "hidden",
              )}
            >
              <div className="p-3 pb-2">
                <label className="flex h-9 items-center gap-2 rounded-xl bg-app-fill px-3 text-app-muted focus-within:ring-2 focus-within:ring-app-accent/60">
                  <Search className="size-3.5 shrink-0" aria-hidden />
                  <span className="sr-only">Buscar cotizaciones</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar por folio o cliente…"
                    className="w-full bg-transparent text-[12.5px] text-app-ink outline-none placeholder:text-app-faint"
                  />
                </label>
              </div>
              <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
                {visible.map((q) => (
                  <li key={q.folio}>
                    <button
                      type="button"
                      aria-pressed={q.folio === quote.folio}
                      onClick={() => select(q.folio)}
                      className={cn(
                        "w-full rounded-xl px-3 py-2.5 text-left transition-colors",
                        q.folio === quote.folio ? "bg-app-green-50 ring-1 ring-app-green-100" : "hover:bg-app-fill",
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-app-primary">
                          {q.folio}
                          {!touched && q.folio === FIRST ? (
                            <span className="relative flex size-2" aria-hidden>
                              <span className="absolute inline-flex size-full animate-ping rounded-full bg-app-accent opacity-60" />
                              <span className="relative inline-flex size-2 rounded-full bg-app-accent" />
                            </span>
                          ) : null}
                        </span>
                        <span className="text-[12px] font-semibold">{money(total(q))}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-[11.5px] text-app-muted">{q.client}</span>
                      <span className="mt-1.5 flex items-center justify-between">
                        <StatusChip quote={q} />
                        <Trackers quote={q} />
                      </span>
                    </button>
                  </li>
                ))}
                {visible.length === 0 ? (
                  <li className="px-3 py-6 text-center text-[12px] text-app-muted">Sin resultados</li>
                ) : null}
              </ul>
            </div>

            {/* Quote detail */}
            <div
              className={cn(
                "min-h-0 min-w-0 flex-1 overflow-y-auto md:block",
                mobileView === "detail" ? "block" : "hidden",
              )}
            >
              <div className="p-4 md:p-5">
                <button
                  type="button"
                  onClick={() => setMobileView("list")}
                  className="mb-3 inline-flex items-center gap-1 text-[12px] font-medium text-app-accent md:hidden"
                >
                  <ChevronLeft className="size-3.5" aria-hidden /> Cotizaciones
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[19px] font-semibold tracking-[-0.02em]">{quote.folio}</h3>
                  <StatusChip quote={quote} />
                </div>
                <p className="mt-1 text-[12px] text-app-muted">
                  {quote.client} · {quote.date} · {money(total(quote))} MXN
                </p>

                {completada(quote) ? (
                  <div className="mt-4 flex items-center gap-3 rounded-xl bg-app-gold-50 px-3.5 py-3 ring-1 ring-app-gold-100 animate-in zoom-in-95 fade-in duration-500">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-app-gold-100 text-app-gold-700">
                      <Sparkles className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-app-gold-700">Venta completada</p>
                      <p className="text-[11.5px] text-app-gold-700/80">Cobrada, facturada y entregada. Nada quedó en el aire.</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 flex items-start gap-2 rounded-xl bg-[#f3f8f5] px-3 py-2.5 text-[12px] text-app-primary">
                    <Lightbulb className="mt-px size-3.5 shrink-0 text-app-accent" aria-hidden />
                    <span key={nextStep(quote)} className="animate-in fade-in duration-500">
                      {nextStep(quote)}
                    </span>
                  </p>
                )}

                {/* Main actions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {quote.status === "borrador" ? (
                    <PrimaryButton
                      onClick={() =>
                        act(
                          { type: "enviar", folio: quote.folio },
                          { title: `${quote.folio} enviada`, detail: "El PDF salió por correo al cliente.", tone: "green" },
                        )
                      }
                    >
                      <Send className="size-3.5" aria-hidden /> Enviar al cliente
                    </PrimaryButton>
                  ) : null}
                  {quote.status === "enviada" ? (
                    <PrimaryButton
                      onClick={() =>
                        act(
                          { type: "aceptar", folio: quote.folio },
                          {
                            title: `${quote.folio} aceptada · stock apartado`,
                            detail: `${pieces(quote)} piezas, primero lo que caduca antes.`,
                            tone: "green",
                          },
                        )
                      }
                    >
                      <Check className="size-3.5" aria-hidden /> Marcar aceptada
                    </PrimaryButton>
                  ) : null}
                  {accepted && !completada(quote) ? (
                    <>
                      {cobroState === "hecho" ? (
                        <GhostButton disabled className="gap-1.5 text-app-primary">
                          <Check className="size-3.5" aria-hidden /> Cobrada
                        </GhostButton>
                      ) : (
                        <PrimaryButton onClick={() => setDialog({ kind: "cobro", folio: quote.folio })}>
                          <CircleDollarSign className="size-3.5" aria-hidden />
                          {cobroState === "parcial" ? "Registrar abono" : "Registrar cobro"}
                        </PrimaryButton>
                      )}
                      {facturada(quote) ? (
                        <GhostButton disabled className="gap-1.5 text-app-primary">
                          <Check className="size-3.5" aria-hidden /> Facturada
                        </GhostButton>
                      ) : (
                        <PrimaryButton onClick={() => setDialog({ kind: "factura", folio: quote.folio })}>
                          <FileCheck2 className="size-3.5" aria-hidden /> Facturar
                        </PrimaryButton>
                      )}
                      {entregaState === "hecho" ? (
                        <GhostButton disabled className="gap-1.5 text-app-primary">
                          <Check className="size-3.5" aria-hidden /> Entregada
                        </GhostButton>
                      ) : (
                        <PrimaryButton onClick={() => setDialog({ kind: "entrega", folio: quote.folio })}>
                          <Truck className="size-3.5" aria-hidden />
                          {entregaState === "parcial" ? "Entregar resto" : "Entregar"}
                        </PrimaryButton>
                      )}
                    </>
                  ) : null}
                </div>

                {/* Alerts, as the app shows them above a quote */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {accepted && facturada(quote) && cobroState !== "hecho" ? (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-medium text-app-amber">
                      Facturada pero NO cobrada
                    </span>
                  ) : null}
                  {cobroState === "parcial" ? (
                    <span className="rounded-full bg-app-gold-50 px-2 py-0.5 text-[10.5px] font-medium text-app-gold-700">
                      Saldo pendiente: {money(balance(quote))}
                    </span>
                  ) : null}
                  {quote.invoice?.complement === "pendiente" ? (
                    <button
                      type="button"
                      onClick={() =>
                        act(
                          { type: "complemento", folio: quote.folio },
                          { title: "Complemento de pago timbrado", detail: `Ligado a la factura ${quote.invoice?.serie}.`, tone: "green" },
                        )
                      }
                      className="rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-medium text-app-amber ring-1 ring-amber-200 transition-colors hover:bg-amber-100"
                    >
                      Complemento de pago pendiente · a más tardar el {complementDeadline} · Timbrar ahora
                    </button>
                  ) : null}
                </div>

                {/* Cobro, factura y entrega, tracked separately */}
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <TrackerCard
                    icon={CircleDollarSign}
                    title="Cobro"
                    active={accepted}
                    state={!accepted ? "—" : cobroState === "hecho" ? "Cobrada" : cobroState === "parcial" ? "Parcial" : "Pendiente"}
                    detail={!accepted ? "Se activa al aceptar" : cobroState === "hecho" ? `Pagado ${money(quote.paid)}` : `Saldo ${money(balance(quote))}`}
                  />
                  <TrackerCard
                    icon={FileCheck2}
                    title="Factura"
                    active={accepted}
                    state={!accepted ? "—" : quote.invoice ? "Timbrada" : "Pendiente"}
                    detail={
                      !accepted
                        ? "Se activa al aceptar"
                        : quote.invoice
                          ? `${quote.invoice.serie} · ${quote.invoice.method} · ${quote.invoice.uuid.slice(0, 8)}…`
                          : "Sin CFDI"
                    }
                  />
                  <TrackerCard
                    icon={Truck}
                    title="Entrega"
                    active={accepted}
                    state={!accepted ? "—" : entregaState === "hecho" ? "Entregada" : entregaState === "parcial" ? "Parcial" : "Pendiente"}
                    detail={
                      !accepted
                        ? "Se activa al aceptar"
                        : `${deliveredPieces(quote)}/${pieces(quote)} piezas${quote.shipment ? ` · ${quote.shipment.carrier}` : ""}`
                    }
                  />
                </div>

                {/* Products */}
                <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-black/[0.06]">
                  <table className="w-full text-left">
                    <thead className="bg-app-fill text-[10.5px] text-app-muted">
                      <tr>
                        <th scope="col" className="px-3 py-2 font-medium">Descripción</th>
                        <th scope="col" className="px-2 py-2 text-right font-medium">Cant.</th>
                        <th scope="col" className="px-3 py-2 text-right font-medium">Importe</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.05]">
                      {quote.lines.map((line, i) => (
                        <tr key={line.ref}>
                          <td className="px-3 py-2">
                            <p className="text-[12px] font-medium">{line.name}</p>
                            <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10.5px] text-app-muted">
                              <span className="font-mono">{line.ref}</span>
                              {accepted ? (
                                <span className="rounded-md bg-app-green-50 px-1.5 py-px font-mono text-app-primary">
                                  {line.lot.startsWith("SN") ? line.lot : `Lote ${line.lot}`}
                                </span>
                              ) : null}
                              {accepted && quote.delivered[i] > 0 ? (
                                <span className="text-app-accent">
                                  {quote.delivered[i]}/{line.qty} entregado
                                </span>
                              ) : null}
                            </p>
                          </td>
                          <td className="px-2 py-2 text-right text-[12px]">{line.qty}</td>
                          <td className="px-3 py-2 text-right text-[12px]">{money(line.qty * line.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <dl className="space-y-1 border-t border-black/[0.06] bg-[#fcfcfb] px-3 py-2.5 text-[12px]">
                    <div className="flex justify-between text-app-muted">
                      <dt>Subtotal</dt>
                      <dd>{money(subtotal(quote))}</dd>
                    </div>
                    <div className="flex justify-between text-app-muted">
                      <dt>IVA (16%)</dt>
                      <dd>{money(iva(quote))}</dd>
                    </div>
                    <div className="flex justify-between text-[13px] font-semibold">
                      <dt>Total</dt>
                      <dd>{money(total(quote))}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toasts */}
        <div
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex flex-col items-center gap-2 px-4 md:right-5 md:left-auto md:items-end md:px-0"
        >
          {toasts.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex max-w-sm items-center gap-2.5 rounded-xl px-3.5 py-2.5 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300",
                item.tone === "gold" ? "bg-app-gold-100 text-app-gold-700" : "bg-app-primary text-white",
              )}
            >
              {item.tone === "gold" ? (
                <Sparkles className="size-4 shrink-0" aria-hidden />
              ) : (
                <PackageCheck className="size-4 shrink-0 text-app-green-200" aria-hidden />
              )}
              <div>
                <p className="text-[12px] font-semibold">{item.title}</p>
                <p className={cn("text-[11px]", item.tone === "gold" ? "text-app-gold-700/80" : "text-white/70")}>
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dialogs */}
        {dialog?.kind === "cobro" && open ? (
          <CobroDialog
            quote={open}
            onClose={() => setDialog(null)}
            onConfirm={(amount) =>
              act(
                { type: "cobrar", folio: open.folio, amount },
                {
                  title: `Cobro registrado · ${money(amount)}`,
                  detail: `Saldo pendiente ${money(Math.max(0, balance(open) - amount))}.`,
                  tone: "green",
                },
              )
            }
          />
        ) : null}
        {dialog?.kind === "factura" && open ? (
          <FacturaDialog
            quote={open}
            onClose={() => setDialog(null)}
            onConfirm={(method, usage) =>
              act(
                { type: "facturar", folio: open.folio, method, usage },
                { title: "CFDI timbrado", detail: `${open.folio} · ${method} · listo para enviar al cliente.`, tone: "green" },
              )
            }
          />
        ) : null}
        {dialog?.kind === "entrega" && open ? (
          <EntregaDialog
            quote={open}
            onClose={() => setDialog(null)}
            onConfirm={(quantities, shipment) => {
              const sent = quantities.reduce((sum, n) => sum + n, 0);
              act(
                { type: "entregar", folio: open.folio, quantities, shipment },
                {
                  title: `Entrega registrada · ${deliveredPieces(open) + sent}/${pieces(open)} con lote`,
                  detail: shipment.kind === "envio" ? `${shipment.carrier} · guía ${shipment.tracking}` : "Entrega local",
                  tone: "green",
                },
              );
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
