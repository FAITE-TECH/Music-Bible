import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export default function Music() {
  const [musicList, setMusicList] = useState([]);
  const [filteredMusicList, setFilteredMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const audioRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchMusic = async () => {
    try {
      const response = await fetch(`/api/music/music`);
      const data = await response.json();
      console.log("Music data:", data);
      setMusicList(data.music || []);
      setFilteredMusicList(data.music || []);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category/getAlbum');
        const data = await res.json();
        if (!res.ok) {
          throw new Error('Failed to load categories');
        } else {
          setCategories(data);
          setSelectedAlbum(data[0]?.albumName || ''); 
        }
      } catch (error) {
        setError('Error fetching categories');
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMusic();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterMusic(e.target.value, selectedAlbum);
  };

  const handleAlbumChange = (e) => {
    setSelectedAlbum(e.target.value);
    filterMusic(searchTerm, e.target.value);
  };

  const filterMusic = (title, category) => {
    let filtered = musicList;
    if (title) {
      filtered = filtered.filter((music) =>
        music.title.toLowerCase().includes(title.toLowerCase())
      );
    }
    if (category && category !== 'all') {
      filtered = filtered.filter((music) => music.category === category);
    }
    setFilteredMusicList(filtered);
  };

  const handleDownload = (music) => {
    if (currentUser) {
      navigate('/order-summary', { state: { musicItem: music } });
    } else {
      navigate('/sign-in');
    }
  };

  const handleShare = (music) => {
    if (navigator.share) {
      navigator
        .share({
          title: music.title,
          url: music.music,
        })
        .then(() => console.log('Music shared successfully'))
        .catch((error) => console.error('Error sharing music:', error));
    } else {
      alert('Web Share API not supported in your browser.');
    }
  };

  const handleNextSong = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === filteredMusicList.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleSongEnd = () => {
    handleNextSong();
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleSongEnd);
      return () => {
        audioRef.current.removeEventListener('ended', handleSongEnd);
      };
    }
  }, [currentSongIndex]);

  const handlePlaySong = (index) => {
    setCurrentSongIndex(index);
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Animation variants for rotation and scroll effect
  const animationVariants = {
    hidden: { opacity: 0, rotate: 20, translateY: 20 },
    visible: { opacity: 1, rotate: 0, translateY: 0 },
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
      <h1 className="text-3xl font-bold text-center mb-6">All Music</h1>
      <div className="flex flex-col md:flex-row justify-end md:space-x-4 mb-6">
        <input
          type="text"
          className="p-2 mb-4 md:mb-0 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
          placeholder="Search by song name..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
          onChange={handleAlbumChange}
        >
          <option value="all">All Albums</option>
          {categories.map((category) => (
            <option key={category._id} value={category.albumName}>
              {category.albumName}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.isArray(filteredMusicList) && filteredMusicList.length > 0 ? (
          filteredMusicList.map((music, index) => (
            <motion.div
              key={music._id}
              className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-black via-purple-950 to-black text-white ${
                index === currentSongIndex ? 'border-2 border-purple-500' : ''
              }`}
              initial="hidden"
              whileInView="visible" 
              variants={animationVariants}
              transition={{ duration: 0.5 }} 
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <h2 className="text-lg font-semibold mb-2">{music.title}</h2>
              <img
                src={music.image || 'https://via.placeholder.com/150'} 
                alt={music.title}
                className="w-full h-48 sm:h-60 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-100 mb-6">{music.description}</p>
              {index === currentSongIndex ? (
                <audio
                  controls
                  controlsList="nodownload"
                  ref={audioRef}
                  className="w-full"
                  autoPlay
                >
                  <source src={music.music} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <button
                  onClick={() => handlePlaySong(index)}
                  className="bg-blue-600 text-white p-2 rounded-lg w-full hover:bg-blue-700 transition-colors"
                >
                  Play Song
                </button>
              )}
              <div className="flex flex-col sm:flex-row justify-between mt-4">
                <button
                  onClick={() => handleShare(music)}
                  className="flex items-center bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors mb-2 sm:mb-0 sm:mr-2"
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
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No music found.</p>
        )}
      </div>
    </div>
  );
}
