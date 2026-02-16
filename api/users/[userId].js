import { getSql, json, methodNotAllowed } from "../_neon.js";

function parseId(req) {
  return req.query?.userId;
}

export default async function handler(req, res) {
  const userId = parseId(req);
  if (!userId) {
    return json(res, 400, { error: "Missing user ID" });
  }

  if (req.method === "GET") {
    try {
      const sql = getSql();
      const rows = await sql`
        select
          u.id,
          u.full_name as name,
          u.age,
          u.sex,
          u.email,
          u.status,
          coalesce(latest.bmi, 0) as current_bmi,
          coalesce(latest.weight_kg, 0) as weight,
          coalesce(latest.height_cm, 0) as height,
          latest.last_updated
        from users u
        left join lateral (
          select bmi, weight_kg, height_cm, measured_at as last_updated
          from bmi_records
          where user_id = u.id
          order by measured_at desc
          limit 1
        ) latest on true
        where u.id = ${userId}
        limit 1
      `;

      if (!rows.length) {
        return json(res, 404, { error: "User not found" });
      }

      return json(res, 200, { user: rows[0] });
    } catch (error) {
      return json(res, 500, {
        error: "Failed to fetch user",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  if (req.method === "PUT") {
    try {
      const { name } = req.body || {};
      if (!name || typeof name !== "string") {
        return json(res, 400, { error: "A valid name is required." });
      }

      const sql = getSql();
      const rows = await sql`
        update users
        set full_name = ${name}
        where id = ${userId}
        returning id, full_name as name, age, sex, email, status
      `;

      if (!rows.length) {
        return json(res, 404, { error: "User not found" });
      }

      return json(res, 200, { user: rows[0] });
    } catch (error) {
      return json(res, 500, {
        error: "Failed to update user",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return methodNotAllowed(res, ["GET", "PUT"]);
}
