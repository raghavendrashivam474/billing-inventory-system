// Stock Adjustment Service — Sprint 3.3
import Decimal                              from 'decimal.js';
import { prisma }                           from '../../config/prisma';
import { stockAdjustmentRepository, SAQueryParams } from './stock-adjustment.repository';
import { CreateStockAdjustmentDTO }         from './dto/create-stock-adjustment.dto';
import { buildPaginationMeta }              from '../../utils/pagination';
import { AppError }                         from '../../utils/app-error';
import { logger }                           from '../../logger';
import {
  StockAdjustmentType,
  StockMovementType,
  StockReferenceType,
} from '@prisma/client';

// ================================
// Generate Adjustment Number
// ================================
async function generateAdjustmentNumber(): Promise<string> {
  const year    = new Date().getFullYear();
  const last    = await stockAdjustmentRepository.getLastAdjustmentNumber(year);
  let nextNum   = 1;

  if (last) {
    const parts   = last.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    nextNum       = lastNum + 1;
  }

  return `ADJ-${year}-${String(nextNum).padStart(6, '0')}`;
}

// ================================
// Stock Adjustment Service
// ================================
export class StockAdjustmentService {

  async getAll(params: SAQueryParams) {
    const { data, total } = await stockAdjustmentRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const adjustment = await stockAdjustmentRepository.findById(id);
    if (!adjustment) throw AppError.notFound(`Stock Adjustment with ID ${id} not found.`);
    return adjustment;
  }

  async create(dto: CreateStockAdjustmentDTO) {

    // ── Step 1: Validate Product ─────────────────────────
    const product = await prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product)        throw AppError.notFound(`Product with ID ${dto.productId} not found.`);
    if (!product.isActive) throw AppError.unprocessable(`Product with ID ${dto.productId} is inactive.`);

    // ── Step 2: Validate Warehouse ───────────────────────
    const warehouse = await prisma.warehouse.findUnique({ where: { id: dto.warehouseId } });
    if (!warehouse)         throw AppError.notFound(`Warehouse with ID ${dto.warehouseId} not found.`);
    if (!warehouse.isActive) throw AppError.unprocessable(`Warehouse with ID ${dto.warehouseId} is inactive.`);

    // ── Step 3: Find Current Inventory ──────────────────
    const inventory = await prisma.inventory.findUnique({
      where: { productId_warehouseId: { productId: dto.productId, warehouseId: dto.warehouseId } },
    });

    const quantityBefore = inventory
      ? new Decimal(String(inventory.quantity))
      : new Decimal(0);

    // ── Step 4: Validate Decrease With No Inventory ──────
    if (dto.adjustmentType === StockAdjustmentType.DECREASE && !inventory) {
      throw AppError.unprocessable(
        `Cannot decrease stock for product "${product.name}" in warehouse "${warehouse.name}". No inventory record exists.`
      );
    }

    // ── Step 5: Calculate Signed Quantity ────────────────
    const requestedQty   = new Decimal(dto.quantity);
    const signedQuantity = dto.adjustmentType === StockAdjustmentType.INCREASE
      ? requestedQty
      : requestedQty.negated();

    // ── Step 6: Calculate Result ─────────────────────────
    const quantityAfter = quantityBefore.plus(signedQuantity);

    // ── Step 7: Negative Inventory Prevention ────────────
    if (quantityAfter.lessThan(0)) {
      throw AppError.unprocessable(
        `Cannot decrease ${dto.quantity} units of "${product.name}" from warehouse "${warehouse.name}". ` +
        `Current stock is ${quantityBefore.toNumber()} units. Insufficient inventory.`
      );
    }

    // ── Step 8: Generate Adjustment Number ───────────────
    const adjustmentNumber = await generateAdjustmentNumber();

    // ── Step 9: Atomic Transaction ───────────────────────
    const movementType = dto.adjustmentType === StockAdjustmentType.INCREASE
      ? StockMovementType.ADJUSTMENT_IN
      : StockMovementType.ADJUSTMENT_OUT;

    const adjustmentId = await prisma.$transaction(async (tx) => {

      // Create Stock Adjustment
      const adjustment = await tx.stockAdjustment.create({
        data: {
          adjustmentNumber,
          productId:      dto.productId,
          warehouseId:    dto.warehouseId,
          adjustmentType: dto.adjustmentType,
          quantity:       requestedQty.toNumber(),
          reason:         dto.reason,
          notes:          dto.notes,
          quantityBefore: quantityBefore.toNumber(),
          quantityAfter:  quantityAfter.toNumber(),
        },
      });

      // Upsert Inventory
      await tx.inventory.upsert({
        where:  { productId_warehouseId: { productId: dto.productId, warehouseId: dto.warehouseId } },
        create: {
          productId:   dto.productId,
          warehouseId: dto.warehouseId,
          quantity:    quantityAfter.toNumber(),
        },
        update: {
          quantity: quantityAfter.toNumber(),
        },
      });

      // Create Stock Movement
      await tx.stockMovement.create({
        data: {
          productId:      dto.productId,
          warehouseId:    dto.warehouseId,
          type:           movementType,
          quantity:       signedQuantity.toNumber(),
          quantityBefore: quantityBefore.toNumber(),
          quantityAfter:  quantityAfter.toNumber(),
          referenceType:  StockReferenceType.STOCK_ADJUSTMENT,
          referenceId:    adjustment.id,
          notes:          dto.notes,
        },
      });

      return adjustment.id;
    });

    const result = await stockAdjustmentRepository.findById(adjustmentId);

    logger.info('Stock Adjustment posted', {
      adjustmentId,
      adjustmentNumber,
      productId:      dto.productId,
      warehouseId:    dto.warehouseId,
      adjustmentType: dto.adjustmentType,
      quantity:       dto.quantity,
      quantityBefore: quantityBefore.toNumber(),
      quantityAfter:  quantityAfter.toNumber(),
      reason:         dto.reason,
    });

    return result;
  }
}

export const stockAdjustmentService = new StockAdjustmentService();