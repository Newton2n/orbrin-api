-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'PENDING';
