// Invoice Service — Sprint 3.6
import Decimal                             from 'decimal.js';
import { prisma }                          from '../../config/prisma';
import { invoiceRepository, InvoiceQueryParams } from './invoice.repository';
import { CreateInvoiceDTO }                from './dto/create-invoice.dto';
import { UpdateInvoiceDTO }                from './dto/update-invoice.dto';
import { buildPaginationMeta }             from '../../utils/pagination';
import { AppError }                        from '../../utils/app-error';
import { logger }                          from '../../logger';
import {
  SalesOrderStatus,
  SalesOrderInvoiceStatus,
  InvoiceStatus,
} from '@prisma/client';

// ================================
// Generate Invoice Number
// ================================
async function generateInvoiceNumber(): Promise<string> {
  const year    = new Date().getFullYear();
  const last    = await invoiceRepository.getLastInvoiceNumber(year);
  let nextNum   = 1;

  if (last) {
    const parts   = last.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    nextNum       = lastNum + 1;
  }

  return `INV-${year}-${String(nextNum).padStart(6, '0')}`;
}

// ================================
// Invoice Service
// ================================
export class InvoiceService {

  async getAll(params: InvoiceQueryParams) {
    const { data, total } = await invoiceRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const invoice = await invoiceRepository.findById(id);
    if (!invoice) throw AppError.notFound(`Invoice with ID ${id} not found.`);
    return invoice;
  }

