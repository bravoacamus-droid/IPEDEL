-- 0008 — Audit log
-- Tabla de auditoría para registrar todas las acciones del personal
-- en el panel admin: creaciones, ediciones, eliminaciones, cambios
-- de rol/contraseña, etc. Permite trazabilidad ante incidentes y
-- cumplimiento de fiscalización.

create table if not exists public.audit_log (
  id            uuid         primary key default gen_random_uuid(),
  actor_id      uuid         references auth.users (id) on delete set null,
  actor_email   text         not null,
  actor_name    text,
  actor_role    text,
  action        text         not null,
  entity_type   text         not null,
  entity_id     text,
  entity_label  text,
  changes       jsonb,
  ip_address    text,
  created_at    timestamptz  not null default now()
);

create index if not exists audit_log_created_at_idx
  on public.audit_log (created_at desc);
create index if not exists audit_log_entity_idx
  on public.audit_log (entity_type, entity_id);
create index if not exists audit_log_actor_idx
  on public.audit_log (actor_id);

-- Solo el rol service_role (creAdminClient) puede leer/escribir esta
-- tabla. Las páginas admin la consultan vía el admin client.
alter table public.audit_log enable row level security;

create policy audit_log_no_anon_select
  on public.audit_log
  for select
  to authenticated
  using (false);
