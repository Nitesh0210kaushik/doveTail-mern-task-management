import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const startServer = async () => {
  await connectDatabase();
  const server = app.listen(env.port, () => {
    logger.info(`API listening on port ${env.port}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      const { disconnectDatabase } = await import('./config/database.js');
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
