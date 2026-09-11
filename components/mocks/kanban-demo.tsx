"use client";

import {
  Boxes,
  CircleDollarSign,
  FileCheck2,
  FileText,
  GripVertical,
  LayoutDashboard,
  MessageCircle,
  PackageCheck,
  Plus,
  Send,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";
import { AppButton, AppSurface, Avatar, money } from "@/components/mocks/app-ui";
import { BrowserFrame } from "@/components/mocks/browser-frame";
import { useDemoStep, useInView } from "@/hooks/use-in-view";
import { demoClients } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type Card = { folio: string; amount: number; client: string; avatar: number };

const columns: { title: string; cards: Card[] }[] = [
  {
    title: "Borrador",
    cards: [
      { folio: "C-0774", amount: 5811.6, client: demoClients[1].name, avatar: 1 },
      { folio: "C-0773", amount: 2450, client: demoClients[5].name, avatar: 0 },
    ],
  },
  {
    title: "Enviada",
    cards: [
      { folio: "C-0769", amount: 13398, client: demoClients[3].name, avatar: 2 },
      { folio: "C-0766", amount: 8550, client: demoClients[4].name, avatar: 1 },
    ],
  },
  {
    title: "Aceptada",
    cards: [{ folio: "C-0758", amount: 39500, client: demoClients[2].name, avatar: 0 }],
  },
  {
    title: "Cobrada",
    cards: [{ folio: "C-0751", amount: 17806, client: demoClients[5].name, avatar: 2 }],
  },
  {
    title: "Facturada",
    cards: [{ folio: "C-0747", amount: 32886, client: demoClients[1].name, avatar: 1 }],
  },
  {
    title: "Entregada",
    cards: [{ folio: "C-0745", amount: 6590, client: demoClients[4].name, avatar: 0 }],
  },
];

// The quote that travels during the demo.
const traveler: Card = {
  folio: "C-0771",
  amount: 13920,
  client: demoClients[0].name,
  avatar: 0,
};

const nav = [
  LayoutDashboard,
  Users,
  FileText,
  ShoppingCart,
  Boxes,
  Truck,
  MessageCircle,
];

function QuoteCard({
  card,
  highlight = false,
  entering = false,
  children,
}: {
  card: Card;
  highlight?: boolean;
  entering?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-shadow duration-300",
        highlight && "ring-2 ring-app-accent",
        entering && "animate-in fade-in slide-in-from-left-6 duration-500",
      )}
    >
      <div className="flex items-center justify-between gap-1.5 whitespace-nowrap">
        <span className="flex items-center gap-0.5 text-[11px] font-semibold text-app-primary">
          <GripVertical className="size-3 text-app-faint" />
          {card.folio}
        </span>
        <span className="text-[11px] font-semibold">{money(card.amount)}</span>
      </div>
      <p className="mt-1 truncate text-[11px] text-app-muted">{card.client}</p>
      <div className="mt-2 flex items-center justify-between">
        <Avatar initials={["BD", "AL", "JM"][card.avatar]} tone={card.avatar} />
        {children}
      </div>
    </div>
  );
}

export function KanbanDemo({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  // 0 sent · 1 about to accept · 2 accepted (stock reserved) · 3 hold
  const step = useDemoStep(4, 2200, inView);
  const accepted = step >= 2;

  const counts = [
    { label: "Por aceptar", value: accepted ? 5 : 6, icon: Send, tone: "bg-app-gold-50 text-app-gold-700" },
    { label: "Por cobrar", value: accepted ? 4 : 3, icon: CircleDollarSign, tone: "bg-app-green-50 text-app-accent" },
    { label: "Por facturar", value: accepted ? 3 : 2, icon: FileCheck2, tone: "bg-app-green-100 text-app-primary-hover" },
    { label: "Por entregar", value: accepted ? 5 : 4, icon: Truck, tone: "bg-app-green-200/70 text-app-primary" },
  ];

  return (
    <div ref={ref} className={className}>
      <BrowserFrame path="cotizaciones" className="w-[780px]">
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
                  i === 2 && "bg-app-green-50 text-app-primary",
                )}
              >
                <Icon className="size-3.5" />
              </span>
            ))}
          </aside>

          <div className="relative min-w-0 flex-1 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[17px] font-semibold tracking-[-0.02em]">Cotizaciones</p>
                <p className="text-[11px] text-app-muted">‹ Septiembre 2026 ›</p>
              </div>
              <div className="flex gap-1.5">
                <AppButton variant="outline">Cobranza</AppButton>
                <AppButton variant="outline">Plantillas</AppButton>
                <AppButton>
                  <Plus className="size-3" /> Nueva Cotizacion
                </AppButton>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {counts.map((count) => (
                <div
                  key={count.label}
                  className="flex items-center justify-between rounded-xl bg-app-fill px-3 py-2"
                >
                  <div>
                    <p className="text-[10.5px] text-app-muted">{count.label}</p>
                    <p
                      key={count.value}
                      className="animate-in fade-in text-[18px] font-semibold duration-500"
                    >
                      {count.value}
                    </p>
                  </div>
                  <span className={cn("grid size-7 place-items-center rounded-full", count.tone)}>
                    <count.icon className="size-3.5" />
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              {columns.map((column, index) => {
                const isSent = index === 1;
                const isAccepted = index === 2;
                const cards = column.cards;
                const total =
                  cards.length + (isSent && !accepted ? 1 : 0) + (isAccepted && accepted ? 1 : 0);
                return (
                  <div
                    key={column.title}
                    className="w-[162px] shrink-0 rounded-xl bg-app-fill p-1.5"
                  >
                    <div className="flex items-center justify-between px-1.5 pt-0.5 pb-1.5">
                      <span className="text-[11px] font-semibold">{column.title}</span>
                      <span className="rounded-full bg-white px-1.5 text-[10px] text-app-muted">
                        {total}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {isSent && !accepted ? (
                        <QuoteCard card={traveler} highlight={step === 1}>
                          <AppButton
                            className={cn(
                              "px-2 py-1 text-[10px]",
                              step === 1 && "bg-app-primary-hover",
                            )}
                          >
                            Aceptar ▾
                          </AppButton>
                        </QuoteCard>
                      ) : null}
                      {isAccepted && accepted ? (
                        <QuoteCard card={traveler} entering>
                          <span className="rounded-full bg-app-green-50 px-2 py-0.5 text-[10px] font-medium text-app-primary">
                            Aceptada
                          </span>
                        </QuoteCard>
                      ) : null}
                      {cards.map((card) => (
                        <QuoteCard key={card.folio} card={card} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className={cn(
                "absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-app-primary px-3 py-2 text-white shadow-lg transition-all duration-500",
                accepted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
            >
              <PackageCheck className="size-4 text-app-green-200" />
              <div>
                <p className="text-[11px] font-semibold">C-0771 aceptada · stock apartado</p>
                <p className="text-[10px] text-white/70">3 piezas, primero lo que caduca antes</p>
              </div>
            </div>
          </div>
        </AppSurface>
      </BrowserFrame>
    </div>
  );
}
