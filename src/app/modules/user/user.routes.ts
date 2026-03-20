import express from 'express';
import auth from '../../middlewares/auth.middleware';
import { UserController } from './user.controller';

const router = express.Router();

router.get('/', auth('admin'), UserController.getAllUsers);
router.get('/:id', auth(), UserController.getUserById);
router.patch('/:id', auth(), UserController.updateProfile);
router.delete('/:id', auth('admin'), UserController.deactivateUser);
router.patch('/:id/role', auth('admin'), UserController.changeUserRole);

export const UserRoutes = router;
