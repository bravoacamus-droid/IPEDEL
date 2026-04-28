// Datos centralizados de la empresa — fuente única de verdad para toda la app.
export const SITE = {
  legalName: "IPE DEL PERU S.A.C.",
  brand: "IPE del Perú",
  ruc: "20197900378",
  phone: "+511 256-6135",
  phoneTel: "+5112566135",
  email: "ventas@ipedelperu.com",
  address: {
    line1: "Calle el Boulevard 182, of. 901",
    line2: "Surco - Lima 33, Perú",
    full: "Calle el Boulevard 182, of. 901, Surco - Lima 33, Perú",
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=100065270633243",
  },
} as const;

// Google Maps URL — abre la dirección directamente en la app o en maps.google.com
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Calle el Boulevard 182, Of 901, Santiago de Surco, Lima, Perú");
