// ================================
// Health Service
// Project: Billing & Inventory Management System
// Sprint: 1.9 — Production Health API
// ================================

import { prisma }        from '../../config/prisma';
import { logger }        from '../../logger';
import { formatUptime }  from '../../utils/format-uptime';
import { formatMemory }  from '../../utils/format-memory';
import {
  APP_NAME,
  APP_VERSION,
  API_VERSION,
} from '../../constants/api';

// ================================
// Health Response Interface
// ================================
export interface HealthResponse {
  success:     boolean;
  status:      string;
  application: {
    name:       string;
    version:    string;
    apiVersion: string;
  };
  database:  string;
  uptime:    string;
  runtime: {
    environment: string;
    node:        string;
    platform:    string;
    pid:         number;
  };
  memory: {
    heapUsed:  string;
    heapTotal: string;
    rss:       string;
  };
  timestamp: string;
}

export interface ApiStatus {
  success:     boolean;
  message:     string;
  version:     string;
  environment: string;
  timestamp:   string;
}

export interface ApiInfo {
  name:          string;
  version:       string;
  status:        string;
  documentation: string;
  timestamp:     string;
}

// ================================
// Health Service Class
// ================================
export class HealthService {

  // ================================
  // Real Database Connectivity Check
  // ================================
  private async checkDatabase(): Promise<string> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return 'connected';
    } catch (error) {
      logger.error('Database health check failed', { error });
      return 'disconnected';
    }
  }

  // ================================
  // GET /api/v1/health
  // Full production health check
  // ================================
  async getHealth(
    environment: string,
    requestId:   string
  ): Promise<HealthResponse> {
    const startTime      = Date.now();
    const databaseStatus = await this.checkDatabase();
    const duration       = Date.now() - startTime;
    const isHealthy      = databaseStatus === 'connected';

    logger.info('Health check completed', {
      requestId,
      database:     databaseStatus,
      responseTime: `${duration}ms`,
      status:       isHealthy ? 'healthy' : 'unhealthy',
    });

    return {
      success:     isHealthy,
      status:      isHealthy ? 'healthy' : 'unhealthy',
      application: {
        name:       APP_NAME,
        version:    APP_VERSION,
        apiVersion: API_VERSION,
      },
      database:  databaseStatus,
      uptime:    formatUptime(process.uptime()),
      runtime: {
        environment,
        node:     process.version,
        platform: process.platform,
        pid:      process.pid,
      },
      memory:    formatMemory(),
      timestamp: new Date().toISOString(),
    };
  }

  // ================================
  // GET /api/v1/status
  // ================================
  getStatus(environment: string): ApiStatus {
    return {
      success:     true,
      message:     'Billing & Inventory Management API is running.',
      version:     API_VERSION,
      environment,
      timestamp:   new Date().toISOString(),
    };
  }

  // ================================
  // GET /api/v1
  // ================================
  getApiInfo(): ApiInfo {
    return {
      name:          APP_NAME,
      version:       API_VERSION,
      status:        'active',
      documentation: '/docs',
      timestamp:     new Date().toISOString(),
    };
  }
}

export const healthService = new HealthService();