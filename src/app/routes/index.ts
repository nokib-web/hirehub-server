import express from 'express';
// Import all module routes here
// import { AuthRoutes } from '../modules/auth/auth.routes';
// import { UserRoutes } from '../modules/user/user.routes';

const router = express.Router();

const moduleRoutes = [
  // { path: '/auth', route: AuthRoutes },
  // { path: '/users', route: UserRoutes },
];

// moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
