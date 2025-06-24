import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, Link } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import {
  HiArrowLeft,
  HiOutlinePhotograph,
  HiOutlineMusicNote,
} from "react-icons/hi";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function AddAlbum() {
  const [file, setFile] = useState({ image: null, music: null });
  const [uploadProgress, setUploadProgress] = useState({
    image: null,
  });
  const [uploadError, setUploadError] = useState({ image: null });
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });


  const handleFileChange = (file, type) => {
    setFile({ ...file, [type]: file });
  };


  const handleUploadFile = (file, type) => {
    if (!file) {
      setUploadError({
        ...uploadError,
        [type]: `Please select a ${type === "image" ? "image" : ""} file`,
      });
      return;
    }
    setUploadError({ ...uploadError, [type]: null });

    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress({ ...uploadProgress, [type]: progress.toFixed(0) });
      },
      (error) => {
        setUploadError({
          ...uploadError,
          [type]: `${type === "image" ? "Image" : ""} upload failed`,
        });
        setUploadProgress({ ...uploadProgress, [type]: null });
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadProgress({ ...uploadProgress, [type]: null });
          setUploadError({ ...uploadError, [type]: null });
          setFormData({ ...formData, [type]: downloadURL });

        setFormData({ ...formData, [type]: data.fileUrl });
      } catch (error) {
        setUploadError({ ...uploadError, [type]: "Upload error" });
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch("/api/category/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),

        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.albumName || !formData.description) {
      setPublishError("Please provide all required fields");
      return;
    }
    try {
      const slug = formData.albumName
        ? formData.albumName
            .split(" ")
            .join("-")
            .toLowerCase()
            .replace(/[^a-zA-Z0-9-]/g, "")
        : "";
      const res = await fetch("/api/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          slug,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message || "Failed to create album");
        return;
      }

      setPublishError(null);
      navigate("/album");
    } catch (error) {
      setPublishError(error.message || "Something went wrong");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-3 max-w-ful bg-black mx-auto min-h-screen"
    >
      {/* Navigation Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-4 mb-6"
      >
        <Link to="/dashboard?tab=profile">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <HiArrowLeft className="text-xl" />
            <span className="font-medium">Back to Dashboard</span>
          </motion.div>
        </Link>
      </motion.div>


      {/* Main Content */}
      <motion.h1
        variants={itemVariants}
        className="text-center  text-3xl md:text-3xl my-7 font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]  text-transparent bg-clip-text"
      >
        Create New Album
      </motion.h1>

      <motion.form
        variants={containerVariants}
        className="flex flex-col max-w-4xl mx-auto gap-6"
        onSubmit={handleSubmit}
      >
        {/* Album Name */}
        <motion.div variants={itemVariants} className="mb-4">
          <TextInput
            type="text"
            placeholder="Album Name"
            required
            id="albumName"
            onChange={(e) =>
              setFormData({ ...formData, albumName: e.target.value })
            }
            className="w-full"
          />
          {!formData.albumName && publishError && (
            <p className="text-red-500 text-sm mt-1">Album name is required</p>
          )}
        </motion.div>

        {/* Image Upload Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 items-center justify-between border-2 border-dashed border-blue-300 rounded-xl p-4 hover:border-blue-500 transition-colors"
        >
          <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
            <div className="flex items-center gap-2 w-full">
              <HiOutlinePhotograph className="text-2xl text-blue-500" />
              <FileInput
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files[0], "image")}
                className="w-full"
              />
            </div>
            <Button
              onClick={() => handleUploadFile(file.image, "image")}
              type="button"
              size="sm"
              gradientDuoTone="purpleToBlue"
              outline
              disabled={uploadProgress.image}
              className="w-full sm:w-auto"
            >
              {uploadProgress.image ? (
                <div className="w-6 h-6">
                  <CircularProgressbar
                    value={uploadProgress.image}
                    text={`${uploadProgress.image || 0}`}
                    styles={{
                      path: { stroke: "#3B82F6" },
                      text: { fill: "#3B82F6", fontSize: "24px" },
                    }}
                  />
                </div>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>


          {uploadError.image && (
            <Alert color="failure" className="w-full">
              {uploadError.image}
            </Alert>
          )}
          {formData.image && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={formData.image}
              alt="upload"
              className="w-full max-h-64 object-contain rounded-lg shadow-md mt-2"
            />
          )}
        </motion.div>

        {/* Description Editor */}
        <motion.div variants={itemVariants}>
          <ReactQuill
            theme="snow"
            placeholder="Add your music description here..."
            className="h-52 mb-12 bg-white rounded-lg"
            onChange={(value) => {
              const sanitizedValue = value.replace(/<\/?[^>]+(>|$)/g, "");
              setFormData({ ...formData, description: sanitizedValue });
            }}
          />
          {(!formData.description || formData.description === "<p><br></p>") &&
            publishError && (
              <p className="text-red-500 text-sm mt-1">
                Description is required
              </p>
            )}
        </motion.div>
        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            className="w-full mt-4 mb-12 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] "
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Album
          </Button>
        </motion.div>
        {publishError && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Alert className="mt-4" color="failure">
              {publishError}
            </Alert>
          </motion.div>
        )}
      </motion.form>
    </motion.div>
  );
}
