import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReclamacionPDF } from "@/lib/pdf/reclamacion-pdf";
import type { Reclamacion } from "@/lib/types/database";

// Genera el PDF oficial de una reclamación como Buffer. Usado tanto
// por la API route /api/reclamaciones/[id]/pdf como por el action que
// envía la copia al consumidor por correo (vía Resend).
export async function renderReclamacionPdf(
  reclamacion: Reclamacion,
): Promise<Buffer> {
  let logoSrc: Buffer | undefined;
  try {
    const logoPath = path.join(process.cwd(), "public", "logo-horizontal.png");
    logoSrc = await readFile(logoPath);
  } catch {
    logoSrc = undefined;
  }

  return renderToBuffer(
    <ReclamacionPDF reclamacion={reclamacion} logoSrc={logoSrc} />,
  );
}
