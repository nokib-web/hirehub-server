import express from 'express';
import { JobController } from './job.controller';
import auth from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/', auth('employer', 'admin'), JobController.createJob);
router.get('/', JobController.getAllJobs);
router.get('/top-companies', JobController.getTopCompanies);
router.get('/category-stats', JobController.getCategoryStats);
router.get('/stats', JobController.getStats);
router.get('/my-jobs', auth('employer', 'admin'), JobController.getMyJobs);
router.get('/:id', JobController.getSingleJob);
router.patch('/:id', auth('employer', 'admin'), JobController.updateJob);
router.delete('/:id', auth('employer', 'admin'), JobController.deleteJob);

export const JobRoutes = router;
