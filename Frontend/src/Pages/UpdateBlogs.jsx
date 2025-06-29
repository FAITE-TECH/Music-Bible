import { Alert, Button, FileInput, TextInput, Textarea, Select } from "flowbite-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiArrowLeft, HiOutlinePhotograph, HiOutlineUser } from "react-icons/hi";
import { FaUser, FaSave, FaPen } from "react-icons/fa";

export default function UpdateBlogs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState({ 
    blogImage: null,
    authorImage: null 
  });
  const [currentImages, setCurrentImages] = useState({
    blogImage: '',
    authorImage: ''
  });
  const [formData, setFormData] = useState({
    title: "",
    category: "Technology",
    content: "",
    authorName: "",
  });
  const [publishError, setPublishError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/get/${id}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch blog");
        }

        setFormData({
          title: data.title,
          category: data.category,
          content: data.content,
          authorName: data.authorName,
        });

        setCurrentImages({
          blogImage: data.blogImage,
          authorImage: data.authorImage
        });
      } catch (error) {
        setPublishError(error.message);
        console.error("Error fetching blog:", error);
        if (error.message.includes("not found")) {
          navigate("/dashboard?tab=blogs");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.title.trim() || !formData.content.trim()) {
      setPublishError('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    setPublishError(null);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('authorName', formData.authorName);
      formDataToSend.append('userId', currentUser._id);
      
      if (files.blogImage) {
        formDataToSend.append('blogImage', files.blogImage);
      }
      if (files.authorImage) {
        formDataToSend.append('authorImage', files.authorImage);
      }

      const res = await fetch(`/api/blog/update/${id}`, {
        method: 'PUT',
        body: formDataToSend
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update blog');
      }

      navigate("/dashboard?tab=blogs");
    } catch (error) {
      setPublishError(error.message || "Something went wrong. Please try again.");
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EBBA0A]"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-3 max-w-full bg-black mx-auto min-h-screen"
    >
      {/* Navigation Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/dashboard?tab=blogs")}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <HiArrowLeft className="text-xl" />
            <span className="font-medium">Back to Blog Dashboard</span>
          </motion.div>
        </button>
      </motion.div>

      {/* Main Content */}
      <motion.h1
        variants={itemVariants}
        className="text-center text-3xl md:text-4xl my-7 font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text"
      >
        Update Blog Post
      </motion.h1>

      <motion.form
        variants={containerVariants}
        className="flex flex-col gap-6 max-w-4xl mx-auto"
        onSubmit={handleSubmit}
      >
        {/* Title */}
        <motion.div variants={itemVariants}>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            value={formData.title || ''}
          />
        </motion.div>

        {/* Category */}
        <motion.div variants={itemVariants}>
          <Select
            value={formData.category || 'Technology'}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value='Technology'>Technology</option>
            <option value='Business'>Business</option>
            <option value='Cloud'>Cloud</option>
            <option value='Development'>Development</option>
            <option value='MobileApps'>Mobile Apps</option>
          </Select>
        </motion.div>

        {/* Author Name */}
        <motion.div variants={itemVariants}>
          <TextInput
            type='text'
            placeholder='Author Name'
            id='authorName'
            onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
            value={formData.authorName || ''}
            icon={HiOutlineUser}
          />
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants}>
          <Textarea
            placeholder="Blog Content"
            className="h-52"
            required
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            value={formData.content || ''}
          />
        </motion.div>

        {/* Blog Image Upload Section */}
        <motion.div
          variants={itemVariants}
          className='flex flex-col gap-4 items-center justify-between border-2 border-dashed border-blue-300 rounded-xl p-4 hover:border-blue-500 transition-colors'
        >
          <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
            <div className="flex items-center gap-2 w-full">
              <HiOutlinePhotograph className="text-2xl text-blue-500" />
              <FileInput
                type='file'
                accept='image/*'
                onChange={(e) => handleFileChange(e, 'blogImage')}
                className="w-full"
              />
            </div>
          </div>

          <div className="w-full">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Current Blog Image:</h3>
            {files.blogImage ? (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={URL.createObjectURL(files.blogImage)}
                alt="Blog Preview"
                className="w-full max-h-64 object-contain rounded-lg shadow-md"
              />
            ) : currentImages.blogImage ? (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={`http://localhost:3000${currentImages.blogImage}`}
                alt="Current Blog"
                className="w-full max-h-64 object-contain rounded-lg shadow-md"
              />
            ) : (
              <p className="text-gray-400 text-sm">No blog image currently set</p>
            )}
          </div>
        </motion.div>

        {/* Author Image Upload Section */}
        <motion.div
          variants={itemVariants}
          className='flex flex-col gap-4 items-center justify-between border-2 border-dashed border-teal-300 rounded-xl p-4 hover:border-teal-500 transition-colors'
        >
          <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
            <div className="flex items-center gap-2 w-full">
              <HiOutlinePhotograph className="text-2xl text-teal-500" />
              <FileInput
                type='file'
                accept='image/*'
                onChange={(e) => handleFileChange(e, 'authorImage')}
                className="w-full"
              />
            </div>
          </div>

          <div className="w-full">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Current Author Image:</h3>
            {files.authorImage ? (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={URL.createObjectURL(files.authorImage)}
                alt="Author Preview"
                className="w-24 h-24 object-cover rounded-full shadow-md"
              />
            ) : currentImages.authorImage ? (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={`http://localhost:3000${currentImages.authorImage}`}
                alt="Current Author"
                className="w-24 h-24 object-cover rounded-full shadow-md"
              />
            ) : (
              <p className="text-gray-400 text-sm">No author image currently set</p>
            )}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <Button
            type='submit'
            className="w-full mb-12 mt-4 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">↻</span>
                Updating...
              </>
            ) : (
              <>
                <FaPen className="mr-2" />
                Update Blog
              </>
            )}
          </Button>
        </motion.div>

        {publishError && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Alert className='mt-4' color='failure'>
              {publishError}
            </Alert>
          </motion.div>
        )}
      </motion.form>
    </motion.div>
  );
}