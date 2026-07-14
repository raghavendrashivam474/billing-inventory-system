// Stock Adjustment Routes — Sprint 3.3
// Immutable business events — no PATCH, DELETE, RESTORE
import { Router } from 'express';
import { stockAdjustmentController }       from './stock-adjustment.controller';
import {
  validateCreateStockAdjustment,
  validateQueryStockAdjustment,
} from './stock-adjustment.validator';

const router = Router();

router.get('/',    validateQueryStockAdjustment,  stockAdjustmentController.getAll);
router.get('/:id',                                stockAdjustmentController.getById);
router.post('/',   validateCreateStockAdjustment, stockAdjustmentController.create);

export default router;