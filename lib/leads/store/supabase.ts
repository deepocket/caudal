import "server-only";

import postgres from "postgres";
import type { LeadStore } from "@/lib/leads/store";
import type { Lead } from "@/lib/leads/types";

// Supabase's Postgres, reached through its pooler as caudal_sitio: a user that
// can only read, create and update sitio.leads, so the site never holds a key
// to the rest of the database. Schema and grants: supabase/migrations.

type Row = Omit<Lead, "created_at" | "updated_at"> & { created_at: Date; updated_at: Date };

const toLead = (row: Row): Lead => ({
  ...row,
  created_at: row.created_at.toISOString(),
  updated_at: row.updated_at.toISOString(),
});

export function supabaseLeadStore(url: string): LeadStore {
  const sql = postgres(url, {
    ssl: "require",
    // The pooler's transaction mode (port 6543) can't keep prepared statements.
    prepare: false,
    max: 1,
    idle_timeout: 20,
    // Give up early if the database doesn't answer: the email still carries the lead.
    connect_timeout: 10,
  });

  return {
    kind: "supabase",

    async list() {
      const rows = await sql<Row[]>`select * from sitio.leads order by created_at desc`;
      return rows.map(toLead);
    },

    async create({ empresa, contacto, telefono, correo, extra }) {
      const [row] = await sql<Row[]>`
        insert into sitio.leads (empresa, contacto, telefono, correo, extra)
        values (${empresa}, ${contacto}, ${telefono}, ${correo}, ${extra})
        returning *
      `;
      return toLead(row);
    },

    async update(id, patch) {
      const [row] = await sql<Row[]>`
        update sitio.leads set ${sql(patch)}, updated_at = now()
        where id = ${id}
        returning *
      `;
      return row ? toLead(row) : null;
    },
  };
}
