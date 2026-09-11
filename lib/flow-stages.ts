// The five stages of a sale, as the flow rail shows them and agents read them.
// `status` is the state the quote is left in, with the app's own labels.
export const flowStages = [
  { verb: "Cotiza", detail: "PDF con fotos, condición y lote de cada pieza.", status: "Enviada" },
  { verb: "Aparta", detail: "Al aceptar, el stock se reserva solo.", status: "Aceptada" },
  { verb: "Entrega", detail: "Cada pieza sale ligada a su lote.", status: "Entregada" },
  { verb: "Factura", detail: "El CFDI se timbra desde la cotización.", status: "Facturada" },
  { verb: "Cobra", detail: "Estados de cuenta en un clic.", status: "Cobrada" },
] as const;
