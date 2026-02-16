import { getSql, json, methodNotAllowed } from "../_neon.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  try {
    const sql = getSql();
    const users = await sql`
      select
        u.id,
        u.full_name as name,
        u.age,
        u.sex,
        u.email,
        u.status,
        coalesce(latest.bmi, 0) as current_bmi,
        coalesce(records.total_records, 0) as total_records,
        latest.last_measurement
      from users u
      left join lateral (
        select bmi, measured_at as last_measurement
        from bmi_records
        where user_id = u.id
        order by measured_at desc
        limit 1
      ) latest on true
      left join (
        select user_id, count(*)::int as total_records
        from bmi_records
        group by user_id
      ) records on records.user_id = u.id
      order by u.id
    `;

    return json(res, 200, { users });
  } catch (error) {
    return json(res, 500, {
      error: "Failed to load users",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
