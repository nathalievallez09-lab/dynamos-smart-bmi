import { getSql, json, methodNotAllowed } from "../_neon.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return json(res, 400, { error: "Username and password are required." });
    }

    const sql = getSql();
    const rows = await sql`
      select username, full_name
      from admin_users
      where username = ${username}
        and password = ${password}
      limit 1
    `;

    if (!rows.length) {
      return json(res, 401, { error: "Invalid username or password" });
    }

    return json(res, 200, {
      token: "admin-session-token",
      admin: rows[0],
    });
  } catch (error) {
    return json(res, 500, {
      error: "Login failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
