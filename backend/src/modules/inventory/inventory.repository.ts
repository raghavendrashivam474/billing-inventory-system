// Inventory Repository — Sprint 3.2
import { prisma } from '../../config/prisma';

const inventoryInclude = {
  product:   { select: { id: true, name: true, sku: true, sellingPrice: true } },
  warehouse: { select: { id: true, name: true, code: true, location: true } },
} as const;

export interface InventoryQueryParams {
  page:        number;
  limit:       number;
  search:      string;
  sort:        string;
  order:       'asc' | 'desc';
  productId:   number | undefined;
  warehouseId: number | undefined;
}

export class InventoryRepository {

  async findAll(params: InventoryQueryParams) {
    const { page, limit, sort, order, productId, warehouseId } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (productId)   where.productId   = productId;
    if (warehouseId) where.warehouseId = warehouseId;

    const [data, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
        include: inventoryInclude,
      }),
      prisma.inventory.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.inventory.findUnique({
      where:   { id },
      include: inventoryInclude,
    });
  }

  async findByProduct(productId: number) {
    const product = await prisma.product.findUnique({
      where:  { id: productId },
      select: { id: true, name: true, sku: true },
    });

    if (!product) return null;

    const inventories = await prisma.inventory.findMany({
      where:   { productId },
      include: { warehouse: { select: { id: true, name: true, code: true, location: true } } },
    });

    const totalQuantity = inventories.reduce(
      (sum, inv) => sum + Number(inv.quantity),
      0
    );

    return {
      product,
      totalQuantity: totalQuantity.toString(),
      warehouses: inventories.map((inv) => ({
        warehouse: inv.warehouse,
        quantity:  inv.quantity.toString(),
      })),
    };
  }
}

export const inventoryRepository = new InventoryRepository();