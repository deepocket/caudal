export const site = {
  name: "Caudal",
  wordmark: "caudal",
  claim: "De la cotización al cobro, sin fugas.",
  description:
    "El sistema de las distribuidoras de material quirúrgico: cotiza, compra, entrega con lote, timbra y cobra en un solo cauce.",
  // What people in Mexico search for, kept within Google's title and snippet lengths.
  seo: {
    title: "Caudal · CRM para distribuidoras de material quirúrgico en México",
    description:
      "Cotiza, compra a proveedores extranjeros, entrega con lote y caducidad, timbra CFDI 4.0 y cobra en un solo sistema. Hecho en una distribuidora mexicana.",
    keywords: [
      "CRM para distribuidoras médicas",
      "software para distribuidoras de material quirúrgico",
      "ERP para distribuidoras de insumos médicos",
      "sistema de cotizaciones para insumos médicos",
      "control de lotes y caducidades",
      "trazabilidad de dispositivos médicos",
      "facturación CFDI 4.0",
      "complemento de pago",
      "cobranza para distribuidoras",
      "distribuidoras de artroscopía y ortopedia",
      "México",
    ],
  },
  email: "hola@trycaudal.com",
  /**
   * Sales line for call leads, in E.164 (e.g. "+524441234567") plus how it reads.
   * While empty, every call button and the phone in structured data stay hidden.
   */
  phone: { e164: "", display: "" },
  // Every "Agendar demo" lands on the lead form.
  demoHref: "#contacto",
  url: "https://trycaudal.com",
  locale: "es-MX",
} as const;

export const hasPhone = site.phone.e164.length > 0;
