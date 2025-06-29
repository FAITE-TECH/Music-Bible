import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { HiArrowLeft, HiCalendar, HiUser, HiTag } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin } from 'react-icons/fa';

const BlogPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Enhanced mock data with more realistic content
                const mockPosts = {
                    1: {
                        id: 1,
                        title: "The Transformative Power of Music in Spiritual Growth",
                        content: `
                            <p class="mb-6">Music has always been the soul's language, transcending cultural and religious boundaries to touch the deepest parts of our spiritual being. In Christian tradition, music serves as a divine bridge between heaven and earth, a powerful medium for worship, meditation, and communion with God's living word.</p>
                            
                            <div class="bg-gray-800 rounded-xl p-6 mb-8 border-l-4 border-blue-500">
                                <blockquote class="text-xl italic">
                                    "Let the word of Christ dwell in you richly in all wisdom; teaching and admonishing one another in psalms and hymns and spiritual songs, singing with grace in your hearts to the Lord."
                                    <footer class="mt-4 text-blue-400">— Colossians 3:16</footer>
                                </blockquote>
                            </div>
                            
                            <h2 class="text-2xl font-bold mb-4 mt-10 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] bg-clip-text text-transparent">The Science Behind Sacred Sounds</h2>
                            
                            <p class="mb-6">At MusicBible, our research has revealed profound benefits when scripture intertwines with melody:</p>
                            
                            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <li class="flex items-start">
                                    <span class="bg-blue-500 rounded-full p-1 mr-3 mt-1">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </span>
                                    <span>300% faster scripture memorization compared to reading alone</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="bg-blue-500 rounded-full p-1 mr-3 mt-1">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </span>
                                    <span>Deeper emotional engagement with biblical texts</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="bg-blue-500 rounded-full p-1 mr-3 mt-1">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </span>
                                    <span>Enhanced focus during prayer sessions</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="bg-blue-500 rounded-full p-1 mr-3 mt-1">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </span>
                                    <span>Reduced stress levels during devotional time</span>
                                </li>
                            </ul>
                            
                            <div class="bg-gray-800 rounded-xl p-6 mb-8 overflow-hidden relative">
                                <div class="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent opacity-30"></div>
                                <h3 class="text-xl font-bold mb-3 relative z-10">Neurological Benefits</h3>
                                <p class="relative z-10">Recent fMRI studies show musical scripture activates both left (analytical) and right (creative) brain hemispheres simultaneously, creating optimal conditions for spiritual learning and retention.</p>
                            </div>
                            
                            <h2 class="text-2xl font-bold mb-4 mt-10 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] bg-clip-text text-transparent">Practical Applications</h2>
                            
                            <p class="mb-6">Try these techniques to incorporate musical scripture into your daily practice:</p>
                            
                            <div class="grid gap-6 mb-10">
                                <div class="bg-gray-800 p-5 rounded-lg border-l-4 border-blue-400">
                                    <h4 class="font-bold text-lg mb-2">Morning Devotion</h4>
                                    <p>Start your day with our "Psalms at Dawn" playlist to set a worshipful tone.</p>
                                </div>
                                <div class="bg-gray-800 p-5 rounded-lg border-l-4 border-green-400">
                                    <h4 class="font-bold text-lg mb-2">Scripture Memorization</h4>
                                    <p>Use our verse-specific tracks to internalize key passages.</p>
                                </div>
                                <div class="bg-gray-800 p-5 rounded-lg border-l-4 border-purple-400">
                                    <h4 class="font-bold text-lg mb-2">Family Worship</h4>
                                    <p>Engage children with our interactive Bible story songs.</p>
                                </div>
                            </div>
                            
                            <div class="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] p-0.5 rounded-xl mb-8">
                                <div class="bg-gray-900 rounded-xl p-6">
                                    <h3 class="text-xl font-bold mb-3">Testimonial</h3>
                                    <p class="italic mb-4">"After using MusicBible for just three weeks, I've memorized more scripture than in the previous three years. The melodies make the words come alive!"</p>
                                    <p class="text-blue-400">— Sarah J., Ministry Leader</p>
                                </div>
                            </div>
                        `,
                        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                        date: "May 15, 2023",
                        author: "Dr. Michael Chen",
                        authorTitle: "Worship Studies Director",
                        authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
                        category: "Spiritual Growth",
                        readTime: "8 min read",
                        tags: ["Worship", "Neuroscience", "Devotion"]
                    }
                };
                
                setTimeout(() => {
                    setPost(mockPosts[id]);
                    setLoading(false);
                }, 800); // Simulate network delay
            } catch (error) {
                console.error("Error fetching blog post:", error);
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const sharePost = (platform) => {
        const url = window.location.href;
        const text = `Check out this article: ${post?.title}`;
        
        switch(platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(post?.title)}`, '_blank');
                break;
            default:
                break;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white pt-20 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                        <p className="text-blue-400">Loading divine inspiration...</p>
                    </div>
                ) : post ? (
                    <motion.article
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Back button */}
                        <Link 
                            to="/blog"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
                        >
                            <HiArrowLeft className="mr-2" />
                            Back to Blog
                        </Link>

                        {/* Header section */}
                        <div className="mb-10">
                            <div className="flex items-center space-x-4 mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900 text-blue-300">
                                    <HiTag className="mr-1" />
                                    {post.category}
                                </span>
                                <span className="text-gray-400 text-sm flex items-center">
                                    <HiCalendar className="mr-1" />
                                    {post.date}
                                </span>
                                <span className="text-gray-400 text-sm flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    {post.readTime}
                                </span>
                            </div>
                            
                            <motion.h1 
                                className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] bg-clip-text text-transparent"
                                initial={{ y: -20 }}
                                animate={{ y: 0 }}
                            >
                                {post.title}
                            </motion.h1>
                            
                            <div className="flex items-center space-x-4">
                                <img 
                                    src={post.authorImage} 
                                    alt={post.author} 
                                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                                />
                                <div>
                                    <p className="font-medium">{post.author}</p>
                                    <p className="text-sm text-gray-400">{post.authorTitle}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Featured image with loading state */}
                        <div className="mb-10 rounded-xl overflow-hidden relative">
                            {!isImageLoaded && (
                                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                    <div className="animate-pulse flex space-x-4">
                                        <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                                        <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                                        <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                                    </div>
                                </div>
                            )}
                            <motion.img 
                                src={post.image} 
                                alt={post.title} 
                                className={`w-3/4 h-3/4 mx-auto object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={() => setIsImageLoaded(true)}
                                initial={{ scale: 0.98 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.8 }}
                            />
                        </div>
                        
                        {/* Content with enhanced styling */}
                        <div 
                            className="prose prose-invert max-w-none mb-12"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-10">
                            {post.tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 rounded-full text-sm bg-gray-800 text-gray-300">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        
                        {/* Share buttons */}
                        <div className="mb-12">
                            <h3 className="text-lg font-medium mb-4">Share this post</h3>
                            <div className="flex space-x-4">
                                <button 
                                    onClick={() => sharePost('facebook')}
                                    className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                                    aria-label="Share on Facebook"
                                >
                                    <FaFacebook size={18} />
                                </button>
                                <button 
                                    onClick={() => sharePost('twitter')}
                                    className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                                    aria-label="Share on Twitter"
                                >
                                    <FaTwitter size={18} />
                                </button>
                                <button 
                                    onClick={() => sharePost('whatsapp')}
                                    className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                                    aria-label="Share on WhatsApp"
                                >
                                    <FaWhatsapp size={18} />
                                </button>
                                <button 
                                    onClick={() => sharePost('linkedin')}
                                    className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                                    aria-label="Share on LinkedIn"
                                >
                                    <FaLinkedin size={18} />
                                </button>
                            </div>
                        </div>
                        
                        {/* Author bio */}
                        <div className="bg-gray-800 rounded-xl p-6 mb-12 border-l-4 border-blue-500">
                            <div className="flex items-start space-x-4">
                                <img 
                                    src={post.authorImage} 
                                    alt={post.author} 
                                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                                />
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{post.author}</h3>
                                    <p className="text-blue-400 mb-3">{post.authorTitle}</p>
                                    <p className="text-gray-300">Dr. Chen is a worship studies scholar with over 15 years of experience researching the intersection of music, neuroscience, and spiritual formation. His work has been published in numerous theological and scientific journals.</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Navigation */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-gray-700">
                            <Link 
                                to="/blog"
                                className="flex-1 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white px-6 py-3 rounded-full font-medium text-center"
                            >
                                Back to Blog
                            </Link>
                            <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
                                Next Article
                            </button>
                        </div>
                    </motion.article>
                ) : (
                    <div className="text-center py-20">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="inline-block mb-6"
                        >
                            <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </motion.div>
                        <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">The spiritual insight you're seeking isn't available at this moment. Perhaps it's still being composed in heaven's choir.</p>
                        <Link 
                            to="/blog"
                            className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white px-8 py-3 rounded-full font-medium inline-block"
                        >
                            Explore Other Articles
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPost;