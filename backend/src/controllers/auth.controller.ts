import { Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../libs/jwt';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types/express.types';

// POST /api/auth/register
export const register = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const user = await User.create({ name, email, password, role: role || 'sales' });

  const token = generateToken({
    id: String(user._id),
    email: user.email,
    role: user.role,
    name: user.name,
  });

  sendResponse(res, 201, 'User registered successfully', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken({
    id: String(user._id),
    email: user.email,
    role: user.role,
    name: user.name,
  });

  sendResponse(res, 200, 'Login successful', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  sendResponse(res, 200, 'User fetched successfully', {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});
