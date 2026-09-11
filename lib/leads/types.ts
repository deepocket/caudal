// Shared by the lead form (client) and its Server Action. Kept out of the
// 'use server' module, which may only export async functions.

export type LeadValues = {
  empresa: string;
  contacto: string;
  telefono: string;
  correo: string;
  extra: string;
};

export type LeadField = keyof LeadValues;

export type LeadErrors = Partial<Record<LeadField, string>>;

export type LeadFormState =
  | { status: "idle" }
  | { status: "invalid"; errors: LeadErrors; values: LeadValues }
  | { status: "error"; message: string; values: LeadValues }
  | { status: "success"; contacto: string; correo: string };

export const initialLeadState: LeadFormState = { status: "idle" };

// A saved lead, shaped like its row in Supabase's sitio.leads table
// (supabase/migrations), so either store returns the same object.

export const leadStatuses = ["nuevo", "contactado", "demo", "cliente", "perdido"] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export type Lead = LeadValues & {
  id: string;
  created_at: string;
  updated_at: string;
  estado: LeadStatus;
  notas: string;
};

/** What the admin can change on a lead; the visitor's own answers stay as sent. */
export type LeadPatch = Partial<Pick<Lead, "estado" | "notas">>;

export const notesMaxLength = 5000;
