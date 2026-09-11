import "server-only";

import type { LeadErrors, LeadField, LeadValues } from "@/lib/leads/types";

// Everything in FormData is untrusted: normalize first, then validate the
// normalized value so what we store and email is exactly what we checked.

const limits: Record<LeadField, number> = {
  empresa: 120,
  contacto: 120,
  telefono: 30,
  correo: 254,
  extra: 2000,
};

/** Drops C0/C1 control characters, keeping tab, line feed and carriage return. */
function stripControls(value: string) {
  let out = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    const control =
      (code < 32 && code !== 9 && code !== 10 && code !== 13) || (code >= 127 && code < 160);
    if (!control) out += char;
  }
  return out;
}

/** Control characters out, whitespace tidied, cut at `max`. */
export function cleanText(raw: string, max: number, multiline = false) {
  const clean = stripControls(raw);
  const normalized = multiline
    ? clean.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
    : clean.replace(/\s+/g, " ").trim();
  return normalized.slice(0, max);
}

function text(formData: FormData, field: LeadField, multiline = false) {
  const raw = formData.get(field);
  if (typeof raw !== "string") return "";
  return cleanText(raw, limits[field], multiline);
}

export function readLead(formData: FormData): LeadValues {
  return {
    empresa: text(formData, "empresa"),
    contacto: text(formData, "contacto"),
    telefono: text(formData, "telefono"),
    correo: text(formData, "correo").toLowerCase(),
    extra: text(formData, "extra", true),
  };
}

const emailPattern = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const phonePattern = /^\+?[\d\s().-]+$/;

export function validateLead(lead: LeadValues): LeadErrors {
  const errors: LeadErrors = {};

  if (lead.empresa.length < 2) {
    errors.empresa = "Escribe el nombre de tu empresa.";
  }
  if (lead.contacto.length < 2) {
    errors.contacto = "Escribe tu nombre.";
  }

  const digits = lead.telefono.replace(/\D/g, "");
  if (!lead.telefono) {
    errors.telefono = "Escribe un número de teléfono.";
  } else if (!phonePattern.test(lead.telefono) || digits.length < 10 || digits.length > 15) {
    errors.telefono = "Revisa el número: debe tener al menos 10 dígitos.";
  }

  if (!lead.correo) {
    errors.correo = "Escribe tu correo electrónico.";
  } else if (!emailPattern.test(lead.correo)) {
    errors.correo = "Revisa el correo: parece incompleto.";
  }

  return errors;
}
