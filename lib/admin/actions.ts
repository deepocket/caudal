"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import {
  endSession,
  isAdminConfigured,
  passwordMatches,
  requireSession,
  startSession,
} from "@/lib/admin/session";
import { clientIp, isRateLimited } from "@/lib/leads/rate-limit";
import { getLeadStore } from "@/lib/leads/store";
import { leadStatuses, notesMaxLength, type LeadPatch, type LeadStatus } from "@/lib/leads/types";
import { cleanText } from "@/lib/leads/validate";

// Anyone can POST to these, so each one checks the session itself and treats
// its arguments as untrusted, like the lead form does.

export type LoginState = { error?: string };

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { error: "El panel no está configurado." };
  }
  if (isRateLimited(`admin:${await clientIp()}`)) {
    return { error: "Demasiados intentos. Espera unos minutos." };
  }
  const password = formData.get("password");
  if (typeof password !== "string" || !passwordMatches(password)) {
    return { error: "Contraseña incorrecta." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export type SaveResult = { ok: true } | { ok: false; error: string };

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function apply(id: unknown, patch: LeadPatch): Promise<SaveResult> {
  if (typeof id !== "string" || !uuid.test(id)) {
    return { ok: false, error: "No encontramos esa solicitud." };
  }
  const store = getLeadStore();
  if (!store) {
    return { ok: false, error: "Conecta Supabase para guardar cambios." };
  }
  try {
    if (!(await store.update(id, patch))) {
      return { ok: false, error: "No encontramos esa solicitud." };
    }
  } catch (error) {
    console.error("[admin] No se pudo guardar el cambio:", error);
    return { ok: false, error: "No se pudo guardar. Inténtalo de nuevo." };
  }
  refresh();
  return { ok: true };
}

export async function setLeadStatus(id: string, estado: LeadStatus): Promise<SaveResult> {
  await requireSession();
  if (!leadStatuses.includes(estado)) {
    return { ok: false, error: "Ese estado no existe." };
  }
  return apply(id, { estado });
}

export async function saveLeadNotes(id: string, notas: string): Promise<SaveResult> {
  await requireSession();
  if (typeof notas !== "string") {
    return { ok: false, error: "No se pudo guardar. Inténtalo de nuevo." };
  }
  return apply(id, { notas: cleanText(notas, notesMaxLength, true) });
}
