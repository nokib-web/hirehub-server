import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { JobRoutes } from '../modules/job/job.routes';
import { ApplicationRoutes } from '../modules/application/application.routes';
import { ReviewRoutes } from '../modules/review/review.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { DashboardRoutes } from '../modules/dashboard/dashboard.routes';
import { AIRoutes } from '../modules/ai/ai.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/jobs',
    route: JobRoutes,
  },
  {
    path: '/applications',
    route: ApplicationRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/dashboard',
    route: DashboardRoutes,
  },
  {
    path: '/ai',
    route: AIRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
