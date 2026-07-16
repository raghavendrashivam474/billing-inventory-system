// Dispatch Repository — Sprint 3.5
import { prisma } from '../../config/prisma';

const dispatchInclude = {
  salesOrder: {
    select: {
      id:             true,
      orderNumber:    true,
      status:         true,
      dispatchStatus: true,
    },
  },
  warehouse: { select: { id: true, name: true, code: true, location: true } },
  items: {
    include: {
      product:       { select: { id: true, name: true, sku: true } },
      salesOrderItem: { select: { id: true, quantity: true } },
    },
  },
} as const;

export interface DispatchQueryParams {
  page:         number;
  limit:        number;
  search:       string;
  sort:         string;
  order:        'asc' | 'desc';
  salesOrderId: number | undefined;
  warehouseId:  number | undefined;
}

export class DispatchRepository {

  async findAll(params: DispatchQueryParams) {
    const { page, limit, search, sort, order, salesOrderId, warehouseId } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { dispatchNumber: { contains: search, mode: 'insensitive' } },
        { salesOrder: { orderNumber: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (salesOrderId) where.salesOrderId = salesOrderId;
    if (warehouseId)  where.warehouseId  = warehouseId;

    const [data, total] = await Promise.all([
      prisma.dispatch.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
        include: dispatchInclude,
      }),
      prisma.dispatch.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.dispatch.findUnique({
      where:   { id },
      include: dispatchInclude,
    });
  }

  async getLastDispatchNumber(year: number): Promise<string | null> {
    const prefix = `DSP-${year}-`;
    const last   = await prisma.dispatch.findFirst({
      where:   { dispatchNumber: { startsWith: prefix } },
      orderBy: { dispatchNumber: 'desc' },
      select:  { dispatchNumber: true },
    });
    return last?.dispatchNumber ?? null;
  }
}

export const dispatchRepository = new DispatchRepository();