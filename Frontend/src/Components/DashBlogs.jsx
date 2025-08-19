import React, { useState, useEffect } from "react";
import { Alert, Button, Dropdown, Modal, Badge } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEllipsisV,
  FaStar,
  FaTrash,
  FaEdit,
  FaSearch,
  FaPen,
  FaBook,
  FaFire,
  FaTags,
} from "react-icons/fa";
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
    totalFeatured: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
    const [allCategories, setAllCategories] = useState([]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const query = searchTerm
          ? `?searchTerm=${searchTerm}&page=${pagination.currentPage}`
          : `?page=${pagination.currentPage}`;
        const res = await fetch(`/api/blog/get${query}`);
        const data = await res.json();
      

        if (res.ok) {
          setBlogs(data.blogs);
          setPagination({
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalBlogs: data.totalBlogs,
            totalFeatured: data.totalFeatured,
          });
          setAllCategories(data.categories);
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

      setBlogs(
        blogs.map((blog) =>
          blog._id === id ? { ...blog, isFeatured: !blog.isFeatured } : blog
        )
      );
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

      setBlogs(blogs.filter((blog) => blog._id !== selectedBlog._id));
      setShowDeleteModal(false);
      setSelectedBlog(null);

      alert("Blog deleted successfully");
    } catch (error) {
      alert(error.message);
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto items-center text-center justify-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-3xl py-1 font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text">
            <span className="block md:inline">Blog </span>
            <span className="block md:inline">Management</span>
          </h1>
          <p className="text-gray-200 mt-2">
            Manage your blog posts and collections
          </p>
        </motion.div>
      </div>

      {/* Search and Add Button */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
      >
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search blogs..."
            className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-700 focus:ring-2 focus:ring-[#0093FF] focus:border-[#0119FF]  text-white"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => navigate("/addblogs")}
           
            className="px-6 py-1 rounded-lg shadow-md w-full md:w-auto bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-700 hover:to-blue-900"
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
        className="flex flex-col md:flex-row gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Total Blogs Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex flex-col p-6 gap-4 w-full rounded-xl shadow-lg bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] dark:bg-gray-800"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-200 text-lg uppercase font-semibold">
                Total Blogs
              </h3>
              <p className="text-3xl font-bold">{pagination.totalBlogs}</p>
            </div>
            <FaBook className="bg-red-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </motion.div>

        {/* Featured Blogs Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex flex-col p-6 gap-4 w-full rounded-xl shadow-lg bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] dark:bg-gray-800"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-200 text-lg uppercase font-semibold">
                Featured Blogs
              </h3>
              <p className="text-3xl font-bold">
                <p className="text-3xl font-bold">{pagination.totalFeatured}</p>
              </p>
            </div>
            <FaFire className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </motion.div>

        {/* Categories Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex flex-col p-6 gap-4 w-full rounded-xl shadow-lg bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] dark:bg-gray-800"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-200 text-lg uppercase font-semibold">
                Categories
              </h3>
              <p className="text-3xl font-bold">{allCategories.length}</p>

            </div>
            <FaTags className="bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </motion.div>
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
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-col-3 gap-6"
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
                      <button className="p-2 rounded-full bg-gray-800 shadow-md hover:bg-gray-700">
                        <FaEllipsisV className="text-gray-300" />
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
                      className={blog.isFeatured ? "text-yellow-500" : ""}
                    >
                      {blog.isFeatured ? "Remove Feature" : "Make Featured"}
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
            className="bg-gray-800 rounded-lg p-8 text-center shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <FaPen className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              {searchTerm ? "No matching blogs found" : "No blogs yet"}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm
                ? "Try a different search term"
                : "Get started by adding your first blog post"}
            </p>
            <Button
              onClick={() => navigate("/addblogs")}
              gradientDuoTone="purpleToBlue"
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
            className="flex justify-between items-center px-6 py-4 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                disabled={pagination.currentPage === 1}
                onClick={() => {
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: Math.max(prev.currentPage - 1, 1),
                  }));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                gradientDuoTone="cyanToBlue"
                outline
              >
                Previous
              </Button>
            </motion.div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-200 dark:text-gray-300">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => {
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: Math.min(
                      prev.currentPage + 1,
                      prev.totalPages
                    ),
                  }));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                gradientDuoTone="cyanToBlue"
                outline
              >
                Next
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        popup
        size="lg"
      >
        <Modal.Header className="border-b border-gray-200 dark:border-gray-700" />
        <Modal.Body>
          <motion.div
            className="text-center flex flex-col items-center justify-center gap-6 p-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-20 sm:w-20">
              <FaTrash className="h-10 w-10 text-red-600 dark:text-red-300" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Delete Blog Post
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this blog post? This action
                  cannot be undone.
                </p>
              </div>
            </div>
          </motion.div>
        </Modal.Body>
        <Modal.Footer className="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              color="light"
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2"
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              color="failure"
              onClick={handleDeleteBlog}
              className="px-4 py-2"
            >
              Delete
            </Button>
          </motion.div>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
}
