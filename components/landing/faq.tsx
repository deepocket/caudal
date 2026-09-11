import { Plus } from "lucide-react";
import { CallLink } from "@/components/landing/call-link";
import { Band, TwoTone } from "@/components/landing/frame";
import { faq } from "@/lib/faq";
import { hasPhone, site } from "@/lib/site";

// Native <details>: answers stay in the HTML for search engines and agents,
// and the accordion works without JavaScript.
export function Faq() {
  return (
    <Band id="preguntas" className="border-t border-rail bg-background" frameClassName="py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.45fr] lg:gap-20">
        <div>
          <TwoTone
            className="text-[2rem] leading-[1.1] md:text-[2.6rem]"
            strong="Preguntas frecuentes."
            soft="Lo que conviene saber antes de agendar una demo."
          />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            ¿Otra duda?{" "}
            {hasPhone ? (
              <>
                Llámanos al <CallLink className="font-medium text-ink underline-offset-4 hover:underline" />{" "}
                o escríbenos a{" "}
              </>
            ) : (
              "Escríbenos a "
            )}
            <a href={`mailto:${site.email}`} className="font-medium text-ink underline-offset-4 hover:underline">
              {site.email}
            </a>
            .
          </p>
        </div>

        <div className="border-b border-rail">
          {faq.map((item) => (
            <details key={item.question} className="group border-t border-rail">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-[17px] leading-snug font-medium tracking-tight text-ink md:text-lg [&::-webkit-details-marker]:hidden">
                <h3>{item.question}</h3>
                <Plus
                  className="mt-0.5 size-5 shrink-0 text-moss transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                />
              </summary>
              <p className="-mt-2 max-w-2xl pb-7 text-[16px] leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Band>
  );
}
