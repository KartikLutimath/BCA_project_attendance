import rateLimit from "express-rate-limit";
import { failure } from "@/common/response";

/**
 * globalRateLimiter — 200 requests per 15 minutes on all routes.
 * Prevents DDoS and general abuse.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: failure("Too many requests, please try again later."),
});

/**
 * authRateLimiter — strict 10 attempts per 15 minutes on login/register.
 * Prevents brute-force attacks on credentials.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: failure("Too many authentication attempts. Try again in 15 minutes."),
});

/**
 * attendanceRateLimiter — max 5 submissions per minute per IP.
 * Prevents attendance flooding.
 */
export const attendanceRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: failure("Too many attendance submissions. Please wait."),
});
