import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LeadStore } from "@/lib/leads/store";
import type { Lead } from "@/lib/leads/types";

// Stand-in for Supabase on your own machine. Leads carry names, phones and
// emails, so the folder is gitignored: this repo is public.
const dir = path.join(process.cwd(), ".data");
const file = path.join(dir, "leads.json");

async function read(): Promise<Lead[]> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as Lead[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function write(leads: Lead[]) {
  await mkdir(dir, { recursive: true });
  // Write aside, then swap, so a crash mid-write never leaves half a file.
  const temp = `${file}.tmp`;
  await writeFile(temp, `${JSON.stringify(leads, null, 2)}\n`);
  await rename(temp, file);
}

// One change at a time, so two quick saves can't overwrite each other.
let queue: Promise<unknown> = Promise.resolve();
function serialized<T>(task: () => Promise<T>) {
  const run = queue.then(task);
  queue = run.catch(() => undefined);
  return run;
}

export const fileLeadStore: LeadStore = {
  kind: "file",

  async list() {
    const leads = await read();
    return leads.sort((a, b) => b.created_at.localeCompare(a.created_at));
  },

  create(values) {
    return serialized(async () => {
      const now = new Date().toISOString();
      const lead: Lead = {
        id: randomUUID(),
        created_at: now,
        updated_at: now,
        ...values,
        estado: "nuevo",
        notas: "",
      };
      await write([...(await read()), lead]);
      return lead;
    });
  },

  update(id, patch) {
    return serialized(async () => {
      const leads = await read();
      const index = leads.findIndex((lead) => lead.id === id);
      if (index === -1) return null;
      const lead = { ...leads[index], ...patch, updated_at: new Date().toISOString() };
      leads[index] = lead;
      await write(leads);
      return lead;
    });
  },
};
