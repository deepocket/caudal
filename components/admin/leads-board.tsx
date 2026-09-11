"use client";

import { useOptimistic, useState, useTransition } from "react";
import {
  Check,
  ChevronLeft,
  Inbox,
  LoaderCircle,
  Mail,
  MessageCircle,
  Phone,
  Search,
  type LucideIcon,
} from "lucide-react";
import { saveLeadNotes, setLeadStatus, type SaveResult } from "@/lib/admin/actions";
import type { LeadStoreKind } from "@/lib/leads/store";
import { leadStatuses, notesMaxLength, type Lead, type LeadStatus } from "@/lib/leads/types";
import { cn } from "@/lib/utils";

type Filter = LeadStatus | "todas";
type StatusChange = { id: string; estado: LeadStatus };

// From first contact to closed: gold while it waits on you, greens as it moves.
const statuses: Record<LeadStatus, { label: string; chip: string; dot: string }> = {
  nuevo: { label: "Nuevo", chip: "bg-gold/20 text-[#6b4f10]", dot: "bg-gold" },
  contactado: { label: "Contactado", chip: "bg-mint/70 text-moss", dot: "bg-sage" },
  demo: { label: "Demo agendada", chip: "bg-sage/25 text-brand", dot: "bg-moss" },
  cliente: { label: "Cliente", chip: "bg-brand text-primary-foreground", dot: "bg-brand" },
  perdido: { label: "Perdido", chip: "bg-black/[0.05] text-muted-foreground", dot: "bg-black/25" },
};

// Mexico City time, whether the server or the browser renders it.
const timeZone = "America/Mexico_City";
const dayOf = new Intl.DateTimeFormat("en-CA", { timeZone, dateStyle: "short" });
const hourOf = new Intl.DateTimeFormat("es-MX", { timeZone, timeStyle: "short" });
const dayMonth = new Intl.DateTimeFormat("es-MX", { timeZone, day: "numeric", month: "short" });
const dayMonthYear = new Intl.DateTimeFormat("es-MX", { timeZone, dateStyle: "medium" });
const fullDate = new Intl.DateTimeFormat("es-MX", { timeZone, dateStyle: "long", timeStyle: "short" });

/** Like an inbox: the hour today, "Ayer", then the date. */
function shortWhen(iso: string) {
  const date = new Date(iso);
  const now = Date.now();
  const day = dayOf.format(date);
  if (day === dayOf.format(now)) return hourOf.format(date);
  if (day === dayOf.format(now - 86_400_000)) return "Ayer";
  return day.slice(0, 4) === dayOf.format(now).slice(0, 4) ? dayMonth.format(date) : dayMonthYear.format(date);
}

