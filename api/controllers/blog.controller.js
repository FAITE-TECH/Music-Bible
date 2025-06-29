import Blog from "../models/blog.model.js";
import mongoose from "mongoose";
import { errorHandler } from "../utils/error.js";
import fs from 'fs';
import path from 'path';

export const createBlog = async (req, res, next) => {
  try {
    // Log incoming request data for debugging
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);

    const { title, content, category, authorName } = req.body;
    const blogImage = req.files?.blogImage?.[0]?.filename;
    const authorImage = req.files?.authorImage?.[0]?.filename;

    console.log('Processed values:', {
      title,
      content,
      category,
      authorName,
      blogImage,
      authorImage
    });

    // Validation
    if (!title || !content || !blogImage) {
      console.log('Validation failed - missing required fields');
      
      // Clean up any uploaded files
      if (blogImage) {
        const blogImagePath = path.join("/var/musicbible/Music-Bible/Frontend/uploads/blog", blogImage);
        if (fs.existsSync(blogImagePath)) {
          fs.unlinkSync(blogImagePath);
        }
      }
      if (authorImage) {
        const authorImagePath = path.join("/var/musicbible/Music-Bible/Frontend/uploads/blog", authorImage);
        if (fs.existsSync(authorImagePath)) {
          fs.unlinkSync(authorImagePath);
        }
      }
      
      return next(errorHandler(400, "Title, content, and blog image are required"));
    }

    // Create new blog
    const newBlog = new Blog({
      title,
      content,
      category,
      authorName,
      blogImage: `/uploads/blog/${blogImage}`,
      authorImage: authorImage 
        ? `/uploads/blog/${authorImage}`
        : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      ...(req.user?.id && { userId: req.user.id })
    });

    const savedBlog = await newBlog.save();
    
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: savedBlog
    });

  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files?.blogImage?.[0]?.filename) {
      const blogImagePath = path.join("/var/musicbible/Music-Bible/Frontend/uploads/blog", req.files.blogImage[0].filename);
      if (fs.existsSync(blogImagePath)) {
        fs.unlinkSync(blogImagePath);
      }
    }
    if (req.files?.authorImage?.[0]?.filename) {
      const authorImagePath = path.join("/var/musicbible/Music-Bible/Frontend/uploads/blog", req.files.authorImage[0].filename);
      if (fs.existsSync(authorImagePath)) {
        fs.unlinkSync(authorImagePath);
      }
    }

    if (error.code === 11000) {
      return next(errorHandler(400, "A blog with this title already exists"));
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return next(errorHandler(400, messages.join(", ")));
    }
    next(error);
  }
};

export const getBlogs = async (req, res, next) => {
  try {
    const { searchTerm, category, page = 1, limit = 9, sort = "-createdAt" } = req.query;
    const queryOptions = {};

    if (searchTerm) {
      queryOptions.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } },
        { authorName: { $regex: searchTerm, $options: "i" } }
      ];
    }

    if (category) {
      queryOptions.category = category;
    }

    // Convert to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count
    const totalBlogs = await Blog.countDocuments(queryOptions);

    // Calculate first and last day of last month for statistics
    const firstDayLastMonth = new Date();
    firstDayLastMonth.setDate(1);
    firstDayLastMonth.setMonth(firstDayLastMonth.getMonth() - 1);
    firstDayLastMonth.setHours(0, 0, 0, 0);

    const lastDayLastMonth = new Date();
    lastDayLastMonth.setDate(0);
    lastDayLastMonth.setHours(23, 59, 59, 999);

    const lastMonthBlogs = await Blog.countDocuments({
      ...queryOptions,
      updatedAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth },
    });

    // Get paginated results
    const blogs = await Blog.find(queryOptions)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      blogs,
      totalBlogs,
      lastMonthBlogs,
      currentPage: pageNum,
      totalPages: Math.ceil(totalBlogs / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

export const getBlog = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(errorHandler(400, "Invalid blog ID"));
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(errorHandler(404, "Blog not found"));
    }

    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

