// Goods Receipt Service — Sprint 3.2
import Decimal                          from 'decimal.js';
import { prisma }                       from '../../config/prisma';
import { goodsReceiptRepository, GRNQueryParams } from './goods-receipt.repository';
import { CreateGoodsReceiptDTO, GoodsReceiptItemInputDTO } from './dto/create-goods-receipt.dto';
import { buildPaginationMeta }          from '../../utils/pagination';
import { AppError }                     from '../../utils/app-error';
import { logger }                       from '../../logger';
import {
  PurchaseOrderStatus,
  PurchaseOrderReceiptStatus,
  StockMovementType,
  StockReferenceType,
} from '@prisma/client';

// ================================
// Generate GRN Number
// ================================
async function generateReceiptNumber(): Promise<string> {
  const year    = new Date().getFullYear();
  const last    = await goodsReceiptRepository.getLastReceiptNumber(year);
  let nextNum   = 1;

  if (last) {
    const parts  = last.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    nextNum      = lastNum + 1;
  }

  return `GRN-${year}-${String(nextNum).padStart(6, '0')}`;
}

// ================================
// Recalculate PO Receipt Status
// ================================
async function recalculatePOReceiptStatus(
  tx:              Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  purchaseOrderId: number
): Promise<void> {
  const poItems = await tx.purchaseOrderItem.findMany({
    where: { purchaseOrderId },
  });

  const receiptTotals = await tx.goodsReceiptItem.groupBy({
    by:    ['purchaseOrderItemId'],
    where: { purchaseOrderItem: { purchaseOrderId } },
    _sum:  { receivedQuantity: true },
  });

  const receivedMap = new Map(
    receiptTotals.map((r) => [r.purchaseOrderItemId, r._sum.receivedQuantity ?? 0])
  );

  let allFull   = true;
  let anyPartial = false;

  for (const item of poItems) {
    const ordered  = new Decimal(String(item.quantity));
    const received = new Decimal(String(receivedMap.get(item.id) ?? 0));

    if (received.greaterThanOrEqualTo(ordered)) {
      anyPartial = true;
    } else if (received.greaterThan(0)) {
      anyPartial = true;
      allFull    = false;
    } else {
      allFull    = false;
    }
  }

  let receiptStatus: PurchaseOrderReceiptStatus;

  if (allFull && anyPartial) {
    receiptStatus = PurchaseOrderReceiptStatus.FULLY_RECEIVED;
  } else if (anyPartial) {
    receiptStatus = PurchaseOrderReceiptStatus.PARTIALLY_RECEIVED;
  } else {
    receiptStatus = PurchaseOrderReceiptStatus.NOT_RECEIVED;
  }

  await tx.purchaseOrder.update({
    where: { id: purchaseOrderId },
    data:  { receiptStatus },
  });
}

// ================================
// Goods Receipt Service
// ================================
export class GoodsReceiptService {

  async getAll(params: GRNQueryParams) {
    const { data, total } = await goodsReceiptRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const grn = await goodsReceiptRepository.findById(id);
    if (!grn) throw AppError.notFound(`Goods Receipt with ID ${id} not found.`);
    return grn;
  }

