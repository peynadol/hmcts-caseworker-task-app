import { pool } from "./db.js"

// get all tasks
export async function getAllTasks() {
	const res = await pool.query("SELECT * FROM tasks")
	return res.rows
}

export async function addTask(title, description, status = 0, due_date = null) {
	const query = "INSERT INTO tasks (title, description, status, due_date) VALUES ($1, $2, $3, $4)"
	await pool.query(query, [title, description, status, due_date])
}
