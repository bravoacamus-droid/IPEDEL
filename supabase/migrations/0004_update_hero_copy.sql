-- Mejor copy para el hero — más alineado a la marca y servicios reales.
update public.site_content
   set value = 'Consolidador aéreo y marítimo con más de 30 años conectando al Perú con el mundo. Representantes oficiales de transnacionales japonesas y red de socios estratégicos en más de 40 países.',
       updated_at = now()
 where key = 'home_hero_subtitle' and locale = 'es';

update public.site_content
   set value = 'Air and maritime consolidator with over 30 years connecting Peru with the world. Official representatives of Japanese multinationals and a strategic partner network in more than 40 countries.',
       updated_at = now()
 where key = 'home_hero_subtitle' and locale = 'en';

-- Stats labels para la home
insert into public.site_content (key, locale, value, section) values
  ('home_stats_years_label', 'es', 'Años de experiencia', 'home'),
  ('home_stats_years_label', 'en', 'Years of experience', 'home'),
  ('home_stats_countries_label', 'es', 'Países en nuestra red', 'home'),
  ('home_stats_countries_label', 'en', 'Countries in our network', 'home')
on conflict (key, locale) do update set value = excluded.value, updated_at = now();
