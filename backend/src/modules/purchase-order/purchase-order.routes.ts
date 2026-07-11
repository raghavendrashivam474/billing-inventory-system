// Purchase Order Routes — Sprint 3.1
import { Router } from 'express';
import { purchaseOrderController }      from './purchase-order.controller';
import {
  validateCreatePurchaseOrder,
  validateUpdatePurchaseOrder,
  validateQueryPurchaseOrder,
} from './purchase-order.validator';

const router = Router();

router.get('/',              validateQueryPurchaseOrder,  purchaseOrderController.getAll);
router.get('/:id',                                       purchaseOrderController.getById);
router.post('/',             validateCreatePurchaseOrder, purchaseOrderController.create);
router.patch('/:id',         validateUpdatePurchaseOrder, purchaseOrderController.update);
router.patch('/:id/confirm',                             purchaseOrderController.confirm);
router.patch('/:id/cancel',                              purchaseOrderController.cancel);

export default router;