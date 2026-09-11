"use client";

import {
  Boxes,
  Building2,
  FileText,
  Globe2,
  History,
  LayoutDashboard,
  ListChecks,
  MessageCircle,
  NotebookPen,
  ReceiptText,
  ScanBarcode,
  ShoppingCart,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useDemoStep, useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

// Fills picked from the landing palette so the grid reads as one family.
const fills = {
  cream: "bg-[#f7f5ee] text-[#1c3a13]",
  mint: "bg-[#d6e6c8] text-[#1c3a13]",
  sage: "bg-[#7fa46b] text-[#f7f5ee]",
  gold: "bg-[#d9a441] text-[#1c3a13]",
  goldSoft: "bg-[#f6e3a1] text-[#7a5b12]",
  moss: "bg-[#2f5a24] text-[#d6e6c8] ring-1 ring-white/10",
  accent: "bg-[#4a9d7c] text-white",
  white: "bg-white text-[#1b3a2d]",
  deep: "bg-[#163010] text-[#a9cdbb] ring-1 ring-white/10",
} as const;

type Tile = { icon: LucideIcon; label: string; fill: keyof typeof fills };

// Three rows of five, wider than the panel so the outer tiles fall off its
// edges, as in stripe.com's integrations grid. Every icon is a real Caudal module.
const tiles: Tile[] = [
  { icon: Globe2, label: "Tipo de cambio", fill: "moss" },
  { icon: LayoutDashboard, label: "Dashboard", fill: "white" },
  { icon: FileText, label: "Cotizaciones", fill: "cream" },
  { icon: ShoppingCart, label: "Compras", fill: "gold" },
  { icon: Users, label: "Clientes", fill: "sage" },

  { icon: Building2, label: "Proveedores", fill: "deep" },
  { icon: Boxes, label: "Inventario", fill: "accent" },
  { icon: ScanBarcode, label: "Lotes", fill: "goldSoft" },
  { icon: Truck, label: "Entregas", fill: "white" },
  { icon: History, label: "Bitácora", fill: "mint" },

  { icon: NotebookPen, label: "Notas", fill: "sage" },
  { icon: ReceiptText, label: "Facturación", fill: "moss" },
  { icon: Wallet, label: "Cobranza", fill: "mint" },
  { icon: ListChecks, label: "Tareas", fill: "gold" },
  { icon: MessageCircle, label: "Chat", fill: "accent" },
];

// The pulse walks a sale through the modules, each with what's waiting there.
const tour = [
  { tile: 2, stat: "6 por aceptar" },
  { tile: 3, stat: "2 pedidos en camino" },
  { tile: 6, stat: "2 lotes por vencer" },
  { tile: 8, stat: "4 entregas pendientes" },
  { tile: 11, stat: "3 por facturar" },
  { tile: 12, stat: "$186,420 por cobrar" },
  { tile: 13, stat: "3 tareas pendientes" },
] as const;

export function ModulesGrid() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const step = useDemoStep(tour.length, 1500, inView);
  const current = tour[step];
  const lit = current.tile;
  const LitIcon = tiles[lit].icon;

  return (
    <div ref={ref} aria-hidden className="absolute inset-0">
      <div className="absolute top-7 left-1/2 grid w-[392px] -translate-x-1/2 grid-cols-5 gap-[18px]">
        {tiles.map((tile, index) => (
          <span
            key={tile.label}
            className={cn(
              "grid size-16 place-items-center rounded-[18px] shadow-[0_12px_26px_-14px_rgba(0,0,0,0.6)] transition-all duration-500",
              fills[tile.fill],
              index === lit
                ? "z-10 scale-[1.1] shadow-[0_0_0_6px_rgba(214,230,200,0.14),0_18px_36px_-12px_rgba(0,0,0,0.7)] ring-2 ring-white/85"
                : "opacity-90",
            )}
          >
            <tile.icon className="size-7" strokeWidth={1.6} />
          </span>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex h-24 items-end justify-center bg-gradient-to-t from-[#1f4119] via-[#1f4119]/85 to-transparent pb-5">
        <span
          key={step}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 font-app text-[12px] text-white ring-1 ring-white/15 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-1 duration-500"
        >
          <LitIcon className="size-3.5 text-[#d6e6c8]" />
          <span className="font-semibold">{tiles[lit].label}</span>
          <span className="text-white/65">· {current.stat}</span>
        </span>
      </div>
    </div>
  );
}
