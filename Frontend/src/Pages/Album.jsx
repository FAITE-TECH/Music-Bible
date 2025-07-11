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
  faHeart as faHeartSolid,
  faHeart as faHeartOutline,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

// Utility function to get audio duration
const getAudioDuration = (url) => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
    });
    audio.addEventListener('error', () => {
      resolve(0); // Return 0 if there's an error
    });
    audio.src = url;
  });
};

export default function Album() {
  const [favorites, setFavorites] = useState({});
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
  const [volumes, setVolumes] = useState({});
  const [mutedTracks, setMutedTracks] = useState({});
  const [openPlaybackRateIndex, setOpenPlaybackRateIndex] = useState(null);
  const [shuffle, setShuffle] = useState(false);
  const [hoveredVolumeIndex, setHoveredVolumeIndex] = useState(null);
  const [showFavoritesForAlbum, setShowFavoritesForAlbum] = useState(null);

  // Initialize volumes when musicList changes
  useEffect(() => {
    if (musicList.length > 0) {
      const initialVolumes = {};
      const initialMuted = {};
      musicList.forEach((_, index) => {
        initialVolumes[index] = 0.7;
        initialMuted[index] = false;
      });
      setVolumes(initialVolumes);
      setMutedTracks(initialMuted);
    }
  }, [musicList]);

  const togglePlaybackRateMenu = (index) => {
    setOpenPlaybackRateIndex(openPlaybackRateIndex === index ? null : index);
  };

  const handleShuffle = () => {
    setShuffle(!shuffle);
  };

  const toggleShowFavorites = () => {
    if (showFavoritesForAlbum === category) {
      setShowFavoritesForAlbum(null);
    } else {
      setShowFavoritesForAlbum(category);
    }
  };



  const handleVolumeChange = (index, newVolume) => {
    const updatedVolumes = { ...volumes, [index]: newVolume };
    setVolumes(updatedVolumes);

    if (index === currentSongIndex && audioRef.current) {
      audioRef.current.volume = newVolume;
      audioRef.current.muted = newVolume === 0;
    }

    if (newVolume === 0) {
      setMutedTracks((prev) => ({ ...prev, [index]: true }));
    } else if (mutedTracks[index]) {
      setMutedTracks((prev) => ({ ...prev, [index]: false }));
    }
  };

  const toggleMute = (index) => {
    const newMutedState = !mutedTracks[index];
    setMutedTracks((prev) => ({ ...prev, [index]: newMutedState }));

    if (index === currentSongIndex && audioRef.current) {
      audioRef.current.muted = newMutedState;
    }
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
  const fetchFavorites = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/favorites", { 
        method: "POST", 
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ userId: currentUser._id }), 
      });
      
      const data = await res.json();
      if (res.ok) {
        
        const favoritesObj = data.favorites.reduce((acc, fav) => {
          acc[fav._id] = true;
          return acc;
        }, {});
        setFavorites(favoritesObj);
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };
  fetchFavorites();
}, [currentUser]);

