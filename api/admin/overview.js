import { getSql, json, methodNotAllowed } from "../_neon.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  try {
    const sql = getSql();

    const [counts] = await sql`
      select
        (select count(*)::int from users) as total_users,
        (select count(*)::int from bmi_records where measured_at::date = current_date) as measurements_today,
        (select count(*)::int from users where status = 'active') as active_users,
        (select count(*)::int from bmi_records) as total_measurements
    `;

    const [avgBmi] = await sql`
      select round(avg(bmi)::numeric, 2) as avg_bmi
      from (
        select distinct on (user_id) user_id, bmi
        from bmi_records
        order by user_id, measured_at desc
      ) latest
    `;

    return json(res, 200, {
      totalUsers: counts.total_users,
      measurementsToday: counts.measurements_today,
      activeUsers: counts.active_users,
      totalMeasurements: counts.total_measurements,
      avgBmi: Number(avgBmi.avg_bmi ?? 0),
      systemHealth: 98.5,
    });
  } catch (error) {
    return json(res, 500, {
      error: "Failed to load admin overview",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
