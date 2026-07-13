// Stock Movement Repository — Sprint 3.2
// Read-only and append-only — no update or delete methods
import { prisma }              from '../../config/prisma';
import { StockMovementType, StockReferenceType } from '@prisma/client';

const smInclude = {
  product:   { select: { id: true, name: true, sku: true } },
  warehouse: { select: { id: true, name: true, code: true, location: true } },
} as const;

export interface SMQueryParams {
  page:          number;
  limit:         number;
  sort:          string;
  order:         'asc' | 'desc';
  productId:     number | undefined;
  warehouseId:   number | undefined;
  type:          StockMovementType | undefined;
  referenceType: StockReferenceType | undefined;
  referenceId:   number | undefined;
  from:          string | undefined;
  to:            string | undefined;
}

export class StockMovementRepository {

  async findAll(params: SMQueryParams) {
    const {
      page, limit, sort, order,
      productId, warehouseId, type, referenceType, referenceId,
      from, to,
    } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (productId)     where.productId     = productId;
    if (warehouseId)   where.warehouseId   = warehouseId;
    if (type)          where.type          = type;
    if (referenceType) where.referenceType = referenceType;
    if (referenceId)   where.referenceId   = referenceId;

    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to   ? { lte: new Date(to)   } : {}),
      };
    }

    const [data, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
        include: smInclude,
      }),
      prisma.stockMovement.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.stockMovement.findUnique({
      where:   { id },
      include: smInclude,
    });
  }
}

export const stockMovementRepository = new StockMovementRepository();