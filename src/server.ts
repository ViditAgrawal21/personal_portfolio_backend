import app from './app';
import { config } from './config';
import { logger } from './utils/logger';
import prisma from './config/database';

const startServer = async () => {
  try {
    // Start server FIRST so Cloud Run sees the port is open
    const server = app.listen(config.port, () => {
      logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
      logger.info(`Health check: http://localhost:${config.port}/health`);
      logger.info(`Public API: http://localhost:${config.port}/api`);
      logger.info(`Admin API: http://localhost:${config.port}/api/admin`);
    });

    // Then connect to the database
    try {
      await prisma.$connect();
      logger.info('Database connected successfully');
    } catch (dbError) {
      logger.error('Database connection failed:', dbError);
    }

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await prisma.$disconnect();
          logger.info('Database connection closed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
