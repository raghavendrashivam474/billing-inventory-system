// Payment Service — Sprint 3.7
import Decimal                             from 'decimal.js';
import { prisma }                          from '../../config/prisma';
import { paymentRepository, PaymentQueryParams } from './payment.repository';
import { CreatePaymentDTO }                from './dto/create-payment.dto';
import { buildPaginationMeta }             from '../../utils/pagination';
import { AppError }                        from '../../utils/app-error';
import { logger }                          from '../../logger';
import { InvoiceStatus }                   from '@prisma/client';

// ================================
// Generate Payment Number
// ================================
async function generatePaymentNumber(): Promise<string> {
  const year    = new Date().getFullYear();
  const last    = await paymentRepository.getLastPaymentNumber(year);
  let nextNum   = 1;

  if (last) {
    const parts   = last.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    nextNum       = lastNum + 1;
  }

  return `PAY-${year}-${String(nextNum).padStart(6, '0')}`;
}

// ================================
// Payment Service
// ================================
export class PaymentService {

  async getAll(params: PaymentQueryParams) {
    const { data, total } = await paymentRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const payment = await paymentRepository.findById(id);
    if (!payment) throw AppError.notFound(`Payment with ID ${id} not found.`);
    return payment;
  }

  async create(dto: CreatePaymentDTO) {

    // ── Step 1: Load Invoice ─────────────────────────────
    const invoice = await prisma.invoice.findUnique({
      where:   { id: dto.invoiceId },
      include: { customer: true },
    });

    if (!invoice) throw AppError.notFound(`Invoice with ID ${dto.invoiceId} not found.`);

    // ── Step 2: Validate Invoice Status ──────────────────
    if (invoice.status !== InvoiceStatus.ISSUED && invoice.status !== InvoiceStatus.PARTIALLY_PAID) {
      throw AppError.unprocessable(
        `Payments can only be recorded against ISSUED or PARTIALLY_PAID invoices. Current status: ${invoice.status}.`
      );
    }

    // ── Step 3: Validate Customer Active ─────────────────
    if (!invoice.customer.isActive) {
      throw AppError.unprocessable(`Customer with ID ${invoice.customerId} is inactive.`);
    }

    // ── Step 4: Calculate Already Paid Amount ────────────
    const totalPaid    = await paymentRepository.getTotalPaidForInvoice(dto.invoiceId);
    const invoiceTotal = new Decimal(String(invoice.totalAmount));
    const alreadyPaid  = new Decimal(totalPaid);
    const outstanding  = invoiceTotal.minus(alreadyPaid);

    // ── Step 5: Validate Payment Amount ──────────────────
    const requested = new Decimal(dto.amount);

    if (requested.greaterThan(outstanding)) {
      throw AppError.unprocessable(
        `Payment amount (${requested.toNumber()}) exceeds outstanding balance (${outstanding.toNumber()}). ` +
        `Invoice total: ${invoiceTotal.toNumber()}, Already paid: ${alreadyPaid.toNumber()}.`
      );
    }

    // ── Step 6: Generate Payment Number ──────────────────
    const paymentNumber = await generatePaymentNumber();

    // ── Step 7: Calculate New Invoice Status ─────────────
    const newTotalPaid = alreadyPaid.plus(requested);
    const newOutstanding = invoiceTotal.minus(newTotalPaid);

    const newStatus: InvoiceStatus = newOutstanding.equals(0)
      ? InvoiceStatus.PAID
      : InvoiceStatus.PARTIALLY_PAID;

    // ── Step 8: Atomic Transaction ───────────────────────
    const paymentId = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          paymentNumber,
          invoiceId:       dto.invoiceId,
          customerId:      invoice.customerId,
          paymentDate:     dto.paymentDate ? new Date(dto.paymentDate) : new Date(),
          paymentMethod:   dto.paymentMethod,
          referenceNumber: dto.referenceNumber,
          amount:          requested.toNumber(),
          notes:           dto.notes,
        },
      });

      // Update Invoice status
      await tx.invoice.update({
        where: { id: dto.invoiceId },
        data:  { status: newStatus },
      });

      return payment.id;
    });

    const result = await paymentRepository.findById(paymentId);

    logger.info('Payment recorded', {
      paymentId,
      paymentNumber,
      invoiceId:      dto.invoiceId,
      amount:         requested.toNumber(),
      alreadyPaid:    alreadyPaid.toNumber(),
      newTotalPaid:   newTotalPaid.toNumber(),
      newOutstanding: newOutstanding.toNumber(),
      newStatus,
    });

    return result;
  }
}

export const paymentService = new PaymentService();