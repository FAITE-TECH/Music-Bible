import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from "react-router-dom";

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
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Add Music</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          } />
          <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value='uncategorized'>Select Album</option>
            {categories.length > 0 && categories.map((category) => (
              <option key={category.id} value={category.albumName}>{category.albumName}</option>
            ))}
          </Select>
        </div>

        {categoriesError && <Alert color="failure">{categoriesError}</Alert>}

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

        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='audio/*' onChange={(e) => handleFileChange(e.target.files[0], 'music')} />
          <Button onClick={() => handleUploadFile(file.music, 'music')} type='button' size='sm' outline disabled={uploadProgress.music} className="bg-slate-400">
            {uploadProgress.music ? (
              <div className="w-16 h-16">
                <CircularProgressbar value={uploadProgress.music} text={`${uploadProgress.music || 0}`} />
              </div>
            ) : ('Upload Music')}
          </Button>
        </div>

        {uploadError.music && <Alert color='failure'>{uploadError.music}</Alert>}
        {formData.music && (
          <div className="mt-4">
            <p className="text-center">Music file uploaded successfully.</p>
            <audio controls src={formData.music} className="w-full mt-2">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <Button type='submit' className="bg-slate-400">Add Music</Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
