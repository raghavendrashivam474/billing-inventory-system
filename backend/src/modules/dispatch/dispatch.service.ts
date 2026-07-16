// Dispatch Service — Sprint 3.5
import Decimal                              from 'decimal.js';
import { prisma }                           from '../../config/prisma';
import { dispatchRepository, DispatchQueryParams } from './dispatch.repository';
import { CreateDispatchDTO, DispatchItemInputDTO } from './dto/create-dispatch.dto';
import { buildPaginationMeta }              from '../../utils/pagination';
import { AppError }                         from '../../utils/app-error';
import { logger }                           from '../../logger';
import {
  SalesOrderStatus,
  SalesOrderDispatchStatus,
  StockMovementType,
  StockReferenceType,
  DispatchStatus,
} from '@prisma/client';

// ================================
// Generate Dispatch Number
// ================================
async function generateDispatchNumber(): Promise<string> {
  const year    = new Date().getFullYear();
  const last    = await dispatchRepository.getLastDispatchNumber(year);
  let nextNum   = 1;

  if (last) {
    const parts   = last.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    nextNum       = lastNum + 1;
  }

  return `DSP-${year}-${String(nextNum).padStart(6, '0')}`;
}

// ================================
// Recalculate Sales Order Dispatch Status
// ================================
async function recalculateDispatchStatus(
  tx:          Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  salesOrderId: number
): Promise<void> {
  const soItems = await tx.salesOrderItem.findMany({
    where: { salesOrderId },
  });

  const dispatchTotals = await tx.dispatchItem.groupBy({
    by:    ['salesOrderItemId'],
    where: { salesOrderItem: { salesOrderId } },
    _sum:  { quantityDispatched: true },
  });

  const dispatchedMap = new Map(
    dispatchTotals.map((d) => [d.salesOrderItemId, d._sum.quantityDispatched ?? 0])
  );

  let allFull    = true;
  let anyPartial = false;

  for (const item of soItems) {
    const ordered    = new Decimal(String(item.quantity));
    const dispatched = new Decimal(String(dispatchedMap.get(item.id) ?? 0));

    if (dispatched.greaterThanOrEqualTo(ordered)) {
      anyPartial = true;
    } else if (dispatched.greaterThan(0)) {
      anyPartial = true;
      allFull    = false;
    } else {
      allFull    = false;
    }
  }

  let dispatchStatus: SalesOrderDispatchStatus;

  if (allFull && anyPartial) {
    dispatchStatus = SalesOrderDispatchStatus.FULLY_DISPATCHED;
  } else if (anyPartial) {
    dispatchStatus = SalesOrderDispatchStatus.PARTIALLY_DISPATCHED;
  } else {
    dispatchStatus = SalesOrderDispatchStatus.NOT_DISPATCHED;
  }

  // Also update Sales Order status to FULFILLED if fully dispatched
  const soUpdate: Record<string, unknown> = { dispatchStatus };
  if (dispatchStatus === SalesOrderDispatchStatus.FULLY_DISPATCHED) {
    soUpdate.status = SalesOrderStatus.FULFILLED;
  }

  await tx.salesOrder.update({
    where: { id: salesOrderId },
    data:  soUpdate,
  });
}

// ================================
// Dispatch Service
// ================================
export class DispatchService {

  async getAll(params: DispatchQueryParams) {
    const { data, total } = await dispatchRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const dispatch = await dispatchRepository.findById(id);
    if (!dispatch) throw AppError.notFound(`Dispatch with ID ${id} not found.`);
    return dispatch;
  }

