-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING');

-- AlterEnum
BEGIN;

CREATE TYPE "PaymentStatus_new" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);

ALTER TABLE "subscriptions"
ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "subscriptions"
ALTER COLUMN "status" TYPE "SubscriptionStatus"
USING (
    CASE "status"::text
        WHEN 'ACTIVE' THEN 'ACTIVE'::"SubscriptionStatus"
        ELSE 'ACTIVE'::"SubscriptionStatus"
    END
);

ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";

ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";

DROP TYPE "public"."PaymentStatus_old";

COMMIT;

-- DropIndex
DROP INDEX "subscriptions_transaction_id_key";

-- AlterTable
ALTER TABLE "organizations"
ADD COLUMN "stripe_customer_id" TEXT;

-- AlterTable
ALTER TABLE "subscriptions"
DROP COLUMN "amount",
DROP COLUMN "currency",
DROP COLUMN "expires_at",
DROP COLUMN "transaction_id",
ADD COLUMN "current_period_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN "current_period_start" TIMESTAMP(3) NOT NULL,
ADD COLUMN "subscription_id" TEXT NOT NULL,
ALTER COLUMN "gateway" SET DEFAULT 'STRIPE',
DROP COLUMN "status",
ADD COLUMN "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "subscription_id" TEXT,
    "gateway" "PaymentGateway" NOT NULL DEFAULT 'STRIPE',
    "transaction_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "invoice_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_id_key"
ON "payments"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_stripe_customer_id_key"
ON "organizations"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_subscription_id_key"
ON "subscriptions"("subscription_id");

-- AddForeignKey
ALTER TABLE "payments"
ADD CONSTRAINT "payments_organization_id_fkey"
FOREIGN KEY ("organization_id")
REFERENCES "organizations"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments"
ADD CONSTRAINT "payments_subscription_id_fkey"
FOREIGN KEY ("subscription_id")
REFERENCES "subscriptions"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;