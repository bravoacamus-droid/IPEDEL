-- ============================================================
-- Ubigeo en libro de reclamaciones (Indecopi requirement)
-- 6 columnas: 3 códigos INEI + 3 nombres (denormalizados para PDF/reporte)
-- ============================================================

alter table public.reclamaciones
  add column if not exists ubigeo_departamento_id text,
  add column if not exists ubigeo_departamento_nombre text,
  add column if not exists ubigeo_provincia_id text,
  add column if not exists ubigeo_provincia_nombre text,
  add column if not exists ubigeo_distrito_id text,
  add column if not exists ubigeo_distrito_nombre text;

create index if not exists reclamaciones_ubigeo_idx
  on public.reclamaciones (ubigeo_departamento_id, ubigeo_provincia_id, ubigeo_distrito_id);
