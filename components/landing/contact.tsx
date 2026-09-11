import { CalendarCheck2, ShieldCheck } from "lucide-react";
import { Band, TwoTone } from "@/components/landing/frame";
import { LeadForm } from "@/components/landing/lead-form";

const promises = [
  {
    icon: CalendarCheck2,
    lead: "Una demo con tu operación.",
    body: "Llevamos una venta como las tuyas por todo el cauce: cotización, entrega, factura y cobro.",
  },
  {
    icon: ShieldCheck,
    lead: "Tus datos, solo para contactarte.",
    body: "Los usamos para agendar tu demo y darte seguimiento. No los compartimos con nadie.",
  },
] as const;

/** stripe.com's "¿Todo listo para empezar?", as the lead form every "Agendar demo" points to. */
export function Contact() {
  return (
    <Band id="contacto" className="border-t border-rail bg-background" frameClassName="py-24 md:py-32">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <TwoTone
            className="text-[2rem] leading-[1.1] md:text-[2.6rem]"
            strong="¿Listo para ordenar tu operación?"
            soft="Déjanos tus datos y te mostramos Caudal con una venta de principio a fin: de la cotización al cobro."
          />
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16">
            {promises.map((promise) => (
              <div key={promise.lead}>
                <span className="grid size-11 place-items-center rounded-lg border border-black/10 bg-card text-moss">
                  <promise.icon className="size-5" strokeWidth={1.6} aria-hidden />
                </span>
                <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground">
                  <span className="block font-medium text-ink">{promise.lead}</span>
                  {promise.body}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Wrapped so the card keeps its own height instead of stretching to the row. */}
        <div>
          <LeadForm />
        </div>
      </div>
    </Band>
  );
}
