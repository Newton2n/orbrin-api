import type { Request, Response, NextFunction } from "express";

import { prisma } from "../lib/prisma";
import { SubscriptionStatus } from "../../../prisma/generated/prisma/enums";

export const subscriptionCheck = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const organizationId = req.user?.organizationId;

		if (!organizationId) {
			return res.status(400).json({
				success: false,
				message: "Organization context is required.",
				errors: [],
			});
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
			return res.status(403).json({
				success: false,
				message: "An active subscription is required.",
				errors: [],
			});
		}

		if (subscription.status !== SubscriptionStatus.ACTIVE) {
			return res.status(403).json({
				success: false,
				message: "Please activate your subscription to access this feature.",
				errors: [],
			});
		}

		if (
			subscription.currentPeriodEnd &&
			subscription.currentPeriodEnd < new Date()
		) {
			return res.status(403).json({
				success: false,
				message: "Subscription has expired. Please renew your subscription.",
				errors: [],
			});
		}

		return next();
	} catch (error) {
		console.error("Subscription check error:", error);

		return res.status(500).json({
			success: false,
			message: "Something went wrong",
			errors: [],
		});
	}
};
