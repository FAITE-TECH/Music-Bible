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
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateTime);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateTime);
    };
  }, [currentSongIndex]);

  const handlePlaySong = (index) => {
    if (currentSongIndex === index) {
      setIsPlaying(!isPlaying);
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    } else {
      setCurrentSongIndex(index);
      setIsPlaying(true);
      setTimeout(() => audioRef.current.play(), 100);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleAlbumShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${category} Album`,
        url: `${window.location.href}`,
      })
        .then(() => console.log('Album shared successfully'))
        .catch((error) => console.error('Error sharing album:', error));
    } else {
      alert('Web Share API not supported in your browser.');
    }
  };

  const handleDownload = (music) => {
    currentUser ? navigate('/order-summary', { state: { musicItem: music } }) : navigate('/sign-in');
  };

  const handleShare = (music) => {
    navigator.share?.({ title: music.title, url: music.music })
      .catch((error) => console.error('Error sharing music:', error));
  };
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-black"><MoonLoader color="#6b46c1" size={80} /><p className="ml-4 text-white text-xl">Loading Music...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto p-4 bg-black">
     <motion.div className="flex justify-end mb-6">
        <label htmlFor="album-select" className="text-white mr-4">Select Album: </label>
        <motion.select
          id="album-select"
          value={category}
          onChange={handleCategoryChange}
          className="p-2 bg-purple-600 text-white rounded-lg"
          whileHover={{ scale: 1.05 }}
        >
          {categories.map((album) => (
            <option key={album._id} value={album.albumName}>
              {album.albumName}
            </option>
          ))}
        </motion.select>
      </motion.div>
      <div className="flex ml-10">
        <motion.div className="w-1/4 p-4" initial={{ x: '-100vw' }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 50, duration: 1.8 }}>
          <img src={categories.find((cat) => cat.albumName === category)?.image || 'https://via.placeholder.com/300'} alt={category} className="w-full h-auto object-cover rounded-lg" />
        </motion.div>
        <motion.div className="w-3/4 flex flex-col mt-3" initial={{ x: '100vw' }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 50, duration: 1.8 }}>
          <h2 className="text-xl font-semibold mb-2 text-gray-300">{category}</h2>
          <div className="flex mt-4 gap-4">
            <motion.button onClick={handleDownload} className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center" whileHover={{ scale: 1.05 }}>
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Download Songs Below
            </motion.button>
            <motion.button onClick={handleAlbumShare} className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center" whileHover={{ scale: 1.05 }}>
              <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
              Share Album
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Music List */}
      <motion.div className="space-y-4 mt-6">
        {musicList.map((music, index) => (
          <div key={music._id} className={`p-1 rounded-lg ${index === currentSongIndex ? 'bg-gray-900' : 'bg-gray-800'}`}>
            <div className="flex justify-between items-center">
              {/* Left Section: Title and Play Button */}
              <div className="flex items-center gap-4 w-1/3">
                <span className="text-lg text-white w-48 truncate">{music.title}</span>
                <button onClick={() => handlePlaySong(index)} className="text-green-400 text-xl">
                  <FontAwesomeIcon icon={currentSongIndex === index && isPlaying ? faPause : faPlay} />
                </button>
              </div>

              {/* Middle Section: Play Time and Progress Bar */}
              <div className="flex items-center gap-4 w-1/3">
                <span className="text-white">{formatTime(currentSongIndex === index ? currentTime : 0)}</span>
                <input
                  type="range"
                  value={currentSongIndex === index ? currentTime : 0}
                  max={duration}
                  onChange={handleSeek}
                  className="w-full"
                />
                <span className="text-white">{formatTime(duration)}</span>
              </div>

              {/* Right Section: Download and Share Buttons */}
              <div className="flex items-center gap-4 w-1/3 justify-end">
                <button onClick={() => handleDownload(music)} className="text-purple-400 text-xl bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] py-1 px-2 rounded-lg">
                  <FontAwesomeIcon icon={faDownload} /> Download Music
                </button>
                <button onClick={() => handleShare(music)} className="text-blue-400 text-xl bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] py-1 px-2 rounded-lg">
                  <FontAwesomeIcon icon={faShareAlt} /> Share Music
                </button>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
      <audio ref={audioRef} src={musicList[currentSongIndex]?.music} autoPlay={isPlaying}></audio>
    </motion.div>
  );
}