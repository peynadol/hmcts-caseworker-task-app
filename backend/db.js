import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Client } = pg
const client = new Client({
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	host: process.env.PGHOST,
	port: process.env.PGPORT,
	database: process.env.PGDATABASE

})

const setupDatabase = async () => {
	try {
		await client.connect()

		const createTable = `
CREATE TABLE IF NOT EXISTS tasks (
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
description TEXT DEFAULT NULL,
status INTEGER DEFAULT 0,
due_date TIMESTAMP
)
`
		await client.query(createTable)
		console.log("Table 'tasks' created or already eists")
	} catch (err) {
		console.error(err)
	} finally {
		await client.end()
	}
}

setupDatabase()
