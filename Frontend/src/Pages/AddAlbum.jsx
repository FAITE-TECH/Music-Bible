import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';

export default function AddAlbum() {
    const [file, setFile] = useState({ image: null, music: null });
    const [uploadProgress, setUploadProgress] = useState({ image: null, music: null });
    const [uploadError, setUploadError] = useState({ image: null, music: null });
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();

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
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData); 
  
    try {
      const res = await fetch('/api/category/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add a New Album</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="albumName" className="block text-sm font-medium text-gray-700 mb-2">
            Album Name:
          </label>
          <TextInput type='text' placeholder='albumName' required id='albumName' className='flex-1' onChange={(e) =>
            setFormData({ ...formData, albumName: e.target.value })
          } />
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='image/*' onChange={(e) => handleFileChange(e.target.files[0], 'image')} />
          <Button onClick={() => handleUploadFile(file.image, 'image')} type='button' size='sm' outline disabled={uploadProgress.image} className="bg-slate-400">
            {uploadProgress.image ? (
              <div className="w-16 h-16">
                <CircularProgressbar value={uploadProgress.image} text={`${uploadProgress.image || 0}`} />
              </div>
            ) : ('Upload Image')}
          </Button>
        </div>

        {uploadError.image && <Alert color='failure'>{uploadError.image}</Alert>}
        {formData.image && <img src={formData.image} alt="upload" className="w-full h-82 object-cover" />}

        <ReactQuill
          theme="snow"
          placeholder="Description..."
          className="h-52 mb-12"
          onChange={(value) => {
            const sanitizedValue = value.replace(/<\/?[^>]+(>|$)/g, "");
            setFormData({ ...formData, description: sanitizedValue });
          }}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Add Album
        </button>
      </form>
    </div>
  );
}
