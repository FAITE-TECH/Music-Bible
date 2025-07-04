import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  HiSearch,
  HiOutlineMusicNote,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { Tooltip } from "flowbite-react";
import ReactAudioPlayer from "react-audio-player";

export default function DashMyPurchases() {
  const { currentUser } = useSelector((state) => state.user);
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch(
          `/api/music-purchase/getUserPurchases/${currentUser._id}?searchTerm=${searchTerm}&page=${currentPage}&limit=10`
        );
        const data = await res.json();
        if (res.ok) {
          setPurchases(data.purchases);
          setTotalPurchases(data.totalPurchases);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser?._id) {
      fetchPurchases();
    }
  }, [currentUser, searchTerm, currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePlaySong = (index) => {
    if (currentSongIndex === index) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
  };

  const showFullImage = (imageUrl) => {
    setExpandedImage(imageUrl);
  };

  const closeFullImage = () => {
    setExpandedImage(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white p-4 md:p-8"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] bg-clip-text text-transparent">
          <span className="block md:inline">My </span>
          <span className="block md:inline">Music Purchases</span>
        </h1>
        <p className="text-gray-400 mt-2">
          All the music you've purchased and downloaded
        </p>
      </motion.div>

      {/* Search and Stats Section */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
      >
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search your purchases..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 w-full rounded-xl  "
          />
        </div>

        <div className="flex items-center gap-2 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]  px-4 py-2 rounded-lg shadow-lg">
          <HiOutlineMusicNote className="h-5 w-5 text-blue-300" />
          <span className="font-medium text-blue-100">
            Total Purchases: {totalPurchases}
          </span>
        </div>
      </motion.div>

      {/* Purchases Grid */}
      {purchases.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {purchases.map((purchase, index) => (
              <motion.div
                key={purchase._id}
                className={`p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-black via-[#0093FF] to-black border border-gray-800 flex flex-col h-full ${
                  index === currentSongIndex ? "ring-2 ring-blue-500" : ""
                }`}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {/* Album Art with Hover Effect - Updated */}
                <div
                  className="flex justify-center mb-3 cursor-pointer relative"
                  onClick={() => showFullImage(purchase.musicImage)}
                >
                  <div className="w-full aspect-square overflow-hidden rounded-lg">
                    <img
                      src={
                        purchase.musicImage || "https://via.placeholder.com/500"
                      }
                      alt={purchase.musicTitle}
                      className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <HiOutlineInformationCircle className="text-white text-2xl bg-black bg-opacity-50 rounded-full p-1" />
                  </div>
                </div>

                {/* Purchase Info */}
                <div className="flex-grow">
                  <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
                    {purchase.musicTitle}
                  </h3>

                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-gray-400 text-xs">Order ID:</span>
                    <Tooltip content={purchase.orderId} placement="top">
                      <span className="text-gray-300 text-xs font-mono cursor-help">
                        {purchase.orderId.substring(0, 6)}...
                      </span>
                    </Tooltip>
                  </div>

                  <p className="text-gray-400 text-xs mb-2">
                    Purchased: {formatDate(purchase.createdAt)}
                  </p>
                  <p className="text-blue-400 font-bold text-sm">
                    ${purchase.price.toFixed(2)}
                  </p>
                </div>

                {/* Audio Player */}
                {index === currentSongIndex && (
                  <div className="mt-2">
                    <ReactAudioPlayer
                      src={purchase.musicFile}
                      controls
                      className="w-full h-8 bg-gray-800 rounded"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-2">
                    <Tooltip content="Download" placement="top">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          window.open(purchase.musicFile, "_blank")
                        }
                        className="text-gray-300 hover:text-blue-400"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </motion.button>
                    </Tooltip>
                    <span className="text-xs text-gray-400">
                      Direct Download
                    </span>
                  </div>

                  <Tooltip
                    content={
                      currentSongIndex === index && isPlaying ? "Pause" : "Play"
                    }
                    placement="top"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePlaySong(index)}
                      className={`rounded-full p-2 w-8 h-8 flex items-center justify-center ${
                        currentSongIndex === index && isPlaying
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={
                          currentSongIndex === index && isPlaying
                            ? faPause
                            : faPlay
                        }
                        className="text-xs"
                      />
                    </motion.button>
                  </Tooltip>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <motion.div
            className="flex justify-between items-center px-6 py-4   rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-lg border border-gray-400 text-gray-300 ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-800"
              }`}
            >
              Previous
            </motion.button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-lg border border-gray-400 text-gray-300 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-800"
              }`}
            >
              Next
            </motion.button>
          </motion.div>
        </>
      ) : (
        <motion.div
          className="w-full py-16 text-center bg-gray-900 rounded-lg border border-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-lg text-gray-400">
            {searchTerm
              ? "No matching purchases found"
              : "You haven't purchased any music yet"}
          </p>
        </motion.div>
      )}

      {/* Full Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeFullImage}
        >
          <div className="relative max-w-4xl max-h-screen">
            <img
              src={expandedImage}
              alt="Expanded album art"
              className="max-w-full max-h-screen object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
              onClick={closeFullImage}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
