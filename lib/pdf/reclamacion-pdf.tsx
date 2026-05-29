import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { Reclamacion } from "@/lib/types/database";

const BRAND = "#96c600";
const INK_900 = "#0a0a0a";
const INK_500 = "#5e5e5e";
const INK_200 = "#d8d8d8";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: INK_900,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: BRAND,
    paddingBottom: 12,
    marginBottom: 16,
  },
  logoBlock: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 110, height: 26, objectFit: "contain" },
  companyBlock: { textAlign: "right", fontSize: 9, color: INK_500 },
  title: { fontSize: 16, fontWeight: 700, color: INK_900 },
  subtitle: { fontSize: 9, color: INK_500, marginTop: 2 },
  numberBox: {
    backgroundColor: BRAND,
    padding: 8,
    borderRadius: 4,
    color: "#000",
    fontSize: 12,
    fontWeight: 700,
    marginTop: 4,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    fontSize: 9,
    color: INK_500,
  },
  section: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: INK_200,
    borderRadius: 4,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: BRAND,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  row: { flexDirection: "row", marginBottom: 4 },
  fieldLabel: {
    width: 110,
    fontSize: 9,
    color: INK_500,
  },
  fieldValue: { flex: 1, fontSize: 10, color: INK_900 },
  textBlock: { fontSize: 10, color: INK_900, lineHeight: 1.4 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 8,
    fontWeight: 700,
    color: "#000",
    backgroundColor: BRAND,
    marginTop: 2,
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: INK_500,
    borderTopWidth: 1,
    borderTopColor: INK_200,
    paddingTop: 8,
  },
  legal: {
    backgroundColor: "#fff7e0",
    borderColor: "#f0c773",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    fontSize: 9,
    color: "#7a4d00",
    marginTop: 8,
  },
});

// Forzamos timezone Lima — sin esto, el PDF se renderea con la zona del
// host (Vercel/Lambda corren en UTC) y la hora aparece 5h adelantada
// respecto a la hora local que el cliente ve en el panel. Mismo fix que
// aplicamos al export CSV/XLSX de embarques.
function formatDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("es-PE", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReclamacionPDF({
  reclamacion,
  logoSrc,
}: {
  reclamacion: Reclamacion;
  logoSrc?: string | Buffer;
}) {
  const r = reclamacion;
  return (
    <Document
      title={`Reclamación N° ${r.numero_correlativo} — IPE del Perú SAC`}
      author="IPE del Perú SAC"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoBlock}>
            {logoSrc && <Image src={logoSrc} style={styles.logo} />}
          </View>
          <View style={styles.companyBlock}>
            <Text>IPE DEL PERU S.A.C.</Text>
            <Text>RUC 20197900378</Text>
            <Text>Calle el Boulevard 182, of. 901, Surco — Lima 33</Text>
            <Text>+511 304-5520 · consultas@ipeperu.com</Text>
          </View>
        </View>

        <Text style={styles.title}>Hoja del Libro de Reclamaciones</Text>
        <Text style={styles.subtitle}>
          Conforme al Código de Protección y Defensa del Consumidor — Ley 29571
        </Text>
        <Text style={styles.numberBox}>RECLAMACIÓN N° {r.numero_correlativo}</Text>

        <View style={styles.meta}>
          <Text>Fecha de registro: {formatDate(r.fecha)}</Text>
          <Text>Tipo: {r.tipo === "reclamo" ? "Reclamo" : "Queja"}</Text>
          <Text>Estado: {r.estado.toUpperCase()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Datos del consumidor</Text>
          <Field label="Nombres y apellidos" value={`${r.nombres} ${r.apellidos}`} />
          <Field label="Documento" value={`${r.tipo_documento} ${r.numero_documento}`} />
          <Field label="Domicilio" value={r.direccion ?? "—"} />
          {r.ubigeo_distrito_nombre && (
            <Field
              label="Ubicación"
              value={`${r.ubigeo_distrito_nombre}, ${r.ubigeo_provincia_nombre}, ${r.ubigeo_departamento_nombre}`}
            />
          )}
          {r.ubigeo_distrito_id && (
            <Field label="Ubigeo (INEI)" value={r.ubigeo_distrito_id} />
          )}
          <Field label="Email" value={r.email} />
          <Field label="Teléfono" value={r.telefono ?? "—"} />
          {r.es_menor_edad && (
            <>
              <Field label="Es menor de edad" value="Sí" />
              <Field label="Representante" value={r.representante_nombre ?? "—"} />
              <Field label="DNI representante" value={r.representante_documento ?? "—"} />
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Identificación del bien o servicio</Text>
          <Field label="Bien o servicio" value={r.bien_servicio} />
          {r.monto_reclamado != null && (
            <Field label="Monto reclamado" value={`S/ ${r.monto_reclamado}`} />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Detalle del reclamo / queja</Text>
          <Text style={styles.textBlock}>{r.detalle}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Pedido del consumidor</Text>
          <Text style={styles.textBlock}>{r.pedido_consumidor}</Text>
        </View>

        {r.respuesta_empresa && (
          <View style={[styles.section, { borderColor: BRAND }]}>
            <Text style={styles.sectionTitle}>5. Respuesta de la empresa</Text>
            {r.fecha_respuesta && (
              <Text style={styles.subtitle}>Registrada: {formatDate(r.fecha_respuesta)}</Text>
            )}
            <Text style={[styles.textBlock, { marginTop: 4 }]}>{r.respuesta_empresa}</Text>
          </View>
        )}

        <Text style={styles.legal}>
          El proveedor responderá al reclamo en un plazo no mayor de 30 días calendario,
          según la Ley N° 29571 — Código de Protección y Defensa del Consumidor.
        </Text>

        <Text style={styles.footer}>
          IPE DEL PERU S.A.C. · RUC 20197900378 · consultas@ipeperu.com · ipeperu.com
        </Text>
      </Page>
    </Document>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.fieldLabel}>{label}:</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}
