import { z } from "zod";
import { PaymentStatus } from "../../../../prisma/generated/prisma/enums";
import {
	paginationQuerySchema,
	sortOrderSchema,
} from "../../utils/query-schema";

export const subscriptionHistoryQuerySchema = paginationQuerySchema.extend({
	search: z.string().trim().min(1).optional(),
	sortBy: z.enum(["createdAt", "updatedAt"]).default("createdAt"),
	sortOrder: sortOrderSchema.default("desc"),
	status: z
		.enum([
			PaymentStatus.PENDING,
			PaymentStatus.COMPLETED,
			PaymentStatus.FAILED,
			PaymentStatus.REFUNDED,
		])
		.optional(),
});
