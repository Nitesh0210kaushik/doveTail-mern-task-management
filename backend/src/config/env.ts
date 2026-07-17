import 'dotenv/config';

const requiredInProduction = ['MONGO_URI', 'JWT_SECRET'];

if (process.env.NODE_ENV === 'production') {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing production environment variables: ${missing.join(', ')}`);
  }
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_management',
  jwtSecret: process.env.JWT_SECRET || 'development-only-change-me',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  refreshCookieName: process.env.REFRESH_COOKIE_NAME || 'task_refresh_token',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  logToFile: process.env.LOG_TO_FILE === 'true',
  logDir: process.env.LOG_DIR || 'logs',
  logMaxFiles: Number(process.env.LOG_MAX_FILES) || 5,
  logMaxSizeBytes: Number(process.env.LOG_MAX_SIZE_BYTES) || 5242880
});
