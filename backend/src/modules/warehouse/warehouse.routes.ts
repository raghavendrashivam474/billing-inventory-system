// Warehouse Routes — Sprint 2.6
import { Router } from 'express';
import { warehouseController }      from './warehouse.controller';
import {
  validateCreateWarehouse,
  validateUpdateWarehouse,
  validateQueryWarehouse,
} from './warehouse.validator';

const router = Router();

router.get('/',              validateQueryWarehouse,  warehouseController.getAll);
router.get('/:id',                                   warehouseController.getById);
router.post('/',             validateCreateWarehouse, warehouseController.create);
router.patch('/:id',         validateUpdateWarehouse, warehouseController.update);
router.delete('/:id',                                warehouseController.delete);
router.patch('/:id/restore',                         warehouseController.restore);

export default router;