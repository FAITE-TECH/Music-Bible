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
  faStepBackward,
  faStepForward,
  faVolumeUp,
  faVolumeMute,
  faBackward,
  faForward,
  faEllipsisH,
  faRandom,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export default function Album() {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [openPlaybackRateIndex, setOpenPlaybackRateIndex] = useState(null);
  const [shuffle, setShuffle] = useState(false);

  const togglePlaybackRateMenu = (index) => {
    setOpenPlaybackRateIndex(openPlaybackRateIndex === index ? null : index);
  };

  const handleShuffle = () => {
    setShuffle(!shuffle);
    console.log(shuffle ? "Shuffle turned off" : "Shuffle turned on");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/getAlbum");
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to load categories");
        setCategories(data);
        setCategory(data[0]?.albumName || "");
      } catch (error) {
        setError("Error fetching categories");
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
        const response = await fetch(
          `/api/music/category?category=${category}`
        );
        if (!response.ok) throw new Error("Failed to fetch music data");
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

    const handleEnded = () => {
      handleNext(); // Automatically go to next song when current ends
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSongIndex, musicList, shuffle]); // Add dependencies

  const handlePlaySong = (index) => {
    if (currentSongIndex === index) {
      setIsPlaying(!isPlaying);
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((e) => console.error("Playback failed:", e));
      }
    } else {
      setCurrentSongIndex(index);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.playbackRate = playbackRate;
          audioRef.current
            .play()
            .catch((e) => console.error("Playback failed:", e));
        }
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentSongIndex === null || musicList.length === 0) return;

    let newIndex;
    if (shuffle) {
      // Shuffle logic - get a random index different from current
      do {
        newIndex = Math.floor(Math.random() * musicList.length);
      } while (newIndex === currentSongIndex && musicList.length > 1);
    } else {
      // Normal sequential play
      newIndex =
        currentSongIndex === 0 ? musicList.length - 1 : currentSongIndex - 1;
    }

    setCurrentSongIndex(newIndex);
    setIsPlaying(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.playbackRate = playbackRate;
        audioRef.current
          .play()
          .catch((e) => console.error("Auto-play failed:", e));
      }
    }, 100);
  };

  const handleNext = () => {
    if (currentSongIndex === null || musicList.length === 0) return;

    let newIndex;
    if (shuffle) {
      // Shuffle logic - get a random index different from current
      do {
        newIndex = Math.floor(Math.random() * musicList.length);
      } while (newIndex === currentSongIndex && musicList.length > 1);
    } else {
      // Normal sequential play
      newIndex =
        currentSongIndex === musicList.length - 1 ? 0 : currentSongIndex + 1;
    }

    setCurrentSongIndex(newIndex);
    setIsPlaying(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.playbackRate = playbackRate;
        audioRef.current
          .play()
          .catch((e) => console.error("Auto-play failed:", e));
      }
    }, 100);
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handlePlaybackRateChange = (rate, index) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    setOpenPlaybackRateIndex(null);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleAlbumShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${category} Album`,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing album:", error));
    } else {
      alert(`Share this album: ${window.location.href}`);
    }
  };

  const handleDownload = (music) => {
    currentUser
      ? navigate("/order-summary", { state: { musicItem: music } })
      : navigate("/sign-in");
  };

  const handleShare = (music) => {
    if (navigator.share) {
      navigator
        .share({
          title: `${music.title}`,
          url: music.music,
        })
        .catch((error) => console.error("Error sharing music:", error));
    } else {
      alert(`Share this song: ${music.title}\n${music.music}`);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSeekBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 10
      );
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeekForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        duration,
        audioRef.current.currentTime + 10
      );
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <MoonLoader color="#6b46c1" size={80} />
        <p className="ml-4 text-white text-xl">Loading Music...</p>
      </div>
    );

  if (error)
    return (
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
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] bg-clip-text text-transparent">
          Music Album
        </h1>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <label htmlFor="album-select" className="text-white md:mr-2">
            Select Album:
          </label>
          <motion.select
            id="album-select"
            value={category}
            onChange={handleCategoryChange}
            className="p-2 bg-white text-gray-500 rounded-lg w-full md:w-64"
            whileHover={{ scale: 1.05 }}
          >
            {categories.map((album) => (
              <option key={album._id} value={album.albumName}>
                {album.albumName}
              </option>
            ))}
          </motion.select>
        </div>
      </motion.div>

      {/* Album Info */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <motion.div 
          className="w-full md:w-1/4"
          initial={{ x: '-100vw' }} 
          animate={{ x: 0 }} 
          transition={{ type: 'spring', stiffness: 50, duration: 1.8 }}
        >
          <img
            src={
              categories.find((cat) => cat.albumName === category)?.image ||
              "https://via.placeholder.com/300"
            }
            alt={category}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </motion.div>

        <motion.div 
          className="w-full md:w-3/4 flex flex-col justify-center"
          initial={{ x: '100vw' }} 
          animate={{ x: 0 }} 
          transition={{ type: 'spring', stiffness: 50, duration: 1.8 }}
        >
          <h2 className="tamil-font text-2xl md:text-3xl font-bold mb-2 text-purple-300">
            {category}
          </h2>
          {categories.find((cat) => cat.albumName === category)
            ?.description && (
            <p className="tamil-font text-gray-300 mb-4">
              {categories.find((cat) => cat.albumName === category).description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <motion.button
              onClick={handleAlbumShare}
              className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <FontAwesomeIcon icon={faShareAlt} />
              <span>Share Album</span>
            </motion.button>

            <motion.button
              onClick={() => {}}
              className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Download Album</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Music List */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4 text-purple-300">Songs</h3>

        {musicList.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            No songs found in this album
          </div>
        )}

        {musicList.map((music, index) => (
          <motion.div
            key={music._id}
            className={`p-3 rounded-lg ${
              index === currentSongIndex
                ? "bg-gray-900 border-l-4 border-blue-500"
                : "bg-gray-800"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-2">
              {/* Title/Description */}
              <div className="flex flex-col w-full sm:w-1/4 max-w-xs text-center sm:text-left">
                <span className="tamil-font text-base sm:text-lg text-white truncate">
                  {music.title}
                </span>
                {music.description && (
                  <span className="tamil-font text-xs sm:text-sm text-gray-400 mt-0.5 truncate">
                    {music.description}
                  </span>
                )}
              </div>

              {/* Player Controls */}
              <div className="flex flex-wrap justify-center items-center gap-2 w-full sm:w-2/4">
                <motion.button
                  onClick={handlePrevious}
                  className="text-gray-400 hover:text-white p-1 sm:p-2"
                  title="Previous Track"
                  whileHover={{ scale: 1.1 }}
                >
                  <FontAwesomeIcon icon={faStepBackward} />
                </motion.button>
                <motion.button
                  onClick={handleSeekBackward}
                  className="text-gray-400 hover:text-white p-1 sm:p-2"
                  title="Seek Backward 10s"
                  whileHover={{ scale: 1.1 }}
                >
                  <FontAwesomeIcon icon={faBackward} />
                </motion.button>
                <motion.button
                  onClick={() => handlePlaySong(index)}
                  className="text-white bg-blue-600 rounded-full p-2 w-8 h-8 flex items-center justify-center"
                  title={
                    currentSongIndex === index && isPlaying ? "Pause" : "Play"
                  }
                  whileHover={{ scale: 1.1 }}
                >
                  <FontAwesomeIcon
                    icon={
                      currentSongIndex === index && isPlaying ? faPause : faPlay
                    }
                  />
                </motion.button>
                <motion.button
                  onClick={handleSeekForward}
                  className="text-gray-400 hover:text-white p-1 sm:p-2"
                  title="Seek Forward 10s"
                  whileHover={{ scale: 1.1 }}
                >
                  <FontAwesomeIcon icon={faForward} />
                </motion.button>
                <motion.button
                  onClick={handleNext}
                  className="text-gray-400 hover:text-white p-1 sm:p-2"
                  title="Next Track"
                  whileHover={{ scale: 1.1 }}
                >
                  <FontAwesomeIcon icon={faStepForward} />
                </motion.button>
                <span className="text-xs text-gray-400 w-8 text-right shrink-0">
                  {formatTime(index === currentSongIndex ? currentTime : 0)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={index === currentSongIndex ? duration || 100 : 0}
                  value={index === currentSongIndex ? currentTime : 0}
                  onChange={handleSeek}
                  className="flex-1 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer min-w-[60px] max-w-[120px]"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 ${
                      ((index === currentSongIndex ? currentTime : 0) /
                        (index === currentSongIndex ? duration || 100 : 100)) *
                      100
                    }%, #4b5563 ${
                      ((index === currentSongIndex ? currentTime : 0) /
                        (index === currentSongIndex ? duration || 100 : 100)) *
                      100
                    }%)`,
                  }}
                />
                <span className="text-xs text-gray-400 w-8 shrink-0">
                  {formatTime(index === currentSongIndex ? duration : 0)}
                </span>

                {/* Shuffle Button */}
                <motion.button
                  onClick={handleShuffle}
                  className={`p-1 sm:p-2 ${
                    shuffle ? "text-purple-400" : "text-gray-400"
                  } hover:text-white`}
                  title={shuffle ? "Disable shuffle" : "Enable shuffle"}
                  whileHover={{ scale: 1.1 }}
                >
                  <FontAwesomeIcon icon={faRandom} />
                </motion.button>

                {/* Playback Rate Dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={() => togglePlaybackRateMenu(index)}
                    className="text-gray-400 hover:text-white p-1 sm:p-2"
                    title="Playback speed"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FontAwesomeIcon icon={faEllipsisH} />
                  </motion.button>

                  {openPlaybackRateIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-800 rounded-lg shadow-lg z-10"
                    >
                      <div className="p-2 space-y-1">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                          <button
                            key={rate}
                            onClick={() =>
                              handlePlaybackRateChange(rate, index)
                            }
                            className={`w-full text-left px-3 py-1 text-sm rounded ${
                              playbackRate === rate
                                ? "bg-blue-600 text-white"
                                : "text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            {rate}x speed
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Volume Control */}
                <div className="relative group flex items-center">
                  <motion.button
                    onClick={toggleMute}
                    className="text-gray-400 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FontAwesomeIcon
                      icon={isMuted ? faVolumeMute : faVolumeUp}
                    />
                  </motion.button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-14 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer absolute left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    style={{ width: "56px" }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-1/4 justify-end mt-2 sm:mt-0">
                <motion.button
                  onClick={() => handleDownload(music)}
                  className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-1 px-2 rounded-lg text-xs sm:text-sm flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <FontAwesomeIcon icon={faDownload} size="xs" />
                  <span className="hidden sm:inline">Download</span>
                </motion.button>
                <motion.button
                  onClick={() => handleShare(music)}
                  className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-1 px-2 rounded-lg text-xs sm:text-sm flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <FontAwesomeIcon icon={faShareAlt} size="xs" />
                  <span className="hidden sm:inline">Share</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={
          currentSongIndex !== null ? musicList[currentSongIndex]?.music : ""
        }
        onError={(e) => console.error("Audio error:", e)}
      />
    </motion.div>
  );
}