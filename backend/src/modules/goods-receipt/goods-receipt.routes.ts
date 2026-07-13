// Goods Receipt Routes — Sprint 3.2
import { Router } from 'express';
import { goodsReceiptController }      from './goods-receipt.controller';
import {
  validateCreateGoodsReceipt,
  validateQueryGoodsReceipt,
} from './goods-receipt.validator';

const router = Router();

router.get('/',    validateQueryGoodsReceipt,  goodsReceiptController.getAll);
router.get('/:id',                             goodsReceiptController.getById);
router.post('/',   validateCreateGoodsReceipt, goodsReceiptController.create);

export default router;