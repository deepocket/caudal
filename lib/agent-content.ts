import { audiences } from "@/lib/audiences";
import { faq } from "@/lib/faq";
import { flowStages } from "@/lib/flow-stages";
import { pricingSummary } from "@/lib/pricing";
import { productModules } from "@/lib/product-content";
import { proofStats } from "@/lib/proof";
import { hasPhone, site } from "@/lib/site";

// Plain-text versions of the landing for AI agents and answer engines:
// /llms.txt (the llmstxt.org summary) and /index.md (the whole page). Both
// are built from the same data the page renders, so they never drift.

const link = (hash: string) => `${site.url}/${hash}`;

const contactLines = () =>
  [
    `- [Agendar demo](${link("#contacto")}): formulario con nombre de la empresa, contacto, teléfono y correo.`,
    hasPhone ? `- Teléfono: ${site.phone.display} (${site.phone.e164})` : null,
    `- Correo: ${site.email}`,
    `- Sitio: ${site.url}`,
  ].filter(Boolean);

export function llmsTxt() {
  return [
    `# ${site.name}`,
    "",
    `> ${site.seo.description}`,
    "",
    `${site.name} es un CRM y ERP para distribuidoras de material quirúrgico e insumos médicos en México. Nació dentro de ArtroConfort, una distribuidora de artroscopía y ortopedia en San Luis Potosí, que opera con él todos los días. Está en español, factura CFDI 4.0 ante el SAT y funciona en el navegador de la computadora y del celular.`,
    "",
    "## Qué hace",
    "",
    ...productModules.map((module) => `- [${module.cardTitle}](${link("#producto")}): ${module.description}`),
    "",
    "## Para quién",
    "",
    ...audiences.map((audience) => `- ${audience.lead} ${audience.body}`),
    "",
    "## Datos de la operación de ArtroConfort",
    "",
    ...proofStats.map((stat) => `- ${stat.value}: ${stat.label}.`),
    "",
    "## Precios",
    "",
    `- ${pricingSummary}`,
    "",
    "## Preguntas frecuentes",
    "",
    ...faq.map((item) => `- [${item.question}](${link("#preguntas")}): ${item.answer}`),
    "",
    "## Contacto",
    "",
    ...contactLines(),
    "",
    "## Optional",
    "",
    `- [Página completa en Markdown](${site.url}/index.md): todo el contenido del sitio en un solo documento.`,
    `- [Demo interactiva](${link("#pruebalo")}): pantalla de cotizaciones con datos de ejemplo; se puede aceptar, cobrar, facturar y entregar una cotización.`,
    "",
  ].join("\n");
}

export function pageMarkdown() {
  return [
    `# ${site.name}: ${site.claim}`,
    "",
    `${site.description}`,
    "",
    "Nació dentro de una distribuidora real: ArtroConfort, San Luis Potosí.",
    "",
    `[Agendar demo](${link("#contacto")})${hasPhone ? ` · Llamar al ${site.phone.display}` : ""}`,
    "",
    "## Cómo fluye una venta",
    "",
    ...flowStages.map(
      (stage, index) => `${index + 1}. **${stage.verb}.** ${stage.detail} La cotización queda como *${stage.status}*.`,
    ),
    "",
    "Cuando está cobrada, facturada y entregada, la venta queda *Completada*.",
    "",
    "## Pruébalo",
    "",
    `En ${link("#pruebalo")} hay una demo interactiva de la pantalla de cotizaciones, con datos de ejemplo: se acepta la cotización C-0771 y luego se cobra, se factura y se entrega en el orden que se quiera. Es una versión simplificada; en Caudal el CFDI se timbra ante el SAT y cada movimiento queda en la bitácora.`,
    "",
    "## Producto: un solo cauce para toda la venta",
    "",
    "Cotizaciones, compras, inventario, entregas, facturas y cobranza comparten los mismos datos: lo que pasa en una etapa ya está en la siguiente.",
    "",
    ...productModules.flatMap((module) => [
      `### ${module.cardTitle}`,
      "",
      `**${module.title}.** ${module.description}`,
      "",
      ...module.bullets.map((bullet) => `- ${bullet}`),
      ...(module.proof ? ["", `Dato de ArtroConfort: **${module.proof.value}** ${module.proof.label}.`] : []),
      "",
    ]),
    "## Probado en una distribuidora de verdad",
    "",
    "Cada módulo se usó primero con clientes, proveedores y el SAT de verdad. Datos de la operación de ArtroConfort:",
    "",
    ...proofStats.map((stat) => `- **${stat.value}** ${stat.label}.`),
    "",
    "## Para quién",
    "",
    "Hecho para quien no puede perder el control: distribuidoras y proveedores de salud con muchos procesos, muchos clientes y poco margen para el desorden.",
    "",
    ...audiences.map((audience) => `- **${audience.lead}** ${audience.body}`),
    "",
    "## Precios",
    "",
    pricingSummary,
    "",
    "## Preguntas frecuentes",
    "",
    ...faq.flatMap((item) => [`### ${item.question}`, "", item.answer, ""]),
    "## Contacto",
    "",
    "¿Listo para ordenar tu operación? Deja tus datos y te mostramos Caudal con una venta de principio a fin: de la cotización al cobro.",
    "",
    ...contactLines(),
    "",
  ].join("\n");
}
