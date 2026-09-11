"use client";

import {
  Bell,
  Boxes,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  FileText,
  Info,
  LayoutDashboard,
  MoreVertical,
  MessageCircle,
  Percent,
  Plus,
  Search,
  ShoppingCart,
  Target,
  Truck,
  Users,
} from "lucide-react";
import {
  AppButton,
  AppSurface,
  Avatar,
  Chip,
  money,
  type ChipTone,
} from "@/components/mocks/app-ui";
import { BrowserFrame } from "@/components/mocks/browser-frame";
import { useDemoStep, useInView } from "@/hooks/use-in-view";
import { demoClients } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type Row = { folio: string; client: string; status: string; tone: ChipTone; amount: number };
type Tab = { label: string; verb: string; total: number; rows: Row[]; note?: string };

const tabs: Tab[] = [
  {
    label: "Facturar",
    verb: "Facturar",
    total: 3,
    rows: [
      { folio: "C-0758", client: demoClients[2].name, status: "Cobrada", tone: "green", amount: 39500 },
      { folio: "C-0766", client: demoClients[4].name, status: "Aceptada", tone: "gold", amount: 8550 },
      { folio: "C-0751", client: demoClients[5].name, status: "Entregada", tone: "dark", amount: 17806 },
    ],
  },
  {
    label: "Cobrar",
    verb: "Cobrar",
    total: 4,
    rows: [
      { folio: "C-0770", client: demoClients[3].name, status: "Aceptada", tone: "gold", amount: 13920 },
      { folio: "C-0768", client: demoClients[0].name, status: "Entregada", tone: "dark", amount: 30740 },
      { folio: "C-0747", client: demoClients[1].name, status: "Facturada", tone: "emerald", amount: 32886 },
    ],
  },
  {
    label: "Entregar",
    verb: "Entregar",
    total: 5,
    rows: [
      { folio: "C-0771", client: demoClients[0].name, status: "Aceptada", tone: "gold", amount: 13920 },
      { folio: "C-0763", client: demoClients[2].name, status: "Cobrada", tone: "green", amount: 21450 },
      { folio: "C-0759", client: demoClients[4].name, status: "Facturada", tone: "emerald", amount: 9310 },
    ],
  },
  {
    label: "Refacturar",
    verb: "Refacturar",
    total: 1,
    rows: [
      { folio: "C-0742", client: demoClients[5].name, status: "Factura cancelada", tone: "red", amount: 11280 },
    ],
    note: "Cancelada el 28/08/2026 · Refacturar en septiembre",
  },
];

const totals: Record<string, number> = {
  Facturar: 65856,
  Cobrar: 91466,
  Entregar: 58730,
  Refacturar: 11280,
};

// The tab order starts on Cobrar (the money) and keeps the widget's cyclic
// order; with reduced motion the demo rests on Facturar, a full tab.
const sequence = [1, 2, 3, 0];

const kpis = [
  { label: "Ventas", value: money(412860, { cents: false }), delta: "+12%", icon: CircleDollarSign },
  { label: "Ingresos", value: money(286300, { cents: false }), delta: "+8%", icon: CircleDollarSign },
  { label: "Margen bruto", value: "38%", delta: "+3 pts", icon: Percent },
  { label: "Tasa de cierre", value: "41%", delta: "+5 pts", icon: Target },
];

const nav = [
  LayoutDashboard,
  Users,
  FileText,
  ShoppingCart,
  Boxes,
  Truck,
  MessageCircle,
];

const pipeline = [
  { label: "Borrador", count: 5, color: "#d4d4d8" },
  { label: "Enviada", count: 6, color: "#f6e3a1" },
  { label: "Aceptada", count: 5, color: "#a9cdbb" },
  { label: "Cobrada", count: 4, color: "#4a9d7c" },
  { label: "Facturada", count: 3, color: "#2a5a44" },
  { label: "Entregada", count: 7, color: "#1b3a2d" },
];
const pipelineTotal = pipeline.reduce((sum, stage) => sum + stage.count, 0);
const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const segments = pipeline.map((stage, index) => ({
  ...stage,
  length: (stage.count / pipelineTotal) * CIRCUMFERENCE,
  start:
    (pipeline.slice(0, index).reduce((sum, previous) => sum + previous.count, 0) / pipelineTotal) *
    CIRCUMFERENCE,
}));

