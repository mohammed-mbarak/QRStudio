import app from './app.js';
import { connectDB } from './config/db.js';  // ✅ Changed to named import
import { env } from './config/env.js';       // ✅ Changed to named import
import { logger } from './utils/logger.js';  // ✅ Changed to named import

// Connect to database
connectDB();

const server = app.listen(env.port, () => {  // ✅ Changed to env.port
  logger.info(`Server running in ${env.env} mode on port ${env.port}`);  // ✅ Changed to env.env
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  server.close(() => {
    logger.info('Process terminated');
  });
});

export default server;