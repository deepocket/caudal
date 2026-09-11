"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { submitLead } from "@/lib/leads/actions";
import {
  initialLeadState,
  type LeadErrors,
  type LeadField,
  type LeadValues,
} from "@/lib/leads/types";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const fieldOrder: LeadField[] = ["empresa", "contacto", "telefono", "correo", "extra"];

// DOM ids are prefixed: the section itself is #contacto, like the contact-name field.
const domId = (field: LeadField) => `lead-${field}`;

const inputClass =
  "w-full rounded-lg border border-black/10 bg-background px-3.5 text-[15px] text-ink transition-colors outline-none placeholder:text-ink-soft/70 focus:border-moss focus:ring-3 focus:ring-moss/15 aria-invalid:border-red-700/60 aria-invalid:focus:ring-red-700/10";

function Field({
  id,
  label,
  hint,
  error,
  className,
  children,
}: {
  id: LeadField;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={domId(id)} className="flex items-baseline justify-between text-[14px] font-medium text-ink">
        {label}
        {hint ? <span className="text-[13px] font-normal text-muted-foreground">{hint}</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${domId(id)}-error`} className="mt-1.5 text-[13px] text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function fieldProps(id: LeadField, errors: LeadErrors, values?: LeadValues) {
  return {
    id: domId(id),
    name: id,
    defaultValue: values?.[id] ?? "",
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `${domId(id)}-error` : undefined,
  };
}

export function LeadForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialLeadState);
  const doneRef = useRef<HTMLHeadingElement>(null);

  // Move focus to what changed: the first field to fix, or the confirmation.
  useEffect(() => {
    if (state.status === "invalid") {
      const first = fieldOrder.find((field) => state.errors[field]);
      if (first) document.getElementById(domId(first))?.focus();
    }
    if (state.status === "success") doneRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-black/[0.08] bg-card p-7 md:p-10"
      >
        <span className="grid size-11 place-items-center rounded-full bg-mint text-brand">
          <Check className="size-5" strokeWidth={2.5} aria-hidden />
        </span>
        <h3
          ref={doneRef}
          tabIndex={-1}
          className="mt-6 text-[1.6rem] leading-tight font-medium tracking-[-0.03em] text-ink outline-none"
        >
          Listo, {state.contacto}.
        </h3>
        <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
          Te enviamos una confirmación a{" "}
          <span className="font-medium text-ink">{state.correo}</span>. Te contactaremos para
          agendar tu demo.
        </p>
      </div>
    );
  }

  const errors = state.status === "invalid" ? state.errors : {};
  const values = state.status === "invalid" || state.status === "error" ? state.values : undefined;

  return (
    <form
      action={formAction}
      noValidate
      className="relative rounded-2xl border border-black/[0.08] bg-card p-6 md:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="empresa" label="Nombre de la empresa" error={errors.empresa}>
          <input
            {...fieldProps("empresa", errors, values)}
            type="text"
            required
            autoComplete="organization"
            maxLength={120}
            className={cn(inputClass, "h-11")}
          />
        </Field>
        <Field id="contacto" label="Nombre del contacto" error={errors.contacto}>
          <input
            {...fieldProps("contacto", errors, values)}
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            className={cn(inputClass, "h-11")}
          />
        </Field>
        <Field id="telefono" label="Número de teléfono" error={errors.telefono}>
          <input
            {...fieldProps("telefono", errors, values)}
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            maxLength={30}
            placeholder="444 123 4567"
            className={cn(inputClass, "h-11")}
          />
        </Field>
        <Field id="correo" label="Correo electrónico" error={errors.correo}>
          <input
            {...fieldProps("correo", errors, values)}
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            placeholder="nombre@empresa.com"
            className={cn(inputClass, "h-11")}
          />
        </Field>
        <Field
          id="extra"
          label="Agregar algo extra"
          hint="Opcional"
          error={errors.extra}
          className="sm:col-span-2"
        >
          <textarea
            {...fieldProps("extra", errors, values)}
            rows={4}
            maxLength={2000}
            placeholder="Qué vendes, cuántas personas operan, qué te gustaría resolver…"
            className={cn(inputClass, "resize-y py-3 leading-relaxed")}
          />
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="lead-website">No llenes este campo</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" ? (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-[14px] leading-snug text-red-800">
          {state.message}{" "}
          <a href={`mailto:${site.email}`} className="font-medium underline underline-offset-2">
            {site.email}
          </a>
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center gap-2 rounded-md bg-brand px-5 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-brand/90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-70"
        >
          {pending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              Enviando…
            </>
          ) : (
            <>
              Enviar solicitud
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </button>
        <p aria-live="polite" className="sr-only">
          {pending ? "Enviando tu solicitud" : ""}
        </p>
      </div>
    </form>
  );
}
