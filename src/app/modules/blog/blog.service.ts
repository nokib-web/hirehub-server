import { IBlog } from './blog.interface';
import { Blog } from './blog.model';

const createBlog = async (blogData: Partial<IBlog>) => {
  const result = await Blog.create(blogData);
  return result;
};

const getAllBlogs = async (query: any) => {
  const {
    category,
    author,
    search,
    limit = 10,
    page = 1,
    status = 'published',
  } = query;

  const filters: any = { status };

  if (category) filters.category = category;
  if (author) filters.author = author;
  if (search) {
    filters.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const blogs = await Blog.find(filters)
    .populate('author', 'name avatar company')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await Blog.countDocuments(filters);

  return { blogs, total, page: Number(page), limit: Number(limit) };
};

const getBlogBySlug = async (slug: string) => {
  const blog = await Blog.findOneAndUpdate(
    { slug, status: 'published' },
    { $inc: { views: 1 } },
    { new: true }
  ).populate('author', 'name avatar company');
  return blog;
};

const updateBlog = async (id: string, updateData: Partial<IBlog>, userId: string, role: string) => {
  const blog = await Blog.findById(id);
  if (!blog) return null;

  if (blog.author.toString() !== userId && role !== 'admin') {
    throw new Error('Not authorized to update this blog');
  }

  const result = await Blog.findByIdAndUpdate(id, updateData, { new: true });
  return result;
};

const deleteBlog = async (id: string, userId: string, role: string) => {
  const blog = await Blog.findById(id);
  if (!blog) return null;

  if (blog.author.toString() !== userId && role !== 'admin') {
    throw new Error('Not authorized to delete this blog');
  }

  await Blog.findByIdAndDelete(id);
  return { success: true };
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};
