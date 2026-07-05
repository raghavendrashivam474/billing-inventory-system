// Tax Rate Routes — Sprint 2.3
import { Router } from 'express';
import { taxRateController }      from './tax-rate.controller';
import {
  validateCreateTaxRate,
  validateUpdateTaxRate,
  validateQueryTaxRate,
} from './tax-rate.validator';

const router = Router();

router.get('/',              validateQueryTaxRate,  taxRateController.getAll);
router.get('/:id',                                 taxRateController.getById);
router.post('/',             validateCreateTaxRate, taxRateController.create);
router.patch('/:id',         validateUpdateTaxRate, taxRateController.update);
router.delete('/:id',                              taxRateController.delete);
router.patch('/:id/restore',                       taxRateController.restore);

export default router;