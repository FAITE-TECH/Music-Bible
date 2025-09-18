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
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export default function Music() {
  const [musicList, setMusicList] = useState([]);
  const [filteredMusicList, setFilteredMusicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 20;
  const totalPages = Math.ceil(filteredMusicList.length / cardsPerPage);
  const paginatedMusic = filteredMusicList.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
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
      const enabledMusic = [
        ...teluguSongs,
        ...remainingSongs,
        ...enabledJamesSong,
      ];

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
      const filtered = musicList.filter(
        (music) =>
          music.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (music.description &&
            music.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredMusicList(filtered);
    }
  }, [searchTerm, musicList]);

  // Handle play all functionality
  const handlePlayAll = () => {
    if (filteredMusicList.length === 0) return;

    if (isPlayingAll) {
      // Stop playing all
      setIsPlayingAll(false);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentSongIndex(null);
    } else {
      // Start playing all from the beginning
      setIsPlayingAll(true);
      setCurrentSongIndex(0);
      setIsPlaying(true);
    }
  };

  // Effect to handle automatic playback of next song
  useEffect(() => {
    if (!isPlayingAll || currentSongIndex === null) return;

    const playNextSong = () => {
      if (currentSongIndex < filteredMusicList.length - 1) {
        setCurrentSongIndex(currentSongIndex + 1);
      } else {
        // Reached the end of the list
        setIsPlayingAll(false);
        setCurrentSongIndex(null);
      }
    };

    const handleAudioEnd = () => {
      playNextSong();
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleAudioEnd);

      // Auto-play the current song
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.error("Auto-play failed:", error);
          });
        }
      }, 100);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnd);
      }
    };
  }, [currentSongIndex, isPlayingAll, filteredMusicList.length]);

  const handlePlaySong = (index) => {
    if (isPlayingAll) {
      setIsPlayingAll(false);
    }

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
        if (audioRef.current) {
          audioRef.current.play();
        }
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
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Title centered at top */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] bg-clip-text text-transparent text-center mb-4"
      >
        Discover and Explore a Wide Collection of Songs
      </motion.h1>

      {/* Search and Play All controls below title */}
      <div className="flex flex-row justify-between items-center mb-8 gap-4 w-full">
        {/* Search Bar on Left */}
        <motion.form
          className="flex-1 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="relative w-full">
            <input
              type="text"
              className="w-full p-2 pl-9 pr-4 rounded-lg bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="Search songs by title ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ minWidth: "140px", maxWidth: "100%" }}
            />
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
        </motion.form>

        {/* Play All Button on Right */}
        {filteredMusicList.length > 0 && (
          <motion.button
            onClick={handlePlayAll}
            className={`px-6 py-1 rounded-lg  shadow transition flex items-center justify-center space-x-2  ${
              isPlayingAll
                ? "bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] text-white"
                : "bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] hover:opacity-90 text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon
              icon={isPlayingAll ? faPause : faPlayCircle}
              className="text-xl"
            />
            <span>{isPlayingAll ? "Stop All" : "Play All"}</span>
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-10">
        {paginatedMusic.map((music, i) => {
          const index = (currentPage - 1) * cardsPerPage + i;
          const isCurrentSong = index === currentSongIndex;

          return (
            <motion.div
              key={music._id}
              className={`p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-black  to-black text-white max-w-[170px] w-full h-64 flex flex-col justify-between mx-auto border ${
                isCurrentSong
                  ? "border-2 border-blue-500 expanded-card"
                  : "border-white"
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
                <div className="flex-grow flex flex-col items-center">
                  <p className="text-gray-300 text-xs mb-0.5 text-center">
                    {music.category}
                  </p>
                  <h3 className="text-white text-xs font-medium mb-0.5 break-words whitespace-normal text-center">
                    {music.title}
                  </h3>
                  <p className="text-gray-200 text-xs text-center">
                    {music.description}
                  </p>
                </div>

                {/* Audio Player */}
                {isCurrentSong && (
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
                      title="Download"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button
                      onClick={() => handleShare(music)}
                      className="text-gray-400 hover:text-[#0119FF]"
                      title="Share"
                    >
                      <FontAwesomeIcon icon={faShareAlt} />
                    </button>
                  </div>
                  <button
                    onClick={() => handlePlaySong(index)}
                    className={`rounded-full p-1.5 w-7 h-7 flex items-center justify-center ${
                      isCurrentSong && isPlaying
                        ? "bg-blue-600 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                    title={isCurrentSong && isPlaying ? "Pause" : "Play"}
                  >
                    <FontAwesomeIcon
                      icon={isCurrentSong && isPlaying ? faPause : faPlay}
                      className="text-xs"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            className="px-3 py-1 rounded-lg bg-gray-800 text-white disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-lg border ${
                currentPage === i + 1
                  ? "border-blue-500 bg-gray-900 text-blue-400"
                  : "border-gray-700 bg-gray-800 text-white"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded-lg bg-gray-800 text-white disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
