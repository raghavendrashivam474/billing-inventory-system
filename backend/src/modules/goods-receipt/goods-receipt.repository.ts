// Goods Receipt Repository — Sprint 3.2
import { prisma } from '../../config/prisma';

const grnInclude = {
  purchaseOrder: {
    select: {
      id:            true,
      orderNumber:   true,
      status:        true,
      receiptStatus: true,
    },
  },
  warehouse: { select: { id: true, name: true, code: true, location: true } },
  items: {
    include: {
      product: { select: { id: true, name: true, sku: true } },
    },
  },
} as const;

export interface GRNQueryParams {
  page:            number;
  limit:           number;
  search:          string;
  sort:            string;
  order:           'asc' | 'desc';
  purchaseOrderId: number | undefined;
  warehouseId:     number | undefined;
}

export class GoodsReceiptRepository {

  async findAll(params: GRNQueryParams) {
    const { page, limit, search, sort, order, purchaseOrderId, warehouseId } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { receiptNumber:         { contains: search, mode: 'insensitive' } },
        { supplierInvoiceNumber: { contains: search, mode: 'insensitive' } },
        { deliveryReference:     { contains: search, mode: 'insensitive' } },
      ];
    }

    if (purchaseOrderId) where.purchaseOrderId = purchaseOrderId;
    if (warehouseId)     where.warehouseId     = warehouseId;

    const [data, total] = await Promise.all([
      prisma.goodsReceipt.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
        include: grnInclude,
      }),
      prisma.goodsReceipt.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.goodsReceipt.findUnique({
      where:   { id },
      include: grnInclude,
    });
  }

  async getLastReceiptNumber(year: number): Promise<string | null> {
    const prefix = `GRN-${year}-`;
    const last   = await prisma.goodsReceipt.findFirst({
      where:   { receiptNumber: { startsWith: prefix } },
      orderBy: { receiptNumber: 'desc' },
      select:  { receiptNumber: true },
    });
    return last?.receiptNumber ?? null;
  }
}

export const goodsReceiptRepository = new GoodsReceiptRepository();