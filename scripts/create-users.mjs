// Create initial admin + operator users in Supabase Auth.
// These accounts get auto-profiled via the on_auth_user_created trigger.

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const users = [
  {
    email: "admin@ipedelperu.com",
    password: process.env.ADMIN_PASSWORD || "Ipedel.Admin2026!",
    full_name: "Administrador IPEDEL",
    role: "admin",
  },
  {
    email: "operador@ipedelperu.com",
    password: process.env.OPERATOR_PASSWORD || "Ipedel.Operador2026!",
    full_name: "Operador IPEDEL",
    role: "operator",
  },
];

async function createUser(u) {
  const res = await fetch(`${URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.full_name, role: u.role },
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    if (body?.error_code === "email_exists" || body?.code === "email_exists") {
      console.log(`= ${u.email} already exists, updating role + password.`);
      // Look up by email and update
      const list = await fetch(
        `${URL}/auth/v1/admin/users?email=${encodeURIComponent(u.email)}`,
        { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } },
      ).then((r) => r.json());
      const existing = (list?.users || []).find((x) => x.email === u.email);
      if (!existing) {
        console.error(`Could not locate existing user ${u.email}`);
        return;
      }
      const upd = await fetch(`${URL}/auth/v1/admin/users/${existing.id}`, {
        method: "PUT",
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: u.password,
          email_confirm: true,
          user_metadata: { full_name: u.full_name, role: u.role },
        }),
      });
      if (!upd.ok) {
        console.error(`Update failed: ${await upd.text()}`);
      } else {
        console.log(`✓ ${u.email} updated`);
      }
      return;
    }
    console.error(`✗ ${u.email}: ${JSON.stringify(body)}`);
    return;
  }
  console.log(`✓ ${u.email} created (id ${body.id}) — role: ${u.role}`);
}

for (const u of users) {
  await createUser(u);
}

// Ensure profile rows have correct role (in case the trigger fired before metadata)
async function fixProfile(email, role) {
  const list = await fetch(
    `${URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } },
  ).then((r) => r.json());
  const u = (list?.users || []).find((x) => x.email === email);
  if (!u) return;
  const upd = await fetch(`${URL}/rest/v1/profiles?id=eq.${u.id}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ role, full_name: email === "admin@ipedelperu.com" ? "Administrador IPEDEL" : "Operador IPEDEL" }),
  });
  if (!upd.ok) console.error(`Profile patch failed (${email}): ${await upd.text()}`);
  else console.log(`✓ ${email} profile role=${role}`);
}

await fixProfile("admin@ipedelperu.com", "admin");
await fixProfile("operador@ipedelperu.com", "operator");
