//TODO: add input validation to routes
import express from "express"
import cors from "cors"
import morgan from "morgan"
import { addTask, deleteTask, getAllTasks, updateTask } from "./db/queries.js"

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
////let tasks = [{
//	id: 1,
//	title: "Learn testing",
//	description: "Gain familiarity with unit testing",
//	status: 0,
//	due_date: "EOW}"
//}]


// fetch all tasks
app.get("/tasks", async (req, res) => {
	try {
		const tasks = await getAllTasks()
		res.status(200).json(tasks)
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: "Error when fetching tasks" })
	}

})

// post a task
app.post("/tasks", async (req, res) => {
	const { title, description, status, due_date } = req.body

	try {
		const task = await addTask(
			title,
			description,
			status,
			due_date
		)
		res.status(201).json(task)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

// delete individual task
app.delete("/tasks/:id", async (req, res) => {
	const { id } = req.params

	try {
		await deleteTask(id)
		res.status(204).send()
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

// update a task
app.patch("/tasks/:id", async (req, res) => {
	const { id } = req.params
	const { title, description, status, due_date } = req.body
	const updatedTask = {
		title,
		description,
		status,
		due_date
	}
	try {
		const task = await updateTask(id, updatedTask)
		res.status(200).json(task)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}

})


app.listen(port, () => {
	console.log("App listening on port 3000")
})

export { app }
