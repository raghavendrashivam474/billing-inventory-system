// Sales Order Repository — Sprint 3.4
import { prisma }           from '../../config/prisma';
import { SalesOrderStatus } from '@prisma/client';

const salesOrderInclude = {
  customer:  { select: { id: true, name: true, email: true, phone: true } },
  warehouse: { select: { id: true, name: true, code: true, location: true } },
  items: {
    include: {
      product: { select: { id: true, name: true, sku: true } },
    },
  },
} as const;

export interface SOQueryParams {
  page:        number;
  limit:       number;
  search:      string;
  sort:        string;
  order:       'asc' | 'desc';
  status:      SalesOrderStatus | undefined;
  customerId:  number | undefined;
  warehouseId: number | undefined;
}

export class SalesOrderRepository {

  async findAll(params: SOQueryParams) {
    const { page, limit, search, sort, order, status, customerId, warehouseId } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customer:    { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status)      where.status      = status;
    if (customerId)  where.customerId  = customerId;
    if (warehouseId) where.warehouseId = warehouseId;

    const [data, total] = await Promise.all([
      prisma.salesOrder.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
        include: salesOrderInclude,
      }),
      prisma.salesOrder.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.salesOrder.findUnique({
      where:   { id },
      include: salesOrderInclude,
    });
  }

  async findByOrderNumber(orderNumber: string) {
    return prisma.salesOrder.findUnique({ where: { orderNumber } });
  }

  async getLastOrderNumber(year: number): Promise<string | null> {
    const prefix = `SO-${year}-`;
    const last   = await prisma.salesOrder.findFirst({
      where:   { orderNumber: { startsWith: prefix } },
      orderBy: { orderNumber: 'desc' },
      select:  { orderNumber: true },
    });
    return last?.orderNumber ?? null;
  }

  async updateStatus(id: number, status: SalesOrderStatus) {
    return prisma.salesOrder.update({
      where:   { id },
      data:    { status },
      include: salesOrderInclude,
    });
  }
}

export const salesOrderRepository = new SalesOrderRepository();