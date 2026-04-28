-- ============================================================
-- IPEDEL Peru — schema inicial
-- ============================================================

-- ============================================================
-- Roles + profiles
-- ============================================================
create type public.user_role as enum ('admin', 'operator');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'operator',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'operator')
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','operator')
  );
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- shipments + events
-- ============================================================
create type public.shipment_mode as enum ('aereo','maritimo','terrestre');
create type public.shipment_status as enum (
  'recibido','en_transito','en_aduana','desconsolidado',
  'en_almacen','en_despacho','en_camino_entrega','entregado'
);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  hbl_number text unique not null,
  mbl_number text,
  description text,
  origin text,
  destination text,
  carrier text,
  mode public.shipment_mode not null default 'aereo',
  status public.shipment_status not null default 'recibido',
  eta date,
  etd date,
  client_name text,
  weight_kg numeric,
  containers text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index shipments_hbl_idx on public.shipments(hbl_number);
create index shipments_status_idx on public.shipments(status);
create index shipments_created_idx on public.shipments(created_at desc);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger shipments_touch before update on public.shipments
  for each row execute function public.touch_updated_at();

create table public.shipment_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  event_date timestamptz not null default now(),
  location text,
  status_label text not null,
  description text,
  is_current boolean default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index shipment_events_shipment_idx on public.shipment_events(shipment_id, event_date desc);

-- ============================================================
-- agents
-- ============================================================
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  city text,
  lat numeric,
  lng numeric,
  contact_email text,
  contact_phone text,
  website text,
  services text[] default '{}',
  is_active boolean default true,
  display_order int default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- reclamaciones
-- ============================================================
create type public.reclamacion_tipo as enum ('reclamo','queja');
create type public.reclamacion_estado as enum ('pendiente','atendido','cerrado');

create table public.reclamaciones (
  id uuid primary key default gen_random_uuid(),
  numero_correlativo serial unique,
  fecha timestamptz not null default now(),
  tipo public.reclamacion_tipo not null,
  nombres text not null,
  apellidos text not null,
  tipo_documento text default 'DNI',
  numero_documento text not null,
  direccion text,
  email text not null,
  telefono text,
  es_menor_edad boolean default false,
  representante_nombre text,
  representante_documento text,
  bien_servicio text not null,
  monto_reclamado numeric,
  detalle text not null,
  pedido_consumidor text not null,
  respuesta_empresa text,
  fecha_respuesta timestamptz,
  responded_by uuid references auth.users(id) on delete set null,
  estado public.reclamacion_estado not null default 'pendiente',
  pdf_path text,
  ip_address text,
  created_at timestamptz not null default now()
);

create index reclamaciones_estado_idx on public.reclamaciones(estado);
create index reclamaciones_fecha_idx on public.reclamaciones(fecha desc);

-- ============================================================
-- contacts
-- ============================================================
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  empresa text,
  email text not null,
  telefono text,
  asunto text,
  mensaje text not null,
  is_read boolean default false,
  responded_at timestamptz,
  responded_by uuid references auth.users(id) on delete set null,
  ip_address text,
  created_at timestamptz not null default now()
);

create index contacts_unread_idx on public.contacts(created_at desc) where is_read = false;

-- ============================================================
-- tarifario
-- ============================================================
create type public.tarifa_modalidad as enum ('aereo','maritimo');
create type public.tarifa_moneda as enum ('DOLARES','SOLES');

create table public.tarifario (
  id uuid primary key default gen_random_uuid(),
  modalidad public.tarifa_modalidad not null,
  tipo_operacion text default 'INGRESO',
  tipo_envio text default 'IMPORTACION',
  doc_transporte text,
  denominacion text not null,
  precio text not null,
  moneda public.tarifa_moneda not null default 'DOLARES',
  unidad_cobro text,
  notas text,
  orden int default 0,
  is_active boolean default true,
  updated_at timestamptz not null default now()
);

create index tarifario_modalidad_idx on public.tarifario(modalidad, orden);

create trigger tarifario_touch before update on public.tarifario
  for each row execute function public.touch_updated_at();

-- ============================================================
-- site_content (CMS)
-- ============================================================
create table public.site_content (
  key text not null,
  locale text not null check (locale in ('es','en')),
  value text not null,
  section text,
  updated_at timestamptz not null default now(),
  primary key (key, locale)
);

create trigger site_content_touch before update on public.site_content
  for each row execute function public.touch_updated_at();

-- ============================================================
-- RLS
-- ============================================================
alter table public.profiles enable row level security;
alter table public.shipments enable row level security;
alter table public.shipment_events enable row level security;
alter table public.agents enable row level security;
alter table public.reclamaciones enable row level security;
alter table public.contacts enable row level security;
alter table public.tarifario enable row level security;
alter table public.site_content enable row level security;

-- profiles
create policy profiles_self_read on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy profiles_admin_write on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- shipments (públic read by HBL)
create policy shipments_public_read on public.shipments
  for select using (true);
create policy shipments_staff_write on public.shipments
  for all using (public.is_staff()) with check (public.is_staff());

-- shipment_events
create policy events_public_read on public.shipment_events
  for select using (true);
create policy events_staff_write on public.shipment_events
  for all using (public.is_staff()) with check (public.is_staff());

-- agents
create policy agents_public_read on public.agents
  for select using (is_active = true or public.is_staff());
create policy agents_staff_write on public.agents
  for all using (public.is_staff()) with check (public.is_staff());

-- reclamaciones
create policy reclamaciones_public_insert on public.reclamaciones
  for insert with check (true);
create policy reclamaciones_staff_read on public.reclamaciones
  for select using (public.is_staff());
create policy reclamaciones_staff_update on public.reclamaciones
  for update using (public.is_staff()) with check (public.is_staff());

-- contacts
create policy contacts_public_insert on public.contacts
  for insert with check (true);
create policy contacts_staff_read on public.contacts
  for select using (public.is_staff());
create policy contacts_staff_update on public.contacts
  for update using (public.is_staff()) with check (public.is_staff());

-- tarifario
create policy tarifario_public_read on public.tarifario
  for select using (is_active = true or public.is_staff());
create policy tarifario_staff_write on public.tarifario
  for all using (public.is_staff()) with check (public.is_staff());

-- site_content
create policy site_content_public_read on public.site_content
  for select using (true);
create policy site_content_staff_write on public.site_content
  for all using (public.is_staff()) with check (public.is_staff());
