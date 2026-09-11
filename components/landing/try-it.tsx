import { CrmDemo } from "@/components/crm-demo/crm-demo";
import { Band, TwoTone } from "@/components/landing/frame";

/** Right under the hero, as x.ai/bot does: the product itself, ready to click. */
export function TryIt() {
  return (
    <Band id="pruebalo" className="bg-background" frameClassName="pt-20 pb-24 md:pt-28 md:pb-32">
      <TwoTone
        className="max-w-4xl text-[2rem] leading-[1.1] md:text-[2.9rem]"
        strong="Lleva una venta de la cotización al cobro."
        soft={
          <>
            Esta es la pantalla de cotizaciones de Caudal. Acepta{" "}
            <span className="whitespace-nowrap">C-0771</span> y luego cóbrala, factúrala y
            entrégala, en el orden que quieras.
          </>
        }
      />
      <div className="river-glow -mx-3 mt-12 rounded-[1.75rem] p-2 sm:mx-0 sm:p-3 md:mt-14 md:p-5">
        <CrmDemo />
      </div>
      <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
        Versión simplificada con datos de ejemplo. En Caudal, el CFDI se timbra ante el SAT,
        el estado de cuenta llega al correo del cliente y cada movimiento queda en la
        bitácora.
      </p>
    </Band>
  );
}
