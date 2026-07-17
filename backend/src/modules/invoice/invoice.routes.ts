// Invoice Routes — Sprint 3.6
import { Router } from 'express';
import { invoiceController }      from './invoice.controller';
import {
  validateCreateInvoice,
  validateUpdateInvoice,
  validateQueryInvoice,
} from './invoice.validator';

const router = Router();

router.get('/',            validateQueryInvoice,  invoiceController.getAll);
router.get('/:id',                                invoiceController.getById);
router.post('/',           validateCreateInvoice, invoiceController.create);
router.patch('/:id',       validateUpdateInvoice, invoiceController.update);
router.patch('/:id/issue',                        invoiceController.issue);
router.patch('/:id/void',                         invoiceController.void);

export default router;