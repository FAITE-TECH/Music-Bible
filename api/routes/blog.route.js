import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
  createBlog, 
  deleteBlog, 
  getBlog, 
  getBlogs, 
  getFeaturedBlogs, 
  getPopularBlogs, 
  incrementViewCount, 
  toggleBlogFeature, 
  updateBlog 
} from '../controllers/blog.controller.js';

const router = express.Router();

// Configure multer storage with better file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = '/var/musicbible/Music-Bible/Frontend/uploads/blog';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Configure multer with limits and file filtering
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 2 // Maximum of 2 files (blogImage and authorImage)
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF) are allowed!'), false);
    }
  }
});

// Blog creation route with file upload handling
router.post('/create', 
  upload.fields([
    { name: 'blogImage', maxCount: 1 },
    { name: 'authorImage', maxCount: 1 }
  ]), 
  createBlog
);

// Error handling middleware for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' 
        ? 'File size too large (max 5MB)' 
        : 'File upload error'
    });
  } else if (err) {
    // An unknown error occurred
    return res.status(500).json({
      success: false,
      message: err.message || 'File upload failed'
    });
  }
  next();
});

// Other blog routes
router.get('/get', getBlogs);
router.get('/get/popular', getPopularBlogs);
router.get('/get/:id', getBlog);
router.put('/update/:id', 
  upload.fields([
    { name: 'blogImage', maxCount: 1 },
    { name: 'authorImage', maxCount: 1 }
  ]), 
  updateBlog
);
router.delete('/delete/:id', deleteBlog);
router.get('/get/featured', getFeaturedBlogs);  
router.put('/feature/:id', toggleBlogFeature); 
router.post('/:id/view', incrementViewCount);

export default router;