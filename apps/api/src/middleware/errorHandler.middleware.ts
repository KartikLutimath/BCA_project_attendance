import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "@/common/errors";
import { failure } from "@/common/response";
import { logger } from "@/config/logger";

/**
 * Global error handler — MUST be registered as the LAST middleware in app.ts.
 * Catches all errors thrown from controllers/services and sends a
 * standardized JSON error response.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Handle Prisma unique constraint violation (P2002)
  if (
    err.constructor.name === "PrismaClientKnownRequestError" &&
    (err as unknown as { code: string }).code === "P2002"
  ) {
    res.status(409).json(failure("Resource already exists"));
    return;
  }

  // Operational AppErrors — thrown intentionally by the application
  if (err instanceof AppError) {
    res.status(err.statusCode).json(failure(err.message));
    return;
  }

  // Zod validation errors (if not caught by validate middleware)
  if (err instanceof ZodError) {
    res.status(422).json(failure("Validation failed", err.errors));
    return;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    res.status(401).json(failure("Invalid token"));
    return;
  }
  if (err.name === "TokenExpiredError") {
    res.status(401).json(failure("Token has expired"));
    return;
  }

  // Unknown / programmer errors — log and return generic message
  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json(failure("Internal server error"));
};