  async create(dto: CreateInvoiceDTO) {

    // ── Step 1: Load Sales Order ─────────────────────────
    const so = await prisma.salesOrder.findUnique({
      where:   { id: dto.salesOrderId },
      include: { items: { include: { product: true } }, customer: true },
    });

    if (!so) throw AppError.notFound(`Sales Order with ID ${dto.salesOrderId} not found.`);

    // ── Step 2: Validate Sales Order Status ──────────────
    if (so.status !== SalesOrderStatus.FULFILLED) {
      throw AppError.unprocessable(
        `Invoice can only be created for FULFILLED Sales Orders. Current status: ${so.status}.`
      );
    }

    // ── Step 3: Validate Customer Active ─────────────────
    if (!so.customer.isActive) {
      throw AppError.unprocessable(`Customer with ID ${so.customerId} is inactive.`);
    }

    // ── Step 4: Load and Validate Dispatch ───────────────
    const dispatch = await prisma.dispatch.findUnique({
      where: { id: dto.dispatchId },
    });

    if (!dispatch) throw AppError.notFound(`Dispatch with ID ${dto.dispatchId} not found.`);

    if (dispatch.salesOrderId !== dto.salesOrderId) {
      throw AppError.unprocessable(
        `Dispatch ${dto.dispatchId} does not belong to Sales Order ${dto.salesOrderId}.`
      );
    }

    // ── Step 5: Snapshot Items from Sales Order ──────────
    // Never read Product again — use stored snapshots
    const orderDiscount = new Decimal(dto.discountAmount ?? 0);

    let totalSubtotal = new Decimal(0);
    let totalTax      = new Decimal(0);

    const invoiceItemsData = so.items.map((item) => {
      const unitPrice     = new Decimal(String(item.unitPrice));
      const taxRate       = new Decimal(String(item.taxRate));
      const quantity      = new Decimal(String(item.quantity));
      const itemDiscount  = new Decimal(String(item.discountAmount));

      const subtotal      = quantity.mul(unitPrice);
      const taxableAmount = subtotal.minus(itemDiscount);
      const taxAmount     = taxableAmount.mul(taxRate).div(100).toDecimalPlaces(2);
      const totalAmount   = taxableAmount.plus(taxAmount).toDecimalPlaces(2);

      totalSubtotal = totalSubtotal.plus(subtotal);
      totalTax      = totalTax.plus(taxAmount);

      return {
        productId:      item.productId,
        description:    item.product.name,
        quantity:       quantity.toNumber(),
        unitPrice:      unitPrice.toNumber(),
        taxRate:        taxRate.toNumber(),
        discountAmount: itemDiscount.toNumber(),
        subtotal:       subtotal.toDecimalPlaces(2).toNumber(),
        taxAmount:      taxAmount.toNumber(),
        totalAmount:    totalAmount.toNumber(),
      };
    });

    // ── Step 6: Calculate Invoice Totals ─────────────────
    const sumItemTotals = invoiceItemsData.reduce(
      (sum, item) => sum.plus(item.totalAmount),
      new Decimal(0)
    );

    if (orderDiscount.greaterThan(sumItemTotals)) {
      throw AppError.unprocessable(
        `Invoice discount (${orderDiscount.toNumber()}) cannot exceed total amount (${sumItemTotals.toNumber()}).`
      );
    }

    const totalAmount   = sumItemTotals.minus(orderDiscount).toDecimalPlaces(2);
    const subtotal      = totalSubtotal.toDecimalPlaces(2);
    const taxAmount     = totalTax.toDecimalPlaces(2);

    if (totalAmount.lessThan(0)) {
      throw AppError.unprocessable('Invoice total cannot be negative.');
    }

    // ── Step 7: Generate Invoice Number ──────────────────
    const invoiceNumber = await generateInvoiceNumber();

    // ── Step 8: Atomic Transaction ───────────────────────
    const invoiceId = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          customerId:    so.customerId,
          salesOrderId:  dto.salesOrderId,
          dispatchId:    dto.dispatchId,
          invoiceDate:   new Date(),
          dueDate:       dto.dueDate ? new Date(dto.dueDate) : undefined,
          status:        InvoiceStatus.DRAFT,
          subtotal:      subtotal.toNumber(),
          taxAmount:     taxAmount.toNumber(),
          discountAmount: orderDiscount.toNumber(),
          totalAmount:   totalAmount.toNumber(),
          notes:         dto.notes,
          items: {
            create: invoiceItemsData,
          },
        },
      });

      // Update Sales Order invoice status
      await tx.salesOrder.update({
        where: { id: dto.salesOrderId },
        data:  { invoiceStatus: SalesOrderInvoiceStatus.INVOICED },
      });

      return invoice.id;
    });

    const result = await invoiceRepository.findById(invoiceId);

    logger.info('Invoice created', {
      invoiceId,
      invoiceNumber,
      salesOrderId: dto.salesOrderId,
      customerId:   so.customerId,
      totalAmount:  totalAmount.toNumber(),
    });

    return result;
  }

  async update(id: number, dto: UpdateInvoiceDTO) {
    const existing = await this.getById(id);

    if (existing.status !== InvoiceStatus.DRAFT) {
      throw AppError.unprocessable(
        `Only DRAFT invoices can be updated. Current status: ${existing.status}.`
      );
    }

    const invoice = await invoiceRepository.update(id, dto);
    logger.info('Invoice updated', { invoiceId: id, invoiceNumber: invoice.invoiceNumber });
    return invoice;
  }

  async issue(id: number) {
    const existing = await this.getById(id);

    if (existing.status !== InvoiceStatus.DRAFT) {
      throw AppError.unprocessable(
        `Only DRAFT invoices can be issued. Current status: ${existing.status}.`
      );
    }

    const invoice = await invoiceRepository.updateStatus(id, InvoiceStatus.ISSUED);
    logger.info('Invoice issued', { invoiceId: id, invoiceNumber: invoice.invoiceNumber });
    return invoice;
  }

  async void(id: number) {
    const existing = await this.getById(id);

    if (existing.status === InvoiceStatus.PAID) {
      throw AppError.unprocessable('PAID invoices cannot be voided.');
    }

    if (existing.status === InvoiceStatus.VOID) {
      throw AppError.unprocessable('Invoice is already voided.');
    }

    const invoice = await invoiceRepository.updateStatus(id, InvoiceStatus.VOID);
    logger.info('Invoice voided', { invoiceId: id, invoiceNumber: invoice.invoiceNumber });
    return invoice;
  }
}

export const invoiceService = new InvoiceService();