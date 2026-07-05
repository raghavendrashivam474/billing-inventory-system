// Unit Routes — Sprint 2.3
import { Router } from 'express';
import { unitController }      from './unit.controller';
import {
  validateCreateUnit,
  validateUpdateUnit,
  validateQueryUnit,
} from './unit.validator';

const router = Router();

router.get('/',              validateQueryUnit,  unitController.getAll);
router.get('/:id',                              unitController.getById);
router.post('/',             validateCreateUnit, unitController.create);
router.patch('/:id',         validateUpdateUnit, unitController.update);
router.delete('/:id',                           unitController.delete);
router.patch('/:id/restore',                    unitController.restore);

export default router;