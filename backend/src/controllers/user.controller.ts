import { Response } from 'express';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types/express.types';

const toUserDto = (user: {
  _id: { toString(): string } | string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
}) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
});

// GET /api/users  [Admin only]
export const getAllUsers = asyncHandler(async (_req: AuthRequest, res: Response): Promise<void> => {
  const users = await User.find().select('-password').lean();
  sendResponse(res, 200, 'Users fetched successfully', users.map(toUserDto));
});

// GET /api/users/:id  [Admin only]
export const getUserById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  sendResponse(res, 200, 'User fetched successfully', toUserDto(user));
});

// PATCH /api/users/:id/role  [Admin only]
export const updateUserRole = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { role } = req.body;
    if (!['admin', 'sales'].includes(role)) {
      throw new ApiError(400, 'Invalid role. Must be admin or sales');
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) throw new ApiError(404, 'User not found');
    sendResponse(res, 200, 'User role updated successfully', toUserDto(user));
  }
);

// DELETE /api/users/:id  [Admin only]
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  // Prevent admin from deleting themselves
  if (String(user._id) === req.user?.id) {
    throw new ApiError(400, 'You cannot delete your own account');
  }

  await User.findByIdAndDelete(req.params.id);
  sendResponse(res, 200, 'User deleted successfully');
});
