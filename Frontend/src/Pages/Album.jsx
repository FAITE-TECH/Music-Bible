import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import Album1 from '../assets/Logo/Album1.png';
import Album2 from '../assets/Logo/Album2.png';
import Album3 from '../assets/Logo/Album3.png';
import Album4 from '../assets/Logo/Album4.png';

export default function Album({ defaultCategory = 'Album1' }) {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(defaultCategory);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const audioRefs = useRef({}); // To store refs for each audio element

  const categories = [
    { value: 'Album1', label: 'VAAZHVU THARUM VAARTHAIGAL' },
    { value: 'Album2', label: 'BOOK OF ECCLESIASTES' },
    { value: 'Album3', label: 'BOOK OF PHILIPPIANS' },
    { value: 'Album4', label: 'BOOKS OF THE GOSPEL' },
  ];

  const albumInfo = {
    Album1: {
      src: Album1,
      label: 'VAAZHVU THARUM VAARTHAIGAL',
      description: 'A collection of soulful and rhythmic tunes from VAAZHVU THARUM VAARTHAIGAL.',
    },
    Album2: {
      src: Album2,
      label: 'BOOK OF ECCLESIASTES',
      description: 'An energetic collection of tracks to keep you motivated from BOOK OF ECCLESIASTES.',
    },
    Album3: {
      src: Album3,
      label: 'BOOK OF PHILIPPIANS',
      description: 'Smooth beats and mellow vibes from BOOK OF PHILIPPIANS.',
    },
    Album4: {
      src: Album4,
      label: 'BOOKS OF THE GOSPEL',
      description: 'Smooth beats and mellow vibes from BOOKS OF THE GOSPEL.',
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

  // Play next song automatically
  const handleAudioEnded = (currentIndex) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < musicList.length) {
      const nextAudio = audioRefs.current[musicList[nextIndex]._id];
      if (nextAudio) {
        nextAudio.play().catch((error) => console.error('Autoplay error:', error));
      }
    }
  };

  const handleDownload = (music) => {
    if (currentUser) {
      navigate('/order-summary', { state: { musicItem: music } });
    } else {
      navigate('/sign-in');
    }
  };

  const handleAlbumDownload = () => {
    if (currentUser) {
      musicList.forEach((music) => {
        const link = document.createElement('a');
        link.href = music.music;
        link.download = `${albumInfo[category]?.label} - ${music.title}`;
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
        title: `${albumInfo[category]?.label} Album`,
        url: `${window.location.href}`,
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
            <option key={album.value} value={album.value}>
              {album.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex">
        <div className="w-1/4 p-4">
          <img
            src={albumInfo[category]?.src || 'https://via.placeholder.com/300'}
            alt={albumInfo[category]?.label}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <div className="w-3/4 p-4 flex flex-col">
          <div className="flex flex-col mb-4">
            <h2 className="text-2xl font-bold text-white mt-4">{albumInfo[category]?.label}</h2>
            <p className="text-gray-300 mt-2">{albumInfo[category]?.description}</p>
            <div className="flex mt-4 gap-4">
              <button
                onClick={handleDownload}
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
        </div>
      </div>
      <h1 className="text-3xl font-bold text-center mb-6">Music</h1>
      <div className="text-center text-gray-400 mb-4">Available music in {albumInfo[category]?.label}:</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-black">
        {musicList.length > 0 ? (
          musicList.map((music, index) => (
            <div key={music._id} className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-black via-purple-950 to-black text-white">
              <h2 className="text-xl font-semibold mb-2">{music.title}</h2>
              <img
                src={music.image}
                alt={music.title}
                className="w-full h-60 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-100 mb-6">{music.description}</p>
              <audio
                ref={(el) => {
                  audioRefs.current[music._id] = el;
                  if (el) {
                    el.addEventListener('ended', () => handleAudioEnded(index)); // Add event listener
                  }
                }}
                src={music.music}
                controls
                className="w-full"
              />
              <div className="flex justify-between mt-4">
              <button
                  onClick={() => handleDownload(music)}
                  className="flex items-center bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  {currentUser ? 'Download' : 'Sign in to Download'}
                </button>
                <button
                  onClick={() => handleShare(music)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Share
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-red-500 text-center">No music available in this album.</p>
        )}
      </div>
    </div>
  );
}