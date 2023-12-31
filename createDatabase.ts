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
    } 

    const newPool = new Pool({
      user: db.user,
      password: db.password,
      host: db.host,
      port: db.port,
      database: db.database,
    });


    const secondResult = await newPool.query(`
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'creators'
    );
  `);



    if (secondResult.rows[0].exists === true) {
      newPool.end();
      return;
    } else {
      const sqlScriptPath = path.join(__dirname, "./database/db.sql");
      const sqlScript = await fs.readFile(sqlScriptPath, "utf8");
      await newPool.query(sqlScript);
      newPool.end();
    }

  } catch (e) {
    console.log("There was an error", e);
  } finally {
    pool.end();
  }
}

export { createDatabase };
