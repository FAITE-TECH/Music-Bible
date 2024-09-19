import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt, faDownload } from '@fortawesome/free-solid-svg-icons';

export default function Album({ defaultCategory = 'Album1' }) {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(defaultCategory);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const categories = ['Album1', 'Album2', 'Album3', 'Album4'];

  const albumInfo = {
    Album1: {
      image: 'https://indiater.com/wp-content/uploads/2021/06/Free-Music-Album-Cover-Art-Banner-Photoshop-Template.jpg',
      description: 'A collection of soulful and rhythmic tunes from Album 1.',
    },
    Album2: {
      image: 'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150597431.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1726617600&semt=ais_hybrid',
      description: 'An energetic collection of tracks to keep you motivated.',
    },
    Album3: {
      image: 'https://marketplace.canva.com/EAF00PkmbGU/1/0/1600w/canva-red-and-yellow-modern-rap-music-music-album-cover-IqU7hAqANz4.jpg',
      description: 'Smooth beats and mellow vibes from Album 3.',
    },
    Album4: {
      image: 'https://png.pngtree.com/thumb_back/fh260/background/20230417/pngtree-viking-music-mixtape-coverhighres-download-for-album-art-photo-image_51616326.jpg',
      description: 'A vibrant mix of genres from Album 4.',
    },
  };

  const fetchMusicByCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/music/category?category=${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch music data');
      }
      const data = await response.json();
      setMusicList(data.music);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusicByCategory();
  }, [category]);

  const handleDownload = (music) => {
    if (currentUser) {
      const link = document.createElement('a');
      link.href = music.music;
      link.download = music.title;
      link.click();
    } else {
      navigate('/sign-in');
    }
  };

  const handleAlbumDownload = () => {
    if (currentUser) {
      musicList.forEach((music) => {
        const link = document.createElement('a');
        link.href = music.music;
        link.download = `${category} - ${music.title}`;
        link.click();
      });
    } else {
      navigate('/sign-in');
    }
  };

  const handleShare = (music) => {
    if (navigator.share) {
      navigator.share({
        title: music.title,
        url: music.music,
      })
        .then(() => console.log('Music shared successfully'))
        .catch((error) => console.error('Error sharing music:', error));
    } else {
      alert('Web Share API not supported in your browser.');
    }
  };

  const handleAlbumShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${category} Album`,
        url: `${window.location.href}`, // Share the current page URL
      })
        .then(() => console.log('Album shared successfully'))
        .catch((error) => console.error('Error sharing album:', error));
    } else {
      alert('Web Share API not supported in your browser.');
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <MoonLoader color="#6b46c1" size={80} loading={loading} />
        <p className="ml-4 text-white text-xl">Loading Music...</p>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-black">
      <div className="flex justify-end mb-6">
        <label htmlFor="album-select" className="text-white mr-4">Select Album: </label>
        <select
          id="album-select"
          value={category}
          onChange={handleCategoryChange}
          className="p-2 bg-purple-600 text-white rounded-lg"
        >
          {categories.map((album) => (
            <option key={album} value={album}>
              {album}
            </option>
          ))}
        </select>
      </div>
      <div className="flex">
        {/* Left side: Album Image */}
        <div className="w-1/4 p-4">
          <img
            src={albumInfo[category]?.image || 'https://via.placeholder.com/300'}
            alt={category}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Right side: Album Details and Music List */}
        <div className="w-3/4 p-4 flex flex-col">
          {/* Album Details */}
          <div className="flex flex-col mb-4">
            <h2 className="text-2xl font-bold text-white mt-4">{category}</h2>
            <p className="text-gray-300 mt-2">{albumInfo[category]?.description}</p>
            <div className="flex mt-4 gap-4">
              <button
                onClick={handleAlbumDownload}
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download Full Album
              </button>
              <button
                onClick={handleAlbumShare}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                Share Album
              </button>
            </div>
          </div>

          {/* Music List */}
         
        </div>
        
      </div>
      <h1 className="text-3xl font-bold text-center mb-6">Music</h1>
          <div className="text-center text-gray-400 mb-4">Available music in {category}:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-black">
            {musicList.length > 0 ? (
              musicList.map((music) => (
                <div key={music._id} className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-black via-purple-950 to-black text-white">
                  <h2 className="text-xl font-semibold mb-2">{music.title}</h2>
                  <img
                    src={music.image}
                    alt={music.title}
                    className="w-full h-60 object-cover rounded-lg mb-4"
                  />
                  <p className="text-gray-100 mb-6">{music.description}</p>
                  <audio controls controlsList="nodownload" className="w-full">
                    <source src={music.music} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleShare(music)}
                      className="flex items-center bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                      Share
                    </button>
                    <button
                      onClick={() => handleDownload(music)}
                      className="flex items-center bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faDownload} className="mr-2" />
                      {currentUser ? 'Download' : 'Sign in to Download'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-2">No music found</p>
            )}
          </div>
    </div>
  );
}
