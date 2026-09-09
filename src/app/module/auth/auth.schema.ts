import { z } from "zod";

const registerOrgOwnerSchema = z.object({
  body: z.object({
    fullName: z
      .string({ error: "Full name is required" })
      .trim()
      .min(1, { error: "Full name cannot be empty" }),
    email: z.email({ error: "Invalid email format" }),
    password: z
      .string({ error: "Password is required" })
      .min(6, { error: "Password must be at least 6 characters" }),
    organizationName: z
      .string({ error: "Organization name is required" })
      .trim()
      .min(1, { error: "Organization name cannot be empty" }),
    organizationSlug: z
      .string({ error: "Organization slug is required" })
      .trim()
      .min(1, { error: "Organization slug cannot be empty" })
      .regex(/^[a-z0-9-]+$/, {
        error: "Slug can only contain lowercase letters, numbers, and hyphens",
      }),
  }),
});

const registerMemberSchema = z.object({
  body: z.object({
    fullName: z
      .string({ error: "Full name is required" })
      .trim()
      .min(1, { error: "Full name cannot be empty" }),
    email: z.email({ error: "Invalid email format" }),
    password: z
      .string({ error: "Password is required" })
      .min(6, { error: "Password must be at least 6 characters" }),
    organizationId: z
      .string({ error: "Organization ID is required" })
      .trim()
      .min(1, { error: "Organization ID cannot be empty" }),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.email({ error: "Invalid email format" }),
    password: z
      .string({ error: "Password is required" })
      .min(1, { error: "Password is required" }),
  }),
});

export const authValidation = {
  registerOrgOwnerSchema,
  registerMemberSchema,
  loginSchema,
};
