import { Request, Response } from 'express';
import { BlogService } from './blog.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../utils/AppError';

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const blogData = {
    ...req.body,
    author: req.user?.id,
    authorRole: req.user?.role as 'admin' | 'employer',
  };
  const blog = await BlogService.createBlog(blogData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Blog created successfully',
    data: blog,
  });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const { blogs, total, page, limit } = await BlogService.getAllBlogs(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blogs fetched successfully',
    data: blogs,
    meta: { page, limit, total },
  });
});

const getBlogBySlug = catchAsync(async (req: Request, res: Response) => {
  const blog = await BlogService.getBlogBySlug(req.params.slug as string);
  if (!blog) {
    throw new AppError(404, 'Blog not found');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog fetched successfully',
    data: blog,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const updatedBlog = await BlogService.updateBlog(
    req.params.id as string,
    req.body,
    req.user?.id as string,
    req.user?.role as string
  );

  if (!updatedBlog) {
    throw new AppError(404, 'Blog not found');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog updated successfully',
    data: updatedBlog,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.deleteBlog(
    req.params.id as string,
    req.user?.id as string,
    req.user?.role as string
  );

  if (!result) {
    throw new AppError(404, 'Blog not found');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog deleted successfully',
    data: null,
  });
});

export const BlogController = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};
