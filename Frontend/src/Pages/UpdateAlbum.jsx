import { Alert, Button, FileInput, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiArrowLeft, HiOutlinePhotograph } from "react-icons/hi";

export default function UpdateAlbum() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

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
    const fetchAlbum = async () => {
      try {
        const res = await fetch(`/api/category/getAlbum/${albumId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        setFormData({ ...data, description: data.description || '' });
        setPublishError(null);
      } catch (error) {
        setPublishError(error.message);
      }
    };
    fetchAlbum();
  }, [albumId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/category/update/${albumId}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate('/dashboard?tab=albums');
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-3 max-w-full bg-black mx-auto min-h-screen"
    >
      {/* Navigation Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
        <Link to="/dashboard?tab=albums">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <HiArrowLeft className="text-xl" />
            <span className="font-medium">Back to Albums Dashboard</span>
          </motion.div>
        </Link>
      </motion.div>

      {/* Main Content */}
      <motion.h1
        variants={itemVariants}
        className="text-center text-3xl md:text-4xl my-7 font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text"
      >
        Update Album
      </motion.h1>

      <motion.form
        variants={containerVariants}
        className="flex flex-col gap-6 max-w-4xl mx-auto"
        onSubmit={handleSubmit}
      >
        {/* Album Name */}
        <motion.div variants={itemVariants}>
          <TextInput
            type='text'
            placeholder='Album Name'
            required
            id='albumName'
            onChange={(e) => setFormData({ ...formData, albumName: e.target.value })}
            value={formData.albumName || ''}
          />
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants}>
          <Textarea
            placeholder="Description"
            className="h-52"
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            value={formData.description || ''}
          />
        </motion.div>

        {/* Image Upload Section */}
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
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full"
              />
            </div>
            <Button
              onClick={handleUploadImage}
              type='button'
              size='sm'
              gradientDuoTone="purpleToBlue"
              outline
              disabled={imageUploadProgress}
              className="w-full sm:w-auto"
            >
              {imageUploadProgress ? (
                <div className="w-6 h-6">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress}%`}
                    styles={{
                      path: { stroke: '#3B82F6' },
                      text: { fill: '#3B82F6', fontSize: '24px' }
                    }}
                  />
                </div>
              ) : ('Upload Image')}
            </Button>
          </div>

          {imageUploadError && (
            <Alert color='failure' className="w-full">{imageUploadError}</Alert>
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

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <Button
            type='submit'
            className="w-full mb-12 mt-4 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Update Album
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