export const incrementViewCount = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(errorHandler(400, "Invalid blog ID"));
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedBlog) {
      return next(errorHandler(404, "Blog not found"));
    }

    res.status(200).json({ success: true, views: updatedBlog.views });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(errorHandler(400, "Invalid blog ID"));
    }

    // Find the existing blog
    const existingBlog = await Blog.findById(req.params.id);
    if (!existingBlog) {
      return next(errorHandler(404, "Blog not found"));
    }

    // Prepare update data
    const updateData = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      authorName: req.body.authorName,
      updatedAt: new Date()
    };

    // Handle blog image update
    if (req.files?.blogImage?.[0]) {
      // Delete old blog image if it exists
      if (existingBlog.blogImage && !existingBlog.blogImage.startsWith('http')) {
        const oldImagePath = path.join("/var/musicbible/Music-Bible/Frontend", existingBlog.blogImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.blogImage = `/uploads/blog/${req.files.blogImage[0].filename}`;
    }

    // Handle author image update
    if (req.files?.authorImage?.[0]) {
      // Delete old author image if it exists and isn't the default
      if (existingBlog.authorImage && 
          !existingBlog.authorImage.startsWith('http') && 
          existingBlog.authorImage !== 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png') {
        const oldImagePath = path.join("/var/musicbible/Music-Bible/Frontend", existingBlog.authorImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.authorImage = `/uploads/blog/${req.files.authorImage[0].filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json(updatedBlog);
  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files?.blogImage?.[0]?.filename) {
      const blogImagePath = path.join("/var/musicbible/Music-Bible/Frontend/uploads/blog", req.files.blogImage[0].filename);
      if (fs.existsSync(blogImagePath)) {
        fs.unlinkSync(blogImagePath);
      }
    }
    if (req.files?.authorImage?.[0]?.filename) {
      const authorImagePath = path.join("/var/musicbible/Music-Bible/Frontend/uploads/blog", req.files.authorImage[0].filename);
      if (fs.existsSync(authorImagePath)) {
        fs.unlinkSync(authorImagePath);
      }
    }
    
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(errorHandler(400, "Invalid blog ID"));
    }

    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!deletedBlog) {
      return next(errorHandler(404, "Blog not found"));
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getPopularBlogs = async (req, res, next) => {
  try {
    const popularBlogs = await Blog.find()
      .sort({ views: -1 })
      .limit(4);
    
    res.status(200).json(popularBlogs);
  } catch (error) {
    next(error);
  }
};

export const toggleBlogFeature = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(errorHandler(400, "Invalid blog ID"));
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(errorHandler(404, "Blog not found"));
    }

    // Check if we're trying to feature the blog
    if (!blog.isFeatured) {
      // Limit to 3 featured blogs
      const featuredCount = await Blog.countDocuments({ isFeatured: true });
      if (featuredCount >= 3) {
        return next(errorHandler(400, "Maximum of 3 featured blogs allowed"));
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { isFeatured: !blog.isFeatured },
      { new: true }
    );

    res.status(200).json(updatedBlog);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedBlogs = async (req, res, next) => {
  try {
    const featuredBlogs = await Blog.find({ isFeatured: true })
      .sort({ updatedAt: -1 })
      .limit(3);  // Limit to 3 featured blogs
    
    res.status(200).json(featuredBlogs);
  } catch (error) {
    next(error);
  }
};

export const getBlogsByCategory = async (req, res, next) => {
  try {
    const { category } = req.query;
    const userId = req.user?.id;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const blogs = await Blog.find({ category });

    // Add isFavorited flag if user is logged in
    if (userId) {
      const user = await User.findById(userId);
      const favoriteIds = user?.favorites || [];
      const blogsWithFavorites = blogs.map((b) => ({
        ...b._doc,
        isFavorited: favoriteIds.includes(b._id.toString()),
      }));
      return res.status(200).json({ blogs: blogsWithFavorites });
    }

    res.status(200).json({ blogs });
  } catch (error) {
    next(error);
  }
};