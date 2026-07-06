// API v1 Router — Sprint 2.4
import { Router, Request, Response } from 'express';
import { healthController }           from '../../modules/health/health.controller';
import { healthRoutes }               from '../../modules/health';

// Master Data Routes
import categoryRoutes  from '../../modules/category/category.routes';
import brandRoutes     from '../../modules/brand/brand.routes';
import unitRoutes      from '../../modules/unit/unit.routes';
import taxRateRoutes   from '../../modules/tax-rate/tax-rate.routes';

// Business Module Routes — Sprint 2.4
import productRoutes   from '../../modules/product/product.routes';

// Placeholder Routes
import supplierRoutes  from '../../modules/supplier/supplier.routes';
import customerRoutes  from '../../modules/customer/customer.routes';
import warehouseRoutes from '../../modules/warehouse/warehouse.routes';

const v1Router = Router();

// Infrastructure
v1Router.get('/', (req: Request, res: Response) => healthController.getApiInfo(req, res));
v1Router.get('/status', (req: Request, res: Response) => healthController.getStatus(req, res));
v1Router.use('/health', healthRoutes);

// Master Data
v1Router.use('/categories',  categoryRoutes);
v1Router.use('/brands',      brandRoutes);
v1Router.use('/units',       unitRoutes);
v1Router.use('/tax-rates',   taxRateRoutes);

// Business Modules
v1Router.use('/products',    productRoutes);

// Placeholders
v1Router.use('/suppliers',   supplierRoutes);
v1Router.use('/customers',   customerRoutes);
v1Router.use('/warehouses',  warehouseRoutes);

export default v1Router;