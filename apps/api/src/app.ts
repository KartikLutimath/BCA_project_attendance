import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { corsOptions } from "@/config/cors";
import { globalRateLimiter } from "@/middleware/rateLimiter.middleware";
import { errorHandler } from "@/middleware/errorHandler.middleware";
import { API_PREFIX } from "@/common/constants";
import apiRouter from "@/routes/index";

const app = express();

// ─── Security middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));

// ─── Body parsing & compression ───────────────────────────────────────────────
// 2mb limit to accommodate face descriptor payloads (128 floats as JSON)
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(compression() as express.RequestHandler);

// ─── Global rate limiter ──────────────────────────────────────────────────────
app.use(globalRateLimiter);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "SmartAttendance AI API is running",
    timestamp: new Date().toISOString(),
  });
});

// ─── API routes ───────────────────────────────────────────────────────────────
app.use(API_PREFIX, apiRouter);

// ─── 404 fallback ─────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global error handler (MUST be last) ──────────────────────────────────────
app.use(errorHandler);

export default app;
