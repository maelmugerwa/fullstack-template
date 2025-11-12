import app from './app';
import { prisma } from './config/database';

/**
 * Server configuration
 */
const PORT = process.env.PORT || 3000;

/**
 * Start the server
 */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API endpoint: http://localhost:${PORT}/api/tasks`);
});

/**
 * Graceful shutdown handler
 * Properly close database connections and server on shutdown
 */
const gracefulShutdown = async (signal: string) => {
  console.log(`\n⚠️  ${signal} signal received: closing HTTP server`);
  
  server.close(async () => {
    console.log('🔒 HTTP server closed');
    
    try {
      await prisma.$disconnect();
      console.log('🔌 Database connection closed');
      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⏱️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

/**
 * Handle shutdown signals
 */
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

/**
 * Handle uncaught errors
 */
process.on('uncaughtException', (error: Error) => {
  console.error('💥 Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});