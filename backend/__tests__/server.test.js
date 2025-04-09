import request from "supertest";
import { describe, expect, it, vi } from "vitest"
import { app } from "../server.js"


describe("Test get route", () => {
	it("returns sucess", async () => {
		const res = await request(app).get("/")
		expect(res.status).toBe(200)
	})
})

describe("Test non existent endpoint", () => {
	it("returns 404 status code", async () => {
		const res = await request(app).get("/badendpoint")
		expect(res.status).toBe(404)
	})
})
