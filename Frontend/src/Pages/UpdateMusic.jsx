import { Alert, Button, FileInput, Select, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiArrowLeft, HiOutlinePhotograph, HiOutlineMusicNote } from "react-icons/hi";

export default function UpdateMusic() {
  const [files, setFiles] = useState({ image: null, music: null });
  const [uploadProgress, setUploadProgress] = useState({ image: null, music: null });
  const [uploadError, setUploadError] = useState({ image: null, music: null });
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { musicId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]); 
  const [categoriesError, setCategoriesError] = useState(null); 

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
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category/getAlbum'); 
        const data = await res.json();

        if (!res.ok) {
          setCategoriesError('Failed to load categories');
        } else {
          setCategories(data); 
        }
      } catch (error) {
        setCategoriesError('Error fetching categories');
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await fetch(`/api/music/getmusic/${musicId}`);
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
    fetchMusic();
  }, [musicId]);

  const handleFileChange = (type, file) => {
    setFiles({ ...files, [type]: file });
  };

  const handleUploadFile = (type) => {
    const file = files[type];
    if (!file) {
      setUploadError({ ...uploadError, [type]: 'Please select a file' });
      return;
    }
    setUploadError({ ...uploadError, [type]: null });

    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress({ ...uploadProgress, [type]: progress.toFixed(0) });
      },
      (error) => {
        setUploadError({ ...uploadError, [type]: 'File upload failed' });
        setUploadProgress({ ...uploadProgress, [type]: null });
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadProgress({ ...uploadProgress, [type]: null });
          setUploadError({ ...uploadError, [type]: null });
          setFormData({ ...formData, [type]: downloadURL });
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/music/update/${musicId}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include", 
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate('/dashboard?tab=music');
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
        <Link to="/dashboard?tab=music">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <HiArrowLeft className="text-xl" />
            <span className="font-medium">Back to Music Dashboard</span>
          </motion.div>
        </Link>
      </motion.div>

      {/* Main Content */}
      <motion.h1
        variants={itemVariants}
        className="text-center text-3xl md:text-4xl my-7 font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text"
      >
        Update Music
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

        {/* Description */}
        <motion.div variants={itemVariants}>
          <Textarea
            placeholder="Description"
            className="h-52"
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            value={formData.description || ''}
          />
        </motion.div>

        {/* Album Selection */}
        <motion.div variants={itemVariants}>
          <Select 
            value={formData.category || 'uncategorized'} 
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value='uncategorized'>Select Album</option>
            {categories.length > 0 && categories.map((category) => (
              <option key={category.id} value={category.albumName}>
                {category.albumName}
              </option>
            ))}
          </Select>
          {categoriesError && <Alert color="failure" className="mt-2">{categoriesError}</Alert>}
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
                onChange={(e) => handleFileChange('image', e.target.files[0])}
                className="w-full"
              />
            </div>
            <Button
              onClick={() => handleUploadFile('image')}
              type='button'
              size='sm'
              gradientDuoTone="purpleToBlue"
              outline
              disabled={uploadProgress.image}
              className="w-full sm:w-auto"
            >
              {uploadProgress.image ? (
                <div className="w-6 h-6">
                  <CircularProgressbar
                    value={uploadProgress.image}
                    text={`${uploadProgress.image}%`}
                    styles={{
                      path: { stroke: '#3B82F6' },
                      text: { fill: '#3B82F6', fontSize: '24px' }
                    }}
                  />
                </div>
              ) : ('Upload Image')}
            </Button>
          </div>

          {uploadError.image && (
            <Alert color='failure' className="w-full">{uploadError.image}</Alert>
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

        {/* Music Upload Section */}
        <motion.div
          variants={itemVariants}
          className='flex flex-col gap-4 items-center justify-between border-2 border-dashed border-teal-300 rounded-xl p-4 hover:border-teal-500 transition-colors'
        >
          <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
            <div className="flex items-center gap-2 w-full">
              <HiOutlineMusicNote className="text-2xl text-teal-500" />
              <FileInput
                type='file'
                accept='audio/*'
                onChange={(e) => handleFileChange('music', e.target.files[0])}
                className="w-full"
              />
            </div>
            <Button
              onClick={() => handleUploadFile('music')}
              type='button'
              size='sm'
              
              outline
              disabled={uploadProgress.music}
              className="w-full sm:w-auto bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]"
            >
              {uploadProgress.music ? (
                <div className="w-6 h-6">
                  <CircularProgressbar
                    value={uploadProgress.music}
                    text={`${uploadProgress.music}%`}
                    styles={{
                      path: { stroke: '#06B6D4' },
                      text: { fill: '#06B6D4', fontSize: '24px' }
                    }}
                  />
                </div>
              ) : ('Upload Music')}
            </Button>
          </div>

          {uploadError.music && (
            <Alert color='failure' className="w-full">{uploadError.music}</Alert>
          )}
          {formData.music && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full mt-4"
            >
              <p className="text-center text-gray-600 mb-2">Current Music:</p>
              <audio
                controls
                src={formData.music}
                className="w-full rounded-lg shadow-md"
              >
                Your browser does not support the audio element.
              </audio>
            </motion.div>
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
            Update Music
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