-- Cambios solicitados por el cliente (PDF de observaciones, 28 abr 2026):
--   · Agenciamiento aduanero: precio "0.8% CIF" (en lugar de "0.008 × CIF")
--   · Transporte: precio "$0.85 x KG", unidad de cobro "mín $250"

update public.tarifario
   set precio = '0.8% CIF',
       updated_at = now()
 where modalidad = 'aereo' and denominacion = 'Agenciamiento aduanero';

update public.tarifario
   set precio = '$0.85 x KG',
       unidad_cobro = 'mín $250',
       updated_at = now()
 where modalidad = 'aereo' and denominacion = 'Transporte';

-- Agregar prefijo $ a las tarifas con precio numérico simple en USD para
-- mantener consistencia visual ahora que la columna en el front ya no
-- añade el "$" automáticamente.
update public.tarifario
   set precio = '$' || precio,
       updated_at = now()
 where moneda = 'DOLARES'
   and precio ~ '^[0-9.]+$';
