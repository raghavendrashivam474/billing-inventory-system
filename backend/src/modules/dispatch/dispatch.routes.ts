// Dispatch Routes — Sprint 3.5
// Immutable business events — no PATCH, DELETE, RESTORE
import { Router } from 'express';
import { dispatchController }      from './dispatch.controller';
import {
  validateCreateDispatch,
  validateQueryDispatch,
} from './dispatch.validator';

const router = Router();

router.get('/',    validateQueryDispatch,  dispatchController.getAll);
router.get('/:id',                         dispatchController.getById);
router.post('/',   validateCreateDispatch, dispatchController.create);

export default router;