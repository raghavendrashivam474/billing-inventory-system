// API v1 Router — Sprint 3.7
import { Router, Request, Response } from 'express';
import { healthController }           from '../../modules/health/health.controller';
import { healthRoutes }               from '../../modules/health';

import categoryRoutes        from '../../modules/category/category.routes';
import brandRoutes           from '../../modules/brand/brand.routes';
import unitRoutes            from '../../modules/unit/unit.routes';
import taxRateRoutes         from '../../modules/tax-rate/tax-rate.routes';
import productRoutes         from '../../modules/product/product.routes';
import supplierRoutes        from '../../modules/supplier/supplier.routes';
import customerRoutes        from '../../modules/customer/customer.routes';
import warehouseRoutes       from '../../modules/warehouse/warehouse.routes';
import purchaseOrderRoutes   from '../../modules/purchase-order/purchase-order.routes';
import goodsReceiptRoutes    from '../../modules/goods-receipt/goods-receipt.routes';
import inventoryRoutes       from '../../modules/inventory/inventory.routes';
import stockMovementRoutes   from '../../modules/stock-movement/stock-movement.routes';
import stockAdjustmentRoutes from '../../modules/stock-adjustment/stock-adjustment.routes';
import salesOrderRoutes      from '../../modules/sales-order/sales-order.routes';
import dispatchRoutes        from '../../modules/dispatch/dispatch.routes';
import invoiceRoutes         from '../../modules/invoice/invoice.routes';
import paymentRoutes         from '../../modules/payment/payment.routes';

const v1Router = Router();

v1Router.get('/',       (req: Request, res: Response) => healthController.getApiInfo(req, res));
v1Router.get('/status', (req: Request, res: Response) => healthController.getStatus(req, res));
v1Router.use('/health', healthRoutes);

v1Router.use('/categories',        categoryRoutes);
v1Router.use('/brands',            brandRoutes);
v1Router.use('/units',             unitRoutes);
v1Router.use('/tax-rates',         taxRateRoutes);
v1Router.use('/products',          productRoutes);
v1Router.use('/suppliers',         supplierRoutes);
v1Router.use('/customers',         customerRoutes);
v1Router.use('/warehouses',        warehouseRoutes);
v1Router.use('/purchase-orders',   purchaseOrderRoutes);
v1Router.use('/goods-receipts',    goodsReceiptRoutes);
v1Router.use('/inventory',         inventoryRoutes);
v1Router.use('/stock-movements',   stockMovementRoutes);
v1Router.use('/stock-adjustments', stockAdjustmentRoutes);
v1Router.use('/sales-orders',      salesOrderRoutes);
v1Router.use('/dispatches',        dispatchRoutes);
v1Router.use('/invoices',          invoiceRoutes);
v1Router.use('/payments',          paymentRoutes);

export default v1Router;