import request from "supertest";
import { beforeAll, describe, expect, it, vi, afterAll, beforeAll, test } from "vitest"
import { app } from "../server.js"
import { pool } from "../db/db.js"

describe("Task API endpoints", () => {
	let testTaskId

	const testTask = {
		title: "Test Task",
		description: "This is a test task",
		status: 0,
		due_date: new Date()
	}

	beforeAll(async () => {
		// clean db of all existing test entries
		await pool.query("DELETE FROM tasks WHERE title LIKE 'Test%'")
	})

	afterAll(async () => {
		// clean db of all test entries after tests
		await pool.query("DELETE FROM tasks WHERE title LIKE 'Test%'")
		pool.end()
	})

	describe("POST /tasks", () => {
		it("should create a new task", async () => {
			const res = await request(app)
				.post("/tasks")
				.send(testTask)

			expect(res.status).toBe(201)
			expect(res.body).toHaveProperty("id")
			expect(res.body.title).toBe(testTask.title)

			testTaskId = res.body.id
		})

		it("should require title", async () => {
			// removes the title in a non destructive way
			const { title, ...invalidTask } = testTask
			const res = await request(app)
				.post("/tasks")
				.send(invalidTask)

			expect(res.status).toBe(500)
		})

		it("should require valid date format", async () => {
			const res = await request(app)
				.post("/tasks")
				.send({
					...testTask,
					due_date: "invalid date format"
				})
			expect(res.status).toBe(500)
		})
	})

	describe("GET /tasks", () => {
		it("should get all tasks", async () => {
			const res = await request(app).get("/tasks")

			expect(res.status).toBe(200)
			expect(res.body.some(task => task.id === testTaskId)).toBe(true)
		})
	})

	describe("PATCH /tasks/:id", () => {
		it("should update a task", async () => {
			const updatedData = {
				title: "Updated title",
				status: 2
			}

			const res = await request(app)
				.patch(`/tasks/${testTaskId}`)
				.send(updatedData)

			expect(res.status).toBe(200)
			expect(res.body.title).toBe(updatedData.title)
			expect(res.body.status).toBe(updatedData.status)

			expect(res.body.description).toBe(testTask.description)
		})


	})

	describe("DELETE /tasks/:id", () => {
		it("should delete a task", async () => {
			const res = await request(app).delete(`/tasks/${testTaskId}`)
			expect(res.status).toBe(204)

			const getRes = await request(app).get("/tasks")
			expect(getRes.body.some(task => task.id === testTaskId)).toBe(false)
		})
	})
})
