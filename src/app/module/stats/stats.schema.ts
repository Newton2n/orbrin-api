
import { z } from "zod";

const reportQuerySchema = z
  .object({
    from: z.iso.datetime({ offset: true }).optional(),
    to: z.iso.datetime({ offset: true }).optional(),
  })
  .refine(
    (query) =>
      !query.from ||
      !query.to ||
      new Date(query.from) <= new Date(query.to),
    {
      message: "'from' must be earlier than or equal to 'to'.",
      path: ["from"],
    },
  );

export const statsValidation = {
  reportQuerySchema,
};

export type ReportQuery = z.infer<typeof reportQuerySchema>;
