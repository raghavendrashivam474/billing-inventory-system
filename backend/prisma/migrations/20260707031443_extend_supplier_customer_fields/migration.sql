/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gstNumber]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gstNumber]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "contactPerson" TEXT,
ADD COLUMN     "gstNumber" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "state" TEXT;

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "contactPerson" TEXT,
ADD COLUMN     "gstNumber" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "state" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "customers_gstNumber_key" ON "customers"("gstNumber");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_phone_key" ON "suppliers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_gstNumber_key" ON "suppliers"("gstNumber");
