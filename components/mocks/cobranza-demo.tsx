"use client";

import { Check, CircleCheck, Download, Mail, RefreshCw, X } from "lucide-react";
import { AppButton, AppSurface, Chip, money } from "@/components/mocks/app-ui";
import { useDemoStep, useInView } from "@/hooks/use-in-view";
import { demoClients } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type Debtor = {
  name: string;
  balance: number;
  quotes: number;
  oldest: string;
  email: string | null;
};

const debtors: Debtor[] = [
  { name: demoClients[2].name, balance: 71240.5, quotes: 3, oldest: "2 meses", email: "cxp.sanrafael@ejemplo.mx" },
  { name: demoClients[0].name, balance: 44660, quotes: 2, oldest: "5 semanas", email: "villasenor@ejemplo.mx" },
  { name: demoClients[4].name, balance: 38114, quotes: 3, oldest: "3 semanas", email: "pagos.cqn@ejemplo.mx" },
  { name: demoClients[1].name, balance: 32406, quotes: 1, oldest: "12 días", email: null },
];

// Typed during the demo into the row that had no address.
const typedEmail = "admin.parque@ejemplo.mx";
const totalOwed = debtors.reduce((sum, debtor) => sum + debtor.balance, 0);
const totalQuotes = debtors.reduce((sum, debtor) => sum + debtor.quotes, 0);

// 0 nothing checked · 1–3 rows checked · 4 missing email typed and checked ·
// 5 "Enviar" pressed · 6 "Sí, enviar" · 7–8 sent (the reduced-motion rest state)
const STEPS = 9;

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "mt-0.5 grid size-3.5 shrink-0 place-items-center rounded-[4px] transition-colors duration-300",
        checked ? "bg-app-primary text-white" : "bg-white ring-1 ring-black/20",
      )}
    >
      {checked ? <Check className="size-2.5" strokeWidth={3.5} /> : null}
    </span>
  );
}

export function CobranzaDemo({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const step = useDemoStep(STEPS, 1150, inView);
  const sent = step >= 7;
  const confirming = step === 5 || step === 6;
  const checkedCount = sent || confirming ? debtors.length : Math.min(step, debtors.length);

  return (
    <div ref={ref} className={className}>
      <AppSurface className="mx-auto w-[310px] rounded-2xl bg-white shadow-[0_30px_70px_-30px_rgba(17,17,17,0.45)] ring-1 ring-black/[0.06]">
        <div className="flex items-start justify-between px-4 pt-3.5">
          <div>
            <p className="text-[14px] font-semibold tracking-[-0.02em]">Cobranza</p>
            <p className="mt-1 text-[11px] text-app-muted">
              {debtors.length} clientes deben{" "}
              <span className="font-semibold text-app-ink">{money(totalOwed)}</span> en{" "}
              {totalQuotes} cotizaciones.
            </p>
          </div>
          <X className="size-3.5 text-app-faint" />
        </div>

        <div className="mt-2.5 border-y border-black/[0.06]">
          {debtors.map((debtor, index) => {
            const checked = index < checkedCount;
            const email = debtor.email ?? (step >= 4 ? typedEmail : null);
            return (
              <div
                key={debtor.name}
                className={cn(
                  "flex gap-2.5 border-b border-black/[0.05] px-4 py-1.5 transition-colors duration-300 last:border-b-0",
                  checked && !sent && "bg-app-green-50/60",
                )}
              >
                <Checkbox checked={checked} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-[11.5px] font-semibold">{debtor.name}</p>
                    <p className="text-[11.5px] font-semibold whitespace-nowrap">
                      {money(debtor.balance)}
                    </p>
                  </div>
                  <p className="text-[10px] text-app-muted">
                    {debtor.quotes} {debtor.quotes === 1 ? "cotización" : "cotizaciones"} · la más
                    vieja hace {debtor.oldest}
                  </p>
                  <div className="mt-0.5 flex h-[17px] items-center">
                    {sent ? (
                      <Chip tone="green" className="animate-in fade-in duration-500">
                        <Check className="size-2.5" strokeWidth={3} /> Enviado
                      </Chip>
                    ) : email ? (
                      <span
                        key={email}
                        className={cn(
                          "flex items-center gap-1 text-[10px] text-app-muted",
                          !debtor.email && "animate-in fade-in rounded-md px-1.5 py-0.5 ring-1 ring-app-accent duration-500",
                        )}
                      >
                        <Mail className="size-2.5" />
                        {email}
                      </span>
                    ) : (
                      <span className="flex w-full items-center justify-between rounded-md px-1.5 py-0.5 text-[10px] text-app-faint ring-1 ring-amber-300">
                        correo@cliente.com
                        <span className="font-medium text-app-amber">sin correo</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative h-[48px] px-4">
          {sent ? (
            <div className="flex h-full animate-in items-center gap-2 fade-in duration-500">
              <CircleCheck className="size-4 shrink-0 text-app-accent" />
              <div>
                <p className="text-[11px] font-semibold text-app-primary">
                  Estados de cuenta enviados a {debtors.length} clientes
                </p>
                <p className="text-[10px] text-app-muted">Cada cliente recibe el suyo.</p>
              </div>
            </div>
          ) : confirming ? (
            <div className="flex h-full animate-in items-center justify-between fade-in duration-300">
              <p className="text-[11px] font-medium">¿Enviar a {debtors.length} clientes?</p>
              <div className="flex gap-1.5">
                <AppButton variant="outline" className="py-1">
                  Cancelar
                </AppButton>
                <AppButton
                  className={cn("py-1", step === 6 && "bg-app-primary-hover ring-2 ring-app-accent/40")}
                >
                  Sí, enviar
                </AppButton>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold">
                  {checkedCount} {checkedCount === 1 ? "cliente" : "clientes"}
                </p>
                <p className="text-[10px] text-app-muted">
                  {money(debtors.slice(0, checkedCount).reduce((sum, d) => sum + d.balance, 0))}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="size-3 text-app-faint" />
                <AppButton variant="outline" className="py-1">
                  <Download className="size-3" /> Descargar
                </AppButton>
                <AppButton className={cn("py-1", checkedCount === 0 && "opacity-40")}>
                  <Mail className="size-3" /> Enviar
                </AppButton>
              </div>
            </div>
          )}
        </div>
      </AppSurface>
    </div>
  );
}
