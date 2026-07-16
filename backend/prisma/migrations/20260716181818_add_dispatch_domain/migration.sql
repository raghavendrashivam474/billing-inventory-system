/*
  Warnings:

  - The values [SALE] on the enum `StockMovementType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "SalesOrderDispatchStatus" AS ENUM ('NOT_DISPATCHED', 'PARTIALLY_DISPATCHED', 'FULLY_DISPATCHED');

-- CreateEnum
CREATE TYPE "DispatchStatus" AS ENUM ('DISPATCHED');

-- AlterEnum
BEGIN;
CREATE TYPE "StockMovementType_new" AS ENUM ('PURCHASE_RECEIPT', 'SALE_DISPATCH', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'TRANSFER_IN', 'TRANSFER_OUT', 'RETURN_IN', 'RETURN_OUT');
ALTER TABLE "stock_movements" ALTER COLUMN "type" TYPE "StockMovementType_new" USING ("type"::text::"StockMovementType_new");
ALTER TYPE "StockMovementType" RENAME TO "StockMovementType_old";
ALTER TYPE "StockMovementType_new" RENAME TO "StockMovementType";
DROP TYPE "StockMovementType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "StockReferenceType" ADD VALUE 'DISPATCH';

-- AlterTable
ALTER TABLE "sales_orders" ADD COLUMN     "dispatchStatus" "SalesOrderDispatchStatus" NOT NULL DEFAULT 'NOT_DISPATCHED';

-- CreateTable
CREATE TABLE "dispatches" (
    "id" SERIAL NOT NULL,
    "dispatchNumber" TEXT NOT NULL,
    "salesOrderId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "dispatchDate" TIMESTAMP(3) NOT NULL,
    "status" "DispatchStatus" NOT NULL DEFAULT 'DISPATCHED',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dispatches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispatch_items" (
    "id" SERIAL NOT NULL,
    "dispatchId" INTEGER NOT NULL,
    "salesOrderItemId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantityDispatched" DECIMAL(10,3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dispatch_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dispatches_dispatchNumber_key" ON "dispatches"("dispatchNumber");

-- AddForeignKey
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "sales_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch_items" ADD CONSTRAINT "dispatch_items_dispatchId_fkey" FOREIGN KEY ("dispatchId") REFERENCES "dispatches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch_items" ADD CONSTRAINT "dispatch_items_salesOrderItemId_fkey" FOREIGN KEY ("salesOrderItemId") REFERENCES "sales_order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch_items" ADD CONSTRAINT "dispatch_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
