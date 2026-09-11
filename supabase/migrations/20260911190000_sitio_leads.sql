-- Solicitudes del formulario de la página (lib/leads), en el proyecto de
-- Supabase artroconfort-logistics. Van en su propio esquema, y la página entra
-- con un usuario que solo puede leer, crear y actualizar esta tabla: si sus
-- credenciales se filtran, el resto de la base queda fuera de su alcance.
-- La contraseña de caudal_sitio se pone aparte (README), nunca en este archivo.

do $$
begin
  if not exists (select from pg_roles where rolname = 'caudal_sitio') then
    create role caudal_sitio login;
  end if;
end
$$;

-- A stuck query can't hold a connection for long.
alter role caudal_sitio set statement_timeout = '5s';

create schema if not exists sitio;

-- Same columns as the Lead type in lib/leads/types.ts.
create table if not exists sitio.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  empresa text not null,
  contacto text not null,
  telefono text not null,
  correo text not null,
  extra text not null default '',
  estado text not null default 'nuevo'
    check (estado in ('nuevo', 'contactado', 'demo', 'cliente', 'perdido')),
  notas text not null default ''
);

create index if not exists leads_created_at_idx on sitio.leads (created_at desc);

-- Only the site's user gets in; no delete, and nothing for the Data API keys.
revoke all on schema sitio from public;
revoke all on table sitio.leads from public, anon, authenticated;
grant usage on schema sitio to caudal_sitio;
grant select, insert, update on table sitio.leads to caudal_sitio;

alter table sitio.leads enable row level security;
drop policy if exists "caudal_sitio administra las solicitudes" on sitio.leads;
create policy "caudal_sitio administra las solicitudes" on sitio.leads
  for all to caudal_sitio using (true) with check (true);
