import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { subscriptionService } from "./subscripton.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import type { z } from "zod";
import type { subscriptionHistoryQuerySchema } from "./subscripton.schema";
import { AppError } from "../../utils/app-error";

// Create Stripe Checkout Session
const createCheckoutSession = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const organizationId = req.user?.organizationId;
		const userId = req.user?.id;
		if (!userId) {
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				"User ID is missing in the request context.",
			);
		}

		if (!organizationId) {
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				"Organization ID is missing in the request context.",
			);
		}

		const result = await subscriptionService.createCheckoutSession(
			organizationId,
			userId,
		);

		sendSuccessResponse(res, {
			statusCode: StatusCodes.OK,
			message: "Checkout session created successfully",
			data: result,
		});
	},
);

// Get Subscription & Payment History for Organization
const getSubscriptionHistory = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const organizationId = req.user?.organizationId;

		if (!organizationId) {
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				"Organization ID is missing in the request context.",
			);
		}

		const result = await subscriptionService.getOrganizationSubscriptionHistory(
			organizationId,
			req.validatedQuery as z.infer<typeof subscriptionHistoryQuerySchema>,
		);

		sendSuccessResponse(res, {
			statusCode: StatusCodes.OK,
			message: "Subscription and billing history retrieved successfully",
			data: result.data,
			pagination: result.pagination,
		});
	},
);

// Webhook handler for Stripe events
const webhookHandler = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const signature = req.headers["stripe-signature"] as string;

		const result = await subscriptionService.webhookHandler(
			req.body,
			signature,
		);

		sendSuccessResponse(res, {
			statusCode: StatusCodes.OK,
			message: "Webhook processed successfully",
			data: result,
		});
	},
);

export const subscriptionController = {
	createCheckoutSession,
	getSubscriptionHistory,
	webhookHandler,
};
