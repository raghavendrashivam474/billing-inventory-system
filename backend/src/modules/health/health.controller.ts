// ================================
// Health Controller
// Project: Billing & Inventory Management System
// Sprint: 1.9 — Production Health API
// ================================

import { Request, Response }  from 'express';
import { healthService }      from './health.service';
import { config }             from '../../config/environment';
import { HTTP_STATUS }        from '../../constants/api';
import { asyncHandler }       from '../../utils/async-handler';

export class HealthController {

  // ================================
  // GET /api/v1/health
  // ================================
  getHealth = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await healthService.getHealth(
      config.server.nodeEnv,
      req.requestId ?? 'unknown'
    );

    const statusCode = result.status === 'healthy'
      ? HTTP_STATUS.OK
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json(result);
  });

  // ================================
  // GET /api/v1/status
  // ================================
  getStatus(req: Request, res: Response): void {
    const result = healthService.getStatus(config.server.nodeEnv);
    res.status(HTTP_STATUS.OK).json(result);
  }

  // ================================
  // GET /api/v1
  // ================================
  getApiInfo(req: Request, res: Response): void {
    const result = healthService.getApiInfo();
    res.status(HTTP_STATUS.OK).json(result);
  }
}

export const healthController = new HealthController();