import { NextResponse, type NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyReclamacionToken } from "@/lib/utils/sign";
import type { Reclamacion } from "@/lib/types/database";
import { ReclamacionPDF } from "@/lib/pdf/reclamacion-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Permite descargar el PDF de una reclamación de dos formas:
// 1) Con sesión admin válida (acceso interno del panel).
// 2) Con un `?token=` HMAC firmado entregado al consumidor al momento
//    de registrar su reclamación (cumple DS 011-2011-PCM Art. 4).

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = req.nextUrl.searchParams.get("token");

  let reclamacion: Reclamacion | null = null;

  if (token && verifyReclamacionToken(id, token)) {
    // Token válido — uso admin client (bypass RLS) sin requerir sesión.
    const admin = createAdminClient();
    const { data } = await admin
      .from("reclamaciones")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    reclamacion = (data as Reclamacion) || null;
  } else {
    // Sin token: requiere sesión autenticada (admin/operador).
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const { data } = await supabase
      .from("reclamaciones")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    reclamacion = (data as Reclamacion) || null;
  }

  if (!reclamacion) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  let logoSrc: Buffer | undefined;
  try {
    const logoPath = path.join(process.cwd(), "public", "logo-horizontal.png");
    logoSrc = await readFile(logoPath);
  } catch {
    logoSrc = undefined;
  }

  const buffer = await renderToBuffer(
    <ReclamacionPDF reclamacion={reclamacion} logoSrc={logoSrc} />,
  );

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="reclamacion-${reclamacion.numero_correlativo}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
