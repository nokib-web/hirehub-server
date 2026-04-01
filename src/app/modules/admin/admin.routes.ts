import express from 'express';
import auth from '../../middlewares/auth.middleware';
import { UserController } from '../user/user.controller';
import { AdminController } from './admin.controller';

const router = express.Router();

router.get('/analytics', auth('admin'), AdminController.getAnalytics);

// User management endpoints
router.get('/users', auth('admin'), UserController.getAllUsers);
router.get('/users/:id', auth('admin'), UserController.getUserById);
router.patch('/users/:id', auth('admin'), UserController.updateProfile);
router.delete('/users/:id', auth('admin'), UserController.deactivateUser);
router.patch('/users/:id/role', auth('admin'), UserController.changeUserRole);

export const AdminRoutes = router;
