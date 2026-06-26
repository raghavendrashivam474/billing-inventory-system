// ================================
// Environment Configuration Module
// Project: Billing & Inventory Management System
// Sprint: 1.3 — Environment Configuration
// ================================
// This module is the single source of truth
// for all runtime configuration.
// Business logic must never access
// process.env directly.
// ================================

export interface AppConfig {
  server: {
    port: number;
    nodeEnv: string;
    isDevelopment: boolean;
    isProduction: boolean;
  };
  database: {
    url: string;
  };
}

// ================================
// Required Environment Variables
// ================================
const REQUIRED_VARIABLES = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
] as const;

// ================================
// Validation
// ================================
function validateEnvironment(): void {
  const missing: string[] = [];

  for (const variable of REQUIRED_VARIABLES) {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  }

  if (missing.length > 0) {
    console.error('================================');
    console.error('FATAL: Missing environment variables:');
    missing.forEach((v) => console.error(`  - ${v}`));
    console.error('Please check your .env file.');
    console.error('================================');
    process.exit(1);
  }
}

// ================================
// Load and Export Configuration
// ================================
function loadConfig(): AppConfig {
  validateEnvironment();

  return {
    server: {
      port: parseInt(process.env.PORT as string, 10),
      nodeEnv: process.env.NODE_ENV as string,
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production',
    },
    database: {
      url: process.env.DATABASE_URL as string,
    },
  };
}

// ================================
// Export Single Instance
// ================================
export const config = loadConfig();