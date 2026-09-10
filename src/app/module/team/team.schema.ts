import { z } from "zod";

const createTeamSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Team name is required" })
      .trim()
      .min(1, { error: "Team name cannot be empty" }),
    description: z.string().optional(),
  }),
});

const updateTeamSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, { error: "Team name cannot be empty" })
      .optional(),
    description: z.string().optional(),
  }),
});

export const teamValidation = {
  createTeamSchema,
  updateTeamSchema,
};