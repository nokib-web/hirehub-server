import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/error.middleware';

// Routes
import { AuthRoutes } from './app/modules/auth/auth.routes';
import { UserRoutes } from './app/modules/user/user.routes';
import { JobRoutes } from './app/modules/job/job.routes';
import { ApplicationRoutes } from './app/modules/application/application.routes';
import { ReviewRoutes } from './app/modules/review/review.routes';
import { DashboardRoutes } from './app/modules/dashboard/dashboard.routes';
import { AIRoutes } from './app/modules/ai/ai.routes';

const app: Application = express();

// Rate limiting configurations
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 minutes
  message: 'Too many requests, please try again after 15 minutes',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per 15 minutes
  message: 'Too many auth attempts, please try again after 15 minutes',
});

// Middleware route
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:3000', process.env.FRONTEND_URL as string],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

// Standard rate limit for all routes
app.use('/api', generalLimiter);

// Specific Routes with individual mounting
app.use('/api/auth', authLimiter, AuthRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/jobs', JobRoutes);
app.use('/api/applications', ApplicationRoutes);
app.use('/api/reviews', ReviewRoutes);
app.use('/api/dashboard', DashboardRoutes);
app.use('/api/ai', AIRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to HireHub API',
  });
});

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'API Not Found',
  });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
