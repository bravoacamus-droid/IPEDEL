-- El cliente solicito el copy textual del parrafo "Quienes somos" en
-- el PDF de correcciones. La pagina nosotros lee primero site_content
-- (CMS) y solo cae al fallback del codigo si esta vacio, asi que el
-- valor sembrado en 0002_seed_data.sql estaba ganando sobre el copy
-- nuevo. Lo sincronizamos aqui.

update public.site_content
   set value = 'IPE del Perú SAC es un agente de carga con más de 30 años de experiencia en logística internacional, representante de transnacionales japonesas, con una red de agentes en más de 40 países.',
       updated_at = now()
 where key = 'nosotros_body' and locale = 'es';

update public.site_content
   set value = 'IPE del Perú SAC is a freight forwarder with over 30 years of experience in international logistics, representative of Japanese multinationals, with a network of agents in more than 40 countries.',
       updated_at = now()
 where key = 'nosotros_body' and locale = 'en';
