import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/auth/audit";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  // Audit ANTES del signOut para que la sesión todavía exista.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await logAudit({
      action: "logout",
      entityType: "auth",
      entityLabel: user.email ?? user.id,
    });
  }
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}
