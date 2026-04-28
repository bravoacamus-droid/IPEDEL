// Apply SQL migrations to Supabase via Management API.
// Usage: node scripts/apply-migrations.mjs [file1.sql file2.sql...]
// Defaults to applying everything in supabase/migrations/ in order.

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF;
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!PROJECT_REF || !TOKEN) {
  console.error("Missing SUPABASE_PROJECT_REF or SUPABASE_ACCESS_TOKEN env var.");
  process.exit(1);
}

async function runQuery(sql, label) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    },
  );
  const text = await res.text();
  if (!res.ok) {
    console.error(`✗ ${label} failed (${res.status})`);
    console.error(text);
    process.exit(1);
  }
  console.log(`✓ ${label}`);
}

const cliFiles = process.argv.slice(2);
const dir = path.resolve("supabase/migrations");
const files =
  cliFiles.length > 0
    ? cliFiles
    : (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort().map((f) => path.join(dir, f));

for (const file of files) {
  const sql = await readFile(file, "utf8");
  await runQuery(sql, path.basename(file));
}

console.log("\nAll migrations applied.");
