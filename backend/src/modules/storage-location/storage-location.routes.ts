// Storage Location Routes — Sprint 4.1
import { Router } from 'express';
import { storageLocationController }      from './storage-location.controller';
import {
  validateCreateStorageLocation,
  validateUpdateStorageLocation,
  validateQueryStorageLocation,
} from './storage-location.validator';

const router = Router();

router.get('/',              validateQueryStorageLocation,  storageLocationController.getAll);
router.get('/:id',                                          storageLocationController.getById);
router.post('/',             validateCreateStorageLocation, storageLocationController.create);
router.patch('/:id',         validateUpdateStorageLocation, storageLocationController.update);
router.delete('/:id',                                       storageLocationController.delete);
router.patch('/:id/restore',                                storageLocationController.restore);

export default router;