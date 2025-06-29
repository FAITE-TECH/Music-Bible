import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCalendar, HiClock } from 'react-icons/hi';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // In a real app, fetch from your API
                const mockPosts = [
                    {
                        id: 1,
                        title: "The Power of Music in Spiritual Growth",
                        excerpt: "Discover how music can enhance your spiritual journey and deepen your connection with scripture.",
                        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
                        date: "May 15, 2023",
                        author: "MusicBible Team",
                        category: "Spiritual Growth"
                    },
                    {
                        id: 2,
                        title: "New Album Release: Psalms in Melody",
                        excerpt: "Our latest album brings the Book of Psalms to life through beautiful musical arrangements.",
                        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
                        date: "June 2, 2023",
                        author: "MusicBible Team",
                        category: "Album News"
                    },
                    {
                        id: 3,
                        title: "How to Incorporate Music Bible in Daily Devotions",
                        excerpt: "Practical tips for using MusicBible to enrich your daily spiritual practice.",
                        image: "https://images.unsplash.com/photo-1501612780327-45045538702b",
                        date: "June 20, 2023",
                        author: "MusicBible Team",
                        category: "Devotional Tips"
                    }
                ];
                

                // Extract unique categories
                const uniqueCategories = ['All', ...new Set(mockPosts.map(post => post.category))];
                
                setPosts(mockPosts);
                setCategories(uniqueCategories);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const filteredPosts = selectedCategory === 'All' 
        ? posts 
        : posts.filter(post => post.category === selectedCategory);

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

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <motion.div
                                key={post.id}
                                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ y: -5 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Link to={`/blog/${post.id}`}>
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                        {post.featured && (
                                            <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm text-blue-400">{post.category}</span>
                                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                                                <HiCalendar className="text-xs" />
                                                <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        </div>
                                        <h2 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h2>
                                        <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400 flex items-center">
                                                <HiClock className="mr-1" />
                                                {post.readTime}
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