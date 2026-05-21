import "server-only";

// Serializa una matriz de filas a CSV con BOM UTF-8 (para que Excel
// reconozca acentos en Windows). Cada valor se escapa con comillas
// dobles y los " internos se duplican (estándar RFC 4180).
export function toCsv(
  headers: string[],
  rows: (string | number | null | undefined)[][],
): string {
  const esc = (v: string | number | null | undefined): string => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const head = headers.map(esc).join(",");
  const body = rows.map((r) => r.map(esc).join(",")).join("\r\n");
  return "﻿" + head + "\r\n" + body;
}

// Construye los headers de respuesta para descargar un CSV con nombre
// de archivo + content-type apropiado.
export function csvResponse(filename: string, body: string): Response {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
