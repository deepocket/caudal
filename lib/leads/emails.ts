import "server-only";

import type { LeadValues } from "@/lib/leads/types";

// Plain HTML emails: table layout and inline styles, because email clients strip
// most CSS. The wordmark is live text — Gmail and Outlook don't render SVG.

const colors = {
  ground: "#f4f2eb",
  card: "#fffcf7",
  brand: "#1c3a13",
  ink: "#111111",
  muted: "#5c5a54",
  rail: "#e2dfd6",
};

const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escaped, with the visitor's own line breaks kept. */
function html(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function rows(lead: LeadValues) {
  const fields: [string, string][] = [
    ["Empresa", lead.empresa],
    ["Contacto", lead.contacto],
    ["Teléfono", lead.telefono],
    ["Correo", lead.correo],
  ];
  if (lead.extra) fields.push(["Algo extra", lead.extra]);
  return fields;
}

function table(lead: LeadValues) {
  return rows(lead)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 0;border-top:1px solid ${colors.rail};width:120px;vertical-align:top;font-size:13px;color:${colors.muted};">${label}</td>
          <td style="padding:12px 0;border-top:1px solid ${colors.rail};vertical-align:top;font-size:15px;color:${colors.ink};">${html(value)}</td>
        </tr>`,
    )
    .join("");
}

function layout({ preheader, body }: { preheader: string; body: string }) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body style="margin:0;padding:0;background:${colors.ground};font-family:${font};">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.ground};">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
            <tr>
              <td style="padding:0 4px 20px;font-size:28px;font-weight:700;letter-spacing:-1.2px;color:${colors.brand};">caudal</td>
            </tr>
            <tr>
              <td style="background:${colors.card};border:1px solid ${colors.rail};border-radius:16px;padding:32px;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 4px 0;font-size:12px;line-height:1.5;color:${colors.muted};">
                Caudal · De la cotización al cobro, sin fugas. · trycaudal.com
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function textRows(lead: LeadValues) {
  return rows(lead)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

/** Internal notice for the Caudal team. Reply-to is the lead, so answering writes to them. */
export function ownerNotification(lead: LeadValues, receivedAt: Date) {
  const when = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(receivedAt);

  return {
    subject: `Nuevo contacto: ${lead.empresa}`,
    html: layout({
      preheader: `${lead.contacto} de ${lead.empresa} pidió una demo.`,
      body: `
        <p style="margin:0 0 6px;font-size:13px;color:${colors.muted};">Solicitud de demo · ${escapeHtml(when)}</p>
        <h1 style="margin:0 0 20px;font-size:22px;line-height:1.25;font-weight:600;color:${colors.ink};">${escapeHtml(lead.empresa)} quiere ver Caudal</h1>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${table(lead)}</table>
        <p style="margin:24px 0 0;font-size:14px;line-height:1.5;color:${colors.muted};">Responde a este correo para escribirle directamente a ${escapeHtml(lead.contacto)}.</p>`,
    }),
    text: `Solicitud de demo · ${when}\n\n${textRows(lead)}\n\nResponde a este correo para escribirle directamente a ${lead.contacto}.`,
  };
}

/** Confirmation for the person who filled the form. Never mentions internal addresses. */
export function leadConfirmation(lead: LeadValues, { canReply }: { canReply: boolean }) {
  const replyLine = canReply
    ? "Si quieres agregar algo, responde a este correo."
    : "";

  return {
    subject: "Recibimos tu solicitud · Caudal",
    html: layout({
      preheader: "Recibimos tus datos. Te contactaremos para agendar tu demo.",
      body: `
        <h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;font-weight:600;color:${colors.ink};">Hola, ${escapeHtml(lead.contacto)}</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${colors.ink};">Gracias por tu interés en Caudal. Recibimos los datos de ${escapeHtml(lead.empresa)} y te contactaremos para agendar una demo con tu operación: una venta de la cotización al cobro.</p>
        <p style="margin:24px 0 4px;font-size:13px;color:${colors.muted};">Lo que nos compartiste</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${table(lead)}</table>
        ${replyLine ? `<p style="margin:24px 0 0;font-size:14px;line-height:1.5;color:${colors.muted};">${replyLine}</p>` : ""}`,
    }),
    text: `Hola, ${lead.contacto}\n\nGracias por tu interés en Caudal. Recibimos los datos de ${lead.empresa} y te contactaremos para agendar una demo con tu operación: una venta de la cotización al cobro.\n\nLo que nos compartiste:\n${textRows(lead)}${replyLine ? `\n\n${replyLine}` : ""}\n\nCaudal · De la cotización al cobro, sin fugas. · trycaudal.com`,
  };
}
