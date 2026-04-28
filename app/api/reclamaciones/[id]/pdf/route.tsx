import { NextResponse, type NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import type { Reclamacion } from "@/lib/types/database";
import { ReclamacionPDF } from "@/lib/pdf/reclamacion-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("reclamaciones")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "No encontrada" },
      { status: 404 },
    );
  }
  const reclamacion = data as Reclamacion;

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
