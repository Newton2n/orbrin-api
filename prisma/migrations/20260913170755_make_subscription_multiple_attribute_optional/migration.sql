-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "current_period_end" DROP NOT NULL,
ALTER COLUMN "current_period_start" DROP NOT NULL,
ALTER COLUMN "subscription_id" DROP NOT NULL;
