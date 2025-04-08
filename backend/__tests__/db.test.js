import { pool, initDB } from "../db/db.js"
import { desribe, it, expect, describe, afterAll } from "vitest"

describe("initDB", () => {
	afterAll(async () => {
		await pool.end()
	})

	it("should create the tasks table", async () => {
		await initDB()

		const res = await pool.query(`
SELECT EXISTS (
SELECT FROM information_schema.tables
WHERE table_name = 'tasks')
`)
		expect(res.rows[0].exists).toBe(true)
	})
})
