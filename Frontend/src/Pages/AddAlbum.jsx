import { Alert, Button, FileInput, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, Link } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiOutlinePhotograph, HiOutlineMusicNote } from 'react-icons/hi';

export default function AddAlbum() {
    const [file, setFile] = useState({ image: null, music: null });
    const [uploadProgress, setUploadProgress] = useState({ image: null, music: null });
    const [uploadError, setUploadError] = useState({ image: null, music: null });
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

    const handleFileChange = (e, type) => {
        setFile({ ...file, [type]: e.target.files[0] });
    };

    const handleUploadFile = async (type) => {
        if (!file[type]) {
            setUploadError({ ...uploadError, [type]: `Please select a ${type} file` });
            return;
        }
        setUploadError({ ...uploadError, [type]: null });

        const formData = new FormData();
        formData.append("file", file[type]);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                setUploadError({ ...uploadError, [type]: "Upload failed" });
                return;
            }

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

            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }

            setPublishError(null);
            navigate("/musics");
        } catch (error) {
            setPublishError("Something went wrong");
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
                        onChange={(e) => setFormData({ ...formData, albumName: e.target.value })}
                        className="w-full"
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
                                onChange={(e) => handleFileChange(e, 'image')}
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
                                onChange={(e) => handleFileChange(e, 'music')}
                                className="w-full"
                            />
                        </div>
                        <Button
                            onClick={() => handleUploadFile('music')}
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

                {/* Description Editor */}
                <motion.div variants={itemVariants}>
                    <ReactQuill
                        theme="snow"
                        placeholder="Add your album description here..."
                        className="h-52 mb-12 bg-white rounded-lg"
                        onChange={(value) => setFormData({ ...formData, description: value })}
                    />
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                    <Button
                        type='submit'
                        
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
                        <Alert className='mt-4' color='failure'>
                            {publishError}
                        </Alert>
                    </motion.div>
                )}
            </motion.form>
        </motion.div>
    );
}