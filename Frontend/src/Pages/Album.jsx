import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt, faDownload, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export default function Album() {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category/getAlbum');
        const data = await res.json();
        if (!res.ok) throw new Error('Failed to load categories');
        setCategories(data);
        setCategory(data[0]?.albumName || '');
      } catch (error) {
        setError('Error fetching categories');
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMusicByCategory = async () => {
      if (!category) return;
      try {
        setLoading(true);
        const response = await fetch(`/api/music/category?category=${category}`);
        if (!response.ok) throw new Error('Failed to fetch music data');
        const data = await response.json();
        setMusicList(data.music);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMusicByCategory();
  }, [category]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [currentSongIndex]);

  const handlePlaySong = (index) => {
    if (currentSongIndex === index) {
      setIsPlaying(!isPlaying);
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      }
    } else {
      setCurrentSongIndex(index);
      setIsPlaying(true);
      setTimeout(() => {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      }, 100);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleAlbumShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${category} Album`,
        url: window.location.href,
      }).catch((error) => console.error('Error sharing album:', error));
    } else {
      alert(`Share this album: ${window.location.href}`);
    }
  };

  const handleDownload = (music) => {
    currentUser ? navigate('/order-summary', { state: { musicItem: music } }) : navigate('/sign-in');
  };

  const handleShare = (music) => {
    if (navigator.share) {
      navigator.share({
        title: `${music.title}`,
        url: music.music,
      }).catch((error) => console.error('Error sharing music:', error));
    } else {
      alert(`Share this song: ${music.title}\n${music.music}`);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-black">
      <MoonLoader color="#6b46c1" size={80} />
      <p className="ml-4 text-white text-xl">Loading Music...</p>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen text-red-500">
      Error: {error}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-black text-white p-4 md:p-8"
    >
      {/* Album Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
       <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] bg-clip-text text-transparent">
          Music Album
        </h1>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <label htmlFor="album-select" className="text-white md:mr-2">Select Album:</label>
          <select
            id="album-select"
            value={category}
            onChange={handleCategoryChange}
            className="p-2 bg-purple-600 text-white rounded-lg w-full md:w-64"
          >
            {categories.map((album) => (
              <option key={album._id} value={album.albumName}>
                {album.albumName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Album Info */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/4">
          <img 
            src={categories.find((cat) => cat.albumName === category)?.image || 'https://via.placeholder.com/300'} 
            alt={category} 
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        
        <div className="w-full md:w-3/4 flex flex-col justify-center">
          <h2 className="tamil-font text-2xl md:text-3xl font-bold mb-2 text-purple-300">{category}</h2>
            {categories.find((cat) => cat.albumName === category)?.description && (
              <p className="tamil-font text-gray-300 mb-4">
                {categories.find((cat) => cat.albumName === category).description}
              </p>
            )}
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button 
              onClick={handleAlbumShare}
              className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]  text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faShareAlt} />
              <span>Share Album</span>
            </button>
            
            <button 
              onClick={() => {}}
              className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]  text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Download Album</span>
            </button>
          </div>
        </div>
      </div>

      {/* Music List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-purple-300">Songs</h3>
        
        {musicList.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            No songs found in this album
          </div>
        )}
        
        {musicList.map((music, index) => (
          <div 
            key={music._id}
            className={`p-4 rounded-lg ${index === currentSongIndex ? 'bg-gray-900 border-l-4 border-purple-500' : 'bg-gray-800'}`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Left Section: Title and Play Button */}
             <div className="flex items-center gap-4 w-1/3">
                <span className="tamil-font text-lg text-white w-48 truncate">{music.title}</span>
                <button onClick={() => handlePlaySong(index)} className="text-green-400 text-xl">
                  <FontAwesomeIcon icon={currentSongIndex === index && isPlaying ? faPause : faPlay} />
                </button>
              </div>

              {/* Middle Section: Progress Bar */}
              <div className="flex items-center gap-3 w-full md:w-1/3">
                <span className="text-xs text-gray-400 w-10 text-right">
                  {formatTime(index === currentSongIndex ? currentTime : 0)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={index === currentSongIndex ? currentTime : 0}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 ${((index === currentSongIndex ? currentTime : 0) / (duration || 100)) * 100}%, #4b5563 ${((index === currentSongIndex ? currentTime : 0) / (duration || 100)) * 100}%)`
                  }}
                />
                <span className="text-xs text-gray-400 w-10">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Right Section: Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-1/3 justify-end">
                <button 
                  onClick={() => handleDownload(music)}
                  className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]  text-white py-2 px-3 md:px-4 rounded-lg text-sm flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faDownload} size="xs" />
                  <span className="hidden sm:inline">Download</span>
                </button>
                
                <button 
                  onClick={() => handleShare(music)}
                  className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-2 px-3 md:px-4 rounded-lg text-sm flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faShareAlt} size="xs" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        src={currentSongIndex !== null ? musicList[currentSongIndex]?.music : ''}
        onError={(e) => console.error("Audio error:", e)}
      />
    </motion.div>
  );
}