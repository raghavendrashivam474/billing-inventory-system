-- CreateTable
CREATE TABLE "storage_locations" (
    "id" SERIAL NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "aisle" TEXT,
    "rack" TEXT,
    "shelf" TEXT,
    "bin" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storage_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "storage_locations_warehouseId_idx" ON "storage_locations"("warehouseId");

-- CreateIndex
CREATE INDEX "storage_locations_isActive_idx" ON "storage_locations"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "storage_locations_warehouseId_code_key" ON "storage_locations"("warehouseId", "code");

-- AddForeignKey
ALTER TABLE "storage_locations" ADD CONSTRAINT "storage_locations_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
