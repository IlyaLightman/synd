-- CreateEnum
CREATE TYPE "DealStatus" AS ENUM ('done', 'failed', 'raising', 'invested', 'draft');

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "allocation_rub" INTEGER NOT NULL,
    "allocation_eth" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "DealStatus" NOT NULL DEFAULT 'draft',

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealToken" (
    "id" TEXT NOT NULL,
    "deal_id" TEXT NOT NULL,
    "token_address" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "token_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DealToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DealToken" ADD CONSTRAINT "DealToken_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
