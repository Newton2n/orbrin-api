import { z } from "zod";
import { SprintStatus } from "../../../../prisma/generated/prisma/enums";
import {
  paginationQuerySchema,
  sortOrderSchema,
} from "../../utils/query-schema";

const createSprintSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Sprint name is required" })
      .trim()
      .min(1, { error: "Sprint name cannot be empty" }),
    goal: z.string().optional(),
    status: z
      .enum([
        SprintStatus.ACTIVE,
        SprintStatus.COMPLETED,
        SprintStatus.PLANNING,
      ])
      .optional(),
    startDate: z.coerce
      .date({ message: "Start date must be a valid date" })
      .optional(),
    endDate: z.coerce
      .date({ message: "End date must be a valid date" })
      .optional(),
  }),
});

const updateSprintSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, { error: "Sprint name cannot be empty" })
      .optional(),
    goal: z.string().optional(),
    status: z
      .enum([
        SprintStatus.ACTIVE,
        SprintStatus.COMPLETED,
        SprintStatus.PLANNING,
      ])
      .optional(),
    startDate: z.coerce
      .date({ message: "Start date must be a valid date" })
      .optional(),
    endDate: z.coerce
      .date({ message: "End date must be a valid date" })
      .optional(),
  }),
});

const sprintQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().min(1).optional(),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: sortOrderSchema.default("desc"),
  status: z
    .enum([SprintStatus.PLANNING, SprintStatus.ACTIVE, SprintStatus.COMPLETED])
    .optional(),
});

export const sprintValidation = {
  createSprintSchema,
  updateSprintSchema,
  sprintQuerySchema,
};
