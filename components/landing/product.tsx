import { Band, TwoTone } from "@/components/landing/frame";
import { ExpandableCard, type CardDetail } from "@/components/landing/expandable-card";
import { CobranzaDemo } from "@/components/mocks/cobranza-demo";
import { ComprasDemo } from "@/components/mocks/compras-demo";
import { EntregaDemo } from "@/components/mocks/entrega-demo";
import { EquipoDemo } from "@/components/mocks/equipo-demo";
import { EscanerDemo } from "@/components/mocks/escaner-demo";
import { FacturarDemo } from "@/components/mocks/facturar-demo";
import { KanbanDemo } from "@/components/mocks/kanban-demo";
import { PendientesDemo } from "@/components/mocks/pendientes-demo";
import { productModule, type ModuleKey } from "@/lib/product-content";
import { cn } from "@/lib/utils";

// Copy lives in lib/product-content.ts; this file only decides how each card looks.

const demos: Record<ModuleKey, React.ReactNode> = {
  cotizaciones: <KanbanDemo />,
  inventario: <EscanerDemo />,
  compras: <ComprasDemo />,
  entregas: <EntregaDemo />,
  facturacion: <FacturarDemo />,
  cobranza: <CobranzaDemo />,
  tablero: <PendientesDemo />,
  equipo: <EquipoDemo />,
};

type Layout = {
  key: ModuleKey;
  featured?: boolean;
  className?: string;
  height: string;
  wash?: "river" | "gold";
  /** Wide screens bleed off the right edge; narrow ones float centered. */
  placement: "bleed" | "center" | "inset";
};

const layout: Layout[] = [
  { key: "cotizaciones", featured: true, className: "lg:col-span-2", height: "min-h-[380px] md:min-h-[420px]", placement: "bleed" },
  { key: "inventario", height: "min-h-[380px] md:min-h-[420px]", placement: "center" },
  { key: "compras", height: "min-h-[360px]", placement: "center" },
  { key: "entregas", height: "min-h-[360px]", placement: "center" },
  { key: "facturacion", height: "min-h-[360px]", wash: "gold", placement: "center" },
  { key: "cobranza", height: "min-h-[380px] md:min-h-[420px]", wash: "gold", placement: "center" },
  { key: "tablero", className: "lg:col-span-2", height: "min-h-[380px] md:min-h-[420px]", placement: "bleed" },
  { key: "equipo", className: "lg:col-span-3", height: "min-h-[340px]", placement: "inset" },
];

const placements = {
  bleed: "absolute top-0 left-6 md:left-8",
  center: "absolute inset-x-0 top-0 flex justify-center",
  inset: "absolute inset-x-6 top-0 md:inset-x-8",
} as const;

/** Decorative wash behind a demo; kept separate so it never masks the demo itself. */
function Wash({ tone = "river" }: { tone?: "river" | "gold" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_45%)]",
        tone === "river" ? "river-glow" : "gold-glow",
      )}
    />
  );
}

export function Product() {
  return (
    <Band id="producto" className="border-t border-rail bg-background" frameClassName="py-24 md:py-32">
      <TwoTone
        className="max-w-4xl text-[2rem] leading-[1.1] md:text-[2.9rem]"
        strong="Un solo cauce para toda la venta."
        soft="Cotizaciones, compras, inventario, entregas, facturas y cobranza comparten los mismos datos: lo que pasa en una etapa ya está en la siguiente."
      />

      <div className="mt-14 grid gap-4 md:mt-16 lg:grid-cols-3">
        {layout.map((card) => {
          const content = productModule(card.key);
          const detail: CardDetail = {
            title: content.title,
            description: content.description,
            bullets: content.bullets,
            proof: content.proof,
            demo: demos[card.key],
          };
          return (
            <ExpandableCard
              key={card.key}
              featured={card.featured}
              title={content.cardTitle}
              detail={detail}
              className={card.className}
              demoClassName={card.height}
            >
              <Wash tone={card.wash} />
              <div className={placements[card.placement]}>{demos[card.key]}</div>
            </ExpandableCard>
          );
        })}
      </div>
    </Band>
  );
}
