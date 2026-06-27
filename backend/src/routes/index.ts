// ================================
// Central Routes Registry
// Project: Billing & Inventory Management System
// Sprint: 1.5 — API Foundation
// ================================

import { Router }   from 'express';
import { API_PREFIX } from '../constants/api';
import v1Router     from './v1';

const router = Router();

// ================================
// API Version Registration
// ================================
router.use('/api/v1', v1Router);

// ================================
// Future versions registered here
// ================================
// router.use('/api/v2', v2Router);

export default router;