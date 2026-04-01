import express from 'express';
import { ApplicationController } from './application.controller';
import auth from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/', auth('jobseeker'), ApplicationController.createApplication);
router.get('/', auth('jobseeker', 'employer', 'admin'), ApplicationController.getAllApplications);
// Alias: employer-specific applications
router.get('/employer', auth('employer', 'admin'), ApplicationController.getAllApplications);
router.get('/:id', auth('jobseeker', 'employer', 'admin'), ApplicationController.getSingleApplication);
router.patch('/:id', auth('employer', 'admin'), ApplicationController.updateApplicationStatus);
router.delete('/:id', auth('jobseeker', 'admin'), ApplicationController.deleteApplication);

export const ApplicationRoutes = router;
