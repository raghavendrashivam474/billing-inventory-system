// ================================
// Health Service
// Project: Billing & Inventory Management System
// Sprint: 1.5 — API Foundation
// ================================

import { MESSAGES } from '../../constants/api';

export interface HealthStatus {
  success:   boolean;
  status:    string;
  database:  string;
  uptime:    string;
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

export class HealthService {

  getHealth(): HealthStatus {
    const uptimeSeconds = Math.floor(process.uptime());
    const hours   = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;

    return {
      success:   true,
      status:    'healthy',
      database:  MESSAGES.DB_SIMULATED,
      uptime:    `${hours}h ${minutes}m ${seconds}s`,
      timestamp: new Date().toISOString(),
    };
  }

  getStatus(environment: string): ApiStatus {
    return {
      success:     true,
      message:     MESSAGES.API_RUNNING,
      version:     'v1',
      environment,
      timestamp:   new Date().toISOString(),
    };
  }

  getApiInfo(): ApiInfo {
    return {
      name:          'Billing & Inventory Management API',
      version:       'v1',
      status:        'active',
      documentation: '/docs',
      timestamp:     new Date().toISOString(),
    };
  }
}

export const healthService = new HealthService();