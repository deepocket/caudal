// Who Caudal is for, shared by the "Para quién" band and the Markdown for agents.
export const audiences = [
  {
    key: "procesos",
    lead: "Organizaciones con muchos procesos que atender.",
    body: "Cotizaciones, compras, inventario, entregas, facturas, cobranza, tareas y chat viven en un mismo lugar y comparten los mismos datos. Nada se queda en una hoja aparte.",
    link: { href: "#producto", label: "Ver el producto" },
  },
  {
    key: "control",
    lead: "Proveedores de salud que necesitan control, transparencia y orden.",
    body: "Cada pieza ligada a su lote y a su caducidad, cada entrega a su cotización y cada factura a su venta. Si alguien pregunta, la respuesta está a un clic.",
    link: { href: "#pruebalo", label: "Pruébalo" },
  },
  {
    key: "duenos",
    lead: "Dueños que quieren ver su negocio completo.",
    body: "Ventas, ingresos, compras, margen y lo que falta cobrar en una sola pantalla, sin pedir reportes ni esperar al cierre de mes.",
    link: { href: "#contacto", label: "Agendar demo" },
  },
] as const;

export type AudienceKey = (typeof audiences)[number]["key"];
