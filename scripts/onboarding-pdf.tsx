/**
 * Genera el PDF de onboarding "Plataforma IPE del Peru v2.0" en la
 * raiz del proyecto (c:/Users/LUIGI/Desktop/web IPEDEL/).
 *
 * Uso:
 *   npx tsx scripts/onboarding-pdf.tsx
 */
import { writeFile } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import path from "node:path";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  renderToBuffer,
  Font,
} from "@react-pdf/renderer";

const BRAND = "#96C600";
const BRAND_DARK = "#7CA300";
const INK_900 = "#0A0A0A";
const INK_700 = "#3F3F3F";
const INK_500 = "#737373";
const INK_300 = "#D4D4D4";
const INK_100 = "#F5F5F5";

const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: INK_700,
    lineHeight: 1.45,
  },
  // --- Cover ---
  coverPage: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: INK_900,
    color: "white",
    fontFamily: "Helvetica",
  },
  coverInner: {
    flex: 1,
    paddingHorizontal: 50,
    paddingVertical: 60,
    justifyContent: "space-between",
  },
  coverHeader: { flexDirection: "row", alignItems: "center" },
  coverLogo: { width: 110, height: 26 },
  coverEyebrow: {
    fontSize: 9,
    color: BRAND,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },
  coverTitle: {
    fontSize: 34,
    fontFamily: "Helvetica-Bold",
    color: "white",
    lineHeight: 1.05,
    marginTop: 8,
  },
  coverSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    marginTop: 14,
    lineHeight: 1.4,
    maxWidth: 380,
  },
  coverGreenBar: {
    width: 60,
    height: 4,
    backgroundColor: BRAND,
    marginTop: 18,
  },
  coverFooter: {
    fontSize: 9,
    color: "rgba(255,255,255,0.5)",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // --- Content pages ---
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    marginBottom: 18,
    borderBottom: `1pt solid ${INK_100}`,
  },
  pageHeaderLogo: { width: 70, height: 17 },
  pageHeaderRight: {
    marginLeft: "auto",
    fontSize: 8,
    color: INK_500,
    textAlign: "right",
  },
  sectionEyebrow: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: BRAND_DARK,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  h1: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: INK_900,
    marginTop: 4,
  },
  h2: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: INK_900,
    marginTop: 18,
  },
  h3: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: INK_900,
    marginTop: 10,
  },
  p: {
    fontSize: 10,
    color: INK_700,
    marginTop: 6,
    lineHeight: 1.5,
  },
  small: {
    fontSize: 9,
    color: INK_500,
  },
  // Access card
  accessCard: {
    marginTop: 14,
    padding: 14,
    border: `1pt solid ${INK_100}`,
    borderLeft: `4pt solid ${BRAND}`,
    backgroundColor: "#FAFAFA",
    borderRadius: 4,
  },
  accessCardTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: INK_900,
  },
  accessRow: { flexDirection: "row", marginTop: 6 },
  accessLabel: {
    width: 90,
    fontSize: 9,
    color: INK_500,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  accessValue: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: INK_900,
  },
  accessValueMono: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Courier-Bold",
    color: INK_900,
  },
  note: {
    marginTop: 10,
    fontSize: 8.5,
    color: INK_500,
    fontStyle: "italic",
  },
  // Feature blocks
  featureRow: { marginTop: 12 },
  featureTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bullet: {
    flexDirection: "row",
    marginTop: 4,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 8,
    fontSize: 10,
    color: BRAND_DARK,
    fontFamily: "Helvetica-Bold",
  },
  bulletText: { flex: 1, fontSize: 9.5, color: INK_700 },
  // Tag/chip
  chip: {
    backgroundColor: BRAND,
    color: INK_900,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Footer
  pageFooter: {
    position: "absolute",
    left: 50,
    right: 50,
    bottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: INK_500,
    paddingTop: 6,
    borderTop: `1pt solid ${INK_100}`,
  },
});