  async create(dto: CreateGoodsReceiptDTO) {
    // ── Step 1: Load Purchase Order ──────────────────────
    const po = await prisma.purchaseOrder.findUnique({
      where:   { id: dto.purchaseOrderId },
      include: { items: { include: { product: true } } },
    });

    if (!po) throw AppError.notFound(`Purchase Order with ID ${dto.purchaseOrderId} not found.`);

    // ── Step 2: Validate PO Status ───────────────────────
    if (po.status !== PurchaseOrderStatus.CONFIRMED) {
      throw AppError.unprocessable(
        `Goods can only be received against a confirmed Purchase Order. Current status: ${po.status}.`
      );
    }

    // ── Step 3: Validate PO Item Ownership ───────────────
    const poItemMap = new Map(po.items.map((i) => [i.id, i]));

    for (const item of dto.items) {
      if (!poItemMap.has(item.purchaseOrderItemId)) {
        throw AppError.unprocessable(
          `Purchase Order Item with ID ${item.purchaseOrderItemId} does not belong to Purchase Order ${dto.purchaseOrderId}.`
        );
      }
    }

    // ── Step 4: Calculate Previously Received Quantities ─
    const poItemIds = dto.items.map((i) => i.purchaseOrderItemId);

    const previousReceipts = await prisma.goodsReceiptItem.groupBy({
      by:    ['purchaseOrderItemId'],
      where: { purchaseOrderItemId: { in: poItemIds } },
      _sum:  { receivedQuantity: true },
    });

    const previousMap = new Map(
      previousReceipts.map((r) => [r.purchaseOrderItemId, new Decimal(String(r._sum.receivedQuantity ?? 0))])
    );

    // ── Step 5: Validate Receipt Quantities ──────────────
    for (const item of dto.items) {
      const poItem       = poItemMap.get(item.purchaseOrderItemId)!;
      const ordered      = new Decimal(String(poItem.quantity));
      const prevReceived = previousMap.get(item.purchaseOrderItemId) ?? new Decimal(0);
      const remaining    = ordered.minus(prevReceived);
      const requested    = new Decimal(item.receivedQuantity);

      if (requested.greaterThan(remaining)) {
        throw AppError.unprocessable(
          `Cannot receive ${item.receivedQuantity} units of product "${poItem.product.name}". ` +
          `Only ${remaining.toNumber()} units remain against this Purchase Order item.`
        );
      }
    }

    // ── Step 6: Execute Atomic Transaction ───────────────
    const receiptNumber = await generateReceiptNumber();
    const warehouseId   = po.warehouseId;

    const grn = await prisma.$transaction(async (tx) => {

      // Create Goods Receipt
      const goodsReceipt = await tx.goodsReceipt.create({
        data: {
          receiptNumber,
          purchaseOrderId: dto.purchaseOrderId,
          warehouseId,
          receivedAt:            new Date(dto.receivedAt),
          supplierInvoiceNumber: dto.supplierInvoiceNumber,
          deliveryReference:     dto.deliveryReference,
          notes:                 dto.notes,
        },
      });

      // Process each item
      for (const item of dto.items) {
        const poItem   = poItemMap.get(item.purchaseOrderItemId)!;
        const productId = poItem.productId;
        const received  = new Decimal(item.receivedQuantity);

        // Create Goods Receipt Item
        await tx.goodsReceiptItem.create({
          data: {
            goodsReceiptId:      goodsReceipt.id,
            purchaseOrderItemId: item.purchaseOrderItemId,
            productId,
            receivedQuantity:    received.toNumber(),
          },
        });

        // Get current inventory
        const existing = await tx.inventory.findUnique({
          where: { productId_warehouseId: { productId, warehouseId } },
        });

        const quantityBefore = existing
          ? new Decimal(String(existing.quantity))
          : new Decimal(0);

        const quantityAfter = quantityBefore.plus(received);

        // Upsert Inventory
        await tx.inventory.upsert({
          where:  { productId_warehouseId: { productId, warehouseId } },
          create: {
            productId,
            warehouseId,
            quantity: quantityAfter.toNumber(),
          },
          update: {
            quantity: { increment: received.toNumber() },
          },
        });

        // Create Stock Movement
        await tx.stockMovement.create({
          data: {
            productId,
            warehouseId,
            type:           StockMovementType.PURCHASE_RECEIPT,
            quantity:       received.toNumber(),
            quantityBefore: quantityBefore.toNumber(),
            quantityAfter:  quantityAfter.toNumber(),
            referenceType:  StockReferenceType.GOODS_RECEIPT,
            referenceId:    goodsReceipt.id,
          },
        });

        logger.info('Stock Movement recorded', {
          productId,
          warehouseId,
          quantityBefore: quantityBefore.toNumber(),
          quantity:       received.toNumber(),
          quantityAfter:  quantityAfter.toNumber(),
          goodsReceiptId: goodsReceipt.id,
        });
      }

      // Recalculate PO Receipt Status
      await recalculatePOReceiptStatus(tx, dto.purchaseOrderId);

      return goodsReceipt.id;
    });

    const result = await goodsReceiptRepository.findById(grn);

    logger.info('Goods Receipt created', {
      goodsReceiptId:  grn,
      receiptNumber,
      purchaseOrderId: dto.purchaseOrderId,
      warehouseId,
    });

    return result;
  }
}

export const goodsReceiptService = new GoodsReceiptService();