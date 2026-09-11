// Questions a distributor asks before a demo, answered only with what the
// product does today. Shown on the page, in FAQPage structured data and in the
// Markdown version agents read, so all three always match.

import { pricingSummary } from "@/lib/pricing";

export const faq = [
  {
    question: "¿Qué es Caudal?",
    answer:
      "Caudal es un sistema para distribuidoras de material quirúrgico e insumos médicos en México. Junta en un solo lugar cotizaciones, compras, inventario con lote y caducidad, entregas, facturación CFDI 4.0 y cobranza.",
  },
  {
    question: "¿Para qué tipo de empresas es?",
    answer:
      "Para distribuidoras que venden insumos y equipo médico a cirujanos, clínicas, hospitales y otras distribuidoras, sobre todo en artroscopía, ortopedia y especialidades afines: material estéril con lote y caducidad, equipo nuevo o reacondicionado y proveedores extranjeros.",
  },
  {
    question: "¿Caudal timbra facturas CFDI 4.0?",
    answer:
      "Sí. La factura se timbra desde la misma cotización a través de un proveedor autorizado de certificación (PAC). Antes de timbrar, Caudal revisa los datos del cliente; maneja PUE y PPD, complementos de pago con su fecha límite, cancelaciones con motivo del SAT y refacturación.",
  },
  {
    question: "¿Cómo controla los lotes y las caducidades?",
    answer:
      "Cada lote se registra con su caducidad y la cámara del teléfono puede leer el código GS1 de la caja. Al aceptar una cotización se aparta primero lo que caduca antes, y cada pieza entregada queda ligada a su lote, a su cliente y a su cotización.",
  },
  {
    question: "¿Sirve si compro a proveedores extranjeros?",
    answer:
      "Sí. Subes el PDF de la factura del proveedor, en inglés y en dólares: Caudal lo lee, traduce las partidas al español, convierte con tu tipo de cambio y crea los lotes en tu inventario.",
  },
  {
    question: "¿Cómo ayuda con la cobranza?",
    answer:
      "Ves quién te debe, cuánto y desde hace cuánto; registras abonos parciales con el saldo al momento y mandas estados de cuenta por correo a varios clientes a la vez.",
  },
  {
    question: "¿Funciona en el celular?",
    answer:
      "Sí. Caudal funciona en el navegador de la computadora y del celular, y el registro de lotes con la cámara se hace desde el teléfono.",
  },
  {
    question: "¿Quién está detrás de Caudal?",
    answer:
      "Caudal nació dentro de ArtroConfort, una distribuidora de insumos y equipo de artroscopía y ortopedia en San Luis Potosí, que opera con él todos los días desde febrero de 2026.",
  },
  {
    question: "¿Cuánto cuesta?",
    answer: `${pricingSummary} En la demo vemos cuál te conviene.`,
  },
] as const;
