// ================================
// Health Controller
// Project: Billing & Inventory Management System
// Sprint: 1.5 — API Foundation
// ================================

import { Request, Response } from 'express';
import { healthService }     from './health.service';
import { config }            from '../../config/environment';
import { HTTP_STATUS }       from '../../constants/api';

export class HealthController {

  getHealth(req: Request, res: Response): void {
    const result = healthService.getHealth();
    res.status(HTTP_STATUS.OK).json(result);
  }

  getStatus(req: Request, res: Response): void {
    const result = healthService.getStatus(config.server.nodeEnv);
    res.status(HTTP_STATUS.OK).json(result);
  }

  getApiInfo(req: Request, res: Response): void {
    const result = healthService.getApiInfo();
    res.status(HTTP_STATUS.OK).json(result);
  }
}

export const healthController = new HealthController();