-- 0009 — Remover sistema de auditoría y soft-delete de reclamaciones
-- Cliente solicitó eliminar ambas funcionalidades del panel admin.
-- Las reclamaciones quedan inmodificables/inborrables desde la UI
-- (cumple obligación legal Indecopi 2 años naturalmente).

drop table if exists public.audit_log cascade;

-- Soft-delete de reclamaciones ya no se usa (no hay forma de
-- archivarlas desde la UI). Se conserva la columna deleted_at por
-- compatibilidad con datos antiguos pero queda sin uso.
-- Nota: NO se borra la columna por si hay reclamaciones antiguas
-- marcadas como deleted que el cliente quiera recuperar manualmente
-- via Supabase Studio.