  async create(dto: CreateDispatchDTO) {

    // ── Step 1: Load Sales Order ─────────────────────────
    const so = await prisma.salesOrder.findUnique({
      where:   { id: dto.salesOrderId },
      include: { items: { include: { product: true } } },
    });

    if (!so) throw AppError.notFound(`Sales Order with ID ${dto.salesOrderId} not found.`);

    // ── Step 2: Validate Sales Order Status ──────────────
    if (so.status !== SalesOrderStatus.CONFIRMED) {
      throw AppError.unprocessable(
        `Dispatch can only be created for CONFIRMED Sales Orders. Current status: ${so.status}.`
      );
    }

    // ── Step 3: Validate Items Belong to Sales Order ─────
    const soItemMap = new Map(so.items.map((i) => [i.id, i]));

    for (const item of dto.items) {
      if (!soItemMap.has(item.salesOrderItemId)) {
        throw AppError.unprocessable(
          `Sales Order Item with ID ${item.salesOrderItemId} does not belong to Sales Order ${dto.salesOrderId}.`
        );
      }
    }

    // ── Step 4: Calculate Already Dispatched Quantities ──
    const soItemIds = dto.items.map((i) => i.salesOrderItemId);

    const previousDispatches = await prisma.dispatchItem.groupBy({
      by:    ['salesOrderItemId'],
      where: { salesOrderItemId: { in: soItemIds } },
      _sum:  { quantityDispatched: true },
    });

    const previousMap = new Map(
      previousDispatches.map((d) => [
        d.salesOrderItemId,
        new Decimal(String(d._sum.quantityDispatched ?? 0)),
      ])
    );

    // ── Step 5: Validate Dispatch Quantities ─────────────
    for (const item of dto.items) {
      const soItem      = soItemMap.get(item.salesOrderItemId)!;
      const ordered     = new Decimal(String(soItem.quantity));
      const prevDisp    = previousMap.get(item.salesOrderItemId) ?? new Decimal(0);
      const remaining   = ordered.minus(prevDisp);
      const requested   = new Decimal(item.quantityDispatched);

      if (requested.greaterThan(remaining)) {
        throw AppError.unprocessable(
          `Cannot dispatch ${item.quantityDispatched} units of product "${soItem.product.name}". ` +
          `Only ${remaining.toNumber()} units remain to be dispatched.`
        );
      }
    }

    // ── Step 6: Validate Inventory Availability ──────────
    const warehouseId = so.warehouseId;

    for (const item of dto.items) {
      const soItem    = soItemMap.get(item.salesOrderItemId)!;
      const productId = soItem.productId;
      const requested = new Decimal(item.quantityDispatched);

      const inventory = await prisma.inventory.findUnique({
        where: { productId_warehouseId: { productId, warehouseId } },
      });

      const available = inventory
        ? new Decimal(String(inventory.quantity))
        : new Decimal(0);

      if (available.lessThan(requested)) {
        throw AppError.unprocessable(
          `Insufficient inventory for product "${soItem.product.name}". ` +
          `Available: ${available.toNumber()}, Required: ${requested.toNumber()}.`
        );
      }
    }

    // ── Step 7: Generate Dispatch Number ─────────────────
    const dispatchNumber = await generateDispatchNumber();

    // ── Step 8: Atomic Transaction ───────────────────────
    const dispatchId = await prisma.$transaction(async (tx) => {

      // Create Dispatch header
      const dispatch = await tx.dispatch.create({
        data: {
          dispatchNumber,
          salesOrderId:  dto.salesOrderId,
          warehouseId,
          dispatchDate:  new Date(dto.dispatchDate),
          status:        DispatchStatus.DISPATCHED,
          remarks:       dto.remarks,
        },
      });

      // Process each dispatch item
      for (const item of dto.items) {
        const soItem    = soItemMap.get(item.salesOrderItemId)!;
        const productId = soItem.productId;
        const quantity  = new Decimal(item.quantityDispatched);

        // Create Dispatch Item
        await tx.dispatchItem.create({
          data: {
            dispatchId:         dispatch.id,
            salesOrderItemId:   item.salesOrderItemId,
            productId,
            quantityDispatched: quantity.toNumber(),
          },
        });

        // Get current inventory for before snapshot
        const inventory = await tx.inventory.findUnique({
          where: { productId_warehouseId: { productId, warehouseId } },
        });

        const quantityBefore = inventory
          ? new Decimal(String(inventory.quantity))
          : new Decimal(0);

        const quantityAfter = quantityBefore.minus(quantity);

        // Decrement Inventory
        await tx.inventory.update({
          where: { productId_warehouseId: { productId, warehouseId } },
          data:  { quantity: { decrement: quantity.toNumber() } },
        });

        // Create Stock Movement — SALE_DISPATCH
        await tx.stockMovement.create({
          data: {
            productId,
            warehouseId,
            type:           StockMovementType.SALE_DISPATCH,
            quantity:       quantity.negated().toNumber(),
            quantityBefore: quantityBefore.toNumber(),
            quantityAfter:  quantityAfter.toNumber(),
            referenceType:  StockReferenceType.DISPATCH,
            referenceId:    dispatch.id,
            notes:          dto.remarks,
          },
        });

        logger.info('Stock Movement recorded for dispatch', {
          productId,
          warehouseId,
          quantityBefore: quantityBefore.toNumber(),
          quantity:       quantity.negated().toNumber(),
          quantityAfter:  quantityAfter.toNumber(),
          dispatchId:     dispatch.id,
        });
      }

      // Recalculate Sales Order dispatch status
      await recalculateDispatchStatus(tx, dto.salesOrderId);

      return dispatch.id;
    });

    const result = await dispatchRepository.findById(dispatchId);

    logger.info('Dispatch created', {
      dispatchId,
      dispatchNumber,
      salesOrderId: dto.salesOrderId,
      warehouseId,
    });

    return result;
  }
}

export const dispatchService = new DispatchService();