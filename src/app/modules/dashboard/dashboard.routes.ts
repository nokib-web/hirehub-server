import express from 'express';
import auth from '../../middlewares/auth.middleware';
import { DashboardController } from './dashboard.controller';

const router = express.Router();

router.get('/stats', auth('admin', 'employer', 'jobseeker'), DashboardController.getStats);
router.get('/chart-data', auth('admin', 'employer', 'jobseeker'), DashboardController.getChartData);

export const DashboardRoutes = router;
