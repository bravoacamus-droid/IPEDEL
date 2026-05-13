-- Reemplaza el seed inicial de agentes por los 6 socios reales que IPE del Perú
-- mantiene con Nippon Express alrededor del mundo (fuente: AGENTES.pdf del cliente).

delete from public.agents;

insert into public.agents (name, country, city, lat, lng, website, services, is_active, display_order) values
  (
    'Nippon Express',
    'Japón',
    'Tokyo',
    35.6762, 139.6503,
    'https://www.nipponexpress.com/location/japan/',
    '{}',
    true,
    10
  ),
  (
    'Nippon Express USA',
    'Estados Unidos',
    'Wood Dale',
    41.9636, -87.9786,
    'https://www.nipponexpress.com/location/north-and-latin-america/united-states/',
    '{}',
    true,
    20
  ),
  (
    'Nippon Express Belgium',
    'Bélgica',
    'Machelen',
    50.9061, 4.4486,
    'https://www.nipponexpress.com/location/emea/belgium/',
    '{}',
    true,
    30
  ),
  (
    'Nippon Express Bangladesh',
    'Bangladesh',
    'Dhaka',
    23.8103, 90.4125,
    'https://www.nipponexpress.com/location/southasia-oceania/bangladesh/',
    '{}',
    true,
    40
  ),
  (
    'Nippon Express Philippines',
    'Filipinas',
    'Taguig',
    14.5176, 121.0509,
    'https://www.nipponexpress.com/location/southasia-oceania/philippines/',
    '{}',
    true,
    50
  ),
  (
    'Nippon Express de Mexico',
    'México',
    'Ciudad de México',
    19.4326, -99.1332,
    'https://www.nipponexpress.com/location/north-and-latin-america/mexico/',
    '{}',
    true,
    60
  );
