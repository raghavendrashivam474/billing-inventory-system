// Product Routes — Sprint 2.4
import { Router } from 'express';
import { productController }      from './product.controller';
import {
  validateCreateProduct,
  validateUpdateProduct,
  validateQueryProduct,
} from './product.validator';

const router = Router();

router.get('/',              validateQueryProduct,  productController.getAll);
router.get('/:id',                                 productController.getById);
router.post('/',             validateCreateProduct, productController.create);
router.patch('/:id',         validateUpdateProduct, productController.update);
router.delete('/:id',                              productController.delete);
router.patch('/:id/restore',                       productController.restore);

export default router;