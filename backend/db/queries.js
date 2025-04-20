import { pool } from "./db.js"

export async function getAllTasks() {
	const res = await pool.query("SELECT * FROM tasks")
	return res.rows
}

export async function addTask(title, description, status = 0, due_date = null) {
	const query = "INSERT INTO tasks (title, description, status, due_date) VALUES ($1, $2, $3, $4) RETURNING *"
	const result = await pool.query(query, [title, description, status, due_date])
	return result.rows[0]
}

export async function deleteTask(id) {
	const query = "DELETE FROM tasks WHERE id = $1"
	await pool.query(query, [id])
}

export async function updateTask(taskId, updatedTask) {
    const query = `
        UPDATE tasks
        SET 
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            status = COALESCE($3, status),
            due_date = COALESCE($4, due_date)
        WHERE id = $5
        RETURNING *
    `;
    
    try {
        const results = await pool.query(query, [
            updatedTask.title,
            updatedTask.description,
            updatedTask.status,
            updatedTask.due_date,
            taskId
        ]);
        
        if (results.rows.length === 0) {
            throw new Error(`Task with id ${taskId} not found`);
        }
        
        return results.rows[0];
    } catch (error) {
        console.error("Database error in updateTask:", error);
        throw error; 
    }
}