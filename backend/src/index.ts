// ================================
// Load environment variables FIRST
// ================================
import dotenv from 'dotenv';
dotenv.config();

// ================================
// Application Entry Point
// Project: Billing & Inventory Management System
// Sprint: 1.5 — API Foundation
// ================================
import express, { Application, Request, Response } from 'express';
import { config }     from './config/environment';
import { APP_NAME, API_PREFIX } from './constants/api';
import router         from './routes';

const app: Application = express();

// ================================
// Middleware
// ================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// API Routes
// ================================
app.use('/', router);

// ================================
// Root Route
// ================================
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: `Welcome to ${APP_NAME}`,
    api:     `${API_PREFIX}`,
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