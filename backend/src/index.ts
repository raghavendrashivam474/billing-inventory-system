// ================================
// Load environment variables FIRST
// ================================
import dotenv from 'dotenv';
dotenv.config();

// ================================
// Application Entry Point
// Project: Billing & Inventory Management System
// Sprint: 1.6 — Middleware Infrastructure
// ================================
import express, { Application, Request, Response } from 'express';
import helmet                from 'helmet';
import { config }            from './config/environment';
import { APP_NAME, API_PREFIX } from './constants/api';
import {
  corsMiddleware,
  loggerMiddleware,
  requestIdMiddleware,
  requestTimerMiddleware,
} from './middlewares';
import router from './routes';

const app: Application = express();

// ================================
// Middleware Pipeline
// Order is important — do not rearrange
// ================================

// 1. Security headers
app.use(helmet());

// 2. CORS
app.use(corsMiddleware);

// 3. HTTP request logger
app.use(loggerMiddleware);

// 4. Request ID — unique identifier per request
app.use(requestIdMiddleware);

// 5. Request timer — measure duration
app.use(requestTimerMiddleware);

// 6. JSON body parser
app.use(express.json());

// 7. URL-encoded body parser
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
// Start Server
// ================================
app.listen(config.server.port, () => {
  console.log('================================');
  console.log(`  ${APP_NAME}`);
  console.log('================================');
  console.log(`  Environment : ${config.server.nodeEnv}`);
  console.log(`  Port        : ${config.server.port}`);
  console.log(`  API         : http://localhost:${config.server.port}${API_PREFIX}`);
  console.log('================================');
});

export default app;