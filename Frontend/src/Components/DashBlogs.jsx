import React, { useState, useEffect } from "react";
import { Alert, Button, Dropdown, Modal, Badge } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEllipsisV, FaStar, FaTrash, FaEdit, FaSearch, FaPen } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import BlogCard from "./BlogCard";

export default function DashBlogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const query = searchTerm ? `?searchTerm=${searchTerm}` : "";
        const res = await fetch(`/api/blog/get${query}`);
        const data = await res.json();

        if (res.ok) {
          setBlogs(data.blogs);
          setPagination({
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalBlogs: data.totalBlogs,
          });
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [searchTerm, pagination.currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFeatureToggle = async (id) => {
    try {
      const res = await fetch(`/api/blog/feature/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to toggle feature");
      }

      setBlogs(blogs.map(blog =>
        blog._id === id ? { ...blog, isFeatured: !blog.isFeatured } : blog
      ));
    } catch (error) {
      alert(error.message);
      console.error("Error toggling feature:", error);
    }
  };

  const handleDeleteBlog = async () => {
    try {
      const res = await fetch(`/api/blog/delete/${selectedBlog._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete blog");
      }

      setBlogs(blogs.filter(blog => blog._id !== selectedBlog._id));
      setShowDeleteModal(false);
      setSelectedBlog(null);

      alert("Blog deleted successfully");
    } catch (error) {
      alert(error.message);
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text">
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <Modal 
              show={showDeleteModal} 
              onClose={() => setShowDeleteModal(false)} 
              size="md"
              as={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Modal.Header className="border-b border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
              </Modal.Header>
              <Modal.Body className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Are you sure you want to delete <span className="font-semibold">{selectedBlog?.title}</span>? 
                    This action cannot be undone.
                  </p>
                  {selectedBlog?.isFeatured && (
                    <Alert color="warning" className="border-l-4 border-yellow-400 bg-yellow-50">
                      <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-500" />
                        <span className="font-medium">Note:</span> This is a featured blog.
                      </div>
                    </Alert>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer className="flex justify-end space-x-3 p-4 border-t border-gray-200">
                <Button 
                  color="light" 
                  onClick={() => setShowDeleteModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </Button>
                <Button 
                  gradientDuoTone="pinkToOrange"
                  onClick={handleDeleteBlog}
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTrash />
                  Confirm Delete
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="min-h-[calc(100vh-64px)]">
          {/* Header */}
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text">
                Blog Management
              </h1>
              <p className="text-gray-600 mt-2">
                {pagination.totalBlogs} {pagination.totalBlogs === 1 ? "blog post" : "blog posts"} available
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/addblogs")}
                gradientDuoTone="cyanToBlue"
                className="px-6 py-2.5 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-2">
                  <FaPlus />
                  <span>Add New Blog</span>
                </div>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-[#0119FF] to-[#0093FF] rounded-xl p-6 shadow-lg text-white"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-medium mb-2">Total Blogs</h3>
              <p className="text-3xl font-bold">{pagination.totalBlogs}</p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-r from-[#0093FF] to-[#3AF7F0] rounded-xl p-6 shadow-lg text-white"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-medium mb-2">Featured Blogs</h3>
              <p className="text-3xl font-bold">{blogs.filter(b => b.isFeatured).length}</p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-r from-[#3AF7F0] to-[#0119FF] rounded-xl p-6 shadow-lg text-white"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-medium mb-2">Categories</h3>
              <p className="text-3xl font-bold">{new Set(blogs.map(b => b.category)).size}</p>
            </motion.div>
          </motion.div>

          {/* Search Section */}
          <motion.div 
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search blogs..."
                className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0093FF] focus:border-[#0119FF] bg-white"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </motion.div>

          {/* Blogs Grid */}
          <div className="mb-12">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0119FF]"
                />
              </div>
            ) : blogs.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {blogs.map((blog) => (
                  <motion.div 
                    key={blog._id} 
                    className="relative"
                    variants={item}
                    layout
                  >
                    <BlogCard blog={blog} />
                    
                    <motion.div 
                      className="absolute top-4 right-4 z-10"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Dropdown
                        label=""
                        renderTrigger={() => (
                          <button className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
                            <FaEllipsisV className="text-gray-600" />
                          </button>
                        )}
                        arrowIcon={false}
                        placement="left-start"
                      >
                        <Dropdown.Item 
                          icon={FaEdit} 
                          onClick={() => navigate(`/edit-blog/${blog._id}`)}
                        >
                          Update
                        </Dropdown.Item>
                        <Dropdown.Item 
                          icon={FaStar} 
                          onClick={() => handleFeatureToggle(blog._id)}
                          className={blog.isFeatured ? 'text-yellow-500' : ''}
                        >
                          {blog.isFeatured ? 'Remove Feature' : 'Make Featured'}
                        </Dropdown.Item>
                        <Dropdown.Item 
                          icon={FaTrash} 
                          onClick={() => {
                            setSelectedBlog(blog);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:!bg-red-50"
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="bg-white rounded-lg p-8 text-center shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                  <FaPen className="w-full h-full" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {searchTerm ? 'No matching blogs found' : 'No blogs yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'Try a different search term' : 'Get started by adding your first blog post'}
                </p>
                <Button
                  onClick={() => navigate("/addblogs")}
                  gradientDuoTone="cyanToBlue"
                  className="px-6 py-2.5"
                >
                  <FaPlus className="mr-2" />
                  Add Blog
                </Button>
              </motion.div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <motion.div 
                className="flex justify-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <motion.button
                      key={i + 1}
                      onClick={() => setPagination({ ...pagination, currentPage: i + 1 })}
                      className={`px-4 py-2 rounded-md mx-1 ${
                        pagination.currentPage === i + 1
                          ? 'bg-gradient-to-r from-[#0119FF] to-[#0093FF] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {i + 1}
                    </motion.button>
                  ))}
                </nav>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 