const toggleFavorite = async (musicId) => {
  try {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    const res = await fetch(`/api/favorites/toggle/${musicId}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ userId: currentUser._id }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to update favorites");

    
    setFavorites(prev => {
      const newFavorites = {...prev};
      if (newFavorites[musicId]) {
        delete newFavorites[musicId];
      } else {
        newFavorites[musicId] = true;
      }
      return newFavorites;
    });
  } catch (error) {
    console.error("Favorite error:", error);
  }
};

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
        
       
        const musicWithDurations = await Promise.all(
          data.music.map(async (music) => {
            const duration = await getAudioDuration(music.music);
            return { ...music, duration };
          })
        );
        
        setMusicList(musicWithDurations);
        setShowFavoritesForAlbum(null);
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
      handleNext();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSongIndex, musicList, shuffle]);

  const handlePlaySong = (index) => {
    if (category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0) {
      alert("This song will be available soon!");
      return;
    }
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
          audioRef.current.volume = volumes[index] || 0.7;
          audioRef.current.muted = mutedTracks[index] || false;
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
      do {
        newIndex = Math.floor(Math.random() * musicList.length);
      } while (newIndex === currentSongIndex && musicList.length > 1);
    } else {
      newIndex =
        currentSongIndex === 0 ? musicList.length - 1 : currentSongIndex - 1;
    }

    setCurrentSongIndex(newIndex);
    setIsPlaying(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = volumes[newIndex] || 0.7;
        audioRef.current.muted = mutedTracks[newIndex] || false;
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
      do {
        newIndex = Math.floor(Math.random() * musicList.length);
      } while (newIndex === currentSongIndex && musicList.length > 1);
    } else {
      newIndex =
        currentSongIndex === musicList.length - 1 ? 0 : currentSongIndex + 1;
    }

    setCurrentSongIndex(newIndex);
    setIsPlaying(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = volumes[newIndex] || 0.7;
        audioRef.current.muted = mutedTracks[newIndex] || false;
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
    if (category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0) {
      alert("This song will be available soon!");
      return;
    }
    currentUser
      ? navigate("/order-summary", { state: { musicItem: music } })
      : navigate("/sign-in");
  };

  const handleShare = (music) => {
    if (category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0) {
      alert("This song will be available soon!");
      return;
    }
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

  // Filter music list based on current album and favorite status
  const filteredMusicList =
  showFavoritesForAlbum === category
    ? musicList.filter((music) => favorites[music._id])
    : musicList;

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

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <motion.div
          className="w-full md:w-1/4"
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 50, duration: 1.8 }}
        >
          <img
            src={
              categories.find((cat) => cat.albumName === category)?.image ||
              "https://via.placeholder.com/300"
            }
            alt={category}
            className="w-full max-w-xs h-auto max-h-80 object-contain rounded-lg shadow-lg mx-auto"
          />
        </motion.div>

        <motion.div
          className="w-full md:w-3/4 flex flex-col justify-center"
          initial={{ x: "100vw" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 50, duration: 1.8 }}
        >
          <h2 className="tamil-font text-2xl md:text-3xl font-bold mb-2 text-purple-300">
            {category}
          </h2>
          {categories.find((cat) => cat.albumName === category)
            ?.description && (
            <p className="tamil-font text-justify text-gray-300 mb-4">
              {categories.find((cat) => cat.albumName === category).description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <motion.button
              onClick={() => {
                if (category === "BOOK OF JAMES - ஞான மொழிகள்") {
                  alert("This album will be available soon!");
                } else {
                  handleAlbumShare();
                }
              }}
              className={`bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                category === "BOOK OF JAMES - ஞான மொழிகள்"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              whileHover={{
                scale: category === "BOOK OF JAMES - ஞான மொழிகள்" ? 1 : 1.05,
              }}
              disabled={category === "BOOK OF JAMES - ஞான மொழிகள்"}
              title={
                category === "BOOK OF JAMES - ஞான மொழிகள்"
                  ? "This album will be available soon!"
                  : "Share this album"
              }
            >
              <FontAwesomeIcon icon={faShareAlt} />
              <span>Share Album</span>
              {category === "BOOK OF JAMES - ஞான மொழிகள்" && (
                <span className="ml-2 text-xs">(Coming Soon)</span>
              )}
            </motion.button>

            <motion.button
              onClick={() => {
                if (category === "BOOK OF JAMES - ஞான மொழிகள்") {
                  // Do nothing or show a message
                } else {
                  // Handle download
                }
              }}
              className={`bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                category === "BOOK OF JAMES - ஞான மொழிகள்"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              whileHover={{
                scale: category === "BOOK OF JAMES - ஞான மொழிகள்" ? 1 : 1.05,
              }}
              disabled={category === "BOOK OF JAMES - ஞான மொழிகள்"}
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Download Album</span>
              {category === "BOOK OF JAMES - ஞான மொழிகள்" && (
                <span className="ml-2 text-xs">(Coming Soon)</span>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-purple-300">Songs</h3>
          <button
            onClick={toggleShowFavorites}
            className={`px-3 py-1 rounded-full text-sm ${
              showFavoritesForAlbum === category
                ? "bg-blue-600 text-white"
                : "bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white"
            }`}
          >
            {showFavoritesForAlbum === category ? "Show All" : "Show Favorites"}
          </button>
        </div>

        {filteredMusicList.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            {showFavoritesForAlbum === category
              ? "No favorite songs in this album"
              : "No songs found in this album"}
          </div>
        )}

        {filteredMusicList.map((music, index) => (
          <motion.div
            key={music._id}
            className={`p-3 rounded-lg ${
              index === currentSongIndex
                ? "bg-gray-900 border-l-4 border-blue-500"
                : "bg-gray-800"
            } ${
              category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                ? "opacity-70 cursor-not-allowed"
                : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-2">
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

              <div className="flex flex-wrap justify-center items-center gap-2 w-full sm:w-2/4">
                {/* Previous Track Button */}
                <motion.button
                  onClick={() => {
                    if (
                      category === "BOOK OF JAMES - ஞான மொழிகள்" &&
                      index !== 0
                    ) {
                      alert("This song will be available soon!");
                      return;
                    }
                    handlePrevious();
                  }}
                  className={`text-gray-400 hover:text-white p-1 sm:p-2 ${
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  title={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "Coming soon"
                      : "Previous Track"
                  }
                  whileHover={{
                    scale:
                      category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                        ? 1
                        : 1.1,
                  }}
                  disabled={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                  }
                >
                  <FontAwesomeIcon icon={faStepBackward} />
                </motion.button>

                {/* Seek Backward Button */}
                <motion.button
                  onClick={() => {
                    if (
                      category === "BOOK OF JAMES - ஞான மொழிகள்" &&
                      index !== 0
                    ) {
                      alert("This song will be available soon!");
                      return;
                    }
                    handleSeekBackward();
                  }}
                  className={`text-gray-400 hover:text-white p-1 sm:p-2 ${
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  title={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "Coming soon"
                      : "Seek Backward 10s"
                  }
                  whileHover={{
                    scale:
                      category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                        ? 1
                        : 1.1,
                  }}
                  disabled={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                  }
                >
                  <FontAwesomeIcon icon={faBackward} />
                </motion.button>

                {/* Play/Pause Button */}
                <motion.button
                  onClick={() => handlePlaySong(index)}
                  className={`text-white ${
                    currentSongIndex === index && isPlaying
                      ? "bg-purple-600"
                      : "bg-blue-600"
                  } rounded-full p-2 w-8 h-8 flex items-center justify-center ${
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  title={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "Coming soon"
                      : currentSongIndex === index && isPlaying
                      ? "Pause"
                      : "Play"
                  }
                  whileHover={{
                    scale:
                      category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                        ? 1
                        : 1.1,
                  }}
                  disabled={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                  }
                >
                  <FontAwesomeIcon
                    icon={
                      currentSongIndex === index && isPlaying ? faPause : faPlay
                    }
                  />
                </motion.button>

                {/* Seek Forward Button */}
                <motion.button
                  onClick={() => {
                    if (
                      category === "BOOK OF JAMES - ஞான மொழிகள்" &&
                      index !== 0
                    ) {
                      alert("This song will be available soon!");
                      return;
                    }
                    handleSeekForward();
                  }}
                  className={`text-gray-400 hover:text-white p-1 sm:p-2 ${
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  title={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "Coming soon"
                      : "Seek Forward 10s"
                  }
                  whileHover={{
                    scale:
                      category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                        ? 1
                        : 1.1,
                  }}
                  disabled={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                  }
                >
                  <FontAwesomeIcon icon={faForward} />
                </motion.button>

                {/* Next Track Button */}
                <motion.button
                  onClick={() => {
                    if (
                      category === "BOOK OF JAMES - ஞான மொழிகள்" &&
                      index !== 0
                    ) {
                      alert("This song will be available soon!");
                      return;
                    }
                    handleNext();
                  }}
                  className={`text-gray-400 hover:text-white p-1 sm:p-2 ${
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  title={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "Coming soon"
                      : "Next Track"
                  }
                  whileHover={{
                    scale:
                      category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                        ? 1
                        : 1.1,
                  }}
                  disabled={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                  }
                >
                  <FontAwesomeIcon icon={faStepForward} />
                </motion.button>

                {/* Progress Bar */}
                <span className="text-xs text-gray-400 w-8 text-right shrink-0">
                  {formatTime(index === currentSongIndex ? currentTime : 0)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={index === currentSongIndex ? duration || 100 : music.duration || 100}
                  value={index === currentSongIndex ? currentTime : 0}
                  onChange={(e) => {
                    if (
                      category === "BOOK OF JAMES - ஞான மொழிகள்" &&
                      index !== 0
                    ) {
                      alert("This song will be available soon!");
                      return;
                    }
                    handleSeek(e);
                  }}
                  className={`flex-1 h-1 rounded-lg appearance-none cursor-pointer min-w-[60px] max-w-[120px] ${
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gray-600"
                  }`}
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 ${
                      ((index === currentSongIndex ? currentTime : 0) /
                        (index === currentSongIndex ? duration || 100 : music.duration || 100)) *
                      100
                    }%, #4b5563 ${
                      ((index === currentSongIndex ? currentTime : 0) /
                        (index === currentSongIndex ? duration || 100 : music.duration || 100)) *
                      100
                    }%)`,
                  }}
                  disabled={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                  }
                />
                <span className="text-xs text-gray-400 w-8 shrink-0">
                  {formatTime(music.duration || 0)}
                </span>

                {/* Shuffle Button */}
                <motion.button
                  onClick={() => {
                    if (
                      category === "BOOK OF JAMES - ஞான மொழிகள்" &&
                      index !== 0
                    ) {
                      alert("This song will be available soon!");
                      return;
                    }
                    handleShuffle();
                  }}
                  className={`p-1 sm:p-2 ${
                    shuffle ? "text-purple-400" : "text-gray-400"
                  } hover:text-white ${
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  title={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "Coming soon"
                      : shuffle
                      ? "Disable shuffle"
                      : "Enable shuffle"
                  }
                  whileHover={{
                    scale:
                      category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                        ? 1
                        : 1.1,
                  }}
                  disabled={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                  }
                >
                  <FontAwesomeIcon icon={faRandom} />
                </motion.button>

                {/* Playback Rate Menu */}
                <div className="relative">
                  <motion.button
                    onClick={() => {
                      if (
                        category === "BOOK OF JAMES - ஞான மொழிகள்" &&
                        index !== 0
                      ) {
                        alert("This song will be available soon!");
                        return;
                      }
                      togglePlaybackRateMenu(index);
                    }}
                    className={`text-gray-400 hover:text-white p-1 sm:p-2 ${
                      category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    title={
                      category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                        ? "Coming soon"
                        : "Playback speed"
                    }
                    whileHover={{
                      scale:
                        category === "BOOK OF JAMES - ஞான மொழிகள்" &&
                        index !== 0
                          ? 1
                          : 1.1,
                    }}
                    disabled={
                      category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                    }
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

                {/* Volume Controls */}
                <div className="relative flex items-center group">
                  <motion.button
                    onClick={() => {
                      if (
                        category === "BOOK OF JAMES - ஞான மொழிகள்" &&
                        index !== 0
                      ) {
                        return; // Don't show alert for volume control
                      }
                      toggleMute(index);
                    }}
                    className={`text-gray-400 hover:text-white ${
                      category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    whileHover={{
                      scale: 1.1,
                    }}
                    onMouseEnter={() => setHoveredVolumeIndex(index)}
                    onTouchStart={() => setHoveredVolumeIndex(index)}
                  >
                    <FontAwesomeIcon
                      icon={mutedTracks[index] ? faVolumeMute : faVolumeUp}
                    />
                  </motion.button>

                  {hoveredVolumeIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0.5 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0.5 }}
                      className={`
                        absolute left-full ml-2 flex items-center
                        ${window.innerWidth < 640 ? "bottom-full mb-2" : ""}
                      `}
                      onMouseLeave={() => setHoveredVolumeIndex(null)}
                      onTouchEnd={() => setHoveredVolumeIndex(null)}
                      style={{
                        width: "100px",
                        zIndex: 10,
                      }}
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={mutedTracks[index] ? 0 : volumes[index] || 0.7}
                        onChange={(e) => {
                          const newVolume = parseFloat(e.target.value);
                          handleVolumeChange(index, newVolume);
                          if (newVolume > 0 && mutedTracks[index]) {
                            setMutedTracks((prev) => ({
                              ...prev,
                              [index]: false,
                            }));
                          }
                        }}
                        className="w-3/4 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #8b5cf6 ${
                            (mutedTracks[index] ? 0 : volumes[index] || 0.7) *
                            100
                          }%, #4b5563 ${
                            (mutedTracks[index] ? 0 : volumes[index] || 0.7) *
                            100
                          }%)`,
                          outline: "none",
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-1/4 justify-end mt-2 sm:mt-0">
                <motion.button
                  onClick={() => toggleFavorite(music._id)}
                  className={`py-1 px-2 rounded-lg text-xs sm:text-sm flex items-center gap-2 ${
                    favorites[music._id]
                      ? "text-red-800 bg-red-500 bg-opacity-20"
                      : "text-gray-200 bg-gray-700"
                  } ${
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  whileHover={{
                    scale:
                      category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                        ? 1
                        : 1.05,
                  }}
                  disabled={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                  }
                >
                  <FontAwesomeIcon
                      icon={favorites[music._id] ? faHeartSolid : faHeartOutline}
                      size="xs"
                    />
                </motion.button>

                {/* Download button */}
                <motion.button
                  onClick={() => handleDownload(music, index)}
                  className={`bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-1 px-2 rounded-lg text-xs sm:text-sm flex items-center gap-2 ${
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  whileHover={{
                    scale:
                      category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                        ? 1
                        : 1.05,
                  }}
                  disabled={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                  }
                >
                  <FontAwesomeIcon icon={faDownload} size="xs" />
                  <span className="hidden sm:inline">Download</span>
                </motion.button>

                {/* Share button */}
                <motion.button
                  onClick={() => handleShare(music, index)}
                  className={`bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-1 px-2 rounded-lg text-xs sm:text-sm flex items-center gap-2 ${
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  whileHover={{
                    scale:
                      category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                        ? 1
                        : 1.05,
                  }}
                  disabled={
                    category === "BOOK OF JAMES - ஞான மொழிகள்" && index !== 0
                  }
                >
                  <FontAwesomeIcon icon={faShareAlt} size="xs" />
                  <span className="hidden sm:inline">Share</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

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