function fmtDateEs(d: Date) {
  return d.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function loadLogo(filename: string): Promise<Buffer | null> {
  try {
    const p = path.join(process.cwd(), "public", filename);
    return await readFile(p);
  } catch {
    return null;
  }
}

function Cover({ logoWhite }: { logoWhite: Buffer | null }) {
  return (
    <Page size="A4" style={styles.coverPage}>
      <View style={styles.coverInner}>
        <View>
          <View style={styles.coverHeader}>
            {logoWhite && (
              <Image
                src={logoWhite}
                style={styles.coverLogo}
              />
            )}
          </View>
          <View style={{ marginTop: 110 }}>
            <Text style={styles.coverEyebrow}>Plataforma web · v2.0</Text>
            <Text style={styles.coverTitle}>
              Guía de acceso y novedades
            </Text>
            <View style={styles.coverGreenBar} />
            <Text style={styles.coverSubtitle}>
              Manual de bienvenida al nuevo panel administrativo, accesos a
              correo corporativo y resumen de todas las mejoras
              incorporadas en la versión 2.0.
            </Text>
          </View>
        </View>
        <View style={styles.coverFooter}>
          <Text>IPE del Perú SAC · RUC 20197900378</Text>
          <Text>{fmtDateEs(new Date())}</Text>
        </View>
      </View>
    </Page>
  );
}

function PageHeader({ logoColor }: { logoColor: Buffer | null }) {
  return (
    <View style={styles.pageHeader} fixed>
      {logoColor && <Image src={logoColor} style={styles.pageHeaderLogo} />}
      <Text style={styles.pageHeaderRight}>
        Plataforma IPE del Perú · v2.0
      </Text>
    </View>
  );
}

function PageFooter() {
  return (
    <View style={styles.pageFooter} fixed>
      <Text>IPE del Perú SAC · RUC 20197900378 · ipeperu.com</Text>
      <Text
        render={({ pageNumber, totalPages }) =>
          `${pageNumber} / ${totalPages}`
        }
      />
    </View>
  );
}

function AccessCard({
  title,
  rows,
  note,
}: {
  title: string;
  rows: { label: string; value: string; mono?: boolean }[];
  note?: string;
}) {
  return (
    <View style={styles.accessCard}>
      <Text style={styles.accessCardTitle}>{title}</Text>
      {rows.map((r) => (
        <View key={r.label} style={styles.accessRow}>
          <Text style={styles.accessLabel}>{r.label}</Text>
          <Text style={r.mono ? styles.accessValueMono : styles.accessValue}>
            {r.value}
          </Text>
        </View>
      ))}
      {note && <Text style={styles.note}>{note}</Text>}
    </View>
  );
}

function Feature({
  number,
  title,
  bullets,
}: {
  number: string;
  title: string;
  bullets: string[];
}) {
  return (
    <View style={styles.featureRow} wrap={false}>
      <View style={styles.featureTitle}>
        <Text style={styles.chip}>{number}</Text>
        <Text style={{ ...styles.h3, marginTop: 0 }}>{title}</Text>
      </View>
      {bullets.map((b, i) => (
        <View key={i} style={styles.bullet}>
          <Text style={styles.bulletDot}>›</Text>
          <Text style={styles.bulletText}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

export function OnboardingDocument({
  logoWhite,
  logoColor,
}: {
  logoWhite: Buffer | null;
  logoColor: Buffer | null;
}) {
  return (
    <Document
      title="Plataforma IPE del Perú v2.0 — Guía de acceso y novedades"
      author="IPE del Perú SAC"
    >
      <Cover logoWhite={logoWhite} />

      {/* ====== PÁGINA 2: ACCESOS ====== */}
      <Page size="A4" style={styles.page}>
        <PageHeader logoColor={logoColor} />

        <Text style={styles.sectionEyebrow}>Capítulo 1</Text>
        <Text style={styles.h1}>Accesos a la plataforma</Text>
        <Text style={styles.p}>
          Estas son las credenciales iniciales para ingresar al panel
          administrativo y al correo corporativo de IPE del Perú. Por
          seguridad, recomendamos cambiar ambas contraseñas en el primer
          ingreso.
        </Text>

        <Text style={styles.h2}>1.1 Panel administrativo</Text>
        <AccessCard
          title="Acceso al panel web"
          rows={[
            { label: "URL", value: "https://ipeperu.com/admin/login" },
            { label: "Usuario", value: "consultas@ipeperu.com" },
            { label: "Contraseña", value: "IpedelAdmin2026!", mono: true },
            { label: "Rol", value: "Administrador (acceso total)" },
          ]}
          note="Desde el panel se puede crear usuarios adicionales (administradores u operadores) sin necesidad de contactar soporte. El cambio de contraseña propia se hace en la sección Mi cuenta."
        />

        <Text style={styles.h2}>1.2 Correo corporativo (Zoho Mail)</Text>
        <AccessCard
          title="Acceso al webmail Zoho"
          rows={[
            { label: "Webmail", value: "https://mail.zoho.com" },
            { label: "Usuario", value: "consultas@ipeperu.com" },
            { label: "Contraseña", value: "Operationzewall1405@", mono: true },
            { label: "Capacidad", value: "5 GB de almacenamiento" },
          ]}
          note="A esta casilla llegan automáticamente todos los mensajes enviados desde el formulario de contacto del sitio y las copias del libro de reclamaciones."
        />

        <Text style={styles.h3}>App móvil Zoho Mail</Text>
        <Text style={styles.p}>
          La app oficial Zoho Mail está disponible gratuitamente en App
          Store (iOS) y Google Play (Android). Permite gestionar el correo
          desde el celular con las mismas credenciales del webmail. Se
          recomienda activar notificaciones push para no perder consultas.
        </Text>
        <View style={styles.bullet}>
          <Text style={styles.bulletDot}>›</Text>
          <Text style={styles.bulletText}>
            iOS — Buscar &quot;Zoho Mail&quot; en App Store
          </Text>
        </View>
        <View style={styles.bullet}>
          <Text style={styles.bulletDot}>›</Text>
          <Text style={styles.bulletText}>
            Android — Buscar &quot;Zoho Mail&quot; en Google Play
          </Text>
        </View>

        <Text style={styles.h2}>1.3 Recuperación de contraseña</Text>
        <Text style={styles.p}>
          El panel cuenta con un flujo completo de recuperación de
          contraseña. Desde la página de login, &quot;¿Olvidaste tu
          clave?&quot; envía un enlace seguro al correo registrado para
          definir una nueva contraseña. El enlace expira en 1 hora y solo
          puede usarse una vez.
        </Text>

        <PageFooter />
      </Page>

      {/* ====== PÁGINA 3-4: NOVEDADES ====== */}
      <Page size="A4" style={styles.page}>
        <PageHeader logoColor={logoColor} />

        <Text style={styles.sectionEyebrow}>Capítulo 2</Text>
        <Text style={styles.h1}>Novedades de la versión 2.0</Text>
        <Text style={styles.p}>
          La plataforma fue actualizada con mejoras profundas en seguridad,
          analítica, trazabilidad y experiencia de uso. Estas son las
          incorporaciones reales que ya están disponibles.
        </Text>

        <Feature
          number="01"
          title="Sistema de roles y permisos (RBAC)"
          bullets={[
            "Dos roles: Administrador (acceso total) y Operador (solo Embarques y Reclamaciones).",
            "El operador no ve Panel, Tarifario, Agentes, Contenido web, Usuarios ni Configuración.",
            "Validación a nivel de servidor: aunque escriba la URL manualmente, el sistema lo redirige.",
            "Política configurada para escalar a más roles si el negocio lo requiere.",
          ]}
        />

        <Feature
          number="02"
          title="Gestión de usuarios directa"
          bullets={[
            "Crear nuevos usuarios desde Usuarios → Nuevo usuario, sin contactar soporte.",
            "Generador automático de contraseñas seguras de 12 caracteres.",
            "Cambiar rol, renombrar y resetear contraseña de cualquier usuario con confirmación.",
            "Eliminación con confirmación tipo escribir-correo-para-confirmar.",
            "Sección Mi cuenta para que cada usuario cambie su propia contraseña.",
          ]}
        />

        <Feature
          number="03"
          title="Dashboard con métricas reales"
          bullets={[
            "4 KPI con contexto: embarques activos (delta vs mes anterior), reclamaciones pendientes con alerta SLA, carga procesada del mes (KG + CBM) y tasa de cumplimiento SLA de 30 días.",
            "Gráfico de embarques creados por mes (últimos 6).",
            "Distribución por modo (aéreo / marítimo / terrestre).",
            "Reclamaciones por mes (últimos 6).",
            "Top 6 destinos y orígenes más frecuentes.",
            "Próximos arribos (ETAs de los próximos 7 días).",
            "Listado de reclamaciones pendientes con badge de días.",
            "Alerta roja automática cuando una reclamación supera el plazo legal de 30 días (Ley 29571 / DS 011-2011-PCM).",
          ]}
        />

        <PageFooter />
      </Page>

      <Page size="A4" style={styles.page}>
        <PageHeader logoColor={logoColor} />

        <Feature
          number="04"
          title="Exportación de datos a Excel y CSV"
          bullets={[
            "Embarques exportable a Excel branded (.xlsx) con logo IPE, colores corporativos, freeze pane y formato profesional listo para enviar.",
            "Embarques y Reclamaciones exportables a CSV plano (compatible con cualquier sistema).",
            "Filtros activos se respetan: estado, rango de fechas, búsqueda — solo se exporta lo que está en pantalla.",
            "Selector de campo de fecha en Embarques: filtrar por fecha de creación, ETD o ETA según necesidad.",
          ]}
        />

        <Feature
          number="05"
          title="Filtros avanzados con rango de fechas"
          bullets={[
            "Embarques: búsqueda por HBL, filtro por estado, rango de fechas configurable.",
            "Reclamaciones: búsqueda por N° / nombre / email, filtro por estado, rango de fechas.",
            "Todos los filtros viajan en la URL: se pueden compartir links con vistas filtradas.",
          ]}
        />

        <Feature
          number="06"
          title="Login y UX mejorados"
          bullets={[
            "Diseño split-screen profesional con branding corporativo.",
            "Toggle de visibilidad de contraseña.",
            "Flujo completo de recuperación de contraseña por correo.",
            "Mensajes neutrales para evitar enumeración de cuentas.",
          ]}
        />

        <Feature
          number="07"
          title="Notificaciones y feedback visual"
          bullets={[
            "Toasts (mensajes flotantes) confirman cada acción: guardado, error.",
            "Modal de confirmación con doble verificación en acciones destructivas.",
            "Badge rojo en el sidebar con el contador de reclamaciones pendientes — visible siempre.",
          ]}
        />

        <Feature
          number="08"
          title="Reclamaciones: registro permanente"
          bullets={[
            "Las reclamaciones NO se pueden eliminar desde el panel (ni administrador ni operador).",
            "Política intencional para cumplir la obligación legal de Indecopi de conservar reclamos por 2 años como mínimo (Art. 12 DS 011-2011-PCM).",
            "Se puede cambiar el estado (pendiente / atendido / cerrado) y registrar respuesta, pero no borrar.",
            "El PDF firmado con HMAC del consumidor queda válido permanentemente.",
          ]}
        />

        <Feature
          number="09"
          title="Correo transaccional con Resend"
          bullets={[
            "Formulario de contacto envía automáticamente a consultas@ipeperu.com.",
            "Libro de reclamaciones envía copia con PDF adjunto al consumidor + notificación interna.",
            "Recuperación de contraseña vía correo profesional desde el dominio ipeperu.com.",
            "Plan free de Resend: 3000 correos/mes (sobra para el volumen operativo).",
          ]}
        />

        <PageFooter />
      </Page>
    </Document>
  );
}

// ----------- runner -----------
async function main() {
  const logoWhite = await loadLogo("logo-horizontal-white.png");
  const logoColor = await loadLogo("logo-horizontal.png");

  const buffer = await renderToBuffer(
    <OnboardingDocument logoWhite={logoWhite} logoColor={logoColor} />,
  );

  const outPath = path.resolve(
    process.cwd(),
    "..",
    "Plataforma IPE del Peru v2.0 - Guia.pdf",
  );
  await writeFile(outPath, buffer);
  console.log("PDF generado:", outPath);
  console.log("Tamaño:", buffer.length, "bytes");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
