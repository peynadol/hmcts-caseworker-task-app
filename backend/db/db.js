import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pg;

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        database: "postgres",
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
      }
);

async function setupTable() {
  try {
    await pool.query(`
CREATE TABLE IF NOT EXISTS tasks (
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
description TEXT DEFAULT NULL,
status INTEGER DEFAULT 0,
due_date TIMESTAMP
)
`);
    console.log("Table 'tasks' created");
  } catch (err) {
    console.error(err);
  }
}

async function initDB() {
  await setupTable();
  await pool.query("SELECT NOW()");
  console.log("db connected");
}

export { pool, initDB };
