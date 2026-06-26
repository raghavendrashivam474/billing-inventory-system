import express, { Application, Request, Response } from 'express';

const app: Application = express();
const PORT: number = 3000;

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
    timestamp: new Date().toISOString(),
  });
});

// ================================
// Start Server
// ================================
app.listen(PORT, () => {
  console.log('================================');
  console.log(`Server is running on port ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log('================================');
});

export default app;