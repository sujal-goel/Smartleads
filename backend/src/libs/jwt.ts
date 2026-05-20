import jwt from 'jsonwebtoken';
import config from '../config/env';
import { IUserPayload } from '../types/auth.types';

export const generateToken = (payload: IUserPayload): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): IUserPayload => {
  return jwt.verify(token, config.jwtSecret) as IUserPayload;
};
