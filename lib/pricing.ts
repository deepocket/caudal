// Monthly plans in Mexican pesos, plus an enterprise quote. Shared by the page,
// the FAQ, the structured data and the Markdown agents read.

export const pricing = {
  currency: "MXN",
  plans: [600, 1100],
  enterprise: "cotización empresarial",
} as const;

const pesos = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: pricing.currency,
  maximumFractionDigits: 0,
});

/** "$600" — how a price reads on the page. */
export const price = (amount: number) => pesos.format(amount);

/** One sentence for the FAQ, llms.txt and index.md. */
export const pricingSummary = `El precio se ajusta a tu operación: hay planes desde ${price(pricing.plans[0])} y de ${price(pricing.plans[1])} al mes (${pricing.currency}), y una ${pricing.enterprise} para operaciones más grandes.`;
