"use client";

import { useMemo, useState } from "react";
import {
  departments,
  provinces,
  districts,
  type Department,
} from "@/lib/peru/ubigeo";

export function UbigeoSelect({
  required = true,
  defaultDeptId = "",
  defaultProvId = "",
  defaultDistId = "",
  labels,
}: {
  required?: boolean;
  defaultDeptId?: string;
  defaultProvId?: string;
  defaultDistId?: string;
  labels: { departamento: string; provincia: string; distrito: string };
}) {
  const [deptId, setDeptId] = useState(defaultDeptId);
  const [provId, setProvId] = useState(defaultProvId);
  const [distId, setDistId] = useState(defaultDistId);

  const sortedDepartments = useMemo(
    () => [...departments].sort((a, b) => a.name.localeCompare(b.name, "es")),
    [],
  );

  const filteredProvinces = useMemo(
    () =>
      provinces
        .filter((p) => p.department_id === deptId)
        .sort((a, b) => a.name.localeCompare(b.name, "es")),
    [deptId],
  );

  const filteredDistricts = useMemo(
    () =>
      districts
        .filter((d) => d.province_id === provId)
        .sort((a, b) => a.name.localeCompare(b.name, "es")),
    [provId],
  );

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div>
        <label className="label" htmlFor="ubigeo_departamento_id">
          {labels.departamento}
          {required && <span className="text-rose-500"> *</span>}
        </label>
        <select
          id="ubigeo_departamento_id"
          name="ubigeo_departamento_id"
          required={required}
          className="input"
          value={deptId}
          onChange={(e) => {
            setDeptId(e.target.value);
            setProvId("");
            setDistId("");
          }}
        >
          <option value="">— Selecciona —</option>
          {sortedDepartments.map((d: Department) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="ubigeo_provincia_id">
          {labels.provincia}
          {required && <span className="text-rose-500"> *</span>}
        </label>
        <select
          id="ubigeo_provincia_id"
          name="ubigeo_provincia_id"
          required={required}
          className="input"
          value={provId}
          disabled={!deptId}
          onChange={(e) => {
            setProvId(e.target.value);
            setDistId("");
          }}
        >
          <option value="">
            {deptId ? "— Selecciona —" : "— Elige un departamento —"}
          </option>
          {filteredProvinces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="ubigeo_distrito_id">
          {labels.distrito}
          {required && <span className="text-rose-500"> *</span>}
        </label>
        <select
          id="ubigeo_distrito_id"
          name="ubigeo_distrito_id"
          required={required}
          className="input"
          value={distId}
          disabled={!provId}
          onChange={(e) => setDistId(e.target.value)}
        >
          <option value="">
            {provId ? "— Selecciona —" : "— Elige una provincia —"}
          </option>
          {filteredDistricts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
