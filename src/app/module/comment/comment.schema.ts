import { z } from "zod";
import {
	paginationQuerySchema,
	sortOrderSchema,
} from "../../utils/query-schema";

const createCommentSchema = z.object({
	body: z.object({
		content: z
			.string({ error: "Comment content is required" })
			.trim()
			.min(1, { error: "Comment content cannot be empty" }),
	}),
});

const updateCommentSchema = z.object({
	body: z.object({
		content: z
			.string({ error: "Comment content is required" })
			.trim()
			.min(1, { error: "Comment content cannot be empty" }),
	}),
});

const commentQuerySchema = paginationQuerySchema.extend({
	search: z.string().trim().min(1).optional(),
	sortBy: z.enum(["createdAt", "updatedAt"]).default("createdAt"),
	sortOrder: sortOrderSchema.default("desc"),
});

export const commentValidation = {
	createCommentSchema,
	updateCommentSchema,
	commentQuerySchema,
};
