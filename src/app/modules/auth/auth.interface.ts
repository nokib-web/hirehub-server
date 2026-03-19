export type IUserRole = 'jobseeker' | 'employer' | 'admin';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: IUserRole;
  avatar?: string;
  headline?: string;
  location?: string;
  company?: string;
  bio?: string;
  skills?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
