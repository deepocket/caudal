// State and rules for the interactive CRM demo. The rules mirror the real app
// (ac-logistics): a quote becomes the sale once accepted, and cobro, factura and
// entrega are tracked separately, in any order. All records are fictional.

export type QuoteStatus = "borrador" | "enviada" | "aceptada";
export type PaymentMethod = "PUE" | "PPD";

export type Line = {
  ref: string;
  name: string;
  qty: number;
  price: number;
  /** Lot reserved when the quote is accepted: the one that expires first. */
  lot: string;
  expiry: string;
};

export type Invoice = {
  serie: string;
  uuid: string;
  method: PaymentMethod;
  usage: string;
  /** PPD invoices need a payment complement once they are paid. */
  complement: "no-aplica" | "pendiente" | "timbrado";
};

export type Shipment = { kind: "envio" | "local"; carrier: string; tracking: string };

export type Quote = {
  folio: string;
  client: string;
  company: string;
  rfc: string;
  date: string;
  status: QuoteStatus;
  lines: Line[];
  paid: number;
  invoice: Invoice | null;
  delivered: number[];
  shipment: Shipment | null;
};

export const TODAY = "10/09/2026";
const COMPLEMENT_DEADLINE = "05/10/2026";

const lines = {
  rf: (qty: number): Line => ({ ref: "AR-9401", name: "Punta de radiofrecuencia 90°", qty, price: 3100, lot: "L24A117", expiry: "31/01/2027" }),
  shaver: (qty: number): Line => ({ ref: "SH-4020", name: "Cuchilla de shaver 4.0 mm", qty, price: 1450, lot: "L25C042", expiry: "31/03/2027" }),
  anchor: (qty: number): Line => ({ ref: "AN-5501", name: "Ancla de sutura 5.5 mm", qty, price: 2900, lot: "L25B310", expiry: "29/02/2028" }),
  cannula: (qty: number): Line => ({ ref: "CN-0808", name: "Cánula de artroscopía 8 mm", qty, price: 1605, lot: "L24K905", expiry: "30/11/2027" }),
  battery: (qty: number): Line => ({ ref: "BT-7700", name: "Batería de sistema motorizado", qty, price: 7850, lot: "SN 7700-2291", expiry: "—" }),
};

function quote(partial: Omit<Quote, "paid" | "invoice" | "delivered" | "shipment"> & Partial<Quote>): Quote {
  return {
    paid: 0,
    invoice: null,
    delivered: partial.lines.map(() => 0),
    shipment: null,
    ...partial,
  };
}

export function initialQuotes(): Quote[] {
  const sanRafael = [lines.rf(10), lines.shaver(4)];
  const cqn = [lines.battery(1)];
  const dmc = [lines.cannula(5)];
  return [
    quote({
      folio: "C-0771",
      client: "Dr. Andrés Villaseñor",
      company: "Ortopedia Villaseñor",
      rfc: "OVI190214KP3",
      date: "08/09/2026",
      status: "enviada",
      lines: [lines.rf(2), lines.shaver(2), lines.anchor(1)],
    }),
    quote({
      folio: "C-0772",
      client: "Clínica del Parque",
      company: "Servicios Médicos del Parque",
      rfc: "SMP150930TN8",
      date: "09/09/2026",
      status: "borrador",
      lines: [lines.cannula(2), lines.shaver(1)],
    }),
    quote({
      folio: "C-0769",
      client: "Dra. Mariana Treviño",
      company: "Artroscopía Treviño",
      rfc: "ATR200611QW5",
      date: "05/09/2026",
      status: "aceptada",
      lines: [lines.anchor(4)],
      paid: 13456,
    }),
    quote({
      folio: "C-0766",
      client: "Centro Quirúrgico Norte",
      company: "CQN Salud",
      rfc: "CSA170422HJ1",
      date: "02/09/2026",
      status: "aceptada",
      lines: cqn,
      invoice: { serie: "A-1041", uuid: "7C1E94B2-5A3F-4D8B-A0E6-2B9F71C4D830", method: "PPD", usage: "G03", complement: "no-aplica" },
      delivered: cqn.map((line) => line.qty),
      shipment: { kind: "local", carrier: "Entrega local", tracking: "" },
    }),
    quote({
      folio: "C-0760",
      client: "Distribuidora Médica Central",
      company: "DMC Insumos",
      rfc: "DIN120318PL6",
      date: "30/08/2026",
      status: "aceptada",
      lines: dmc,
      paid: 4654.5,
      delivered: [3],
      shipment: { kind: "envio", carrier: "Estafeta", tracking: "3015 8842 6610" },
    }),
    quote({
      folio: "C-0758",
      client: "Hospital San Rafael",
      company: "Hospitalaria San Rafael",
      rfc: "HSR180523KJ4",
      date: "28/08/2026",
      status: "aceptada",
      lines: sanRafael,
      paid: 42688,
      invoice: { serie: "A-1039", uuid: "3F2A9C1E-7B4D-4E8A-9C21-5D6F0A1B2C3D", method: "PUE", usage: "G01", complement: "no-aplica" },
      delivered: sanRafael.map((line) => line.qty),
      shipment: { kind: "envio", carrier: "FedEx", tracking: "7749 2210 5531" },
    }),
  ];
}

