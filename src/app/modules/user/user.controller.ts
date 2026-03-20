import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { UserService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { IUserRole } from './user.interface';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.getUserById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile fetched successfully',
    data: user,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const requesterId = req.user?.id as string;
  const user = await UserService.updateProfile(req.params.id as string, requesterId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

const deactivateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.deactivateUser(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deactivated successfully',
    data: user,
  });
});

const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.changeUserRole(req.params.id as string, req.body.role as IUserRole);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User role updated successfully',
    data: user,
  });
});

export const UserController = {
  getAllUsers,
  getUserById,
  updateProfile,
  deactivateUser,
  changeUserRole,
};
