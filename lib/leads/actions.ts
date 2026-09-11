"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { leadConfirmation, ownerNotification } from "@/lib/leads/emails";
import { isRateLimited } from "@/lib/leads/rate-limit";
import type { LeadFormState, LeadValues } from "@/lib/leads/types";
import { readLead, validateLead } from "@/lib/leads/validate";

// Resend's shared sender only delivers to the Resend account owner: fine for the
// internal notice while testing, but lead confirmations need a verified domain.
const FALLBACK_FROM = "Caudal <onboarding@resend.dev>";

const failure = (values: LeadValues, message?: string): LeadFormState => ({
  status: "error",
  // The form appends a mailto link to site.email after every message.
  message: message ?? "No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos directamente:",
  values,
});

/**
 * Lead form Server Action. Anyone can POST here, so it validates everything,
 * rate-limits per IP, and never returns internal addresses or provider errors.
 */
export async function submitLead(
  _previous: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const lead = readLead(formData);

  // Honeypot: people never see this field, bots fill it. Pretend it worked.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success", contacto: lead.contacto, correo: lead.correo };
  }

  const errors = validateLead(lead);
  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors, values: lead };
  }

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    return failure(
      lead,
      "Recibimos varias solicitudes seguidas. Espera unos minutos o escríbenos directamente:",
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL;
  if (!apiKey || !notifyTo) {
    if (process.env.NODE_ENV === "development") {
      console.info("[leads] Resend sin configurar; solicitud recibida en desarrollo:", lead);
      return { status: "success", contacto: lead.contacto, correo: lead.correo };
    }
    console.error("[leads] Falta RESEND_API_KEY o LEAD_NOTIFY_EMAIL; la solicitud no se envió.");
    return failure(lead);
  }

  const resend = new Resend(apiKey);
  const from = process.env.LEAD_FROM_EMAIL || FALLBACK_FROM;
  const replyTo = process.env.LEAD_REPLY_TO || undefined;

  // The internal notice goes first: if it fails, the lead would be lost, so say so.
  const notice = ownerNotification(lead, new Date());
  try {
    const { error } = await resend.emails.send({
      from,
      to: notifyTo,
      replyTo: lead.correo,
      subject: notice.subject,
      html: notice.html,
      text: notice.text,
    });
    if (error) {
      console.error("[leads] Resend rechazó el aviso interno:", error.name, error.message);
      return failure(lead);
    }
  } catch (error) {
    console.error("[leads] No se pudo contactar a Resend para el aviso interno:", error);
    return failure(lead);
  }

  // A separate email, so the lead never sees the internal address (no cc, no bcc).
  const confirmation = leadConfirmation(lead, { canReply: Boolean(replyTo) });
  try {
    const { error } = await resend.emails.send({
      from,
      to: lead.correo,
      replyTo,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
    });
    if (error) {
      console.error("[leads] Resend rechazó la confirmación:", error.name, error.message);
    }
  } catch (error) {
    console.error("[leads] No se pudo enviar la confirmación:", error);
  }

  return { status: "success", contacto: lead.contacto, correo: lead.correo };
}
