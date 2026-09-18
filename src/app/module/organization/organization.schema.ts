import { z } from "zod";
import {
	OrganizationMembershipStatus,
	Role,
} from "../../../../prisma/generated/prisma/client";
import {
	paginationQuerySchema,
	sortOrderSchema,
} from "../../utils/query-schema";

export const updateOrganizationValidationSchema = z.object({
	body: z.object({
		name: z
			.string()
			.trim()
			.min(2, "Organization name must be at least 2 characters")
			.max(100, "Organization name cannot exceed 100 characters")
			.optional(),

		slug: z
			.string()
			.trim()
			.toLowerCase()
			.min(2, "Organization slug must be at least 2 characters")
			.max(100, "Organization slug cannot exceed 100 characters")
			.regex(
				/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
				"Slug can only contain lowercase letters, numbers, and hyphens",
			)
			.optional(),
	}),
});

export const updateMemberRoleValidationSchema = z.object({
	body: z.object({
		role: z.enum([Role.MEMBER, Role.MANAGER]),
	}),
});

export const updateMemberStatusValidationSchema = z.object({
	body: z.object({
		status: z.enum([
			OrganizationMembershipStatus.ACTIVE,
			OrganizationMembershipStatus.INACTIVE,
			OrganizationMembershipStatus.SUSPENDED,
		]),
	}),
});

export const organizationMemberQuerySchema = paginationQuerySchema.extend({
	search: z.string().trim().min(1).optional(),
	sortBy: z.enum(["createdAt", "updatedAt", "role"]).default("createdAt"),
	sortOrder: sortOrderSchema.default("desc"),
	role: z.enum([Role.ADMIN, Role.MANAGER, Role.MEMBER]).optional(),
	status: z
		.enum([
			OrganizationMembershipStatus.ACTIVE,
			OrganizationMembershipStatus.INACTIVE,
			OrganizationMembershipStatus.SUSPENDED,
		])
		.default(OrganizationMembershipStatus.ACTIVE),
});
