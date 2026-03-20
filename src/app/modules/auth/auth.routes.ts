import express from 'express';
import { AuthController } from './auth.controller';
import { registerValidation, loginValidation } from './auth.validation';

import auth from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', auth(), AuthController.logout);

export const AuthRoutes = router;
