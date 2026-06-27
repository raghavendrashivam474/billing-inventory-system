// ================================
// Health Routes
// Project: Billing & Inventory Management System
// Sprint: 1.9 — Production Health API
// ================================

import { Router }           from 'express';
import { healthController } from './health.controller';

const router = Router();

// GET /api/v1/health
// healthController.getHealth is wrapped with asyncHandler
// so it must be passed directly as middleware
router.get('/', healthController.getHealth);

export default router;