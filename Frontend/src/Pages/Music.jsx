import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt, faDownload } from '@fortawesome/free-solid-svg-icons';

export default function Music() {
  const [musicList, setMusicList] = useState([]);
  const [filteredMusicList, setFilteredMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [currentSongIndex, setCurrentSongIndex] = useState(null); // Track current song index
  const audioRef = useRef(null); // Ref for audio element

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchMusic = async () => {
    try {
      const response = await fetch(`/api/music/music`);
      if (!response.ok) {
        throw new Error('Failed to fetch music data');
      }
      const data = await response.json();
      setMusicList(data.music);
      setFilteredMusicList(data.music);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusic(); // Fetch on component load
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
      const link = document.createElement('a');
      link.href = music.music;
      link.download = music.title;
      link.click();
    } else {
      navigate('/sign-in');
    }
  };

  const handleShare = (music) => {
    if (navigator.share) {
      navigator.share({
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
    // Move to the next song, wrap around if needed
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
    // Set the clicked song as the current song
    setCurrentSongIndex(index);
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

      {/* Search and Filter Section */}
      <div className="flex justify-end mb-6 space-x-4">
        {/* Search Bar */}
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by song name..."
          value={searchTerm}
          onChange={handleSearch}
        />

        {/* Album Dropdown */}
        <select
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedAlbum}
          onChange={handleAlbumChange}
        >
          <option value="all">All Albums</option>
          <option value="Album1">VAAZHVU THARUM VAARTHAIGAL</option>
          <option value="Album2">BOOK OF ECCLESIASTES</option>
          <option value="Album3">BOOK OF PHILIPPIANS</option>
          <option value="Album4">BOOKS OF THE GOSPEL</option>
        </select>
      </div>

      {/* Music List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-black">
        {filteredMusicList.length > 0 ? (
          filteredMusicList.map((music, index) => (
            <div
              key={music._id}
              className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-black via-purple-950 to-black text-white ${
                index === currentSongIndex ? 'border-2 border-purple-500' : ''
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">{music.title}</h2>
              <img
                src={music.image}
                alt={music.title}
                className="w-full h-60 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-100 mb-6">{music.description}</p>
              {/* Conditionally render the audio element for the current song */}
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

              {/* Button Container */}
              <div className="flex justify-between mt-4">
                {/* Share Button */}
                <button
                  onClick={() => handleShare(music)}
                  className="flex items-center bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                  Share
                </button>
                {/* Download Button */}
                <button
                  onClick={() => handleDownload(music)}
                  className="flex items-center bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  {currentUser ? 'Download' : 'Sign in to Download'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">No music found</p>
        )}
      </div>
    </div>
  );
}
