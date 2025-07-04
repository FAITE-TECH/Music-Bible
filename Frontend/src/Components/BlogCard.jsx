import React from 'react';
import { FaStar, FaPen } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function BlogCard({ blog }) {
  return (
    <motion.div 
      className="border border-[#0093FF] bg-gray-800 rounded-xl shadow-xl overflow-hidden h-full  flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Blog Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={`http://localhost:3000${blog.blogImage}`}
          alt={blog.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
        {blog.isFeatured && (
          <div className="absolute top-2 left-2 z-10">
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-md">
              <FaStar className="text-white" />
              <span>Featured</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Blog Content */}
      <div className="p-5 flex-1 flex flex-col bg-white bg-opacity-90 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-medium text-white bg-gradient-to-r from-[#0119FF] to-[#0093FF] px-3 py-1 rounded-full">
            {blog.category}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
          {blog.title}
        </h3>
        
        <div 
          className="text-gray-600 text-sm mb-4 line-clamp-3 prose prose-sm"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        
        {/* Author Info */}
        <div className="mt-auto flex items-center gap-3 pt-3 border-t border-gray-200">
          {blog.authorImage && (
            <motion.img
              src={`http://localhost:3000${blog.authorImage}`}
              alt={blog.authorName}
              className="w-8 h-8 rounded-full object-cover border-2 border-[#0093FF]"
              whileHover={{ scale: 1.1 }}
            />
          )}
          <div>
            <p className="text-sm font-medium text-gray-800">
              {blog.authorName}
            </p>
            <p className="text-xs text-gray-500">Author</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}