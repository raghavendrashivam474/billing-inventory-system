// Payment Repository — Sprint 3.7
import { prisma }        from '../../config/prisma';
import { PaymentMethod } from '@prisma/client';

const paymentInclude = {
  invoice: {
    select: {
      id:            true,
      invoiceNumber: true,
      status:        true,
      totalAmount:   true,
    },
  },
  customer: { select: { id: true, name: true, email: true, phone: true } },
} as const;

export interface PaymentQueryParams {
  page:          number;
  limit:         number;
  search:        string;
  sort:          string;
  order:         'asc' | 'desc';
  invoiceId:     number | undefined;
  customerId:    number | undefined;
  paymentMethod: PaymentMethod | undefined;
}

export class PaymentRepository {

  async findAll(params: PaymentQueryParams) {
    const { page, limit, search, sort, order, invoiceId, customerId, paymentMethod } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { paymentNumber:   { contains: search, mode: 'insensitive' } },
        { referenceNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (invoiceId)     where.invoiceId     = invoiceId;
    if (customerId)    where.customerId    = customerId;
    if (paymentMethod) where.paymentMethod = paymentMethod;

    const [data, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
        include: paymentInclude,
      }),
      prisma.payment.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.payment.findUnique({
      where:   { id },
      include: paymentInclude,
    });
  }

  async getLastPaymentNumber(year: number): Promise<string | null> {
    const prefix = `PAY-${year}-`;
    const last   = await prisma.payment.findFirst({
      where:   { paymentNumber: { startsWith: prefix } },
      orderBy: { paymentNumber: 'desc' },
      select:  { paymentNumber: true },
    });
    return last?.paymentNumber ?? null;
  }

  async getTotalPaidForInvoice(invoiceId: number): Promise<number> {
    const result = await prisma.payment.aggregate({
      where: { invoiceId },
      _sum:  { amount: true },
    });
    return Number(result._sum.amount ?? 0);
  }
}

export const paymentRepository = new PaymentRepository();