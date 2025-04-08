import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Client } = pg

async function setupTable() {
	const client = new Client({
		database: "postgres",
		user: process.env.PGUSER,
		password: process.env.PGPASSWORD,
		host: process.env.PGHOST,
		port: process.env.PGPORT
	})

	try {
		await client.connect()
		await client.query(`
CREATE TABLE IF NOT EXISTS tasks (
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
description TEXT DEFAULT NULL,
status INTEGER DEFAULT 0,
due_date TIMESTAMP
)
`)
		console.log("Table 'tasks' created")
	} catch (err) {
		console.error(err)
	} finally {
		await client.end()
	}
}

setupTable()
