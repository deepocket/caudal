import Image from "next/image";
import { DemoButton } from "@/components/demo-button";
import { Wordmark } from "@/components/wordmark";
import { site } from "@/lib/site";

const steps = [
  { n: "01", label: "Cotización" },
  { n: "02", label: "Orden" },
  { n: "03", label: "Cirugía" },
  { n: "04", label: "Factura" },
  { n: "05", label: "Cobro" },
] as const;

const proofs = [
  {
    title: "Tiempo a cobro",
    body: "Aceptar, facturar y cobrar viven en el mismo cauce. Menos espera entre una cotización cerrada y el dinero en caja.",
  },
  {
    title: "Fugas a la vista",
    body: "Lo pendiente de cobrar no se pierde en hojas ni chats. Queda en un tablero, con acción.",
  },
  {
    title: "Cotizaciones en cauce",
    body: "Del borrador a la entrega, cada folio tiene estado. Nada queda en el aire.",
  },
] as const;

export default function Home() {
  return (
    <div id="top" className="flex min-h-full flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <Wordmark />
        <DemoButton />
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10 md:px-10 md:pb-24 md:pt-20">
          <h1 className="max-w-4xl text-[2.6rem] leading-[1.05] font-medium tracking-[-0.04em] text-black sm:text-6xl md:text-[4.75rem]">
            {site.claim}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {site.description}
          </p>
          <div className="mt-9">
            <DemoButton size="hero" />
          </div>
        </section>

        <section
          id="producto"
          className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-10 md:pb-32"
        >
          <ol className="-mx-6 flex snap-x snap-mandatory scroll-pl-6 gap-8 overflow-x-auto border-t border-black/10 px-6 pt-8 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-x-6 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
            {steps.map((step, index) => (
              <li
                key={step.label}
                className="w-[7.75rem] shrink-0 snap-start sm:w-auto sm:min-w-0"
              >
                <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                  {step.n}
                </p>
                <p className="mt-2 text-lg font-medium tracking-tight text-black">
                  {step.label}
                </p>
                {index < steps.length - 1 ? (
                  <p className="mt-3 text-black/25" aria-hidden>
                    →
                  </p>
                ) : null}
              </li>
            ))}
          </ol>

          <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Desde el CRM puedes{" "}
            <span className="text-black">facturar y cobrar</span> en el mismo
            flujo. También{" "}
            <span className="text-black">
              administrar entregas y lotes de inventario
            </span>
            , sin salir del cauce.
          </p>

          <figure className="mt-14">
            <div className="overflow-hidden rounded-xl border border-black/10 bg-card shadow-[0_20px_60px_-28px_rgba(17,17,17,0.28)]">
              <Image
                src="/hero-cotizaciones-kanban.png"
                alt="Kanban de Cotizaciones: borrador, enviada, aceptada, cobrada, facturada y entregada."
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 1152px) 100vw, 1152px"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-4 text-sm text-muted-foreground">
              Cotizaciones · un kanban, un cauce.
            </figcaption>
          </figure>

          <figure className="mt-10 md:mt-14">
            <div className="overflow-hidden rounded-xl border border-black/10 bg-card shadow-[0_20px_60px_-28px_rgba(17,17,17,0.28)]">
              <Image
                src="/dashboard-cobrar.png"
                alt="Dashboard con la pestaña Cobrar y pendientes de cobranza."
                width={1536}
                height={1024}
                sizes="(max-width: 1152px) 100vw, 1152px"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-4 text-sm text-muted-foreground">
              Pendientes · Cobrar. Las fugas, a la vista.
            </figcaption>
          </figure>
        </section>

        <section
          id="senales"
          className="border-y border-black/10 bg-[#efece4]"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 md:grid-cols-3 md:gap-10 md:px-10 md:py-24">
            <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase md:col-span-3">
              Señales del producto · no son cifras de un estudio
            </p>
            {proofs.map((proof) => (
              <article key={proof.title}>
                <h2 className="text-2xl font-medium tracking-tight text-black md:text-[1.75rem]">
                  {proof.title}
                </h2>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                  {proof.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="demo"
          className="mx-auto flex w-full max-w-6xl flex-col items-start px-6 py-24 md:px-10 md:py-32"
        >
          <Wordmark />
          <div className="mt-10">
            <DemoButton size="hero" />
          </div>
        </section>
      </main>
    </div>
  );
}
