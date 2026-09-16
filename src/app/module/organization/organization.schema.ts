import { z } from "zod";

export const createOrganizationValidationSchema = z.object({
	body: z.object({
		name: z
			.string()
			.trim()
			.min(2, "Organization name must be at least 2 characters")
			.max(100, "Organization name cannot exceed 100 characters"),

		slug: z
			.string()
			.trim()
			.toLowerCase()
			.min(2, "Organization slug must be at least 2 characters")
			.max(100, "Organization slug cannot exceed 100 characters")
			.regex(
				/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
				"Slug can only contain lowercase letters, numbers, and hyphens",
			),
	}),
});

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
		role: z.enum(["ADMIN", "MANAGER", "MEMBER"]),
	}),
});

export const updateMemberStatusValidationSchema = z.object({
	body: z.object({
		status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
	}),
});