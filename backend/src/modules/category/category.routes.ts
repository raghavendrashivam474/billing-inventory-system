// Category Routes — Sprint 2.2
import { Router } from 'express';
import { categoryController }      from './category.controller';
import {
  validateCreateCategory,
  validateUpdateCategory,
  validateQueryCategory,
} from './category.validator';

const router = Router();

router.get('/',           validateQueryCategory,  categoryController.getAll);
router.get('/:id',                               categoryController.getById);
router.post('/',          validateCreateCategory, categoryController.create);
router.patch('/:id',      validateUpdateCategory, categoryController.update);
router.delete('/:id',                            categoryController.delete);
router.patch('/:id/restore',                     categoryController.restore);

export default router;