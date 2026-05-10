// server.ts — HTTP server entry point.
// Loads env first (fail-fast), then connects to DB, then starts listening.
import "./config/env"; // validates environment on startup
import http from "http";
import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/database";
import { logger } from "./config/logger";

const PORT = parseInt(env.PORT, 10);

async function bootstrap() {
  // ─── Database connectivity check ─────────────────────────────────────────
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");
  } catch (err) {
    logger.error("Failed to connect to database", err);
    process.exit(1);
  }

  // ─── Start HTTP server ───────────────────────────────────────────────────
  const server = http.createServer(app);

  server.listen(PORT, () => {
    logger.info(`SmartAttendance API running on port ${PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
  });

  // ─── Graceful shutdown ───────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info("Database disconnected. Goodbye.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // ─── Unhandled rejection / exception safety net ──────────────────────────
  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Promise Rejection", reason);
  });

  process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception", { message: err.message, stack: err.stack });
    process.exit(1);
  });
}

bootstrap();
