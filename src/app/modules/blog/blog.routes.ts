import express from 'express';
import { BlogController } from './blog.controller';
import auth from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/', auth('employer', 'admin'), BlogController.createBlog);
router.get('/', BlogController.getAllBlogs);
router.get('/:slug', BlogController.getBlogBySlug);
router.patch('/:id', auth('employer', 'admin'), BlogController.updateBlog);
router.delete('/:id', auth('employer', 'admin'), BlogController.deleteBlog);

export const BlogRoutes = router;
