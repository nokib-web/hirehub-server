import { User } from './user.model';
import { IUser, IUserRole } from './user.interface';
import AppError from '../../utils/AppError';

const getAllUsers = async (query: any) => {
  const { role, page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  
  const filter: any = {};
  if (role) filter.role = role as string;

  const users = await User.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort('-createdAt');

  const total = await User.countDocuments(filter);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
    data: users,
  };
};

const getUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return user;
};

const updateProfile = async (id: string, requesterId: string, updateData: Partial<IUser>) => {
  if (id !== requesterId) {
    throw new AppError(403, 'You are not authorized to update this profile');
  }

  // Define allowed fields for update
  const allowedFields = ['name', 'avatar', 'headline', 'location', 'bio', 'skills', 'company'];
  const dataToUpdate: any = {};
  
  Object.keys(updateData).forEach((key) => {
    if (allowedFields.includes(key)) {
      dataToUpdate[key] = updateData[key as keyof IUser];
    }
  });

  const user = await User.findByIdAndUpdate(id, dataToUpdate, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

const deactivateUser = async (id: string) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

const changeUserRole = async (id: string, role: IUserRole) => {
  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateProfile,
  deactivateUser,
  changeUserRole,
};
