import { Alert, Button, FileInput, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';

export default function AddAlbum() {
    const [file, setFile] = useState({ image: null, music: null });
    const [uploadProgress, setUploadProgress] = useState({ image: null, music: null });
    const [uploadError, setUploadError] = useState({ image: null, music: null });
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();

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
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add a New Album</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="albumName" className="block text-sm font-medium text-gray-700 mb-2">
              Album Name:
            </label>
            <TextInput type="text" placeholder="Album Name" required id="albumName" 
              onChange={(e) => setFormData({ ...formData, albumName: e.target.value })} />
          </div>

          {/* Image Upload */}
          <div className='flex gap-4 items-center border-4 border-teal-500 border-dotted p-3'>
            <FileInput type='file' accept='image/*' onChange={(e) => handleFileChange(e, 'image')} />
            <Button onClick={() => handleUploadFile('image')} type='button' disabled={uploadProgress.image}>
              {uploadProgress.image ? (
                <CircularProgressbar value={uploadProgress.image} text={`${uploadProgress.image}%`} />
              ) : ('Upload Image')}
            </Button>
          </div>

          {uploadError.image && <Alert color='failure'>{uploadError.image}</Alert>}
          {formData.image && <img src={formData.image} alt="Uploaded" className="w-full h-80 object-cover" />}

          

          {uploadError.music && <Alert color='failure'>{uploadError.music}</Alert>}

          <ReactQuill theme="snow" placeholder="Description..." onChange={(value) => setFormData({ ...formData, description: value })} />
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Add Album</button>
        </form>
      </div>
    );
}
