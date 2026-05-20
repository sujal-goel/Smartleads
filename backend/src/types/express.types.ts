import { Request } from 'express';
import { IUserPayload } from './auth.types';

// Extends the Express Request to include the authenticated user payload
export interface AuthRequest extends Request {
  user?: IUserPayload;
}
