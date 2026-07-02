// Brand Routes — Sprint 2.2
import { Router } from 'express';
import { brandController }      from './brand.controller';
import {
  validateCreateBrand,
  validateUpdateBrand,
  validateQueryBrand,
} from './brand.validator';

const router = Router();

router.get('/',              validateQueryBrand,  brandController.getAll);
router.get('/:id',                               brandController.getById);
router.post('/',             validateCreateBrand, brandController.create);
router.patch('/:id',         validateUpdateBrand, brandController.update);
router.delete('/:id',                            brandController.delete);
router.patch('/:id/restore',                     brandController.restore);

export default router;