import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { createPaginationMeta, getPagination } from "../../utils/query";
import type { z } from "zod";
import type { subscriptionHistoryQuerySchema } from "./subscripton.schema";
import {
  PaymentGateway,
  SubscriptionStatus,
} from "../../../../prisma/generated/prisma/enums";
import config from "../../config";
import type { Stripe } from "stripe";
import {
  handleInvoicePaymentSucceeded,
  handlePaymentSuccess,
} from "../../utils/stripe-event";

const createCheckoutSession = async (organizationId: string) => {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId, deletedAt: null },
    include: { subscriptions: true },
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  const subscription = organization.subscriptions;
  const today = new Date();
  const subcriptionEndDate = subscription?.currentPeriodEnd;

  if (subcriptionEndDate && subcriptionEndDate > today) {
    throw new Error(
      "Cannot create a new subscription while the current subscription is still active.",
    );
  }

  let customerId = organization.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      name: organization.name,
      metadata: { organizationId },
    });
    customerId = customer.id;

    await prisma.organization.update({
      where: { id: organizationId },
      data: { stripeCustomerId: customerId },
    });
  }

  // Create or ensure a PENDING subscription record exists before opening checkout
  await prisma.subscription.upsert({
    where: { organizationId },
    update: {
      status: SubscriptionStatus.PENDING,
    },
    create: {
      organizationId,
      planName: "orbrin base one month",
      status: SubscriptionStatus.PENDING,
      gateway: PaymentGateway.STRIPE, // Will be set after successful checkout
    },
  });

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: config.orbrin_base_one_month_plan_id, quantity: 1 }],
    mode: "subscription",
    success_url: `${config.frontend_url}/subscription/success`,
    cancel_url: `${config.frontend_url}/subscription/cancel`,
    metadata: {
      organizationId,
      planName: "orbrin base one month",
      amount: "20",
    },
  });

  return { url: session.url };
};

const webhookHandler = async (payload: Buffer, signature: string) => {
  const webhookSecret = config.stripe_webhook_secret;

  const event: Stripe.Event = stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret,
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      await handlePaymentSuccess(session);

      break;
    }

    case "invoice.payment_succeeded": {
      console.log("invoice payment succeeded hit");

      const invoice = event.data.object as Stripe.Invoice;

      await handleInvoicePaymentSucceeded(invoice);

      break;
    }

    default: {
      console.log(`Unhandled Stripe event: ${event.type}`);
      break;
    }
  }

  return {
    eventType: event.type,
    eventId: event.id,
  };
};

const getOrganizationSubscriptionHistory = async (
  organizationId: string,
  query: z.infer<typeof subscriptionHistoryQuerySchema>,
) => {
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId },
  });

  if (!subscription) {
    throw new Error("No subscription history found for the organization");
  }

  const { page, limit, search, sortBy, sortOrder, status } = query;
  const paymentWhere = {
    organizationId,
    ...(status ? { status } : {}),
    ...(search
      ? { transactionId: { contains: search, mode: "insensitive" as const } }
      : {}),
  };
  const [payments, total] = await prisma.$transaction([
    prisma.payment.findMany({
      where: paymentWhere,
      ...getPagination(page, limit),
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.payment.count({ where: paymentWhere }),
  ]);

  return {
    data: { ...subscription, payments },
    pagination: createPaginationMeta(page, limit, total),
  };
};

export const subscriptionService = {
  createCheckoutSession,
  getOrganizationSubscriptionHistory,
  webhookHandler,
};
