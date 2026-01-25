import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { logger } from './utils/logger';
import { generalRateLimiter } from './middleware/rateLimiter.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import publicRoutes from './routes/public.routes';
import adminRoutes from './routes/admin.routes';
import contentPublicRoutes from './routes/content.public.routes';
import contentAdminRoutes from './routes/content.admin.routes';
import { authenticate } from './middleware/auth.middleware';

const app: Application = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (config.cors.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
app.use(generalRateLimiter);

// Request Logging
app.use((_req, _res, next) => {
  logger.info(`${_req.method} ${_req.path}`, {
    ip: _req.ip,
    userAgent: _req.get('user-agent'),
  });
  next();
});

// Static File Serving
app.use('/assets', express.static('public/assets'));

// Health Check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Content Routes
app.use('/api/content', contentPublicRoutes);
app.use('/api/admin/content', authenticate, contentAdminRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
