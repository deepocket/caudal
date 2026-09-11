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
