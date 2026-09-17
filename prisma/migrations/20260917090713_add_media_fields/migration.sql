-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "logo_public_id" TEXT,
ADD COLUMN     "logo_url" TEXT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "document_public_id" TEXT,
ADD COLUMN     "document_url" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profile_image_public_id" TEXT,
ADD COLUMN     "profile_image_url" TEXT;
