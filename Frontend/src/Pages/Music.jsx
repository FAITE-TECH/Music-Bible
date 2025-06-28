<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt, faDownload, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
=======
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MoonLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareAlt,
  faDownload,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
>>>>>>> 4c92959 (new)

export default function Music() {
  const [musicList, setMusicList] = useState([]);
  const [filteredMusicList, setFilteredMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [searchTerm, setSearchTerm] = useState('');
=======
  const [searchTerm, setSearchTerm] = useState("");
>>>>>>> 4c92959 (new)
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchMusic = async () => {
<<<<<<< HEAD
    try {
      const response = await fetch(`/api/music/music?limit=0`);
      const data = await response.json();
      setMusicList(data.music || []);
      setFilteredMusicList(data.music || []);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
=======
  try {
    const response = await fetch(`/api/music/music?limit=0`);
    const data = await response.json();

    // First, find all Telugu songs
    const teluguSongs = (data.music || []).filter(
      (music) => music.language === "Telugu"
    );

    // Then find all other songs (non-Telugu)
    const otherSongs = (data.music || []).filter(
      (music) => music.language !== "Telugu"
    );

    // Find BOOK OF JAMES songs from other songs
    const jamesSongs = otherSongs.filter(
      (music) => music.category === "BOOK OF JAMES - ஞான மொழிகள்"
    );

    // Remove BOOK OF JAMES songs from other songs
    const remainingSongs = otherSongs.filter(
      (music) => music.category !== "BOOK OF JAMES - ஞான மொழிகள்"
    );

    // Only include the first song from BOOK OF JAMES (if it exists)
    const enabledJamesSong = jamesSongs.length > 0 ? [jamesSongs[0]] : [];

    // Combine all songs in the desired order: Telugu songs first, then other songs, then BOOK OF JAMES
    const enabledMusic = [...teluguSongs, ...remainingSongs, ...enabledJamesSong];

    setMusicList(enabledMusic);
    setFilteredMusicList(enabledMusic);
    setLoading(false);
  } catch (error) {
    setError(error.message);
    setLoading(false);
  }
};
>>>>>>> 4c92959 (new)

  useEffect(() => {
    fetchMusic();
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    if (searchTerm.trim() === '') {
=======
    if (searchTerm.trim() === "") {
>>>>>>> 4c92959 (new)
      setFilteredMusicList(musicList);
    } else {
      const filtered = musicList.filter((music) =>
        music.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMusicList(filtered);
    }
  }, [searchTerm, musicList]);

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
      setTimeout(() => {
        audioRef.current.play();
      }, 0);
    }
  };

  const handleDownload = (music) => {
    if (currentUser) {
<<<<<<< HEAD
      navigate('/order-summary', { state: { musicItem: music } });
    } else {
      navigate('/sign-in');
=======
      navigate("/order-summary", { state: { musicItem: music } });
    } else {
      navigate("/sign-in");
>>>>>>> 4c92959 (new)
    }
  };

  const handleShare = (music) => {
    if (navigator.share) {
      navigator
        .share({
          title: music.title,
          url: music.music,
        })
<<<<<<< HEAD
        .catch((error) => console.error('Error sharing music:', error));
=======
        .catch((error) => console.error("Error sharing music:", error));
>>>>>>> 4c92959 (new)
    } else {
      alert(`Share this song: ${music.title}\n${music.music}`);
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
<<<<<<< HEAD
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
=======
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
>>>>>>> 4c92959 (new)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
<<<<<<< HEAD
      <motion.h1 
=======
      <motion.h1
>>>>>>> 4c92959 (new)
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] bg-clip-text text-transparent"
      >
        All Music
      </motion.h1>

      {/* Search Bar */}
<<<<<<< HEAD
      <motion.div 
=======
      <motion.div
>>>>>>> 4c92959 (new)
        className="flex justify-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative w-full max-w-md">
          <input
            type="text"
            className="w-full p-3 pl-10 rounded-lg bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-3 text-gray-400">
<<<<<<< HEAD
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
=======
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
>>>>>>> 4c92959 (new)
            </svg>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredMusicList.map((music, index) => (
          <motion.div
<<<<<<< HEAD
              key={music._id}
              className={`p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-black via-[#0093FF] to-black text-white max-w-[170px] w-full h-64 flex flex-col justify-between mx-auto ${
                index === currentSongIndex ? 'border-2 border-blue-500 expanded-card' : ''
              }`}
              whileInView={{ opacity: 1, rotate: 0, translateY: 0 }}
              transition={{ duration: 0.5 }}
            >
            <div className="flex flex-col justify-center h-full">
              {/* Album Art */}
              <div className="flex justify-center mb-1">
                <img 
                  src={music.image || 'https://via.placeholder.com/150'} 
=======
            key={music._id}
            className={`p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-black via-[#0093FF] to-black text-white max-w-[170px] w-full h-64 flex flex-col justify-between mx-auto ${
              index === currentSongIndex
                ? "border-2 border-blue-500 expanded-card"
                : ""
            }`}
            whileInView={{ opacity: 1, rotate: 0, translateY: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col justify-center h-full">
              {/* Album Art */}
              <div className="flex justify-center mb-1">
                <img
                  src={music.image || "https://via.placeholder.com/150"}
>>>>>>> 4c92959 (new)
                  alt={music.title}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>

              {/* Song Info */}
<<<<<<< HEAD
             <div className=" flex-grow flex flex-col items-center">
              <p className="text-gray-400 text-xs mb-0.5 text-center">{music.category}</p>
              <h3 className="text-white text-xs font-medium mb-0.5 break-words whitespace-normal text-center">{music.title}</h3>
              <p className="text-gray-400 text-xs text-center">{music.description}</p>
            </div>
=======
              <div className=" flex-grow flex flex-col items-center">
                <p className="text-gray-400 text-xs mb-0.5 text-center">
                  {music.category}
                </p>
                <h3 className="text-white text-xs font-medium mb-0.5 break-words whitespace-normal text-center">
                  {music.title}
                </h3>
                <p className="text-gray-400 text-xs text-center">
                  {music.description}
                </p>
              </div>
>>>>>>> 4c92959 (new)

              {/* Audio Player */}
              {index === currentSongIndex && (
                <div className="mt-2 flex justify-center items-center">
                  <audio
                    controls
                    controlsList="nodownload"
                    ref={audioRef}
                    className="w-full h-8 max-w-[140px] mx-auto"
                  >
                    <source src={music.music} type="audio/mpeg" />
                  </audio>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
<<<<<<< HEAD
                  <button 
=======
                  <button
>>>>>>> 4c92959 (new)
                    onClick={() => handleDownload(music)}
                    className="text-gray-400 hover:text-[#0119FF]"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
<<<<<<< HEAD
                  <button 
=======
                  <button
>>>>>>> 4c92959 (new)
                    onClick={() => handleShare(music)}
                    className="text-gray-400 hover:text-[#0119FF]"
                  >
                    <FontAwesomeIcon icon={faShareAlt} />
                  </button>
                </div>
<<<<<<< HEAD
                <button 
                  onClick={() => handlePlaySong(index)}
                  className="text-white bg-blue-600 rounded-full p-1.5 w-7 h-7 flex items-center justify-center"
                >
                  <FontAwesomeIcon 
                    icon={currentSongIndex === index && isPlaying ? faPause : faPlay} 
=======
                <button
                  onClick={() => handlePlaySong(index)}
                  className="text-white bg-blue-600 rounded-full p-1.5 w-7 h-7 flex items-center justify-center"
                >
                  <FontAwesomeIcon
                    icon={
                      currentSongIndex === index && isPlaying ? faPause : faPlay
                    }
>>>>>>> 4c92959 (new)
                    className="text-xs"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 4c92959 (new)
