import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCalendar, HiClock } from 'react-icons/hi';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch posts from your API
                const response = await fetch('/api/blog/get');
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch posts');
                }

                // Extract unique categories from the fetched posts
                const uniqueCategories = ['All', ...new Set(data.blogs.map(post => post.category))];
                
                setPosts(data.blogs);
                setCategories(uniqueCategories);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError(err.message || 'Failed to load blog posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const filteredPosts = selectedCategory === 'All' 
        ? posts 
        : posts.filter(post => post.category === selectedCategory);

    // Function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Function to estimate read time
    const estimateReadTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
    };

    // Function to get complete image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        // Check if it's already a full URL
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        // Prepend the base URL for local images
        return `http://localhost:3000${imagePath}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl py-2 font-bold mb-4 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] bg-clip-text text-transparent">
                        MusicBible Blog
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Insights, news, and spiritual guidance through the power of music and scripture.
                    </p>
                </motion.div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 justify-center mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                selectedCategory === category
                                    ? 'bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {error ? (
                    <div className="text-center py-12">
                        <p className="text-red-400">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <motion.div
                                key={post._id}
                                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ y: -5 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Link to={`/blog/${post._id}`}>
                                    <div className="h-48 overflow-hidden relative">
                                        {post.blogImage && (
                                            <img
                                                src={getImageUrl(post.blogImage)}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                        )}
                                        {post.isFeatured && (
                                            <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        {/* Author section */}
                                        <div className="flex items-center gap-3 mb-4">
                                            {post.authorImage && (
                                                <img 
                                                    src={getImageUrl(post.authorImage)} 
                                                    alt={post.authorName || 'Author'}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-[#0093FF]"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/placeholder-avatar.jpg';
                                                    }}
                                                />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-200">
                                                    {post.authorName || 'Unknown Author'}
                                                </p>
                                                <div className="flex items-center space-x-2 text-xs text-gray-400">
                                                    <HiCalendar className="text-xs" />
                                                    <span>{formatDate(post.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm text-blue-400">{post.category}</span>
                                        </div>
                                        <h2 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h2>
                                        <p className="text-gray-300 mb-4 line-clamp-3">{post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400 flex items-center">
                                                <HiClock className="mr-1" />
                                                {estimateReadTime(post.content)}
                                            </span>
                                            <span className="text-sm text-[#0093FF] hover:text-blue-300 transition-colors">
                                                Read More →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;