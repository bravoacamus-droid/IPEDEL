import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// HMAC determinístico para descargas públicas de PDFs de reclamación.
// El consumidor recibe (id, token) al registrar su reclamo y puede
// descargar la copia firmada en cualquier momento — sin expiración.
//
// Cumplimiento: DS 011-2011-PCM Art. 4 — el proveedor "deberá permitir
// que el consumidor imprima gratuitamente una copia de su Hoja de
// Reclamación virtual luego de haber registrado su queja o reclamo".
//
// El secreto se deriva del SUPABASE_SERVICE_ROLE_KEY (server-only) para
// evitar agregar otra variable de entorno; cualquier rotación de la
// service_role invalidaría tokens previos, lo cual es aceptable.

function getSecret(): string {
  const s = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!s) throw new Error("SUPABASE_SERVICE_ROLE_KEY no configurado.");
  return s;
}

export function signReclamacionToken(id: string): string {
  return createHmac("sha256", getSecret()).update(`reclamacion:${id}`).digest("base64url").slice(0, 32);
}

export function verifyReclamacionToken(id: string, token: string): boolean {
  if (!token || token.length < 16) return false;
  const expected = signReclamacionToken(id);
  if (expected.length !== token.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}
