import { describe, it, expect, vi } from "vitest"
import { getAllTasks, addTask, deleteTask, updateTask } from "../db/queries.js"
import { pool } from "../db/db.js"

describe("getAllTasks", () => {
	it("should return task rows", async () => {
		const mockRows = [{ title: "Test", status: false }]
		pool.query = vi.fn().mockResolvedValue({ rows: mockRows })

		const result = await getAllTasks()
		expect(result).toEqual(mockRows)
	})
})

describe("addTask", () => {
	it("should insert task", async () => {
		const mockTask = {
			title: "test",
			description: "this is a test task",
			status: 0,
			due_date: new Date()
		}
		pool.query = vi.fn().mockResolvedValue({ rows: mockTask })

		await addTask(mockTask.title, mockTask.description, mockTask.status, mockTask.due_date)
		expect(pool.query).toHaveBeenCalledWith(
			"INSERT INTO tasks (title, description, status, due_date) VALUES ($1, $2, $3, $4)",
			[mockTask.title, mockTask.description, mockTask.status, mockTask.due_date]
		)
	})
})

describe("deleteTask", () => {
	it("should delete task", async () => {
		const id = 1

		pool.query = vi.fn().mockResolvedValue({})
		await deleteTask(id)
		expect(pool.query).toHaveBeenCalledWith(
			"DELETE FROM tasks WHERE id = $1",
			[id]
		)
	})
})

//describe("updateTask", () => {
//	it("should update task fields correctly", async () => {
//	TODO: come back to this when i have a better understanding of testing and mocking
//	})
//})
