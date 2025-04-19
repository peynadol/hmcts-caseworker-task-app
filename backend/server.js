//TODO: add input validation to routes
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { addTask, deleteTask, getAllTasks, updateTask } from "./db/queries.js";
import { TaskSchema } from "../schemas/task.ts";
import { z } from "zod";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// fetch all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error when fetching tasks" });
  }
});

// post a task
app.post("/tasks", async (req, res) => {
  try {
    const validatedData = TaskSchema.parse(req.body);
    const task = await addTask(
      validatedData.title,
      validatedData.description || null,
      validatedData.status,
      validatedData.due_date
    );

    res.status(201).json(task);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// delete individual task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await deleteTask(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// update a task
app.patch("/tasks/:id", async (req, res) => {
  try {
    const validatedData = TaskSchema.partial().parse(req.body);

    const task = await updateTask(req.params.id, validatedData);

    res.status(200).json(task);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log("App listening on port 3000");
});

export { app };
