import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowLeft, HiOutlineMusicNote, HiOutlinePhotograph } from "react-icons/hi";

export default function AddMusic() {
  const [file, setFile] = useState({ image: null, music: null });
  const [uploadProgress, setUploadProgress] = useState({ image: null, music: null });
  const [uploadError, setUploadError] = useState({ image: null, music: null });
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]); 
  const [categoriesError, setCategoriesError] = useState(null); 
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

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

  const handleFileChange = (file, type) => {
    setFile({ ...file, [type]: file });
  };

  const handleUploadFile = (file, type) => {
    if (!file) {
      setUploadError({ ...uploadError, [type]: `Please select a ${type === 'image' ? 'image' : 'music'} file` });
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
        setUploadError({ ...uploadError, [type]: `${type === 'image' ? 'Image' : 'Music'} upload failed` });
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
    console.log('Form Data:', formData); 
  
    try {
      const res = await fetch('/api/music/create', {
        method: 'POST',
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
      navigate(`/musics`);
    } catch (error) {
      setPublishError('Something went wrong');
      console.error(error);
    }
  };

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

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-3 max-w-full mx-auto bg-black min-h-screen"
    >
      {/* Navigation Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
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
        className="text-center text-3xl md:text-3xl my-7 font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text"
      >
        Add New Music
      </motion.h1>

      <motion.form 
        variants={containerVariants}
        className="flex flex-col gap-6 max-w-4xl itme-center justify center mx-auto" 
        onSubmit={handleSubmit}
      >
        {/* Title and Category Row */}
        <motion.div 
          variants={itemVariants}
          className='flex flex-col gap-4 sm:flex-row justify-between'
        >
          <TextInput 
            type='text' 
            placeholder='Music Title' 
            required 
            id='title' 
            className='flex-1' 
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            } 
          />
          <Select 
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="min-w-[200px]"
          >
            <option value='uncategorized'>Select Album</option>
            {categories.length > 0 && categories.map((category) => (
              <option key={category.id} value={category.albumName}>{category.albumName}</option>
            ))}
          </Select>
        </motion.div>

        {categoriesError && (
          <motion.div variants={itemVariants}>
            <Alert color="failure">{categoriesError}</Alert>
          </motion.div>
        )}

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
                onChange={(e) => handleFileChange(e.target.files[0], 'image')}
                className="w-full"
              />
            </div>
            <Button 
              onClick={() => handleUploadFile(file.image, 'image')} 
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
                    text={`${uploadProgress.image || 0}`} 
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
                onChange={(e) => handleFileChange(e.target.files[0], 'music')}
                className="w-full"
              />
            </div>
            <Button 
              onClick={() => handleUploadFile(file.music, 'music')} 
              type='button' 
              size='sm' 
              gradientDuoTone="cyanToBlue"
              outline 
              disabled={uploadProgress.music}
              className="w-full sm:w-auto"
            >
              {uploadProgress.music ? (
                <div className="w-6 h-6">
                  <CircularProgressbar 
                    value={uploadProgress.music} 
                    text={`${uploadProgress.music || 0}`} 
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
              <p className="text-center text-gray-600 mb-2">Music preview:</p>
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
            
            className="w-full mt-4 mb-12 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add Music
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