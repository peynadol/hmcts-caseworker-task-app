import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  description: z.string().max(500).nullable().optional(),
  status: z.number().int().min(0).max(2).default(0),
  due_date: z.string().refine(
    (val) => {
      const date = new Date(val);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return date >= now;
    },
    {
      message: "Due date can not be in the past",
    }
  ),
});

export type Task = z.infer<typeof TaskSchema>;
