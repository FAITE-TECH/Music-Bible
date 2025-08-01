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
import SEO from "../Components/SEO";

export default function Music() {
  const [musicList, setMusicList] = useState([]);
  const [filteredMusicList, setFilteredMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchMusic = async () => {
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

  useEffect(() => {
    fetchMusic();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
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
      navigate("/order-summary", { state: { musicItem: music } });
    } else {
      navigate("/sign-in");
    }
  };

  const handleShare = (music) => {
    if (navigator.share) {
      navigator
        .share({
          title: music.title,
          url: music.music,
        })
        .catch((error) => console.error("Error sharing music:", error));
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
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Christian Music Collection - Stream Tamil, English & Multi-Language Songs | aMusicBible"
        description="Stream and download Christian music in Tamil, English, and multiple languages on aMusicBible. Discover worship songs, spiritual music, and biblical songs. Experience the Holy Bible through beautiful melodies and sacred music."
        keywords="aMusicBible music, Christian music streaming, Tamil Christian songs, English Christian songs, worship music, spiritual songs, biblical music, gospel music, devotional songs, holy bible songs"
        url="/musics"
        schema={{
          "@context": "https://schema.org",
          "@type": "MusicPlaylist",
          "name": "aMusicBible Christian Music Collection",
          "description": "Collection of Christian music in Tamil, English and multiple languages on aMusicBible platform",
          "genre": ["Christian", "Gospel", "Worship"],
          "inLanguage": ["ta", "en"],
          "creator": {
            "@type": "Organization",
            "name": "aMusicBible",
            "url": "https://amusicbible.com"
          },
          "publisher": {
            "@type": "Organization",
            "name": "FAITE (PVT) Ltd"
          }
        }}
      />
      <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] bg-clip-text text-transparent"
      >
        All Music
      </motion.h1>

      {/* Search Bar */}
      <motion.div
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
            </svg>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredMusicList.map((music, index) => (
          <motion.div
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
                  alt={music.title}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>

              {/* Song Info */}
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
                  <button
                    onClick={() => handleDownload(music)}
                    className="text-gray-400 hover:text-[#0119FF]"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button
                    onClick={() => handleShare(music)}
                    className="text-gray-400 hover:text-[#0119FF]"
                  >
                    <FontAwesomeIcon icon={faShareAlt} />
                  </button>
                </div>
                <button
                  onClick={() => handlePlaySong(index)}
                  className="text-white bg-blue-600 rounded-full p-1.5 w-7 h-7 flex items-center justify-center"
                >
                  <FontAwesomeIcon
                    icon={
                      currentSongIndex === index && isPlaying ? faPause : faPlay
                    }
                    className="text-xs"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </>
  );
}
