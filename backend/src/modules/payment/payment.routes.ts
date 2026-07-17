// Payment Routes — Sprint 3.7
// Immutable financial records — no PATCH, DELETE, RESTORE
import { Router } from 'express';
import { paymentController }      from './payment.controller';
import {
  validateCreatePayment,
  validateQueryPayment,
} from './payment.validator';

const router = Router();

router.get('/',    validateQueryPayment,  paymentController.getAll);
router.get('/:id',                        paymentController.getById);
router.post('/',   validateCreatePayment, paymentController.create);

export default router;