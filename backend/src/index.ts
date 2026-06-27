// ================================
// Load environment variables FIRST
// ================================
import dotenv from 'dotenv';
dotenv.config();

// ================================
// Application Entry Point
// Project: Billing & Inventory Management System
// Sprint: 1.7 — Global Error Handling
// ================================
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import { config }               from './config/environment';
import { APP_NAME, API_PREFIX } from './constants/api';
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
// Order is critical — do not rearrange
// ================================

// 1. Security headers
app.use(helmet());

// 2. CORS
app.use(corsMiddleware);

// 3. HTTP request logger
app.use(loggerMiddleware);

// 4. Request ID
app.use(requestIdMiddleware);

// 5. Request timer
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
// 404 Handler
// Must be AFTER all routes
// ================================
app.use(notFoundMiddleware);

// ================================
// Global Error Handler
// Must be LAST in the pipeline
// ================================
app.use(errorMiddleware);

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