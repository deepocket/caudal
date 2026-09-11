import { ArrowRight } from "lucide-react";
import { DemoButton } from "@/components/demo-button";
import { Band, TwoTone } from "@/components/landing/frame";

export function Hero() {
  return (
    <Band frameClassName="pb-16 pt-14 md:pb-24 md:pt-28">
      <a
        href="#cifras"
        className="group inline-flex flex-wrap items-center gap-x-2 text-[15px] text-ink"
      >
        <span className="font-medium">Nació dentro de una distribuidora real:</span>
        <span className="text-muted-foreground transition-colors group-hover:text-ink">
          ArtroConfort, San Luis Potosí
        </span>
        <ArrowRight
          className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </a>
      <TwoTone
        as="h1"
        className="mt-8 max-w-[15em] text-[2.35rem] leading-[1.06] sm:text-6xl md:text-[4.4rem]"
        strong="De la cotización al cobro, sin fugas."
        soft="Caudal es el sistema de las distribuidoras de material quirúrgico: cotiza, compra, entrega con lote, timbra y cobra en un solo cauce."
      />
      <div className="mt-10 flex flex-wrap gap-3">
        <DemoButton size="hero" />
        <a
          href="#producto"
          className="inline-flex h-12 items-center gap-2 rounded-md border border-black/15 bg-card/70 px-5 text-[15px] font-medium text-ink backdrop-blur-sm transition-colors hover:bg-card"
        >
          Ver el producto
          <ArrowRight className="size-4" aria-hidden />
        </a>
      </div>
    </Band>
  );
}