/** Case- and accent-insensitive, so "jose" finds "José". */
const fold = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** wa.me takes the international number as digits; ten digits is a Mexican number. */
function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.length === 10 ? `52${digits}` : digits}`;
}

function StatusChip({ status, className }: { status: LeadStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium",
        statuses[status].chip,
        className,
      )}
    >
      {statuses[status].label}
    </span>
  );
}

function Notice({ tone, children }: { tone: "info" | "error"; children: React.ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "mb-6 rounded-xl px-4 py-3 text-[14px] leading-relaxed",
        tone === "error" ? "bg-red-50 text-red-800" : "bg-gold/15 text-[#5c4410]",
      )}
    >
      {children}
    </p>
  );
}

function ContactLink({
  href,
  icon: Icon,
  external,
  children,
}: {
  href: string;
  icon: LucideIcon;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-black/10 bg-background px-3.5 text-[14px] font-medium text-ink transition-colors hover:border-moss/40"
    >
      <Icon className="size-4 text-moss" aria-hidden />
      {children}
    </a>
  );
}

function LeadDetail({
  lead,
  onBack,
  onStatus,
}: {
  lead: Lead;
  onBack: () => void;
  onStatus: (change: StatusChange) => void;
}) {
  const [, startStatus] = useTransition();
  const [statusError, setStatusError] = useState<string | null>(null);
  const [notesPending, startNotes] = useTransition();
  const [draft, setDraft] = useState(lead.notas);
  const [notesResult, setNotesResult] = useState<SaveResult | null>(null);
  const dirty = draft.trim() !== lead.notas;

  function changeStatus(estado: LeadStatus) {
    if (estado === lead.estado) return;
    setStatusError(null);
    startStatus(async () => {
      // The chip changes now; if saving fails, it goes back on its own.
      onStatus({ id: lead.id, estado });
      const result = await setLeadStatus(lead.id, estado);
      if (!result.ok) setStatusError(result.error);
    });
  }

  function saveNotes(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotesResult(null);
    startNotes(async () => {
      setNotesResult(await saveLeadNotes(lead.id, draft));
    });
  }

  return (
    <article className="rounded-2xl border border-black/[0.08] bg-card p-5 md:p-7">
      <button
        type="button"
        onClick={onBack}
        className="-ml-1 mb-4 inline-flex items-center gap-1 text-[14px] font-medium text-moss lg:hidden"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Solicitudes
      </button>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[1.5rem] leading-tight font-medium tracking-[-0.03em] break-words text-ink">
            {lead.empresa}
          </h2>
          <p className="mt-1 text-[15px] text-ink">{lead.contacto}</p>
        </div>
        <StatusChip status={lead.estado} className="mt-1.5" />
      </div>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Recibida el{" "}
        <time dateTime={lead.created_at} suppressHydrationWarning>
          {fullDate.format(new Date(lead.created_at))}
        </time>
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <ContactLink href={`tel:${lead.telefono.replace(/[^\d+]/g, "")}`} icon={Phone}>
          Llamar
        </ContactLink>
        <ContactLink href={whatsappHref(lead.telefono)} icon={MessageCircle} external>
          WhatsApp
        </ContactLink>
        <ContactLink href={`mailto:${lead.correo}`} icon={Mail}>
          Correo
        </ContactLink>
      </div>

      <dl className="mt-6 divide-y divide-rail border-y border-rail text-[14px]">
        <div className="grid gap-1 py-3 sm:grid-cols-[110px_1fr] sm:gap-4">
          <dt className="text-muted-foreground">Teléfono</dt>
          <dd className="text-ink tabular-nums">{lead.telefono}</dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-[110px_1fr] sm:gap-4">
          <dt className="text-muted-foreground">Correo</dt>
          <dd className="break-all text-ink">{lead.correo}</dd>
        </div>
        {lead.extra ? (
          <div className="grid gap-1 py-3 sm:grid-cols-[110px_1fr] sm:gap-4">
            <dt className="text-muted-foreground">Mensaje</dt>
            <dd className="leading-relaxed whitespace-pre-line text-ink">{lead.extra}</dd>
          </div>
        ) : null}
      </dl>

      <fieldset className="mt-6">
        <legend className="text-[14px] font-medium text-ink">Estado</legend>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {leadStatuses.map((estado) => {
            const active = lead.estado === estado;
            return (
              <button
                key={estado}
                type="button"
                aria-pressed={active}
                onClick={() => changeStatus(estado)}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13.5px] transition-colors",
                  active
                    ? "border-brand bg-brand text-primary-foreground"
                    : "border-black/10 bg-background text-ink hover:border-black/25",
                )}
              >
                <span
                  className={cn("size-2 rounded-full", active ? "bg-primary-foreground" : statuses[estado].dot)}
                  aria-hidden
                />
                {statuses[estado].label}
              </button>
            );
          })}
        </div>
        {statusError ? (
          <p role="alert" className="mt-2 text-[13px] text-red-700">
            {statusError}
          </p>
        ) : null}
      </fieldset>

      <form onSubmit={saveNotes} className="mt-6">
        <label htmlFor="lead-notas" className="text-[14px] font-medium text-ink">
          Notas
        </label>
        <textarea
          id="lead-notas"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setNotesResult(null);
          }}
          rows={5}
          maxLength={notesMaxLength}
          placeholder="Qué platicaron, qué sigue, cuándo volver a llamar…"
          className="mt-2 w-full resize-y rounded-lg border border-black/10 bg-background px-3.5 py-3 text-[15px] leading-relaxed text-ink transition-colors outline-none placeholder:text-ink-soft/70 focus:border-moss focus:ring-3 focus:ring-moss/15"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!dirty || notesPending}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-[14px] font-medium text-primary-foreground transition-colors hover:bg-brand/90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50"
          >
            {notesPending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : null}
            {notesPending ? "Guardando…" : "Guardar notas"}
          </button>
          <p aria-live="polite" className="text-[13px]">
            {notesResult?.ok && !dirty ? (
              <span className="inline-flex items-center gap-1 text-moss">
                <Check className="size-3.5" aria-hidden />
                Guardado
              </span>
            ) : notesResult && !notesResult.ok ? (
              <span className="text-red-700">{notesResult.error}</span>
            ) : null}
          </p>
        </div>
      </form>
    </article>
  );
}

export function LeadsBoard({
  leads,
  storage,
  loadFailed,
}: {
  leads: Lead[];
  storage: LeadStoreKind | null;
  loadFailed: boolean;
}) {
  const [shown, showStatus] = useOptimistic(leads, (current, change: StatusChange) =>
    current.map((lead) => (lead.id === change.id ? { ...lead, estado: change.estado } : lead)),
  );
  const [filter, setFilter] = useState<Filter>("todas");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = Object.fromEntries(leadStatuses.map((estado) => [estado, 0])) as Record<LeadStatus, number>;
  for (const lead of shown) counts[lead.estado] += 1;

  const needle = fold(query.trim());
  const visible = shown.filter(
    (lead) =>
      (filter === "todas" || lead.estado === filter) &&
      (!needle || fold(`${lead.empresa} ${lead.contacto} ${lead.correo} ${lead.telefono}`).includes(needle)),
  );
  const selected = shown.find((lead) => lead.id === selectedId) ?? null;

  function select(id: string) {
    setSelectedId(id);
    // On phones the detail takes the list's place: start it at the top.
    if (!window.matchMedia("(min-width: 1024px)").matches) window.scrollTo({ top: 0 });
  }

  const notices = (
    <>
      {storage === null ? (
        <Notice tone="info">
          Aquí todavía no se guardan las solicitudes: conecta Supabase (instrucciones en el README).
          Mientras tanto siguen llegando a tu correo.
        </Notice>
      ) : null}
      {loadFailed ? (
        <Notice tone="error">No pudimos leer las solicitudes. Recarga la página en un momento.</Notice>
      ) : null}
    </>
  );

  if (shown.length === 0) {
    return (
      <>
        {notices}
        {storage && !loadFailed ? (
          <div className="rounded-2xl border border-black/[0.08] bg-card px-6 py-16 text-center">
            <span className="mx-auto grid size-11 place-items-center rounded-full bg-mint text-brand">
              <Inbox className="size-5" aria-hidden />
            </span>
            <p className="mt-5 text-[17px] font-medium text-ink">Aún no hay solicitudes</p>
            <p className="mt-1.5 text-[15px] text-muted-foreground">
              Cuando alguien llene el formulario de la página, aparece aquí.
            </p>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      {notices}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
        <section aria-label="Lista de solicitudes" className={selected ? "hidden lg:block" : undefined}>
          <label className="flex h-11 items-center gap-2.5 rounded-lg border border-black/10 bg-card px-3.5 text-muted-foreground focus-within:border-moss focus-within:ring-3 focus-within:ring-moss/15">
            <Search className="size-4 shrink-0" aria-hidden />
            <span className="sr-only">Buscar</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Empresa, nombre, correo o teléfono"
              className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-soft/70"
            />
          </label>

          <div role="group" aria-label="Filtrar por estado" className="mt-3 flex flex-wrap gap-1.5">
            {(["todas", ...leadStatuses] as const).map((value) => {
              const active = filter === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(value)}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] transition-colors",
                    active
                      ? "border-brand bg-brand text-primary-foreground"
                      : "border-black/10 bg-card text-ink hover:border-black/25",
                  )}
                >
                  {value === "todas" ? "Todas" : statuses[value].label}
                  <span className={cn("tabular-nums", active ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {value === "todas" ? shown.length : counts[value]}
                  </span>
                </button>
              );
            })}
          </div>

          {visible.length > 0 ? (
            <ul className="mt-4 divide-y divide-rail overflow-hidden rounded-2xl border border-black/[0.08] bg-card">
              {visible.map((lead) => {
                const current = lead.id === selectedId;
                return (
                  <li key={lead.id}>
                    <button
                      type="button"
                      aria-current={current ? "true" : undefined}
                      onClick={() => select(lead.id)}
                      className={cn(
                        "block w-full px-4 py-3.5 text-left transition-colors",
                        current ? "bg-mint/40" : "hover:bg-black/[0.025]",
                      )}
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="truncate text-[15px] font-medium text-ink">{lead.empresa}</span>
                        <time
                          dateTime={lead.created_at}
                          suppressHydrationWarning
                          className="shrink-0 text-[12.5px] text-muted-foreground tabular-nums"
                        >
                          {shortWhen(lead.created_at)}
                        </time>
                      </span>
                      <span className="mt-1 flex items-center justify-between gap-3">
                        <span className="truncate text-[14px] text-muted-foreground">{lead.contacto}</span>
                        <StatusChip status={lead.estado} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 rounded-2xl border border-black/[0.08] bg-card px-4 py-10 text-center text-[14px] text-muted-foreground">
              Ninguna solicitud coincide.
            </p>
          )}

          {storage === "file" ? (
            <p className="mt-3 text-[12.5px] text-muted-foreground">
              Guardadas en este equipo, en <code className="font-mono">.data/leads.json</code>.
            </p>
          ) : null}
        </section>

        <section aria-label="Detalle de la solicitud" className={cn("lg:sticky lg:top-6", !selected && "hidden lg:block")}>
          {selected ? (
            <LeadDetail key={selected.id} lead={selected} onBack={() => setSelectedId(null)} onStatus={showStatus} />
          ) : (
            <div className="grid place-items-center rounded-2xl border border-dashed border-black/10 px-6 py-24 text-center text-[15px] text-muted-foreground">
              Elige una solicitud para ver sus datos.
            </div>
          )}
        </section>
      </div>
    </>
  );
}
