import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";

type BodyValidationSchema = z.ZodObject<{
	body: z.ZodTypeAny;
}>;

export const validate = (schema: BodyValidationSchema) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result = schema.safeParse({
			body: req.body,
		});

		if (!result.success) {
			next(result.error);
			return;
		}

		req.body = result.data.body;
		next();
	};
};

declare global {
	namespace Express {
		interface Request {
			validatedQuery?: unknown;
		}
	}
}

export const validateQuery = (schema: z.ZodType) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result = schema.safeParse(req.query);

		if (!result.success) {
			next(result.error);
			return;
		}

		req.validatedQuery = result.data;
		next();
	};
};
