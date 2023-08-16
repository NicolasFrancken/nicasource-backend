import { Pool } from "pg";
import { db } from "./config";
import path from "path";
import fs from "fs/promises";

async function createDatabase(): Promise<void> {
  const pool = new Pool({
    user: db.user,
    password: db.password,
    host: db.host,
    port: db.port,
    database: db.postgresDatabase,
  });

  try {
    const result = await pool.query(
      "SELECT datname FROM pg_database WHERE datname = $1",
      ["nicasourcedb"]
    );

    if (result.rows.length === 0) {
      await pool.query(`CREATE DATABASE nicasourcedb`);
    } else {
      return;
    }

    const newPool = new Pool({
      user: db.user,
      password: db.password,
      host: db.host,
      port: db.port,
      database: db.database,
    });

    const sqlScriptPath = path.join(__dirname, "./database/db.sql");
    const sqlScript = await fs.readFile(sqlScriptPath, "utf8");
    await newPool.query(sqlScript);
    newPool.end();
  } catch (e) {
    console.log("There was an error", e);
  } finally {
    pool.end();
  }
}

export { createDatabase };
