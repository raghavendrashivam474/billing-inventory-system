// ================================
// Load environment variables FIRST
// before any other imports
// ================================
import dotenv from 'dotenv';
dotenv.config();

// ================================
// Application Entry Point
// Project: Billing & Inventory Management System
// Sprint: 1.3 — Environment Configuration
// ================================
import express, { Application, Request, Response } from 'express';
import { config } from './config/environment';

const app: Application = express();

// ================================
// Middleware
// ================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// Routes
// ================================
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Backend');
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    environment: config.server.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ================================
// Start Server
// ================================
app.listen(config.server.port, () => {
  console.log('================================');
  console.log(`Environment : ${config.server.nodeEnv}`);
  console.log(`Server Port : ${config.server.port}`);
  console.log(`URL         : http://localhost:${config.server.port}`);
  console.log('================================');
});

export default app;