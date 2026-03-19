import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { JobRoutes } from '../modules/job/job.routes';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
