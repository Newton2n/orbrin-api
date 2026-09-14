import { Router } from "express";
import express from "express";
import { subscriptionController } from "./subscripton.controller";
import { validate } from "../../middleware/validate";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/webhook", subscriptionController.webhookHandler);

// Create Stripe Checkout Session (Admin only)
router.post(
	"/checkout",
	authMiddleware.auth(Role.ADMIN),
	subscriptionController.createCheckoutSession,
);

// Get Subscription & Payment History for Organization
router.get(
	"/history",
	authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
	subscriptionController.getSubscriptionHistory,
);

export const subscriptionRoutes = router;
