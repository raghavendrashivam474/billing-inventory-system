// ================================
// Health Routes
// Project: Billing & Inventory Management System
// Sprint: 1.5 — API Foundation
// ================================

import { Router }          from 'express';
import { healthController } from './health.controller';

const router = Router();

// GET /api/v1/health
router.get('/', (req, res) => healthController.getHealth(req, res));

export default router;