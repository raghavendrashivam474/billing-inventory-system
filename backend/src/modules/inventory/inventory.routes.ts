// Inventory Routes — Sprint 3.2
// Read-only — Inventory is system-managed
import { Router } from 'express';
import { inventoryController }   from './inventory.controller';
import { validateQueryInventory } from './inventory.validator';

const router = Router();

// IMPORTANT: specific route registered BEFORE generic :id route
router.get('/product/:productId',  inventoryController.getByProduct);
router.get('/',   validateQueryInventory, inventoryController.getAll);
router.get('/:id',                        inventoryController.getById);

export default router;