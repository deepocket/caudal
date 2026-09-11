import { CalendarCheck2, Phone, ShieldCheck, Tag } from "lucide-react";
import { CallLink } from "@/components/landing/call-link";
import { Band, TwoTone } from "@/components/landing/frame";
import { LeadForm } from "@/components/landing/lead-form";
import { price, pricing } from "@/lib/pricing";
import { site } from "@/lib/site";

const promises = [
  {
    icon: Tag,
    lead: `Desde ${price(pricing.plans[0])} al mes.`,
    body: `Planes de ${price(pricing.plans[0])} y ${price(pricing.plans[1])} al mes, o ${pricing.enterprise}. Se ajustan a tu operación.`,
  },
  {
    icon: CalendarCheck2,
    lead: "Una demo con tu operación.",
    body: "Llevamos una venta como las tuyas por todo el cauce: cotización, entrega, factura y cobro.",
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
          {/* Call leads: for people who would rather talk than fill a form. */}
          <CallLink className="group mt-8 inline-flex items-center gap-3 rounded-xl border border-black/10 bg-card px-4 py-3 transition-colors hover:border-moss/40">
            <span className="grid size-10 place-items-center rounded-lg bg-brand text-primary-foreground">
              <Phone className="size-4" aria-hidden />
            </span>
            <span className="text-left">
              <span className="block text-[13px] text-muted-foreground">¿Prefieres llamar?</span>
              <span className="block text-[17px] font-medium tracking-tight text-ink">
                {site.phone.display}
              </span>
            </span>
          </CallLink>
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
          <p className="mt-10 flex items-start gap-2.5 text-[14px] leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-moss" strokeWidth={1.8} aria-hidden />
            Tus datos solo se usan para agendar tu demo y darte seguimiento. No los compartimos con nadie.
          </p>
        </div>
        {/* Wrapped so the card keeps its own height instead of stretching to the row. */}
        <div>
          <LeadForm />
        </div>
      </div>
    </Band>
  );
}