function PipelineWidget() {
  return (
    <div className="min-w-[180px] flex-1 rounded-2xl bg-app-fill p-2.5">
      <p className="text-[13px] font-semibold">Pipeline de cotizaciones</p>
      <div className="mt-2 flex items-center gap-3">
        <div className="relative size-[84px] shrink-0">
          <svg viewBox="0 0 80 80" className="size-full -rotate-90">
            {segments.map((segment) => (
              <circle
                key={segment.label}
                cx="40"
                cy="40"
                r={RADIUS}
                fill="none"
                stroke={segment.color}
                strokeWidth="11"
                strokeDasharray={`${segment.length - 1.2} ${CIRCUMFERENCE - segment.length + 1.2}`}
                strokeDashoffset={-segment.start}
              />
            ))}
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <p className="text-[15px] leading-none font-semibold">
              {pipelineTotal}
              <span className="block text-[8.5px] font-normal text-app-muted">activas</span>
            </p>
          </div>
        </div>
        <ul className="space-y-0.5 text-[10px]">
          {pipeline.map((stage) => (
            <li key={stage.label} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="size-1.5 rounded-full" style={{ backgroundColor: stage.color }} />
              <span className="text-app-muted">{stage.label}</span>
              <span className="font-medium">{stage.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function PendientesDemo({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const step = useDemoStep(sequence.length, 2600, inView);
  const active = tabs[sequence[step]];

  return (
    <div ref={ref} className={className}>
      <BrowserFrame path="dashboard" className="w-[740px]">
        <AppSurface className="flex h-[400px] bg-white">
          <aside className="flex w-12 shrink-0 flex-col items-center gap-2 border-r border-black/[0.06] py-3">
            <span className="mb-2 grid size-7 place-items-center rounded-lg bg-app-primary text-[11px] font-bold text-white">
              c
            </span>
            {nav.map((Icon, i) => (
              <span
                key={i}
                className={cn(
                  "grid size-7 place-items-center rounded-lg text-app-muted",
                  i === 0 && "bg-app-green-50 text-app-primary",
                )}
              >
                <Icon className="size-3.5" />
              </span>
            ))}
          </aside>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-1.5">
              <p className="mr-1 text-[13px] font-semibold tracking-[-0.02em]">Septiembre 2026</p>
              <span className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] ring-1 ring-black/10">
                <CalendarDays className="size-3 text-app-muted" />
                01/09/2026 - 30/09/2026
                <ChevronDown className="size-3 text-app-muted" />
              </span>
              <span className="flex w-[150px] items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] text-app-faint ring-1 ring-black/10">
                <Search className="size-3" />
                Buscar...
                <span className="ml-auto text-[9.5px]">⌘K</span>
              </span>
              <div className="ml-auto flex items-center gap-2">
                <AppButton className="py-1">
                  <Plus className="size-3" /> Agregar widget
                </AppButton>
                <Bell className="size-3.5 text-app-muted" />
                <Avatar initials="BD" />
              </div>
            </div>

            <div className="px-4 pt-2.5">
              <div className="grid grid-cols-4 gap-2">
                {kpis.map((kpi) => (
                  <div key={kpi.label} className="rounded-2xl bg-app-fill px-3 py-2">
                    <p className="flex items-center gap-1 text-[10.5px] text-app-muted">
                      {kpi.label}
                      <Info className="size-2.5 text-app-faint" />
                      <span className="ml-auto text-[9.5px] font-medium text-app-accent">
                        {kpi.delta}
                      </span>
                    </p>
                    <div className="mt-0.5 flex items-center justify-between">
                      <p className="text-[19px] font-semibold tracking-[-0.02em]">{kpi.value}</p>
                      <span className="grid size-6 place-items-center rounded-full bg-white text-app-primary">
                        <kpi.icon className="size-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex gap-2">
                <div className="w-[470px] shrink-0 rounded-2xl bg-app-fill p-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold">Pendientes</p>
                    <span className="flex items-center gap-1.5 text-[10px] text-app-muted">
                      <span className="size-3 rounded-[3px] bg-white ring-1 ring-black/15" />
                      Todos los periodos
                    </span>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {tabs.map((tab) => (
                      <span
                        key={tab.label}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10.5px] font-medium transition-colors duration-500",
                          tab === active ? "bg-app-primary text-white" : "bg-white text-app-muted",
                        )}
                      >
                        {tab.label} ({tab.total})
                      </span>
                    ))}
                  </div>

                  <div className="mt-2 h-[108px] overflow-hidden rounded-xl bg-white">
                    <div
                      key={active.label}
                      className="animate-in fade-in slide-in-from-bottom-1 duration-500"
                    >
                      {active.rows.map((row) => (
                        <div
                          key={row.folio}
                          className="flex items-center gap-3 border-b border-black/[0.05] px-3 py-1 last:border-b-0"
                        >
                          <div className="w-[132px] min-w-0">
                            <p className="text-[11px] font-semibold text-app-primary">{row.folio}</p>
                            <p className="truncate text-[10.5px] text-app-muted">{row.client}</p>
                          </div>
                          <div className="w-[98px]">
                            <Chip tone={row.tone}>{row.status}</Chip>
                          </div>
                          <p className="w-[62px] text-right text-[11.5px] font-semibold">
                            {money(row.amount, { cents: false })}
                          </p>
                          <AppButton className="w-[70px] py-1">{active.verb}</AppButton>
                          <MoreVertical className="ml-auto size-3.5 text-app-faint" />
                        </div>
                      ))}
                      {active.note ? (
                        <p className="px-3 py-2 text-[10px] text-app-muted">{active.note}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between px-1 text-[10.5px]">
                    <p key={active.label} className="animate-in fade-in duration-500">
                      <span className="text-app-muted">
                        {active.total} {active.total === 1 ? "cotización" : "cotizaciones"} ·{" "}
                      </span>
                      <span className="font-semibold">
                        Total: {money(totals[active.label], { cents: false })}
                      </span>
                    </p>
                    <span className="font-medium text-app-primary">Ver todas →</span>
                  </div>
                </div>

                <PipelineWidget />
              </div>
            </div>
          </div>
        </AppSurface>
      </BrowserFrame>
    </div>
  );
}
