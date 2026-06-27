// ================================
// Prisma Client Instance
// Project: Billing & Inventory Management System
// Sprint: 1.9 — Health API
// ================================
// Single shared Prisma Client instance.
// All repositories must import from here.
// Never instantiate PrismaClient directly.
// ================================

import { PrismaClient } from '@prisma/client';
import { logger }       from '../logger';

const prisma = new PrismaClient({
  log: [
    { level: 'error', emit: 'event' },
    { level: 'warn',  emit: 'event' },
  ],
});

// ================================
// Log Prisma Warnings and Errors
// ================================
prisma.$on('error', (e) => {
  logger.error('Prisma error', { message: e.message });
});

prisma.$on('warn', (e) => {
  logger.warn('Prisma warning', { message: e.message });
});

export { prisma };