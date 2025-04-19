import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  description: z.string().max(500).nullable().optional(),
  status: z.number().int().min(0).max(2).default(0),
  due_date: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;
