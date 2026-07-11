// Purchase Order Service — Sprint 3.1
import Decimal                          from 'decimal.js';
import { prisma }                       from '../../config/prisma';
import { purchaseOrderRepository, POQueryParams, CreatePOItemData } from './purchase-order.repository';
import { CreatePurchaseOrderDTO, PurchaseOrderItemInputDTO } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDTO }        from './dto/update-purchase-order.dto';
import { buildPaginationMeta }           from '../../utils/pagination';
import { AppError }                      from '../../utils/app-error';
import { logger }                        from '../../logger';
import { PurchaseOrderStatus }           from '@prisma/client';

// ================================
// Purchase Order Number Generator
// ================================
async function generateOrderNumber(): Promise<string> {
  const year   = new Date().getFullYear();
  const last   = await purchaseOrderRepository.getLastOrderNumber(year);

  let nextNum  = 1;

  if (last) {
    const parts  = last.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    nextNum      = lastNum + 1;
  }

  return `PO-${year}-${String(nextNum).padStart(6, '0')}`;
}

// ================================
// Validate Supplier
// ================================
async function validateSupplier(supplierId: number): Promise<void> {
  const supplier = await prisma.supplier.findUnique({ where: { id: supplierId } });
  if (!supplier)        throw AppError.notFound(`Supplier with ID ${supplierId} not found.`);
  if (!supplier.isActive) throw AppError.unprocessable(`Supplier with ID ${supplierId} is inactive.`);
}

// ================================
// Validate Warehouse
// ================================
async function validateWarehouse(warehouseId: number): Promise<void> {
  const warehouse = await prisma.warehouse.findUnique({ where: { id: warehouseId } });
  if (!warehouse)         throw AppError.notFound(`Warehouse with ID ${warehouseId} not found.`);
  if (!warehouse.isActive) throw AppError.unprocessable(`Warehouse with ID ${warehouseId} is inactive.`);
}

