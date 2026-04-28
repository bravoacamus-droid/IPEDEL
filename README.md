# IPEDEL Perú — Plataforma web

Plataforma corporativa + panel administrativo para **IPE DEL PERÚ S.A.C.** (RUC 20197900378), agente de carga internacional con sede en Lima.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript** + **Tailwind CSS v4**
- **Supabase** (PostgreSQL 17 + Auth + RLS)
- **Nodemailer** sobre SMTP del hosting Stellar / Namecheap cPanel
- **next-intl-style i18n** (built-in) con dictionaries `es` / `en`
- Despliegue objetivo: **Vercel**

## Ejecutar en local

```bash
npm install --legacy-peer-deps
cp .env.example .env.local           # llenar credenciales
npm run dev                          # http://localhost:3000
```

> El flag `--legacy-peer-deps` es necesario porque `react-simple-maps@3` aún declara React 18 como peer; en la práctica funciona con React 19.

## Variables de entorno

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Llave pública (RLS aplica). |
| `SUPABASE_SERVICE_ROLE_KEY` | Llave service role (server-only, bypassa RLS). |
| `SUPABASE_ACCESS_TOKEN` | Personal access token — solo para `scripts/apply-migrations.mjs`. |
| `SUPABASE_PROJECT_REF` | Referencia del proyecto (`ittwoqrnzvkegeslkymc`). |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Credenciales SMTP del cPanel Stellar. |
| `SMTP_FROM` | Remitente para los correos transaccionales. |
| `RECLAMOS_NOTIFY_TO` / `CONTACTO_NOTIFY_TO` | Destino interno de notificaciones. |
| `NEXT_PUBLIC_SITE_URL` | URL pública (Vercel la inyecta automáticamente al deploy). |

> **Nota de seguridad:** la `service_role` key y el access token jamás deben commitearse. `.env.local` está en `.gitignore`.

## Scripts útiles

- `node scripts/apply-migrations.mjs` — aplica `supabase/migrations/*.sql` vía Supabase Management API.
- `node scripts/create-users.mjs` — crea / actualiza el admin y operador iniciales.

## Estructura

```
app/
  [locale]/                 # sitio público bilingüe (es | en)
    page.tsx                # home
    nosotros/
    servicios/
      [slug]/               # subservicios
    tracking/               # consulta por HBL
    tarifario/              # tarifario VUCE
    agentes/                # red de agentes
    contacto/               # formulario
    libro-de-reclamaciones/ # libro INDECOPI
    politica-de-privacidad/
    terminos-condiciones/
    politica-cookies/
  admin/
    login/                  # acceso público
    logout/
    (panel)/                # route group con sidebar y guard
      page.tsx              # dashboard
      embarques/
      reclamaciones/
      mensajes/
      tarifario/
      agentes/
      contenido/
      configuracion/
components/
  public/                   # Navbar, Footer, formularios
lib/
  supabase/                 # client, server, admin, proxy helper
  i18n/                     # config + dictionaries
  email/mail.ts             # nodemailer wrapper
  types/database.ts         # tipos manuales alineados al schema
  utils.ts
proxy.ts                    # auth admin + locale routing (ex middleware.ts)
supabase/migrations/        # SQL declarativo + seeds
scripts/                    # tooling (migrate, create users)
```

## Autenticación

- **Login admin:** `/admin/login` — usa Supabase Auth con email + password.
- **Roles:** `admin` y `operator` se asignan vía la tabla `profiles` (auto-creada por trigger).
- **Cookies:** manejadas por `@supabase/ssr` y refrescadas en `proxy.ts` en cada request.

Cuentas iniciales (cambiar contraseña antes de producción):

| Rol | Email | Password |
|-----|-------|----------|
| Administrador | `admin@ipedelperu.com` | `Ipedel.Admin2026!` |
| Operador | `operador@ipedelperu.com` | `Ipedel.Operador2026!` |

## Cumplimiento normativo (resumen)

- **Ley 29571 + DS 011-2011-PCM** — libro de reclamaciones digital con número correlativo, plazo 30 días.
- **DS 010-2011-MTC** — tarifario VUCE publicado y editable desde admin.
- **Ley 29733** — política de privacidad, consentimiento explícito en formularios, derechos ARCO.
- **Código de Consumo Art. 2** — RUC, razón social, dirección y contacto en footer.

## Despliegue

```bash
# Recomendado: Vercel
npx vercel link
npx vercel env pull
npx vercel deploy --prod
```

Configurar las mismas variables de entorno en el dashboard de Vercel. El proyecto Supabase ya está provisionado (ref `ittwoqrnzvkegeslkymc`).

## Roadmap por sprints

- **Sprint 1 ✓** — schema Supabase, auth admin, sitio público funcional, paleta verde, ES/EN base.
- **Sprint 2** — CRUD completo de embarques + edición inline del tarifario.
- **Sprint 3** — generación de PDF de reclamaciones + envío SMTP.
- **Sprint 4** — mapa interactivo de agentes (`react-simple-maps`).
- **Sprint 5** — CMS inline para `site_content`, traducción EN completa.
- **Sprint 6** — SEO, imágenes IA finales, dominio en Vercel.

---
© IPE del Perú SAC · Todos los derechos reservados.
