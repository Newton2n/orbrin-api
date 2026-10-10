import { Router } from "express";
import express from "express";
import { subscriptionController } from "./subscripton.controller";
import { validate, validateQuery } from "../../middleware/validate";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { subscriptionHistoryQuerySchema } from "./subscripton.schema";
import { emailVerificationMiddleware } from "../../middleware/email-verified";
const router = Router();

router.post("/webhook", subscriptionController.webhookHandler);

// Create Stripe Checkout Session (Admin only)
router.post(
	"/checkout",
	authMiddleware.auth(Role.ADMIN),
	emailVerificationMiddleware,
	subscriptionController.createCheckoutSession,
);

// Get Subscription & Payment History for Organization
router.get(
	"/history",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	emailVerificationMiddleware,
	validateQuery(subscriptionHistoryQuerySchema),
	subscriptionController.getSubscriptionHistory,
);

export const subscriptionRoutes = router;
