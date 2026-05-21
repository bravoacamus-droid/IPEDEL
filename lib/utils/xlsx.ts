import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";

// Paleta corporativa IPE del Perú
const BRAND_GREEN = "FF96C600";
const BRAND_DARK = "FF0A0A0A";
const BRAND_INK_50 = "FFF5F5F5";
const BRAND_INK_300 = "FFD4D4D4";

export type XlsxColumn = {
  header: string;
  /** Anchor estimado en caracteres (Excel ~7px por unit). */
  width?: number;
};

export type XlsxExportInput<T> = {
  /** Texto del título grande arriba del listado. */
  title: string;
  /** Subtítulo opcional (rango de fechas, filtros aplicados, etc). */
  subtitle?: string;
  columns: XlsxColumn[];
  /** Función que mapea cada fila a un array de valores en el mismo
   *  orden que `columns`. */
  rows: T[];
  rowToValues: (row: T) => (string | number | Date | null | undefined)[];
  /** Nombre interno de la hoja (default "Datos"). */
  sheetName?: string;
};

// Genera un buffer XLSX branded con logo de IPE del Perú, header
// destacado en verde brand, fila de filtros y datos. Diseñado para
// ser enviado como descarga directa desde una route handler.
export async function buildBrandedXlsx<T>(input: XlsxExportInput<T>): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "IPE del Perú SAC";
  wb.created = new Date();
  wb.company = "IPE del Perú SAC";

  const ws = wb.addWorksheet(input.sheetName ?? "Datos", {
    views: [{ state: "frozen", ySplit: 5 }],
    properties: { defaultRowHeight: 18 },
  });

  // ----- Cabecera con logo + título -----
  // Fila 1-3 → bloque visual: logo a la izquierda + título a la derecha.
  ws.getRow(1).height = 22;
  ws.getRow(2).height = 22;
  ws.getRow(3).height = 22;

  try {
    const logoPath = path.join(process.cwd(), "public", "logo-horizontal.png");
    const logoBuffer = await readFile(logoPath);
    const logoId = wb.addImage({
      buffer: new Uint8Array(logoBuffer).buffer as ArrayBuffer,
      extension: "png",
    });
    // Posiciona el logo en A1:B3
    ws.addImage(logoId, {
      tl: { col: 0.1, row: 0.1 },
      ext: { width: 130, height: 50 },
    });
  } catch {
    // Si no se puede leer el logo, seguimos sin él (no rompe la exportación).
  }

  // Title (a la derecha del logo)
  const colsTotal = Math.max(input.columns.length, 4);
  const titleCell = ws.getCell(1, 3);
  titleCell.value = input.title;
  titleCell.font = { name: "Calibri", size: 16, bold: true, color: { argb: BRAND_DARK } };
  titleCell.alignment = { vertical: "middle", horizontal: "left" };
  ws.mergeCells(1, 3, 1, colsTotal);

  // Subtitle
  if (input.subtitle) {
    const subCell = ws.getCell(2, 3);
    subCell.value = input.subtitle;
    subCell.font = { name: "Calibri", size: 10, color: { argb: "FF737373" } };
    subCell.alignment = { vertical: "middle", horizontal: "left" };
    ws.mergeCells(2, 3, 2, colsTotal);
  }

  // Línea de generado
  const genCell = ws.getCell(3, 3);
  genCell.value = `Generado: ${new Date().toLocaleString("es-PE", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })} · IPE del Perú SAC · RUC 20197900378`;
  genCell.font = { name: "Calibri", size: 9, italic: true, color: { argb: "FF737373" } };
  genCell.alignment = { vertical: "middle", horizontal: "left" };
  ws.mergeCells(3, 3, 3, colsTotal);

  // Línea separadora (fila 4)
  ws.getRow(4).height = 6;
  for (let c = 1; c <= colsTotal; c++) {
    const cell = ws.getCell(4, c);
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: BRAND_GREEN },
    };
  }

  // ----- Headers de columnas (fila 5) -----
  const headerRow = ws.getRow(5);
  headerRow.height = 24;
  input.columns.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = col.header;
    cell.font = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: BRAND_DARK },
    };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    cell.border = {
      top: { style: "thin", color: { argb: BRAND_DARK } },
      bottom: { style: "medium", color: { argb: BRAND_GREEN } },
    };

    const c = ws.getColumn(i + 1);
    c.width = col.width ?? 18;
  });

  // ----- Filas de datos -----
  input.rows.forEach((row, i) => {
    const values = input.rowToValues(row);
    const r = ws.getRow(6 + i);
    values.forEach((v, j) => {
      const cell = r.getCell(j + 1);
      cell.value = v ?? "";
      cell.font = { name: "Calibri", size: 10, color: { argb: BRAND_DARK } };
      cell.alignment = { vertical: "middle", horizontal: "left", wrapText: false };
      // Zebra striping
      if (i % 2 === 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: BRAND_INK_50 },
        };
      }
      cell.border = {
        bottom: { style: "hair", color: { argb: BRAND_INK_300 } },
      };
    });
    r.height = 16;
  });

  // ----- Footer con conteo -----
  const footerRow = ws.getRow(6 + input.rows.length + 1);
  footerRow.getCell(1).value = `Total: ${input.rows.length} registros`;
  footerRow.getCell(1).font = {
    name: "Calibri",
    size: 9,
    italic: true,
    color: { argb: "FF737373" },
  };

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export function xlsxResponse(filename: string, body: Buffer): Response {
  return new Response(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
