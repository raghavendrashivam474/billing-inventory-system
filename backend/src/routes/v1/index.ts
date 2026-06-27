// ================================
// API v1 Router
// Project: Billing & Inventory Management System
// Sprint: 1.5 — API Foundation
// ================================

import { Router, Request, Response } from 'express';
import { healthController }          from '../../modules/health/health.controller';
import { healthRoutes }              from '../../modules/health';
import { APP_NAME, API_VERSION }     from '../../constants/api';

const v1Router = Router();

// ================================
// GET /api/v1
// API metadata endpoint
// ================================
v1Router.get('/', (req: Request, res: Response) => {
  healthController.getApiInfo(req, res);
});

// ================================
// GET /api/v1/status
// API status endpoint
// ================================
v1Router.get('/status', (req: Request, res: Response) => {
  healthController.getStatus(req, res);
});

// ================================
// Module Routes
// Register module routes below
// ================================
v1Router.use('/health', healthRoutes);

// ================================
// Future modules registered here
// ================================
// v1Router.use('/products',  productRoutes);
// v1Router.use('/customers', customerRoutes);
// v1Router.use('/inventory', inventoryRoutes);
// v1Router.use('/billing',   billingRoutes);

export default v1Router;