// ================================
// Load environment variables FIRST
// ================================
import dotenv from 'dotenv';
dotenv.config();

// ================================
// Application Entry Point
// Project: Billing & Inventory Management System
// Sprint: 1.8 — Logging Infrastructure
// ================================
import express, { Application, Request, Response } from 'express';
import helmet                from 'helmet';
import { config }            from './config/environment';
import { APP_NAME, APP_VERSION, API_PREFIX } from './constants/api';
import { logger }            from './logger';
import {
  corsMiddleware,
  loggerMiddleware,
  requestIdMiddleware,
  requestTimerMiddleware,
  notFoundMiddleware,
  errorMiddleware,
} from './middlewares';
import router from './routes';

const app: Application = express();

// ================================
// Middleware Pipeline
// ================================
app.use(helmet());
app.use(corsMiddleware);
app.use(loggerMiddleware);
app.use(requestIdMiddleware);
app.use(requestTimerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// Application Routes
// ================================
app.use('/', router);

// ================================
// Root Route
// ================================
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: `Welcome to ${APP_NAME}`,
    api:     API_PREFIX,
    docs:    '/docs',
  });
});

// ================================
// 404 Handler
// ================================
app.use(notFoundMiddleware);

// ================================
// Global Error Handler
// ================================
app.use(errorMiddleware);

// ================================
// Start Server
// ================================
app.listen(config.server.port, () => {
  logger.info(`${APP_NAME} started successfully`);
  logger.info(`Version     : ${APP_VERSION}`);
  logger.info(`Environment : ${config.server.nodeEnv}`);
  logger.info(`Port        : ${config.server.port}`);
  logger.info(`API         : http://localhost:${config.server.port}${API_PREFIX}`);
});

export default app;