// Stock Adjustment Repository — Sprint 3.3
import { prisma }                from '../../config/prisma';
import { StockAdjustmentType, StockAdjustmentReason } from '@prisma/client';

const adjustmentInclude = {
  product:   { select: { id: true, name: true, sku: true } },
  warehouse: { select: { id: true, name: true, code: true, location: true } },
} as const;

export interface SAQueryParams {
  page:           number;
  limit:          number;
  search:         string;
  sort:           string;
  order:          'asc' | 'desc';
  productId:      number | undefined;
  warehouseId:    number | undefined;
  adjustmentType: StockAdjustmentType   | undefined;
  reason:         StockAdjustmentReason | undefined;
  fromDate:       string | undefined;
  toDate:         string | undefined;
}

export class StockAdjustmentRepository {

  async findAll(params: SAQueryParams) {
    const {
      page, limit, search, sort, order,
      productId, warehouseId, adjustmentType, reason,
      fromDate, toDate,
    } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { adjustmentNumber: { contains: search, mode: 'insensitive' } },
        { notes:            { contains: search, mode: 'insensitive' } },
      ];
    }

    if (productId)      where.productId      = productId;
    if (warehouseId)    where.warehouseId    = warehouseId;
    if (adjustmentType) where.adjustmentType = adjustmentType;
    if (reason)         where.reason         = reason;

    if (fromDate || toDate) {
      where.createdAt = {
        ...(fromDate ? { gte: new Date(fromDate) } : {}),
        ...(toDate   ? { lte: new Date(toDate)   } : {}),
      };
    }

    const [data, total] = await Promise.all([
      prisma.stockAdjustment.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
        include: adjustmentInclude,
      }),
      prisma.stockAdjustment.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.stockAdjustment.findUnique({
      where:   { id },
      include: adjustmentInclude,
    });
  }

  async getLastAdjustmentNumber(year: number): Promise<string | null> {
    const prefix = `ADJ-${year}-`;
    const last   = await prisma.stockAdjustment.findFirst({
      where:   { adjustmentNumber: { startsWith: prefix } },
      orderBy: { adjustmentNumber: 'desc' },
      select:  { adjustmentNumber: true },
    });
    return last?.adjustmentNumber ?? null;
  }
}

export const stockAdjustmentRepository = new StockAdjustmentRepository();