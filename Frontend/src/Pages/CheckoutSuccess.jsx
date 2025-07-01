import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
        const response = await fetch(
          `https://amusicbible.com/api/music/getmusic/${musicId}`
        ); // Ensure the endpoint matches your backend route
        if (!response.ok) {
          throw new Error("Failed to fetch music details");
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
      const link = document.createElement("a");
      link.href = musicDetails.music; // The URL for the music file
      link.download = `${musicDetails.title}.mp3`; // Set file name for download
      document.body.appendChild(link);
      link.click(); // Trigger download
      document.body.removeChild(link); // Clean up the link element
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    ); // Display loading state
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        Error: {error}
      </div>
    ); // Display error state
  }

  return (
    // <div className="max-w-lg mx-auto p-6 bg-black shadow-lg rounded-lg mt-20">
    //   <h1 className="text-3xl font-bold text-center text-green-500">Checkout Success!</h1>
    //   <p className="mt-4 text-lg text-center text-gray-600">Your purchase was successful. Click the button below to download your music.</p>
    //   <button
    //     onClick={handleAlbumDownload}
    //     className="mt-6 w-full py-2 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white font-semibold rounded-lg hover:from-[#3AF7F0] hover:via-[#0093FF] hover:to-[#0119FF] transition duration-300"
    //   >
    //     Download Music
    //   </button>
    // </div>

    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="p-8 text-center">
          {/* Success Animation */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-500/20 mb-6">
            <svg
              className="h-12 w-12 text-green-500 animate-check"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Payment Successful!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Your purchase was completed successfully. You can now download your
            music.
          </p>

          {/* Download button */}
          <button
            onClick={handleAlbumDownload}
            className="w-full max-w-xs mx-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Download Your Music
          </button>

          {/* Additional helpful links */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">
              Need help?{" "}
              <a href="/contactus" className="text-blue-500 hover:underline">
                Contact support
              </a>
            </p>
            <p className="text-sm text-gray-500">
              Want to explore more?{" "}
              <a href="/musics" className="text-blue-500 hover:underline">
                Browse our collection
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
