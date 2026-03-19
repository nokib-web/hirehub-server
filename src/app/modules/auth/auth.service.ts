import jwt from 'jsonwebtoken';
import { User } from './auth.model';
import { IUser } from './auth.interface';
import AppError from '../../utils/AppError';
import dotenv from 'dotenv';

dotenv.config();

const signAccessToken = (payload: { id: string; email: string; role: string }) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  } as any);
};

const signRefreshToken = (payload: { id: string; email: string; role: string }) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  } as any);
};

const registerUser = async (userData: IUser) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(400, 'User already exists with this email');
  }

  const user = await User.create(userData);

  const payload = {
    id: (user as any)._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return { user, accessToken, refreshToken };
};

const loginUser = async (loginData: any) => {
  const { email, password } = loginData;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const isPasswordMatched = await (user as any).comparePassword(password);
  if (!isPasswordMatched) {
    throw new AppError(401, 'Invalid email or password');
  }

  const payload = {
    id: (user as any)._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return { user, accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as any;

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError(401, 'User not found');
    }

    const payload = {
      id: (user as any)._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(payload);
    return { accessToken };
  } catch (error) {
    throw new AppError(401, 'Invalid refresh token');
  }
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken,
};
