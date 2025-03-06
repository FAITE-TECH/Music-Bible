import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt, faDownload, faPlay } from '@fortawesome/free-solid-svg-icons';
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
          setSelectedAlbum('all');
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

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMusicList(musicList);
    } else {
      const filtered = musicList.filter((music) =>
        music.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMusicList(filtered);
    }
  }, [searchTerm, musicList]);
  

  const handlePlaySong = (index) => {
    setCurrentSongIndex(index);
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
    <div className="container mx-auto p-4 bg-black overflow-hidden">
      <h1 className="text-3xl font-bold text-center mb-6">All Music</h1>
      <div className="flex flex-col md:flex-row justify-end md:space-x-4 mb-6">
        <input
          type="text"
          className="p-2 mb-4 md:mb-0 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
          placeholder="Search by song name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMusicList.length > 0 ? (
          filteredMusicList.map((music, index) => (
            <motion.div
              key={music._id}
              className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-black via-purple-950 to-black text-white ${
                index === currentSongIndex ? 'border-2 border-purple-500 expanded-card' : ''
              }`}
              whileInView={{ opacity: 1, rotate: 0, translateY: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center">
                <img 
                  src={music.image || 'https://via.placeholder.com/150'} 
                  alt={music.title}
                  className="w-70 h-70 sm:h-60 object-cover rounded-lg mb-4"
                />
              </div>
              <p className="text-gray-100 mb-6">{music.category}</p>
              <p className="text-gray-100 mb-6 text-xl">{music.title}</p>
              <p className="text-gray-100 mb-6 text-sm">{music.description}</p>
              
              <div className="flex flex-col sm:flex-row justify-between mt-4">
                <div className="flex space-x-4">
                <button onClick={() => handleDownload(music)} className="transition-colors">
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                </button>
                  <button onClick={() => handleShare(music)} className="text-white p-2 transition-colors">
                    <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                  </button>
                </div>
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
                    <button onClick={() => handlePlaySong(index)}>
                      <FontAwesomeIcon icon={faPlay} className="mr-2" />
                    </button>
                  )}
                
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