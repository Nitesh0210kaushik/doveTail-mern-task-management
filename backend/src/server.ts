import app from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { env } from './config/env';
import { logger } from './config/logger';

const startServer = async () => {
  await connectDatabase();
  const server = app.listen(env.port, () => {
    logger.info(`API listening on port ${env.port}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer().catch((error) => {
  logger.fatal({ error: error instanceof Error ? error.stack : error }, 'Failed to start server');
  process.exit(1);
});
