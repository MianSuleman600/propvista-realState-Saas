-- DropForeignKey
ALTER TABLE "public"."Property" DROP CONSTRAINT "Property_agentId_fkey";

-- AlterTable
ALTER TABLE "public"."Agent" ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Property" ALTER COLUMN "agentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
