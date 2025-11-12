import { Request, Response, NextFunction } from "express";

/**
 * Simple request logger middleware
 * Logs HTTP method, URL, status code, and response time
 */
export const logger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Store original res.json function
  const originalJson = res.json.bind(res);

  // Override res.json to log after response is sent
  res.json = function (body: any) {
    const duration = Date.now() - startTime;

    // Log request details
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${
        req.originalUrl
      } - Status: ${res.statusCode} - ${duration}ms`
    );

    // Call original json function
    return originalJson(body);
  };

  next();
};
