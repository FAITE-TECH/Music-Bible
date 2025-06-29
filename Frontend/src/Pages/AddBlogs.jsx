import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, Link } from "react-router-dom";
import { HiArrowLeft, HiOutlinePhotograph, HiOutlineUser } from "react-icons/hi";
import { FaPen } from "react-icons/fa";

export default function AddBlog() {
  const [files, setFiles] = useState({
    blogImage: null,
    authorImage: null
  });
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Technology',
    authorName: ''
  });
  const [publishError, setPublishError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: 'Technology' },
    { id: 2, name: 'Business' },
    { id: 3, name: 'Health' },
    { id: 4, name: 'Travel' },
    { id: 5, name: 'Food' },
    { id: 6, name: 'Lifestyle' }
  ];

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.title.trim() || !formData.content.trim() || !files.blogImage) {
      setPublishError('Title, content, and blog image are required');
      return;
    }

    setIsSubmitting(true);
    setPublishError(null);

    try {
      const formDataToSend = new FormData();
      
      // Append all fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('authorName', formData.authorName);
      
      // Append files
      formDataToSend.append('blogImage', files.blogImage);
      if (files.authorImage) {
        formDataToSend.append('authorImage', files.authorImage);
      }

      // Debug: Log FormData contents
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const res = await fetch('/api/blog/create', {
        method: 'POST',
        body: formDataToSend
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create blog');
      }

      navigate("/dashboard?tab=blogs");
    } catch (error) {
      setPublishError(error.message || "Something went wrong. Please try again.");
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3 max-w-full mx-auto bg-black min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/dashboard?tab=blogs">
          <div className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
            <HiArrowLeft className="text-xl" />
            <span className="font-medium">Back to Dashboard</span>
          </div>
        </Link>
      </div>

      <h1 className="text-center text-3xl md:text-3xl my-7 font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text">
        Add New Blog Post
      </h1>

      <form className="flex flex-col gap-6 max-w-4xl mx-auto" onSubmit={handleSubmit}>
        {/* Title and Category */}
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput 
            type='text' 
            placeholder='Blog Title' 
            required 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className='flex-1' 
          />
          <Select 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="min-w-[200px]"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </Select>
        </div>

        {/* Author Info */}
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput 
            type='text' 
            placeholder='Author Name' 
            value={formData.authorName}
            onChange={(e) => setFormData({...formData, authorName: e.target.value})}
            className='flex-1'
            icon={HiOutlineUser}
          />
          
          <div className="flex flex-col gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full">
              <HiOutlineUser className="text-2xl text-blue-500" />
              <FileInput 
                type='file' 
                accept='image/*'
                onChange={(e) => handleFileChange(e, 'authorImage')}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {files.authorImage && (
          <div className="flex justify-center">
            <img 
              src={URL.createObjectURL(files.authorImage)} 
              alt="Author preview" 
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500" 
            />
          </div>
        )}

        {/* Blog Image Upload */}
        <div className='flex flex-col gap-4 items-center justify-between border-2 border-dashed border-blue-300 rounded-xl p-4 hover:border-blue-500 transition-colors'>
          <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
            <div className="flex items-center gap-2 w-full">
              <HiOutlinePhotograph className="text-2xl text-blue-500" />
              <FileInput 
                type='file' 
                accept='image/*'
                onChange={(e) => handleFileChange(e, 'blogImage')}
                className="w-full"
                required
              />
            </div>
          </div>

          {files.blogImage && (
            <img 
              src={URL.createObjectURL(files.blogImage)} 
              alt="Blog preview" 
              className="w-full max-h-64 object-cover rounded-lg shadow-md mt-2" 
            />
          )}
        </div>

        {/* Content Editor */}
        <div>
          <ReactQuill
            theme="snow"
            placeholder="Write your blog content here..."
            className="h-52 mb-12 bg-white rounded-lg"
            value={formData.content}
            onChange={(value) => setFormData({...formData, content: value})}
          />
        </div>

        {/* Submit Button */}
        <div>
          <Button 
            type='submit' 
            className="w-full mt-4 mb-12 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">↻</span>
                Publishing...
              </>
            ) : (
              <>
                <FaPen className="mr-2" />
                Publish Blog
              </>
            )}
          </Button>
        </div>

        {publishError && (
          <Alert color='failure' className='mt-4'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}