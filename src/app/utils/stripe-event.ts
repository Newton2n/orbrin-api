import type Stripe from "stripe";

import { stripe } from "../lib/stripe";
import { prisma } from "../lib/prisma";

import {
	PaymentGateway,
	PaymentStatus,
	SubscriptionStatus,
} from "../../../prisma/generated/prisma/enums";

export const handlePaymentSuccess = async (
	session: Stripe.Checkout.Session,
) => {
	const organizationId = session.metadata?.organizationId;

	if (!organizationId) {
		throw new Error(
			"Missing organizationId in Stripe Checkout session metadata",
		);
	}

	const planName = session.metadata?.planName ?? "Orbrin Base One Month";

	const stripeSubscriptionId =
		typeof session.subscription === "string"
			? session.subscription
			: session.subscription?.id;

	if (!stripeSubscriptionId) {
		throw new Error("Missing Stripe subscription ID from Checkout session");
	}

	const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

	console.log("Stripe subscription:", stripeSub);

	const subscriptionItem = stripeSub.items.data[0];

	if (!subscriptionItem) {
		throw new Error(`No subscription item found for ${stripeSub.id}`);
	}

	const periodStart = subscriptionItem.current_period_start;
	const periodEnd = subscriptionItem.current_period_end;

	if (typeof periodStart !== "number" || typeof periodEnd !== "number") {
		throw new Error(`Invalid subscription period for ${stripeSub.id}`);
	}

	const currentPeriodStart = new Date(periodStart * 1000);
	const currentPeriodEnd = new Date(periodEnd * 1000);

	const subRecord = await prisma.subscription.upsert({
		where: {
			organizationId,
		},

		update: {
			planName,
			status: SubscriptionStatus.ACTIVE,
			gateway: PaymentGateway.STRIPE,
			subscriptionId: stripeSub.id,
			currentPeriodStart,
			currentPeriodEnd,
		},

		create: {
			organizationId,
			planName,
			status: SubscriptionStatus.ACTIVE,
			gateway: PaymentGateway.STRIPE,
			subscriptionId: stripeSub.id,
			currentPeriodStart,
			currentPeriodEnd,
		},
	});

	console.log("Subscription saved:", subRecord.id);

	return subRecord;
};

export const handleInvoicePaymentSucceeded = async (
	invoice: Stripe.Invoice,
) => {
	const stripeSubscriptionId =
		invoice.parent?.subscription_details?.subscription;

	if (!stripeSubscriptionId) {
		throw new Error(`Invoice ${invoice.id} has no subscription ID`);
	}

	console.log("Invoice ID:", invoice.id);
	console.log("Stripe subscription ID:", stripeSubscriptionId);

	// Find local subscription
	let subscription = await prisma.subscription.findUnique({
		where: {
			subscriptionId: stripeSubscriptionId as string,
		},
	});

	if (!subscription) {
		console.log(
			"Local subscription not found. Creating it from Stripe subscription.",
		);

		const stripeSub = await stripe.subscriptions.retrieve(
			stripeSubscriptionId as string,
		);

		const subscriptionItem = stripeSub.items.data[0];

		if (!subscriptionItem) {
			throw new Error(`No subscription item found for ${stripeSub.id}`);
		}

		const periodStart = subscriptionItem.current_period_start;

		const periodEnd = subscriptionItem.current_period_end;

		const customerId =
			typeof stripeSub.customer === "string"
				? stripeSub.customer
				: stripeSub.customer.id;

		const customer = await stripe.customers.retrieve(customerId);

		if (customer.deleted) {
			throw new Error(`Stripe customer ${customerId} has been deleted`);
		}

		const organizationId = customer.metadata?.organizationId;

		if (!organizationId) {
			throw new Error(
				`Missing organizationId in Stripe customer metadata for ${customerId}`,
			);
		}

		const planName =
			stripeSub.items.data[0]?.price?.nickname ?? "Orbrin Base One Month";

		subscription = await prisma.subscription.upsert({
			where: {
				organizationId,
			},

			update: {
				planName,
				status: SubscriptionStatus.ACTIVE,
				gateway: PaymentGateway.STRIPE,
				subscriptionId: stripeSub.id,
				currentPeriodStart: new Date(periodStart * 1000),
				currentPeriodEnd: new Date(periodEnd * 1000),
			},

			create: {
				organizationId,
				planName,
				status: SubscriptionStatus.ACTIVE,
				gateway: PaymentGateway.STRIPE,
				subscriptionId: stripeSub.id,
				currentPeriodStart: new Date(periodStart * 1000),
				currentPeriodEnd: new Date(periodEnd * 1000),
			},
		});
	}

	const amount = invoice.amount_paid / 100;
	const currency = invoice.currency.toUpperCase();

	const payment = await prisma.payment.upsert({
		where: {
			transactionId: invoice.id,
		},

		update: {
			status: PaymentStatus.COMPLETED,
			amount,
			currency,
			organizationId: subscription.organizationId,
			subscriptionId: subscription.id,
		},

		create: {
			organizationId: subscription.organizationId,
			subscriptionId: subscription.id,
			gateway: PaymentGateway.STRIPE,
			transactionId: invoice.id,
			amount,
			currency,
			status: PaymentStatus.COMPLETED,
		},
	});

	console.log("Payment saved:", payment.id);

	return payment;
};
