-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'VILLA', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('FOR_SALE', 'FOR_RENT', 'SOLD');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Agent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "photoUrl" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "facebookUrl" TEXT,
    "twitterUrl" TEXT,
    "linkedInUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Property" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" INTEGER NOT NULL DEFAULT 0,
    "areaSqft" INTEGER NOT NULL DEFAULT 0,
    "propertyType" "public"."PropertyType" NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'FOR_SALE',
    "mainImage" TEXT,
    "images" TEXT[],
    "agentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "propertyId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "public"."Agent"("email");

-- CreateIndex
CREATE INDEX "Agent_name_idx" ON "public"."Agent"("name");

-- CreateIndex
CREATE INDEX "Agent_email_idx" ON "public"."Agent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "public"."Property"("slug");

-- CreateIndex
CREATE INDEX "Property_title_idx" ON "public"."Property"("title");

-- CreateIndex
CREATE INDEX "Property_city_idx" ON "public"."Property"("city");

-- CreateIndex
CREATE INDEX "Property_state_idx" ON "public"."Property"("state");

-- CreateIndex
CREATE INDEX "Property_bedrooms_bathrooms_idx" ON "public"."Property"("bedrooms", "bathrooms");

-- CreateIndex
CREATE INDEX "Property_createdAt_idx" ON "public"."Property"("createdAt");

-- CreateIndex
CREATE INDEX "Property_price_idx" ON "public"."Property"("price");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "public"."Property"("propertyType");

-- CreateIndex
CREATE INDEX "Property_status_idx" ON "public"."Property"("status");

-- CreateIndex
CREATE INDEX "Inquiry_propertyId_idx" ON "public"."Inquiry"("propertyId");

-- CreateIndex
CREATE INDEX "Inquiry_agentId_idx" ON "public"."Inquiry"("agentId");

-- CreateIndex
CREATE INDEX "Inquiry_createdAt_idx" ON "public"."Inquiry"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
