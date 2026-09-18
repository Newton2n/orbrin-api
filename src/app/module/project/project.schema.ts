import { z } from "zod";
import {
	paginationQuerySchema,
	sortOrderSchema,
} from "../../utils/query-schema";

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

const projectQuerySchema = paginationQuerySchema.extend({
	search: z.string().trim().min(1).optional(),
	sortBy: z.enum(["name", "createdAt", "updatedAt"]).default("createdAt"),
	sortOrder: sortOrderSchema.default("desc"),
	status: z.string().trim().min(1).optional(),
	teamId: z.uuid().optional(),
});

export const projectValidation = {
	createProjectSchema,
	updateProjectSchema,
	assignTeamSchema,
	projectQuerySchema,
};
