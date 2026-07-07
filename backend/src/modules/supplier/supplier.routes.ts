// Supplier Routes — Sprint 2.5
import { Router } from 'express';
import { supplierController }      from './supplier.controller';
import {
  validateCreateSupplier,
  validateUpdateSupplier,
  validateQuerySupplier,
} from './supplier.validator';

const router = Router();

router.get('/',              validateQuerySupplier,  supplierController.getAll);
router.get('/:id',                                  supplierController.getById);
router.post('/',             validateCreateSupplier, supplierController.create);
router.patch('/:id',         validateUpdateSupplier, supplierController.update);
router.delete('/:id',                               supplierController.delete);
router.patch('/:id/restore',                        supplierController.restore);

export default router;