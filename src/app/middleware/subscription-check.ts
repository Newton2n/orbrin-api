import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { SubscriptionStatus } from "../../../prisma/generated/prisma/enums";
import { AppError } from "../utils/app-error";
import { StatusCodes } from "http-status-codes";

export const subscriptionCheck = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const organizationId = req.user?.organizationId;

		if (!organizationId) {
			return next(
				new AppError(
					StatusCodes.BAD_REQUEST,
					"Organization context is required.",
				),
			);
		}

		const subscription = await prisma.subscription.findUnique({
			where: {
				organizationId,
			},
			select: {
				status: true,
				currentPeriodEnd: true,
			},
		});

		if (!subscription) {
			return next(
				new AppError(
					StatusCodes.FORBIDDEN,
					"No active subscription found. Please subscribe to access this feature.",
				),
			);
		}

		if (subscription.status !== SubscriptionStatus.ACTIVE) {
			return next(
				new AppError(
					StatusCodes.FORBIDDEN,
					"Please activate your subscription to access this feature.",
				),
			);
		}

		if (
			subscription.currentPeriodEnd &&
			subscription.currentPeriodEnd < new Date()
		) {
			return next(
				new AppError(
					StatusCodes.FORBIDDEN,
					"Subscription has expired. Please renew your subscription.",
				),
			);
		}

		return next();
	} catch (error) {
		console.error("Subscription check error:", error);

		return next(error);
	}
};
