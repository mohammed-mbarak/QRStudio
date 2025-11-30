import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { logger } from '../utils/logger.js'; // default export
import { env } from '../config/env.js';

/**
 * Custom rate limit handler with logging
 */
const rateLimitHandler = (req, res) => {
  const clientIP = req.ip || req.connection?.remoteAddress;

  logger.warn(`Rate limit exceeded for IP: ${clientIP}, Path: ${req.originalUrl}`);

  res.status(429).json({
    success: false,
    error: 'Too many requests, please try again later.',
    retryAfter: Math.ceil(env.rateLimit.windowMs / 1000 / 60) + ' minutes'
  });
};

/**
 * Main rate limiter middleware
 */
export const mainRateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  handler: rateLimitHandler,
  keyGenerator: ipKeyGenerator, // ✅ Handles IPv4 & IPv6 correctly
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Stricter rate limiter for QR generation endpoints
 */
export const qrGenerationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  handler: rateLimitHandler,
  keyGenerator: ipKeyGenerator,
  message: 'Too many QR generation requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Lenient rate limiter for read operations
 */
export const readRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  handler: rateLimitHandler,
  keyGenerator: ipKeyGenerator,
  message: 'Too many read requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth rate limiter
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: rateLimitHandler,
  keyGenerator: ipKeyGenerator,
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Development rate limiter (more lenient)
 */
export const developmentRateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max * 2,
  handler: rateLimitHandler,
  keyGenerator: ipKeyGenerator,
  skip: () => env.env !== 'development',
  standardHeaders: true,
  legacyHeaders: false,
});

// Export the main rate limiter as default
export default mainRateLimiter;
