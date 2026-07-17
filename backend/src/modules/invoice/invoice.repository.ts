// Invoice Repository — Sprint 3.6
import { prisma }        from '../../config/prisma';
import { InvoiceStatus } from '@prisma/client';
import { UpdateInvoiceDTO } from './dto/update-invoice.dto';

const invoiceInclude = {
  customer:   { select: { id: true, name: true, email: true, phone: true, gstNumber: true } },
  salesOrder: { select: { id: true, orderNumber: true, status: true, dispatchStatus: true } },
  dispatch:   { select: { id: true, dispatchNumber: true, dispatchDate: true, status: true } },
  items: {
    include: {
      product: { select: { id: true, name: true, sku: true } },
    },
  },
} as const;

export interface InvoiceQueryParams {
  page:         number;
  limit:        number;
  search:       string;
  sort:         string;
  order:        'asc' | 'desc';
  status:       InvoiceStatus | undefined;
  customerId:   number | undefined;
  salesOrderId: number | undefined;
}

export class InvoiceRepository {

  async findAll(params: InvoiceQueryParams) {
    const { page, limit, search, sort, order, status, customerId, salesOrderId } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { customer:      { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status)       where.status       = status;
    if (customerId)   where.customerId   = customerId;
    if (salesOrderId) where.salesOrderId = salesOrderId;

    const [data, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
        include: invoiceInclude,
      }),
      prisma.invoice.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.invoice.findUnique({
      where:   { id },
      include: invoiceInclude,
    });
  }

  async findByInvoiceNumber(invoiceNumber: string) {
    return prisma.invoice.findUnique({ where: { invoiceNumber } });
  }

  async getLastInvoiceNumber(year: number): Promise<string | null> {
    const prefix = `INV-${year}-`;
    const last   = await prisma.invoice.findFirst({
      where:   { invoiceNumber: { startsWith: prefix } },
      orderBy: { invoiceNumber: 'desc' },
      select:  { invoiceNumber: true },
    });
    return last?.invoiceNumber ?? null;
  }

  async update(id: number, dto: UpdateInvoiceDTO) {
    return prisma.invoice.update({
      where:   { id },
      data:    dto,
      include: invoiceInclude,
    });
  }

  async updateStatus(id: number, status: InvoiceStatus) {
    return prisma.invoice.update({
      where:   { id },
      data:    { status },
      include: invoiceInclude,
    });
  }
}

export const invoiceRepository = new InvoiceRepository();