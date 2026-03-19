import { NextFunction, Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import catchAsync from '../utils/catchAsync';
// import AppError from '../utils/AppError';

// Placeholder for auth middleware
const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Auth logic will go here
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
