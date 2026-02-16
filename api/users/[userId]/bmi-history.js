import { getSql, json, methodNotAllowed } from "../../_neon.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  const userId = req.query?.userId;
  if (!userId) {
    return json(res, 400, { error: "Missing user ID" });
  }

  try {
    const sql = getSql();
    const rows = await sql`
      select
        measured_at as date,
        bmi,
        weight_kg as weight,
        height_cm as height
      from bmi_records
      where user_id = ${userId}
      order by measured_at asc
    `;

    return json(res, 200, { history: rows });
  } catch (error) {
    return json(res, 500, {
      error: "Failed to fetch BMI history",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
