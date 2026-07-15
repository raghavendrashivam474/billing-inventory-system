// Sales Order Service — Sprint 3.4
import Decimal                              from 'decimal.js';
import { prisma }                           from '../../config/prisma';
import { salesOrderRepository, SOQueryParams } from './sales-order.repository';
import { CreateSalesOrderDTO, SalesOrderItemInputDTO } from './dto/create-sales-order.dto';
import { UpdateSalesOrderDTO }              from './dto/update-sales-order.dto';
import { buildPaginationMeta }              from '../../utils/pagination';
import { AppError }                         from '../../utils/app-error';
import { logger }                           from '../../logger';
import { SalesOrderStatus }                 from '@prisma/client';

// ================================
// Internal item data shape
// ================================
interface ItemData {
  productId:      number;
  quantity:       number;
  unitPrice:      number;
  taxRate:        number;
  discountAmount: number;
  subtotal:       number;
  taxAmount:      number;
  totalAmount:    number;
}

// ================================
// Generate Sales Order Number
// ================================
async function generateOrderNumber(): Promise<string> {
  const year    = new Date().getFullYear();
  const last    = await salesOrderRepository.getLastOrderNumber(year);
  let nextNum   = 1;

  if (last) {
    const parts   = last.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    nextNum       = lastNum + 1;
  }

  return `SO-${year}-${String(nextNum).padStart(6, '0')}`;
}

// ================================
// Validate Customer
// ================================
async function validateCustomer(customerId: number): Promise<void> {
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer)          throw AppError.notFound(`Customer with ID ${customerId} not found.`);
  if (!customer.isActive) throw AppError.unprocessable(`Customer with ID ${customerId} is inactive.`);
}

// ================================
// Validate Warehouse
// ================================
async function validateWarehouse(warehouseId: number): Promise<void> {
  const warehouse = await prisma.warehouse.findUnique({ where: { id: warehouseId } });
  if (!warehouse)           throw AppError.notFound(`Warehouse with ID ${warehouseId} not found.`);
  if (!warehouse.isActive)  throw AppError.unprocessable(`Warehouse with ID ${warehouseId} is inactive.`);
}

