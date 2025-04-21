import express from "express";
import cors from "cors";
import morgan from "morgan";
import { addTask, deleteTask, getAllTasks, updateTask } from "./db/queries.js";
import { TaskSchema } from "../schemas/task.js";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";
import { initDB } from "./db/db.js";

const app = express();
const port = process.env.PORT || 10000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "..", "frontend", "dist");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API routes
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error when fetching tasks" });
  }
});

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

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteTask(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/tasks/:id", async (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const validatedData = TaskSchema.partial().parse(req.body);
    const task = await updateTask(taskId, validatedData);
    res.status(200).json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: err.errors,
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use(express.static(frontendPath));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

initDB()
  .then(() => {
    console.log("Database initialized successfully");
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

export { app };