// ================================
// Validate and Resolve Products
// ================================
async function resolveProducts(items: PurchaseOrderItemInputDTO[]) {
  // Check for duplicate product IDs
  const productIds  = items.map((i) => i.productId);
  const uniqueIds   = new Set(productIds);

  if (uniqueIds.size !== productIds.length) {
    const seen = new Set<number>();
    for (const id of productIds) {
      if (seen.has(id)) {
        throw AppError.conflict(`Product with ID ${id} appears more than once in the Purchase Order.`);
      }
      seen.add(id);
    }
  }

  // Fetch all products in one query
  const products = await prisma.product.findMany({
    where:   { id: { in: [...uniqueIds] } },
    include: { taxRate: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Validate each product
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product)         throw AppError.notFound(`Product with ID ${item.productId} not found.`);
    if (!product.isActive) throw AppError.unprocessable(`Product with ID ${item.productId} is inactive.`);
  }

  return productMap;
}

// ================================
// Calculate Item Values
// ================================
function calculateItems(
  items:      PurchaseOrderItemInputDTO[],
  productMap: Map<number, { taxRate: { rate: unknown } | null }>
): { itemsData: CreatePOItemData[]; subtotal: Decimal; taxAmount: Decimal; totalAmount: Decimal } {
  let subtotal   = new Decimal(0);
  let taxAmount  = new Decimal(0);

  const itemsData: CreatePOItemData[] = items.map((item) => {
    const product    = productMap.get(item.productId)!;
    const taxRate    = product.taxRate ? new Decimal(String(product.taxRate.rate)) : new Decimal(0);
    const qty        = new Decimal(item.quantity);
    const cost       = new Decimal(item.unitCost);

    const baseAmount = qty.mul(cost);
    const itemTax    = baseAmount.mul(taxRate).div(100).toDecimalPlaces(2);
    const lineTotal  = baseAmount.plus(itemTax).toDecimalPlaces(2);

    subtotal  = subtotal.plus(baseAmount);
    taxAmount = taxAmount.plus(itemTax);

    return {
      productId: item.productId,
      quantity:  qty.toDecimalPlaces(3) as unknown as import('@prisma/client/runtime/library').Decimal,
      unitCost:  cost.toDecimalPlaces(2) as unknown as import('@prisma/client/runtime/library').Decimal,
      taxRate:   taxRate.toDecimalPlaces(2) as unknown as import('@prisma/client/runtime/library').Decimal,
      taxAmount: itemTax as unknown as import('@prisma/client/runtime/library').Decimal,
      lineTotal: lineTotal as unknown as import('@prisma/client/runtime/library').Decimal,
    };
  });

  const totalAmount = subtotal.plus(taxAmount).toDecimalPlaces(2);
  subtotal  = subtotal.toDecimalPlaces(2);
  taxAmount = taxAmount.toDecimalPlaces(2);

  return { itemsData, subtotal, taxAmount, totalAmount };
}

// ================================
// Purchase Order Service
// ================================
export class PurchaseOrderService {

  async getAll(params: POQueryParams) {
    const { data, total } = await purchaseOrderRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const po = await purchaseOrderRepository.findById(id);
    if (!po) throw AppError.notFound(`Purchase Order with ID ${id} not found.`);
    return po;
  }

  async create(dto: CreatePurchaseOrderDTO) {
    await validateSupplier(dto.supplierId);
    await validateWarehouse(dto.warehouseId);

    const productMap  = await resolveProducts(dto.items);
    const { itemsData, subtotal, taxAmount, totalAmount } = calculateItems(dto.items, productMap);
    const orderNumber = await generateOrderNumber();

    const po = await purchaseOrderRepository.create(
      {
        orderNumber,
        supplierId:  dto.supplierId,
        warehouseId: dto.warehouseId,
        orderDate:   new Date(),
        expectedDate: dto.expectedDate ? new Date(dto.expectedDate) : undefined,
        status:      PurchaseOrderStatus.DRAFT,
        subtotal:    subtotal    as unknown as import('@prisma/client/runtime/library').Decimal,
        taxAmount:   taxAmount   as unknown as import('@prisma/client/runtime/library').Decimal,
        totalAmount: totalAmount as unknown as import('@prisma/client/runtime/library').Decimal,
        notes:       dto.notes,
      },
      itemsData
    );

    logger.info('Purchase Order created', {
      purchaseOrderId: po.id,
      orderNumber:     po.orderNumber,
      supplierId:      po.supplierId,
      warehouseId:     po.warehouseId,
      totalAmount:     po.totalAmount,
    });

    return po;
  }

  async update(id: number, dto: UpdatePurchaseOrderDTO) {
    const existing = await this.getById(id);

    if (existing.status !== PurchaseOrderStatus.DRAFT) {
      throw AppError.unprocessable('Only DRAFT Purchase Orders can be modified.');
    }

    if (dto.supplierId)  await validateSupplier(dto.supplierId);
    if (dto.warehouseId) await validateWarehouse(dto.warehouseId);

    let itemsData: CreatePOItemData[] | undefined;
    let subtotal:   Decimal | undefined;
    let taxAmount:  Decimal | undefined;
    let totalAmount: Decimal | undefined;

    if (dto.items) {
      const productMap = await resolveProducts(dto.items);
      const calculated = calculateItems(dto.items, productMap);
      itemsData   = calculated.itemsData;
      subtotal    = calculated.subtotal;
      taxAmount   = calculated.taxAmount;
      totalAmount = calculated.totalAmount;
    }

    const poData: Record<string, unknown> = {};
    if (dto.supplierId)   poData.supplierId   = dto.supplierId;
    if (dto.warehouseId)  poData.warehouseId  = dto.warehouseId;
    if (dto.expectedDate) poData.expectedDate = new Date(dto.expectedDate);
    if (dto.notes !== undefined) poData.notes = dto.notes;
    if (subtotal !== undefined) {
      poData.subtotal    = subtotal;
      poData.taxAmount   = taxAmount;
      poData.totalAmount = totalAmount;
    }

    const po = await purchaseOrderRepository.update(id, poData as never, itemsData);
    logger.info('Purchase Order updated', { purchaseOrderId: po.id, orderNumber: po.orderNumber });
    return po;
  }

  async confirm(id: number) {
    const existing = await this.getById(id);

    if (existing.status !== PurchaseOrderStatus.DRAFT) {
      throw AppError.unprocessable(
        `Purchase Order cannot be confirmed. Current status: ${existing.status}.`
      );
    }

    if (!existing.items || existing.items.length === 0) {
      throw AppError.unprocessable('Cannot confirm a Purchase Order with no items.');
    }

    // Revalidate all references
    await validateSupplier(existing.supplierId);
    await validateWarehouse(existing.warehouseId);

    for (const item of existing.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product)          throw AppError.notFound(`Product with ID ${item.productId} not found.`);
      if (!product.isActive) throw AppError.unprocessable(`Product with ID ${item.productId} is inactive.`);
    }

    const po = await purchaseOrderRepository.updateStatus(id, PurchaseOrderStatus.CONFIRMED);
    logger.info('Purchase Order confirmed', { purchaseOrderId: po.id, orderNumber: po.orderNumber });
    return po;
  }

  async cancel(id: number) {
    const existing = await this.getById(id);

    if (existing.status === PurchaseOrderStatus.CANCELLED) {
      throw AppError.unprocessable('Purchase Order is already cancelled.');
    }

    const po = await purchaseOrderRepository.updateStatus(id, PurchaseOrderStatus.CANCELLED);
    logger.info('Purchase Order cancelled', { purchaseOrderId: po.id, orderNumber: po.orderNumber });
    return po;
  }
}

export const purchaseOrderService = new PurchaseOrderService();