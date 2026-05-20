import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/env';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import userRoutes from './routes/user.routes';
import { DBConnection } from './libs/db';
import { errorHandler, notFound } from './middlewares/errorHandler';
import { asyncHandler } from './utils/asyncHandler';

const app = express();

// CORS
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Smart Leads API is running', env: config.nodeEnv });
});

// Establish a cached Mongo connection before serving database-backed routes.
app.use(
  '/api',
  asyncHandler(async (_req, _res, next) => {
    await DBConnection();
    next();
  })
);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

export default app;
