import { proofStats } from "@/lib/proof";

// One source for what the product does, used by the bento on the page, the
// structured data and the Markdown version agents read. Every claim maps to
// shipped code in ac-logistics; planned features (fiscal module, AI day plan)
// stay out until they ship.

export type ModuleKey =
  | "cotizaciones"
  | "inventario"
  | "compras"
  | "entregas"
  | "facturacion"
  | "cobranza"
  | "tablero"
  | "equipo";

export type ProductModule = {
  key: ModuleKey;
  /** Short title on the bento card. */
  cardTitle: string;
  /** Title inside the detail dialog. */
  title: string;
  description: string;
  bullets: readonly string[];
  proof?: { value: string; label: string };
};

const [, catalogProof, suppliersProof, fdaProof] = proofStats;

export const productModules: readonly ProductModule[] = [
  {
    key: "cotizaciones",
    cardTitle: "Cotiza y sigue cada venta hasta cobrarla",
    title: "Cada venta, de la cotización al cobro, en un solo tablero",
    description:
      "Cotiza con tu catálogo, manda el PDF al cliente y sigue cada folio: enviada, aceptada, cobrada, facturada y entregada. Cuando el cliente acepta, el inventario se aparta solo.",
    bullets: [
      "Plantillas de sistemas completos para cotizar con un clic",
      "PDF con fotos, condición nuevo o reacondicionado y lote de cada pieza",
      "Al aceptar, el stock se aparta: primero lo que caduca antes",
      "Cobro, factura y entrega se registran por separado, en el orden en que pasen",
      "Marcadores de urgente, en espera o revisar, con su nota",
      "Bitácora con cada cambio de la cotización",
    ],
  },
  {
    key: "inventario",
    cardTitle: "Escanea la caja: lote, caducidad y serie",
    title: "Inventario con lote y caducidad, sin teclear",
    description:
      "La cámara del teléfono lee el código GS1 de la caja y llena el lote, la caducidad y el número de serie. Si el código no se deja leer, basta una foto de la etiqueta.",
    bullets: [
      "Códigos GS1 / UDI leídos con la cámara del teléfono",
      "Productos verificados contra el registro de dispositivos de la FDA",
      "Alertas de producto vencido y por vencer en 30 días",
      "Cobertura en días y lista de lo que hay que reponer",
      "Cada lote muestra a qué cliente y en qué cotización salió",
      "Número de serie para el equipo reutilizable",
    ],
    proof: { value: fdaProof.value, label: fdaProof.label },
  },
  {
    key: "compras",
    cardTitle: "Administra tus compras al extranjero",
    title: "La factura del proveedor se captura sola",
    description:
      "Subes el PDF de tu proveedor extranjero, en inglés y en dólares. La IA lo lee, traduce cada partida al español, convierte con tu tipo de cambio y crea los lotes en tu inventario. Tú revisas y guardas.",
    bullets: [
      "Dos pasos: subir el PDF, revisar y guardar",
      "Descripción original y nombre traducido, lado a lado",
      "Lote, caducidad, cantidad y precio de cada partida",
      "Dólares convertidos con el tipo de cambio que tú defines",
      "Pedidos en camino con su guía internacional y nacional",
    ],
    proof: { value: suppliersProof.value, label: suppliersProof.label },
  },
  {
    key: "entregas",
    cardTitle: "Entrega pieza por pieza, con su lote",
    title: "Entregas con trazabilidad, aunque salgan en partes",
    description:
      "Cada venta aceptada entra a la cola de entregas. Registras lo que sale, con su lote, su guía y quién lo recibió. Si falta algo, queda a la vista hasta que se entregue.",
    bullets: [
      "Entregas parciales: cuánto salió y cuánto falta, a la vista",
      "Lote obligatorio en cada pieza que sale",
      "Envío con guía o entrega local",
      "Rastreo de FedEx, DHL, Estafeta y más dentro de la app",
      "Estados claros: pendiente, en ruta, parcial y entregada",
    ],
  },
  {
    key: "facturacion",
    cardTitle: "Timbra el CFDI desde la cotización",
    title: "La factura sale de la venta, no de otro sistema",
    description:
      "Caudal revisa que no falte nada, te muestra exactamente lo que se va al SAT y timbra el CFDI 4.0. El PDF se arma desde el XML, con el formato que tus clientes ya conocen.",
    bullets: [
      "Revisión antes de timbrar: lo que bloquea y lo que conviene revisar",
      "Uso de CFDI filtrado según el régimen del cliente",
      "Complementos de pago para PPD, con su fecha límite",
      "Cancelación con motivo del SAT, acuse y refactura",
      "Datos fiscales leídos de la Constancia de Situación Fiscal",
      "Protección contra timbrar dos veces la misma venta",
    ],
    proof: { value: catalogProof.value, label: catalogProof.label },
  },
  {
    key: "cobranza",
    cardTitle: "Cobra sin ir cliente por cliente",
    title: "Todos los estados de cuenta, en un clic",
    description:
      "Caudal junta lo que te debe cada cliente, en pesos o en dólares, y le manda su estado de cuenta por correo. Registras abonos parciales y ves al momento el saldo que queda.",
    bullets: [
      "Quién te debe, cuánto y desde hace cuánto",
      "Estados de cuenta en PDF o por correo, a varios clientes a la vez",
      "Abonos parciales con el saldo pendiente en vivo",
      "Se persigue todo lo pendiente, no solo lo del mes que estás viendo",
      "Venta completada cuando está cobrada, facturada y entregada",
    ],
  },
  {
    key: "tablero",
    cardTitle: "Lo pendiente, siempre a la vista",
    title: "Tu negocio en una pantalla",
    description:
      "Ventas, ingresos, compras y margen del periodo, junto a lo que falta facturar, cobrar, entregar o refacturar. Cada persona arma su tablero con lo que necesita ver.",
    bullets: [
      "Pendientes: facturar, cobrar, entregar y refacturar",
      "Ventas contra ingresos contra compras",
      "Tasa de cierre que también cuenta lo que se perdió",
      "Top clientes, inventario y envíos en camino",
      "Modo privado para ocultar los montos en pantalla",
    ],
  },
  {
    key: "equipo",
    cardTitle: "Tu equipo, en el mismo cauce",
    title: "Tareas y chat del equipo, sin salir de Caudal",
    description:
      "Asigna tareas con responsable y fecha, pega capturas y sigue el avance. Las coordinaciones salen de WhatsApp y se quedan en el mismo sistema donde está la venta.",
    bullets: [
      "Tareas con responsable, fecha límite y capturas",
      "Tiempo en progreso medido solo",
      "Chat con grupos y menciones",
      "Correo al asignar una tarea",
      "Rendimiento del equipo en Reportes",
    ],
  },
];

export function productModule(key: ModuleKey): ProductModule {
  const found = productModules.find((module) => module.key === key);
  if (!found) throw new Error(`Unknown product module: ${key}`);
  return found;
}
