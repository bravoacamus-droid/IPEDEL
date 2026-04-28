-- ============================================================
-- IPEDEL Peru — seed data
-- ============================================================

-- Tarifario VUCE — extraído del blueprint del cliente
insert into public.tarifario (modalidad, doc_transporte, denominacion, precio, moneda, unidad_cobro, orden) values
  ('aereo','AWB','Handling','250','DOLARES','/ AWB',10),
  ('aereo','AWB','Agenciamiento aduanero','0.008 × CIF','DOLARES','mín $300',20),
  ('aereo','AWB','Gasto operativo','100','DOLARES','/ AWB',30),
  ('aereo','AWB','Gasto administrativo','100','DOLARES','/ AWB',40),
  ('aereo','AWB','Transporte','0.85','DOLARES','× kg (mín $250)',50),
  ('maritimo','BL','Handling','270','DOLARES','/ BL',10),
  ('maritimo','BL','Endose F/V','300','DOLARES','/ BL',20),
  ('maritimo','BL','Desconsolidación','290','DOLARES','/ BL',30),
  ('maritimo','BL','Descarga','200','DOLARES','/ BL',40),
  ('maritimo','BL','THC (Terminal Handling Charge)','240','DOLARES','/ BL',50),
  ('maritimo','BL','THD','260','DOLARES','/ BL',60),
  ('maritimo','BL','Trámite documentario','170','DOLARES','/ BL',70),
  ('maritimo','BL','Transmisión electrónica','300','DOLARES','/ BL',80),
  ('maritimo','BL','Gastos administrativos','120','DOLARES','/ BL',90),
  ('maritimo','BL','Visto Bueno','420','DOLARES','/ BL',100);

-- Agentes internacionales (datos representativos editables desde admin)
insert into public.agents (name, country, city, lat, lng, contact_email, contact_phone, services, display_order) values
  ('Tokyo Logistics Partners','Japón','Tokyo',35.6762,139.6503,'tokyo@partner.example','+81 3-0000-0000','{aereo,maritimo}',10),
  ('Shanghai Freight Co.','China','Shanghai',31.2304,121.4737,'shanghai@partner.example','+86 21-0000-0000','{maritimo,fcl,lcl}',20),
  ('Miami Cargo Services','Estados Unidos','Miami',25.7617,-80.1918,'miami@partner.example','+1 305-000-0000','{aereo,maritimo}',30),
  ('Hamburg Sea Lines','Alemania','Hamburgo',53.5511,9.9937,'hamburg@partner.example','+49 40-0000000','{maritimo}',40),
  ('Santos Brasil Logística','Brasil','Santos',-23.9608,-46.3331,'santos@partner.example','+55 13-0000-0000','{maritimo,terrestre}',50),
  ('Buenos Aires Trade','Argentina','Buenos Aires',-34.6037,-58.3816,'baires@partner.example','+54 11-0000-0000','{aereo,maritimo,terrestre}',60);

-- Embarques de ejemplo (HBL de prueba)
with s1 as (
  insert into public.shipments (hbl_number, description, origin, destination, carrier, mode, status, eta, client_name, weight_kg)
  values ('IPE-AIR-2026-0001','Repuestos automotrices','Tokyo, Japón','Lima, Perú','ANA Cargo','aereo','en_transito','2026-05-12','Cliente Demo SAC',840)
  returning id
)
insert into public.shipment_events (shipment_id, event_date, location, status_label, description, is_current)
select id, e.event_date, e.location, e.status_label, e.description, e.is_current from s1, (values
  (now() - interval '5 days','Tokyo, Japón','Recibido en origen','Carga recibida en bodega del agente',false),
  (now() - interval '4 days','Tokyo Narita (NRT)','Cargado en vuelo','Embarcado en vuelo NH-001',false),
  (now() - interval '2 days','En tránsito','En tránsito aéreo','Vuelo en ruta hacia Lima',true)
) as e(event_date,location,status_label,description,is_current);

with s2 as (
  insert into public.shipments (hbl_number, description, origin, destination, carrier, mode, status, eta, client_name, containers)
  values ('IPE-SEA-2026-0042','Maquinaria industrial','Shanghai, China','Callao, Perú','MSC','maritimo','en_aduana','2026-04-30','Importadora del Sur SAC','1x40HC')
  returning id
)
insert into public.shipment_events (shipment_id, event_date, location, status_label, description, is_current)
select id, e.event_date, e.location, e.status_label, e.description, e.is_current from s2, (values
  (now() - interval '30 days','Shanghai, China','Recibido en puerto','Contenedor recibido',false),
  (now() - interval '28 days','Shanghai (CNSHA)','Zarpe','Embarcado en MSC ARIES',false),
  (now() - interval '4 days','Callao, Perú','Arribo a puerto','Buque amarrado en muelle',false),
  (now() - interval '1 day','Callao, Perú','En aduana','Inspección documentaria SUNAT',true)
) as e(event_date,location,status_label,description,is_current);

-- Site content (textos editables desde admin)
insert into public.site_content (key, locale, value, section) values
  ('home_hero_title','es','Confianza logística que cruza fronteras','home'),
  ('home_hero_title','en','Logistics trust that crosses borders','home'),
  ('home_hero_subtitle','es','Más de 30 años conectando al Perú con el mundo. Agente de carga internacional especializado en representaciones japonesas y red de socios en más de 40 países.','home'),
  ('home_hero_subtitle','en','Over 30 years connecting Peru with the world. International freight forwarder specialized in Japanese trade representation and a partner network across 40+ countries.','home'),
  ('home_hero_cta','es','Rastrear embarque','home'),
  ('home_hero_cta','en','Track shipment','home'),
  ('home_stats_countries','es','40+','home'),
  ('home_stats_countries','en','40+','home'),
  ('home_stats_countries_label','es','Países en nuestra red','home'),
  ('home_stats_countries_label','en','Countries in our network','home'),
  ('home_stats_years','es','30+','home'),
  ('home_stats_years','en','30+','home'),
  ('home_stats_years_label','es','Años de experiencia','home'),
  ('home_stats_years_label','en','Years of experience','home'),
  ('nosotros_title','es','Sobre nosotros','nosotros'),
  ('nosotros_title','en','About us','nosotros'),
  ('nosotros_body','es','IPE del Perú SAC es una agencia de carga internacional con más de tres décadas de experiencia, especializada en la representación de transnacionales japonesas y servicios de logística integrales para importadores y exportadores peruanos.','nosotros'),
  ('nosotros_body','en','IPE del Perú SAC is an international freight forwarder with over three decades of experience, specialized in Japanese trade representation and end-to-end logistics services for Peruvian importers and exporters.','nosotros');
