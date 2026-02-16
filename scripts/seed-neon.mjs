import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Missing DATABASE_URL. Set it before running db:seed.");
    process.exit(1);
  }

  const schemaPath = path.join(__dirname, "..", "db", "schema.sql");
  const seedPath = path.join(__dirname, "..", "db", "seed.sql");
  const schemaSql = await fs.readFile(schemaPath, "utf8");
  const seedSql = await fs.readFile(seedPath, "utf8");

  const sql = neon(databaseUrl);
  await sql.query(schemaSql);
  await sql.query(seedSql);

  console.log("Neon database schema + seed applied successfully.");
}

run().catch((error) => {
  console.error("Failed to seed database:", error);
  process.exit(1);
});
