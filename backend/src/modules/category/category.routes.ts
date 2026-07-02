// Category Routes — Sprint 2.1 Placeholder
import { Router }                    from 'express';
import { Controller } from './category.controller';

const router = Router();

router.get('/', (req, res) => Controller.placeholder(req, res));

export default router;