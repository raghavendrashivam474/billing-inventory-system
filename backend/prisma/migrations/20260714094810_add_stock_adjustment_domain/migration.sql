-- CreateEnum
CREATE TYPE "StockAdjustmentType" AS ENUM ('INCREASE', 'DECREASE');

-- CreateEnum
CREATE TYPE "StockAdjustmentReason" AS ENUM ('PHYSICAL_COUNT', 'DAMAGED', 'LOST', 'EXPIRED', 'DATA_CORRECTION', 'OTHER');

-- CreateTable
CREATE TABLE "stock_adjustments" (
    "id" SERIAL NOT NULL,
    "adjustmentNumber" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "adjustmentType" "StockAdjustmentType" NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,
    "reason" "StockAdjustmentReason" NOT NULL,
    "notes" TEXT,
    "quantityBefore" DECIMAL(10,3) NOT NULL,
    "quantityAfter" DECIMAL(10,3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_adjustments_adjustmentNumber_key" ON "stock_adjustments"("adjustmentNumber");

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
