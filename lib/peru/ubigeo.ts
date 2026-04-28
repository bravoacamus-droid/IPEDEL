// Ubigeo INEI 2016 — fuente: github.com/ernestorivero/Ubigeo-Peru
// Códigos de 6 dígitos: 2 (departamento) + 2 (provincia) + 2 (distrito).
import deptData from "./departamentos.json";
import provData from "./provincias.json";
import distData from "./distritos.json";

export type Department = { id: string; name: string };
export type Province = { id: string; name: string; department_id: string };
export type District = {
  id: string;
  name: string;
  province_id: string;
  department_id: string;
};

export const departments: Department[] = deptData as Department[];
export const provinces: Province[] = provData as Province[];
export const districts: District[] = distData as District[];

export function getDepartment(id: string) {
  return departments.find((d) => d.id === id);
}

export function getProvince(id: string) {
  return provinces.find((p) => p.id === id);
}

export function getDistrict(id: string) {
  return districts.find((d) => d.id === id);
}

// Resolves the full ubigeo from a 6-digit district id. Returns null if invalid.
export function resolveUbigeo(districtId: string) {
  const distrito = getDistrict(districtId);
  if (!distrito) return null;
  const provincia = getProvince(distrito.province_id);
  const departamento = getDepartment(distrito.department_id);
  if (!provincia || !departamento) return null;
  return {
    distrito_id: distrito.id,
    distrito_nombre: distrito.name,
    provincia_id: provincia.id,
    provincia_nombre: provincia.name,
    departamento_id: departamento.id,
    departamento_nombre: departamento.name,
  };
}
