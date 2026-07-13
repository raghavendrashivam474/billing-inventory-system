// Stock Movement Routes — Sprint 3.2
// Read-only — Stock Movements are immutable
import { Router } from 'express';
import { stockMovementController }      from './stock-movement.controller';
import { validateQueryStockMovement }   from './stock-movement.validator';

const router = Router();

router.get('/',    validateQueryStockMovement, stockMovementController.getAll);
router.get('/:id',                             stockMovementController.getById);

export default router;