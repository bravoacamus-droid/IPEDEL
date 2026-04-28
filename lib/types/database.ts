// DB types — alineados con supabase/migrations/0001_init_schema.sql
// (regenerar con `supabase gen types typescript` cuando esté disponible)

export type ShipmentMode = "aereo" | "maritimo" | "terrestre";
export type ShipmentStatus =
  | "recibido"
  | "en_transito"
  | "en_aduana"
  | "desconsolidado"
  | "en_almacen"
  | "en_despacho"
  | "en_camino_entrega"
  | "entregado";
export type UserRole = "admin" | "operator";
export type ReclamacionTipo = "reclamo" | "queja";
export type ReclamacionEstado = "pendiente" | "atendido" | "cerrado";
export type TarifaModalidad = "aereo" | "maritimo";
export type TarifaMoneda = "DOLARES" | "SOLES";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
};

export type Shipment = {
  id: string;
  hbl_number: string;
  mbl_number: string | null;
  description: string | null;
  origin: string | null;
  destination: string | null;
  carrier: string | null;
  mode: ShipmentMode;
  status: ShipmentStatus;
  eta: string | null;
  etd: string | null;
  client_name: string | null;
  weight_kg: number | null;
  containers: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ShipmentEvent = {
  id: string;
  shipment_id: string;
  event_date: string;
  location: string | null;
  status_label: string;
  description: string | null;
  is_current: boolean;
  created_by: string | null;
  created_at: string;
};

export type Agent = {
  id: string;
  name: string;
  country: string;
  city: string | null;
  lat: number | null;
  lng: number | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  services: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
};

export type Reclamacion = {
  id: string;
  numero_correlativo: number;
  fecha: string;
  tipo: ReclamacionTipo;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  direccion: string | null;
  email: string;
  telefono: string | null;
  es_menor_edad: boolean;
  representante_nombre: string | null;
  representante_documento: string | null;
  bien_servicio: string;
  monto_reclamado: number | null;
  detalle: string;
  pedido_consumidor: string;
  respuesta_empresa: string | null;
  fecha_respuesta: string | null;
  responded_by: string | null;
  estado: ReclamacionEstado;
  pdf_path: string | null;
  ip_address: string | null;
  created_at: string;
};

export type Contact = {
  id: string;
  nombre: string;
  empresa: string | null;
  email: string;
  telefono: string | null;
  asunto: string | null;
  mensaje: string;
  is_read: boolean;
  responded_at: string | null;
  responded_by: string | null;
  ip_address: string | null;
  created_at: string;
};

export type Tarifa = {
  id: string;
  modalidad: TarifaModalidad;
  tipo_operacion: string;
  tipo_envio: string;
  doc_transporte: string | null;
  denominacion: string;
  precio: string;
  moneda: TarifaMoneda;
  unidad_cobro: string | null;
  notas: string | null;
  orden: number;
  is_active: boolean;
  updated_at: string;
};

export type SiteContent = {
  key: string;
  locale: "es" | "en";
  value: string;
  section: string | null;
  updated_at: string;
};

export const SHIPMENT_STATUS_LABELS: Record<ShipmentStatus, { es: string; en: string }> = {
  recibido: { es: "Recibido", en: "Received" },
  en_transito: { es: "En tránsito", en: "In transit" },
  en_aduana: { es: "En aduana", en: "At customs" },
  desconsolidado: { es: "Desconsolidado", en: "Deconsolidated" },
  en_almacen: { es: "En almacén", en: "In warehouse" },
  en_despacho: { es: "En despacho", en: "In dispatch" },
  en_camino_entrega: { es: "En camino a entrega", en: "Out for delivery" },
  entregado: { es: "Entregado", en: "Delivered" },
};
