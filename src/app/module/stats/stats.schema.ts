import { z } from "zod";

const isNotFutureDate = (value: string | undefined) => {
  if (!value) {
    return true;
  }

  const date = new Date(value);

  return (
    !Number.isNaN(date.getTime()) &&
    date.getTime() <= Date.now()
  );
};

const reportQuerySchema = z
  .object({
    from: z
      .iso.datetime({ offset: true })
      .optional()
      .refine(isNotFutureDate, {
        message: "'from' cannot be a future date.",
        path: ["from"],
      }),
    to: z
      .iso.datetime({ offset: true })
      .optional()
      .refine(isNotFutureDate, {
        message: "'to' cannot be a future date.",
        path: ["to"],
      }),
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