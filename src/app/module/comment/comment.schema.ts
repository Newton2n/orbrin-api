import { z } from "zod";

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

export const commentValidation = {
  createCommentSchema,
  updateCommentSchema,
};