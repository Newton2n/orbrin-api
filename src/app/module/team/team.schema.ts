import { z } from "zod";
import {
	paginationQuerySchema,
	sortOrderSchema,
} from "../../utils/query-schema";

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
	body: z
		.object({
			name: z
				.string()
				.trim()
				.min(1, { error: "Team name cannot be empty" })
				.optional(),
			description: z.string().optional(),
		})
		.refine((body) => Object.keys(body).length > 0, {
			error: "At least one team field is required to update",
		}),
});

const teamQuerySchema = paginationQuerySchema.extend({
	search: z.string().trim().min(1).optional(),
	sortBy: z.enum(["name", "createdAt", "updatedAt"]).default("createdAt"),
	sortOrder: sortOrderSchema.default("desc"),
});

const addTeamMemberValidationSchema = z.object({
	body: z.object({
		userId: z.uuid("Invalid user ID."),
	}),
});

const teamMemberParamsValidationSchema = z.object({
	params: z.object({
		teamId: z.uuid("Invalid team ID."),
	}),
});

const removeTeamMemberValidationSchema = z.object({
	params: z.object({
		teamId: z.uuid("Invalid team ID."),
		userId: z.uuid("Invalid user ID."),
	}),
});

export const teamValidation = {
	createTeamSchema,
	updateTeamSchema,
	teamQuerySchema,
	addTeamMemberValidationSchema,
	teamMemberParamsValidationSchema,
	removeTeamMemberValidationSchema,
};
