import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from './auth.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../utils/AppError';

const register = catchAsync(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(400, errors.array()[0].msg);
  }

  const { user, accessToken, refreshToken } = await AuthService.registerUser(req.body);

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: (user as any)._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(400, errors.array()[0].msg);
  }

  const { user, accessToken, refreshToken } = await AuthService.loginUser(req.body);

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully',
    data: {
      user: {
        id: (user as any)._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new AppError(401, 'No refresh token provided');
  }

  const { accessToken } = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken,
    },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});

export const AuthController = {
  register,
  login,
  refreshToken,
  logout,
};
