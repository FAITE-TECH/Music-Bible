import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const { musicId } = useParams(); 
  const [musicDetails, setMusicDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch music details based on musicId
    const fetchMusicDetails = async () => {
      try {
        const response = await fetch(`/api/music/getmusic/${musicId}`); // Ensure the endpoint matches your backend route
        if (!response.ok) {
          throw new Error('Failed to fetch music details');
        }
        const data = await response.json();
        setMusicDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusicDetails();
  }, [musicId]);

  const handleAlbumDownload = () => {
    if (musicDetails) {
      const link = document.createElement('a');
      link.href = musicDetails.music; // The URL for the music file
      link.download = `${musicDetails.title}.mp3`; // Set file name for download
      document.body.appendChild(link);
      link.click(); // Trigger download
      document.body.removeChild(link); // Clean up the link element
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>; // Display loading state
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-lg text-red-500">Error: {error}</div>; // Display error state
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-20">
      <h1 className="text-3xl font-bold text-center text-gray-800">Checkout Success!</h1>
      <p className="mt-4 text-lg text-center text-gray-600">Your purchase was successful. Click the button below to download your music.</p>
      <button 
        onClick={handleAlbumDownload} 
        className="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Download Music
      </button>
    </div>
  );
};

export default CheckoutSuccess;
