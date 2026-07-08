/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `warehouses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[managerPhone]` on the table `warehouses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `warehouses` table without a default value. This is not possible if the table is not empty.
  - Made the column `location` on table `warehouses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "warehouses" ADD COLUMN     "city" TEXT,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "managerName" TEXT,
ADD COLUMN     "managerPhone" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "state" TEXT,
ALTER COLUMN "location" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_code_key" ON "warehouses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_managerPhone_key" ON "warehouses"("managerPhone");
