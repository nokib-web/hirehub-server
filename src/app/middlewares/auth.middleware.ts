import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';
import { User } from '../modules/auth/auth.model';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new AppError(401, 'You are not logged in! Please login to get access.');
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

      // Check if user still exists
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new AppError(401, 'The user belonging to this token no longer exists.');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AppError(401, 'Your account is deactivated.');
      }

      // Role based authorization
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        throw new AppError(403, 'You do not have permission to perform this action');
      }

      req.user = {
        id: (user as any)._id.toString(),
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error: any) {
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError(401, 'Invalid token. Please login again.'));
    }
  };
};

export default auth;
