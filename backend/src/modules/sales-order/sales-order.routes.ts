// Sales Order Routes — Sprint 3.4
import { Router } from 'express';
import { salesOrderController }      from './sales-order.controller';
import {
  validateCreateSalesOrder,
  validateUpdateSalesOrder,
  validateQuerySalesOrder,
} from './sales-order.validator';

const router = Router();

router.get('/',              validateQuerySalesOrder,  salesOrderController.getAll);
router.get('/:id',                                    salesOrderController.getById);
router.post('/',             validateCreateSalesOrder, salesOrderController.create);
router.patch('/:id',         validateUpdateSalesOrder, salesOrderController.update);
router.patch('/:id/confirm',                          salesOrderController.confirm);
router.patch('/:id/cancel',                           salesOrderController.cancel);

export default router;