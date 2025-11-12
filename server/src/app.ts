import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

// Load environment variables
dotenv.config();

/**
 * Express application configuration
 */
const app: Application = express();

/**
 * Middleware
 */

// CORS configuration - allow requests from frontend
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(logger);

/**
 * Routes
 */

// API routes mounted under /api
app.use('/api', routes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Fullstack Template API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      tasks: '/api/tasks',
    },
  });
});

/**
 * Error handling
 * Must be the last middleware
 */
app.use(errorHandler);

export default app;