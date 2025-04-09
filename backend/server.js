import express from "express"
import cors from "cors"
import morgan from "morgan"

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
let tasks = []


// fetch all tasks
app.get("/", async (req, res) => {

	try {
		if (!tasks || tasks.length === 0) {
			throw new Error("No tasks")
		}
		res.status(200).json(tasks)
	}
	catch (err) {
		res.status(500).json({ message: err.message })
	}

})

// post a task
app.post("/", async (req, res) => {

})

// delete individual task
app.delete("/:id", async (req, res) => {

})

// update a task
app.patch("/:id", async (req, res) => {

})


app.listen(port, () => {
	console.log("App listening on port 3000")
})

export { app }
