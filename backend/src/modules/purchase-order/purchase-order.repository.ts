// Purchase Order Repository — Sprint 3.1
import { prisma }                  from '../../config/prisma';
import { PurchaseOrderStatus }     from '@prisma/client';
import { Decimal }                 from '@prisma/client/runtime/library';

// ================================
// Nested include for full response
// ================================
const purchaseOrderInclude = {
  supplier:  { select: { id: true, name: true, email: true, phone: true } },
  warehouse: { select: { id: true, name: true, code: true, location: true } },
  items: {
    include: {
      product: { select: { id: true, name: true, sku: true } },
    },
  },
} as const;

export interface POQueryParams {
  page:        number;
  limit:       number;
  search:      string;
  sort:        string;
  order:       'asc' | 'desc';
  status:      PurchaseOrderStatus | undefined;
  supplierId:  number | undefined;
  warehouseId: number | undefined;
  fromDate:    string | undefined;
  toDate:      string | undefined;
}

export interface CreatePOData {
  orderNumber: string;
  supplierId:  number;
  warehouseId: number;
  orderDate:   Date;
  expectedDate?: Date;
  status:      PurchaseOrderStatus;
  subtotal:    Decimal;
  taxAmount:   Decimal;
  totalAmount: Decimal;
  notes?:      string;
}

export interface CreatePOItemData {
  productId:      number;
  quantity:       Decimal;
  unitCost:       Decimal;
  taxRate:        Decimal;
  taxAmount:      Decimal;
  lineTotal:      Decimal;
}

export class PurchaseOrderRepository {

  async findAll(params: POQueryParams) {
    const { page, limit, search, sort, order, status, supplierId, warehouseId, fromDate, toDate } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { supplier:    { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status)      where.status      = status;
    if (supplierId)  where.supplierId  = supplierId;
    if (warehouseId) where.warehouseId = warehouseId;

    if (fromDate || toDate) {
      where.orderDate = {
        ...(fromDate ? { gte: new Date(fromDate) } : {}),
        ...(toDate   ? { lte: new Date(toDate)   } : {}),
      };
    }

    const [data, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
        include: purchaseOrderInclude,
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.purchaseOrder.findUnique({
      where:   { id },
      include: purchaseOrderInclude,
    });
  }

  async findByOrderNumber(orderNumber: string) {
    return prisma.purchaseOrder.findUnique({ where: { orderNumber } });
  }

  async getLastOrderNumber(year: number): Promise<string | null> {
    const prefix = `PO-${year}-`;
    const last = await prisma.purchaseOrder.findFirst({
      where:   { orderNumber: { startsWith: prefix } },
      orderBy: { orderNumber: 'desc' },
      select:  { orderNumber: true },
    });
    return last?.orderNumber ?? null;
  }

  async create(poData: CreatePOData, itemsData: CreatePOItemData[]) {
    return prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.create({
        data: {
          ...poData,
          items: {
            create: itemsData.map((item) => ({ ...item })),
          },
        },
        include: purchaseOrderInclude,
      });
      return po;
    });
  }

  async update(
    id:        number,
    poData:    Partial<CreatePOData>,
    itemsData: CreatePOItemData[] | undefined
  ) {
    return prisma.$transaction(async (tx) => {
      if (itemsData !== undefined) {
        await tx.purchaseOrderItem.deleteMany({ where: { purchaseOrderId: id } });
        await tx.purchaseOrderItem.createMany({
          data: itemsData.map((item) => ({ ...item, purchaseOrderId: id })),
        });
      }

      const po = await tx.purchaseOrder.update({
        where:   { id },
        data:    poData,
        include: purchaseOrderInclude,
      });

      return po;
    });
  }

  async updateStatus(id: number, status: PurchaseOrderStatus) {
    return prisma.purchaseOrder.update({
      where:   { id },
      data:    { status },
      include: purchaseOrderInclude,
    });
  }
}

export const purchaseOrderRepository = new PurchaseOrderRepository();