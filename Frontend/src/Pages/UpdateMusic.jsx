import { Alert, Button, FileInput, Select, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

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
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Music</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Title'
          required
          id='title'
          className='flex-1'
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          value={formData.title || ''}
        />
        <Textarea
          placeholder="Description"
          className="h-52"
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          value={formData.description || ''}
        />
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
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => handleFileChange('image', e.target.files[0])}
          />
          <Button
            onClick={() => handleUploadFile('image')}
            type='button'
            size='sm'
            outline
            disabled={uploadProgress.image}
          >
            {uploadProgress.image ? (
              <div className="w-16 h-16">
                <CircularProgressbar value={uploadProgress.image} text={`${uploadProgress.image || 0}`} />
              </div>
            ) : ('Upload Image')}
          </Button>
        </div>
        {uploadError.image && <Alert color='failure'>{uploadError.image}</Alert>}
        {formData.image && <img src={formData.image} alt="upload" className="w-full h-82 object-cover" />}
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='audio/*'
            onChange={(e) => handleFileChange('music', e.target.files[0])}
          />
          <Button
            onClick={() => handleUploadFile('music')}
            type='button'
            size='sm'
            outline
            disabled={uploadProgress.music}
          >
            {uploadProgress.music ? (
              <div className="w-16 h-16">
                <CircularProgressbar value={uploadProgress.music} text={`${uploadProgress.music || 0}`} />
              </div>
            ) : ('Upload Music')}
          </Button>
        </div>
        {uploadError.music && <Alert color='failure'>{uploadError.music}</Alert>}
        {formData.music && (
          <div className="flex flex-col gap-2">
            <audio controls>
              <source src={formData.music} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        <Button type='submit' gradientDuoTone='purpleToBlue'>Update Music</Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}



