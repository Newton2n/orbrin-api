import { z } from "zod";
import {
  TaskStatus,
  TaskPriority,
} from "../../../../prisma/generated/prisma/enums";

const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string({ error: "Task title is required" })
      .trim()
      .min(1, { error: "Task title cannot be empty" }),
    description: z.string().optional(),
    status: z
      .enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
      .optional(),
    priority: z
      .enum([TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW,TaskPriority.URGENT])
      .optional(),
       dueDate: z.coerce
      .date({ message: "Due date must be a valid date" }) 
      .optional(),
    assigneeId: z
      .uuid({ error: "Assignee ID must be a valid UUID" })
      .optional(),
    sprintId: z.uuid({ error: "Sprint ID must be a valid UUID" }).optional(),
    parentTaskId: z
      .uuid({ error: "Parent task ID must be a valid UUID" })
      .optional(),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, { error: "Task title cannot be empty" })
      .optional(),
    description: z.string().optional(),
    status: z
      .enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
      .optional(),
    priority: z
      .enum([TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW,TaskPriority.URGENT])
      .optional(),
        dueDate: z.coerce
      .date({ message: "Due date must be a valid date" }) 
      .optional(),
    assigneeId: z
      .uuid({ error: "Assignee ID must be a valid UUID" })
      .optional(),
    sprintId: z.uuid({ error: "Sprint ID must be a valid UUID" }).optional(),
    parentTaskId: z
      .uuid({ error: "Parent task ID must be a valid UUID" })
      .optional(),
  }),
});

export const taskValidation = {
  createTaskSchema,
  updateTaskSchema,
};

