export interface HealthApplication {
  name: string;
  version: string;
  apiVersion: string;
}

export interface HealthRuntime {
  environment: string;
  node: string;
  platform: string;
  pid: number;
}

export interface HealthMemory {
  heapUsed: string;
  heapTotal: string;
  rss: string;
}

export interface HealthResponse {
  success: boolean;
  status: string;
  application: HealthApplication;
  database: string;
  uptime: string;
  runtime: HealthRuntime;
  memory: HealthMemory;
  timestamp: string;
}