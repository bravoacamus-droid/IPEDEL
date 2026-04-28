import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Refresh Supabase session cookies on every request
  const { response, user } = await updateSession(request);

  // 2. Admin gating
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return response; // login page is public
    }
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  // 3. Locale routing for the public site
  const isApi = pathname.startsWith("/api");
  const isAsset =
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.[a-zA-Z0-9]+$/.test(pathname);

  if (isApi || isAsset) return response;

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (!first || !isLocale(first)) {
    const accept = request.headers.get("accept-language") || "";
    const preferred = accept.toLowerCase().includes("en") ? "en" : defaultLocale;
    const target = preferred && isLocale(preferred) ? preferred : defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${target}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|mp4|pdf)$).*)",
  ],
};

// Tell future maintainers we explicitly support both locales:
export const SUPPORTED_LOCALES = locales;
