import { ChevronRight } from "lucide-react";
import { LotTrace } from "@/components/landing/audience/lot-trace";
import { ModulesGrid } from "@/components/landing/audience/modules-grid";
import { OwnerDashboard } from "@/components/landing/audience/owner-dashboard";
import { Band } from "@/components/landing/frame";

const audiences = [
  {
    lead: "Organizaciones con muchos procesos que atender.",
    body: "Cotizaciones, compras, inventario, entregas, facturas, cobranza, tareas y chat viven en un mismo lugar y comparten los mismos datos. Nada se queda en una hoja aparte.",
    link: { href: "#producto", label: "Ver el producto" },
    graphic: <ModulesGrid />,
  },
  {
    lead: "Proveedores de salud que necesitan control, transparencia y orden.",
    body: "Cada pieza ligada a su lote y a su caducidad, cada entrega a su cotización y cada factura a su venta. Si alguien pregunta, la respuesta está a un clic.",
    link: { href: "#pruebalo", label: "Pruébalo" },
    graphic: <LotTrace />,
  },
  {
    lead: "Dueños que quieren ver su negocio completo.",
    body: "Ventas, ingresos, compras, margen y lo que falta cobrar en una sola pantalla, sin pedir reportes ni esperar al cierre de mes.",
    link: { href: "#contacto", label: "Agendar demo" },
    graphic: <OwnerDashboard />,
  },
] as const;

/** Stripe's dark "choose your path" band, told as the three kinds of business Caudal serves. */
export function Audience() {
  return (
    <Band
      id="para-quien"
      className="bg-brand text-primary-foreground"
      frameClassName="border-white/10 py-24 md:py-32"
    >
      <h2 className="max-w-4xl text-[2rem] leading-[1.1] font-medium tracking-[-0.035em] text-balance md:text-[2.9rem]">
        Hecho para quien no puede perder el control.{" "}
        <span className="text-primary-foreground/50">
          Distribuidoras y proveedores de salud con muchos procesos, muchos clientes y poco
          margen para el desorden.
        </span>
      </h2>

      <div className="mt-14 grid gap-14 md:mt-20 lg:grid-cols-3 lg:gap-5">
        {audiences.map((audience) => (
          <article key={audience.lead}>
            <div className="relative h-[320px] overflow-hidden rounded-xl bg-[#21431a] ring-1 ring-white/10 [background-image:radial-gradient(90%_70%_at_85%_0%,rgba(214,230,200,0.16),transparent_60%),radial-gradient(80%_60%_at_0%_100%,rgba(217,164,65,0.12),transparent_65%)]">
              {audience.graphic}
            </div>
            <p className="mt-7 text-[17px] leading-relaxed text-primary-foreground/60">
              <span className="font-medium text-primary-foreground">{audience.lead}</span>{" "}
              {audience.body}
            </p>
            <a
              href={audience.link.href}
              className="group mt-4 inline-flex items-center gap-1 text-[15px] font-medium text-mint transition-colors hover:text-white"
            >
              {audience.link.label}
              <ChevronRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          </article>
        ))}
      </div>
    </Band>
  );
}
