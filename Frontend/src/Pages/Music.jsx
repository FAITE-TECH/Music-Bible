import React, { useState, useEffect } from 'react';

export default function Music() {
  const [musicList, setMusicList] = useState([]);
  const [filteredMusicList, setFilteredMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(''); 


  const fetchMusic = async () => {
    try {
      const response = await fetch('/api/music/music');
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
    fetchMusic();
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-black via-purple-950 to-black ">
      <h1 className="text-3xl font-bold text-center mb-6">All Music</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          className="w-100 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by song name..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Album Dropdown */}
      <div className="mb-6 ">
        <select
          className="w-100 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedAlbum}
          onChange={handleAlbumChange}
        >
          <option value="all">All Albums</option>
          <option value="Album1">Album 1</option>
          <option value="Album2">Album 2</option>
          <option value="Album3">Album 3</option>
          
        </select>
      </div>

      {/* Music List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 bg-gradient-to-r from-black via-purple-950 to-black">
        {filteredMusicList.length > 0 ? (
          filteredMusicList.map((music) => (
            <div key={music._id} className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-black via-purple-950 to-black text-white ">
              <h2 className="text-xl font-semibold mb-2">{music.title}</h2>
              <img
                src={music.image}
                alt={music.title}
                className="w-full h-60 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-100 mb-6">{music.description}</p>
              <audio controls className="w-full">
                <source src={music.music} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">No music found</p>
        )}
      </div>
    </div>
  );
}
