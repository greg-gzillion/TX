import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = nanoid();
  const startTime = Date.now();

  // Attach request ID to request object
  req.requestId = requestId;

  // Log request
  console.log('📥 Incoming Request:', {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString(),
  });

  // Capture response
  const originalSend = res.send;
  res.send = function (body) {
    const duration = Date.now() - startTime;
    
    console.log('📤 Response Sent:', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });

    return originalSend.call(this, body);
  };

  next();
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}
