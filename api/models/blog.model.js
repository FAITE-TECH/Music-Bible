import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 120
    },
    content: { 
      type: String, 
      required: true 
    },
    category: { 
      type: String, 
      required: true,
      enum: ['Technology', 'Business', 'Cloud', 'Development', 'MobileApps'],
      default: 'Technology'
    },
    authorName: { 
      type: String, 
      required: true,
      trim: true
    },
    authorImage: { 
      type: String,
      default: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1620000000/default-author.png'
    },
    blogImage: { 
      type: String, 
      required: true 
    },
    views: {
      type: Number,
      default: 0
    },
     isFeatured: { 
      type: Boolean, 
      default: false 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better performance
blogSchema.index({ title: 'text', content: 'text', category: 1 });
blogSchema.index({ views: -1 });
blogSchema.index({ createdAt: -1 });

// Virtual for time ago
blogSchema.virtual('timeAgo').get(function() {
  const seconds = Math.floor((new Date() - this.createdAt) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval}y ago`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval}mo ago`;
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval}d ago`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval}h ago`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval}m ago`;
  
  return `${Math.floor(seconds)}s ago`;
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;