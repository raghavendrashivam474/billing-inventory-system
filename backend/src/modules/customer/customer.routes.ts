// Customer Routes — Sprint 2.5
import { Router } from 'express';
import { customerController }      from './customer.controller';
import {
  validateCreateCustomer,
  validateUpdateCustomer,
  validateQueryCustomer,
} from './customer.validator';

const router = Router();

router.get('/',              validateQueryCustomer,  customerController.getAll);
router.get('/:id',                                  customerController.getById);
router.post('/',             validateCreateCustomer, customerController.create);
router.patch('/:id',         validateUpdateCustomer, customerController.update);
router.delete('/:id',                               customerController.delete);
router.patch('/:id/restore',                        customerController.restore);

export default router;