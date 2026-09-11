import "server-only";

import type { Lead, LeadPatch, LeadValues } from "@/lib/leads/types";
import { fileLeadStore } from "@/lib/leads/store/file";
import { supabaseLeadStore } from "@/lib/leads/store/supabase";

export type LeadStoreKind = "supabase" | "file";

/** Where leads live. Both stores return the same rows, so callers never branch on it. */
export type LeadStore = {
  kind: LeadStoreKind;
  /** Newest first. */
  list(): Promise<Lead[]>;
  create(values: LeadValues): Promise<Lead>;
  /** Null when no lead has that id. */
  update(id: string, patch: LeadPatch): Promise<Lead | null>;
};

let supabase: LeadStore | undefined;

/**
 * Supabase when LEADS_DATABASE_URL is set. Otherwise a JSON file on this
 * machine: Vercel's filesystem is read-only, so there it's null and the form
 * delivers leads by email only.
 */
export function getLeadStore(): LeadStore | null {
  const url = process.env.LEADS_DATABASE_URL;
  if (url) return (supabase ??= supabaseLeadStore(url));
  if (!process.env.VERCEL) return fileLeadStore;
  return null;
}
