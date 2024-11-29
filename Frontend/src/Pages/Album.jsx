import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export default function Album() {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const audioRefs = useRef({});
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category/getAlbum');
        const data = await res.json();

        if (!res.ok) {
          throw new Error('Failed to load categories');
        } else {
          setCategories(data);
          setCategory(data[0]?.albumName || '');
        }
      } catch (error) {
        setError('Error fetching categories');
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const fetchMusicByCategory = async () => {
    if (!category) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/music/category?category=${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch music data');
      }
      const data = await response.json();
      setMusicList(data.music);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusicByCategory();
  }, [category]);

  const handleAudioEnded = (currentIndex) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < musicList.length) {
      const nextAudio = audioRefs.current[musicList[nextIndex]._id];
      if (nextAudio) {
        nextAudio.play().catch((error) => console.error('Autoplay error:', error));
      }
    }
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

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Intersection Observer to detect when cards are in view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cardIndex = cardRefs.current.indexOf(entry.target);
          entry.target.classList.add('rotate');
          // Stop observing the card after it has animated
          observer.unobserve(entry.target);
        }
      });
    });

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, [musicList]);

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

  const selectedAlbum = categories.find((cat) => cat.albumName === category) || {};

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="container mx-auto p-4 bg-black"
    >
      {/* Category Section */}
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
        {/* Category Image Slide from Left */}
        <motion.div 
          className="w-1/4 p-4"
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 50, duration: 1.8 }} 
        >
          <img
            src={selectedAlbum.image || 'https://via.placeholder.com/300'} 
            alt={selectedAlbum.albumName}
            className="w-full h-auto object-cover rounded-lg"
          />
        </motion.div>

        {/* Category Details Slide from Right */}
        <motion.div 
          className="w-3/4 flex flex-col mt-3"
          initial={{ x: '100vw' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 50, duration: 1.8 }}
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-300">{selectedAlbum.albumName}</h2>
          <p className="text-gray-100">{selectedAlbum.description}</p>
          <div className="flex mt-4 gap-4">
            <motion.button
              onClick={handleDownload}
              className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Download Songs Below
            </motion.button>
            <motion.button
              onClick={handleAlbumShare}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
              Share Album
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Music Cards with Rotation Animation */}
      <h1 className="text-3xl font-bold text-center mb-6">Music</h1>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-black"
      >
        {musicList.length > 0 ? (
          musicList.map((music, index) => (
            <motion.div
              key={music._id}
              ref={(el) => (cardRefs.current[index] = el)} // Store reference to each card
              className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-black via-purple-950 to-black text-white transform transition-transform duration-500" // Added transform and transition
              initial={{ rotateY: 90, opacity: 0 }} // Start with rotateY and opacity
              animate={{ rotateY: 0, opacity: 1 }} // Animate to normal position
              transition={{ delay: index * 0.2, duration: 0.5 }} 
            >
              <h2 className="text-xl font-semibold mb-2">{music.title}</h2>
              <img
                src={music.image}
                alt={music.title}
                className="w-full h-60 object-cover rounded-lg mb-4"
              />
              <div className="flex justify-between items-center">
                <motion.button
                  onClick={() => handleDownload(music)}
                  className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Download
                </motion.button>
                <motion.button
                  onClick={() => handleShare(music)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                  Share
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-white text-lg">No music available for this category.</p>
        )}
      </motion.div>
    </motion.div>
  );
}
