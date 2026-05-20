import { Request, Response, NextFunction } from 'express';

// Wraps async route handlers to catch errors and forward to error middleware
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