// Folios fiscales handed out, in order, as the visitor stamps invoices.
const nextInvoices = [
  { serie: "A-1042", uuid: "9B4D2E71-0C6A-4F3B-8E15-A7D2C9F046B1" },
  { serie: "A-1043", uuid: "E5A07C3D-92B1-4B6E-A4F8-1D3C5E7A9B20" },
  { serie: "A-1044", uuid: "2D8F6B14-7E3A-4C9D-B1A5-6F0E8C2D4A73" },
  { serie: "A-1045", uuid: "C71B3E9A-4D2F-4A8C-9E60-5B1D7F3A2C84" },
];

// ——— Derived values ———

export const subtotal = (q: Quote) => q.lines.reduce((sum, line) => sum + line.qty * line.price, 0);
export const iva = (q: Quote) => Math.round(subtotal(q) * 0.16 * 100) / 100;
export const total = (q: Quote) => subtotal(q) + iva(q);
export const balance = (q: Quote) => Math.max(0, Math.round((total(q) - q.paid) * 100) / 100);
export const pieces = (q: Quote) => q.lines.reduce((sum, line) => sum + line.qty, 0);
export const deliveredPieces = (q: Quote) => q.delivered.reduce((sum, n) => sum + n, 0);

export type Progress = "pendiente" | "parcial" | "hecho";

export function cobro(q: Quote): Progress {
  if (q.paid <= 0) return "pendiente";
  return balance(q) > 0 ? "parcial" : "hecho";
}

export function entrega(q: Quote): Progress {
  const done = deliveredPieces(q);
  if (done === 0) return "pendiente";
  return done < pieces(q) ? "parcial" : "hecho";
}

export const facturada = (q: Quote) => q.invoice !== null;

export const completada = (q: Quote) =>
  q.status === "aceptada" && cobro(q) === "hecho" && facturada(q) && entrega(q) === "hecho";

export function counts(quotes: Quote[]) {
  const accepted = quotes.filter((q) => q.status === "aceptada");
  return {
    porAceptar: quotes.filter((q) => q.status === "enviada").length,
    porCobrar: accepted.filter((q) => cobro(q) !== "hecho").length,
    porFacturar: accepted.filter((q) => !facturada(q)).length,
    porEntregar: accepted.filter((q) => entrega(q) !== "hecho").length,
    abiertas: quotes.filter((q) => q.status !== "aceptada").length,
  };
}

// ——— Actions ———

export type Action =
  | { type: "enviar"; folio: string }
  | { type: "aceptar"; folio: string }
  | { type: "cobrar"; folio: string; amount: number }
  | { type: "facturar"; folio: string; method: PaymentMethod; usage: string }
  | { type: "complemento"; folio: string }
  | { type: "entregar"; folio: string; quantities: number[]; shipment: Shipment }
  | { type: "reiniciar" };

export type State = { quotes: Quote[]; invoicesIssued: number };

export const initialState = (): State => ({ quotes: initialQuotes(), invoicesIssued: 0 });

function update(state: State, folio: string, change: (q: Quote) => Quote): State {
  return { ...state, quotes: state.quotes.map((q) => (q.folio === folio ? change(q) : q)) };
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reiniciar":
      return initialState();
    case "enviar":
      return update(state, action.folio, (q) => ({ ...q, status: "enviada" }));
    case "aceptar":
      return update(state, action.folio, (q) => ({ ...q, status: "aceptada" }));
    case "cobrar":
      return update(state, action.folio, (q) => {
        const paid = Math.min(total(q), Math.round((q.paid + action.amount) * 100) / 100);
        const settled = paid >= total(q);
        // Paying a PPD invoice calls for its complemento de pago.
        const invoice =
          q.invoice && q.invoice.method === "PPD" && q.invoice.complement === "no-aplica"
            ? { ...q.invoice, complement: settled ? ("pendiente" as const) : q.invoice.complement }
            : q.invoice;
        return { ...q, paid, invoice };
      });
    case "facturar": {
      const next = nextInvoices[state.invoicesIssued % nextInvoices.length];
      const stamped = update(state, action.folio, (q) => ({
        ...q,
        invoice: {
          ...next,
          method: action.method,
          usage: action.usage,
          complement: action.method === "PPD" && cobro(q) === "hecho" ? "pendiente" : "no-aplica",
        },
      }));
      return { ...stamped, invoicesIssued: state.invoicesIssued + 1 };
    }
    case "complemento":
      return update(state, action.folio, (q) =>
        q.invoice ? { ...q, invoice: { ...q.invoice, complement: "timbrado" } } : q,
      );
    case "entregar":
      return update(state, action.folio, (q) => ({
        ...q,
        delivered: q.delivered.map((done, i) => Math.min(q.lines[i].qty, done + (action.quantities[i] ?? 0))),
        shipment: action.shipment,
      }));
  }
}

/** The next thing a person would do with this quote, shown as a gentle hint. */
export function nextStep(q: Quote): string {
  if (q.status === "borrador") return "Revisa las partidas y envíala al cliente.";
  if (q.status === "enviada") return "El cliente dijo que sí: márcala como aceptada y el stock se aparta solo.";
  if (completada(q)) return "Venta completada: cobrada, facturada y entregada. Prueba con otra cotización.";
  const missing = [
    cobro(q) !== "hecho" && "cobrar",
    !facturada(q) && "facturar",
    entrega(q) !== "hecho" && "entregar",
  ].filter(Boolean);
  return `Falta ${missing.join(", ").replace(/, ([^,]*)$/, " y $1")}. Hazlo en el orden que quieras.`;
}

export const complementDeadline = COMPLEMENT_DEADLINE;