// ================================
// Resolve Products with Snapshots
// ================================
async function resolveProducts(items: SalesOrderItemInputDTO[]) {
  const productIds = items.map((i) => i.productId);
  const unique     = new Set(productIds);

  if (unique.size !== productIds.length) {
    const seen = new Set<number>();
    for (const id of productIds) {
      if (seen.has(id)) {
        throw AppError.badRequest(`Duplicate Product IDs are not allowed. Product ID ${id} appears more than once.`);
      }
      seen.add(id);
    }
  }

  const products = await prisma.product.findMany({
    where:   { id: { in: [...unique] } },
    include: { taxRate: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product)          throw AppError.notFound(`Product with ID ${item.productId} not found.`);
    if (!product.isActive) throw AppError.unprocessable(`Product with ID ${item.productId} is inactive.`);
  }

  return productMap;
}

// ================================
// Calculate Items
// ================================
function calculateItems(
  items:      SalesOrderItemInputDTO[],
  productMap: Map<number, { sellingPrice: unknown; taxRate: { rate: unknown } | null }>
): { calculatedItems: ItemData[]; subtotal: Decimal; taxAmount: Decimal } {
  let totalSubtotal = new Decimal(0);
  let totalTax      = new Decimal(0);

  const calculatedItems: ItemData[] = items.map((item) => {
    const product       = productMap.get(item.productId)!;
    const unitPrice     = new Decimal(String(product.sellingPrice));
    const taxRate       = product.taxRate ? new Decimal(String(product.taxRate.rate)) : new Decimal(0);
    const qty           = new Decimal(item.quantity);
    const discount      = new Decimal(item.discountAmount ?? 0);
    const subtotal      = qty.mul(unitPrice);

    if (discount.greaterThan(subtotal)) {
      throw AppError.unprocessable(
        `Item discount (${discount.toNumber()}) cannot exceed item subtotal (${subtotal.toNumber()}) for Product ID ${item.productId}.`
      );
    }

    const taxableAmount = subtotal.minus(discount);
    const taxAmount     = taxableAmount.mul(taxRate).div(100).toDecimalPlaces(2);
    const totalAmount   = taxableAmount.plus(taxAmount).toDecimalPlaces(2);

    totalSubtotal = totalSubtotal.plus(subtotal);
    totalTax      = totalTax.plus(taxAmount);

    return {
      productId:      item.productId,
      quantity:       qty.toDecimalPlaces(3).toNumber(),
      unitPrice:      unitPrice.toDecimalPlaces(2).toNumber(),
      taxRate:        taxRate.toDecimalPlaces(2).toNumber(),
      discountAmount: discount.toDecimalPlaces(2).toNumber(),
      subtotal:       subtotal.toDecimalPlaces(2).toNumber(),
      taxAmount:      taxAmount.toNumber(),
      totalAmount:    totalAmount.toNumber(),
    };
  });

  return {
    calculatedItems,
    subtotal:  totalSubtotal.toDecimalPlaces(2),
    taxAmount: totalTax.toDecimalPlaces(2),
  };
}

// ================================
// Calculate Order Totals
// ================================
function calculateOrderTotals(
  calculatedItems: ItemData[],
  orderDiscount:   Decimal
): { totalAmount: Decimal } {
  const sumItemTotals = calculatedItems.reduce(
    (sum, item) => sum.plus(item.totalAmount),
    new Decimal(0)
  );

  if (orderDiscount.greaterThan(sumItemTotals)) {
    throw AppError.unprocessable(
      `Order discount (${orderDiscount.toNumber()}) cannot exceed total order amount (${sumItemTotals.toNumber()}).`
    );
  }

  const totalAmount = sumItemTotals.minus(orderDiscount).toDecimalPlaces(2);

  if (totalAmount.lessThan(0)) {
    throw AppError.unprocessable('Order total amount cannot be negative.');
  }

  return { totalAmount };
}

// ================================
// Prisma include reused
// ================================
const soInclude = {
  customer:  { select: { id: true, name: true, email: true, phone: true } },
  warehouse: { select: { id: true, name: true, code: true, location: true } },
  items: { include: { product: { select: { id: true, name: true, sku: true } } } },
} as const;

// ================================
// Sales Order Service
// ================================
export class SalesOrderService {

  async getAll(params: SOQueryParams) {
    const { data, total } = await salesOrderRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const so = await salesOrderRepository.findById(id);
    if (!so) throw AppError.notFound(`Sales Order with ID ${id} not found.`);
    return so;
  }

  async create(dto: CreateSalesOrderDTO) {
    await validateCustomer(dto.customerId);
    await validateWarehouse(dto.warehouseId);

    const productMap    = await resolveProducts(dto.items);
    const orderDiscount = new Decimal(dto.discountAmount ?? 0);
    const { calculatedItems, subtotal, taxAmount } = calculateItems(dto.items, productMap);
    const { totalAmount } = calculateOrderTotals(calculatedItems, orderDiscount);

    const orderNumber = await generateOrderNumber();

    const so = await prisma.$transaction(async (tx) => {
      return tx.salesOrder.create({
        data: {
          orderNumber,
          customerId:           dto.customerId,
          warehouseId:          dto.warehouseId,
          status:               SalesOrderStatus.DRAFT,
          orderDate:            new Date(),
          expectedDeliveryDate: dto.expectedDeliveryDate ? new Date(dto.expectedDeliveryDate) : undefined,
          subtotal:             subtotal.toNumber(),
          taxAmount:            taxAmount.toNumber(),
          discountAmount:       orderDiscount.toNumber(),
          totalAmount:          totalAmount.toNumber(),
          notes:                dto.notes,
          items: {
            create: calculatedItems,
          },
        },
        include: soInclude,
      });
    });

    logger.info('Sales Order created', {
      salesOrderId: so.id,
      orderNumber:  so.orderNumber,
      customerId:   so.customerId,
      warehouseId:  so.warehouseId,
      totalAmount:  so.totalAmount,
    });

    return so;
  }

  async update(id: number, dto: UpdateSalesOrderDTO) {
    const existing = await this.getById(id);

    if (existing.status !== SalesOrderStatus.DRAFT) {
      throw AppError.unprocessable('Only DRAFT Sales Orders can be modified.');
    }

    if (dto.customerId)  await validateCustomer(dto.customerId);
    if (dto.warehouseId) await validateWarehouse(dto.warehouseId);

    let newItems:     ItemData[] | undefined;
    let newSubtotal:  Decimal | undefined;
    let newTaxAmount: Decimal | undefined;
    let newTotal:     Decimal | undefined;

    if (dto.items) {
      const productMap    = await resolveProducts(dto.items);
      const orderDiscount = new Decimal(dto.discountAmount ?? Number(existing.discountAmount));
      const { calculatedItems, subtotal, taxAmount } = calculateItems(dto.items, productMap);
      const { totalAmount } = calculateOrderTotals(calculatedItems, orderDiscount);

      newItems     = calculatedItems;
      newSubtotal  = subtotal;
      newTaxAmount = taxAmount;
      newTotal     = totalAmount;
    }

    const so = await prisma.$transaction(async (tx) => {
      if (newItems !== undefined) {
        await tx.salesOrderItem.deleteMany({ where: { salesOrderId: id } });
        await tx.salesOrderItem.createMany({
          data: newItems.map((item) => ({ ...item, salesOrderId: id })),
        });
      }

      return tx.salesOrder.update({
        where: { id },
        data: {
          ...(dto.customerId           ? { customerId:           dto.customerId }                      : {}),
          ...(dto.warehouseId          ? { warehouseId:          dto.warehouseId }                    : {}),
          ...(dto.expectedDeliveryDate ? { expectedDeliveryDate: new Date(dto.expectedDeliveryDate) } : {}),
          ...(dto.notes !== undefined  ? { notes:                dto.notes }                          : {}),
          ...(newSubtotal ? {
            subtotal:      newSubtotal.toNumber(),
            taxAmount:     newTaxAmount!.toNumber(),
            totalAmount:   newTotal!.toNumber(),
          } : {}),
          ...(dto.discountAmount !== undefined && !dto.items
            ? { discountAmount: dto.discountAmount }
            : {}),
        },
        include: soInclude,
      });
    });

    logger.info('Sales Order updated', { salesOrderId: so.id, orderNumber: so.orderNumber });
    return so;
  }

  async confirm(id: number) {
    const existing = await this.getById(id);

    if (existing.status !== SalesOrderStatus.DRAFT) {
      throw AppError.unprocessable(
        `Sales Order cannot be confirmed. Current status: ${existing.status}.`
      );
    }

    await validateCustomer(existing.customerId);
    await validateWarehouse(existing.warehouseId);

    // Validate inventory — read-only, no mutations
    for (const item of existing.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || !product.isActive) {
        throw AppError.unprocessable(
          `Product with ID ${item.productId} is inactive or no longer exists.`
        );
      }

      const inventory = await prisma.inventory.findUnique({
        where: { productId_warehouseId: { productId: item.productId, warehouseId: existing.warehouseId } },
      });

      const available = inventory ? new Decimal(String(inventory.quantity)) : new Decimal(0);
      const required  = new Decimal(String(item.quantity));

      if (available.lessThan(required)) {
        throw AppError.unprocessable(
          `Insufficient inventory for product "${product.name}". ` +
          `Available: ${available.toNumber()}, Required: ${required.toNumber()}.`
        );
      }
    }

    const so = await salesOrderRepository.updateStatus(id, SalesOrderStatus.CONFIRMED);
    logger.info('Sales Order confirmed', { salesOrderId: so.id, orderNumber: so.orderNumber });
    return so;
  }

  async cancel(id: number) {
    const existing = await this.getById(id);

    if (existing.status !== SalesOrderStatus.DRAFT) {
      throw AppError.unprocessable(
        `Only DRAFT Sales Orders can be cancelled. Current status: ${existing.status}.`
      );
    }

    const so = await salesOrderRepository.updateStatus(id, SalesOrderStatus.CANCELLED);
    logger.info('Sales Order cancelled', { salesOrderId: so.id, orderNumber: so.orderNumber });
    return so;
  }
}

export const salesOrderService = new SalesOrderService();