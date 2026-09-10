import { z } from "zod";

const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Project name is required" })
      .trim()
      .min(1, { error: "Project name cannot be empty" }),
    description: z.string().optional(),
  }),
});

const updateProjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, { error: "Project name cannot be empty" })
      .optional(),
    description: z.string().optional(),
    status: z.string().optional(),
  }),
});

const assignTeamSchema = z.object({
  body: z.object({
    teamId: z
      .string({ error: "Team ID is required" })
      .trim()
      .min(1, { error: "Team ID cannot be empty" }),
  }),
});

export const projectValidation = {
  createProjectSchema,
  updateProjectSchema,
  assignTeamSchema,
};