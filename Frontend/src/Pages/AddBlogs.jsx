import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, Link } from "react-router-dom";
import {
  HiArrowLeft,
  HiOutlinePhotograph,
  HiOutlineUser,
} from "react-icons/hi";
import { FaPen } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AddBlog() {
  const [files, setFiles] = useState({
    blogImage: null,
    authorImage: null,
  });
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Spiritual Growth",
    authorName: "",
  });
  const [publishError, setPublishError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: "Spiritual Growth" },
    { id: 2, name: "Album News" },
    { id: 3, name: "Devotional Tips" },
    { id: 4, name: "Interviews" },
    { id: 5, name: "App Updates" },
    { id: 6, name: "Music Reviews" },
    { id: 7, name: "Community Stories" },
  ];

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [type]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !files.blogImage
    ) {
      setPublishError("Title, content, and blog image are required");
      return;
    }

    setIsSubmitting(true);
    setPublishError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("authorName", formData.authorName);
      formDataToSend.append("blogImage", files.blogImage);
      if (files.authorImage) {
        formDataToSend.append("authorImage", files.authorImage);
      }

      const res = await fetch("/api/blog/create", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create blog");
      }

      navigate("/dashboard?tab=blogs");
    } catch (error) {
      setPublishError(
        error.message || "Something went wrong. Please try again."
      );
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-3 max-w-full mx-auto bg-black min-h-screen"
    >
      <motion.div
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4 mb-6"
      >
        <Link to="/dashboard?tab=blogs">
          <div className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
            <HiArrowLeft className="text-xl" />
            <span className="font-medium">Back to Dashboard</span>
          </div>
        </Link>
      </motion.div>

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-center text-3xl md:text-4xl py-3 mb-3 font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text"
      >
        Add New Blog Post
      </motion.h1>

      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col gap-6 max-w-4xl mx-auto"
        onSubmit={handleSubmit}
      >
        {/* Title and Category */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row justify-between"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <TextInput
            type="text"
            placeholder="Blog Title"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="flex-1"
          />
          <Select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="min-w-[200px]"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
        </motion.div>

        {/* Author Info */}
        <motion.div
          className="flex flex-col gap-6"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <TextInput
            type="text"
            placeholder="Author Name"
            value={formData.authorName}
            onChange={(e) =>
              setFormData({ ...formData, authorName: e.target.value })
            }
            className="w-full"
            icon={HiOutlineUser}
          />

          {/* Author Image Upload */}
          <div className="flex flex-col gap-4 items-center justify-between border-2 border-dashed border-blue-300 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
              <div className="flex items-center gap-2 w-full">
                <HiOutlineUser className="text-2xl text-blue-500" />
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "authorImage")}
                  className="w-full"
                />
              </div>
            </div>

            {files.authorImage && (
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={URL.createObjectURL(files.authorImage)}
                alt="Author preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              />
            )}
          </div>
        </motion.div>

        {/* Blog Image Upload */}
        <motion.div
          className="flex flex-col gap-4 items-center justify-between border-2 border-dashed border-blue-300 rounded-xl p-4 hover:border-blue-500 transition-colors"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
            <div className="flex items-center gap-2 w-full">
              <HiOutlinePhotograph className="text-2xl text-blue-500" />
              <FileInput
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "blogImage")}
                className="w-full"
                required
              />
            </div>
          </div>

          {files.blogImage && (
            <motion.div
              className="w-full h-64  rounded-lg overflow-hidden flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={URL.createObjectURL(files.blogImage)}
                alt="Blog preview"
                className="max-w-full max-h-full object-contain p-2"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Content Editor */}
        <motion.div
          whileHover={{ scale: 1.005 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <ReactQuill
            theme="snow"
            placeholder="Write your blog content here..."
            className="h-52 mb-12 bg-white rounded-lg"
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="w-full mt-4 mb-12 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] hover:opacity-90 transition-opacity"
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
        </motion.div>

        {publishError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert color="failure" className="mt-4">
              {publishError}
            </Alert>
          </motion.div>
        )}
      </motion.form>
    </motion.div>
  );
}
