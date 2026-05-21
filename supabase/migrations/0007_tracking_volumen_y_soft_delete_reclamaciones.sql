-- 0007 — Observaciones del supervisor (PDF mayo 2026):
--   1. Reemplazo de "Transportista" / "Contenedores" por VOLUMEN (CBM)
--      en el formulario de embarques. Se agrega columna `volumen_cbm`
--      con 2 decimales. Las columnas `carrier` y `containers` se
--      mantienen en DB por compatibilidad de datos antiguos pero ya
--      no se usan en UI.
--   2. Soft-delete de reclamaciones. Se agrega `deleted_at` para
--      ocultar reclamaciones cerradas del panel sin perder la data
--      (Indecopi exige conservar 2 años los reclamos — Art. 12 del
--      DS 011-2011-PCM).

alter table public.shipments
  add column if not exists volumen_cbm numeric(10, 2);

alter table public.reclamaciones
  add column if not exists deleted_at timestamptz null;

-- Índice para filtrar rápidamente reclamaciones activas
create index if not exists reclamaciones_active_idx
  on public.reclamaciones (created_at desc)
  where deleted_at is null;
