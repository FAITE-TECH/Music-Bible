import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiCalendar, HiClock } from "react-icons/hi";
import SEO from "../Components/SEO";

const BlogHeroSection = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-12 py-16"
  >
    <h1 className="text-3xl md:text-5xl py-2 font-bold mb-4 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] bg-clip-text text-transparent">
      MusicBible Blog
    </h1>
    <p className="text-gray-300 max-w-2xl mx-auto">
      Insights, news, and spiritual guidance through the power of music and
      scripture.
    </p>
  </motion.div>
);

const FilterTabs = ({ categories, selectedCategory, setSelectedCategory }) => (
  <div className="flex flex-wrap gap-2 justify-center mb-12">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => setSelectedCategory(category)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === category
            ? "bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);
const FeaturedSlideshow = ({
  featuredBlogs,
  getImageUrl,
  formatDate,
  estimateReadTime,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === featuredBlogs.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? featuredBlogs.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredBlogs.length]);

  if (!featuredBlogs.length) return null;

  return (
    <div className="relative max-w-5xl mx-auto mb-16 px-4">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">
        Featured Posts
      </h2>

      <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg min-h-[20rem] md:min-h-[24rem]">
        {/* Mobile/Tablet View - Stacked Layout */}
        <div className="md:hidden">
          {featuredBlogs.map((post, index) => (
            <motion.div
              key={post._id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
            >
              <Link to={`/blog/${post._id}`} className="block h-full">
                <div className="flex flex-col h-full">
                  {/* Image Section - Full width on mobile */}
                  <div className="h-48 w-full overflow-hidden">
                    {post.blogImage && (
                      <img
                        src={getImageUrl(post.blogImage)}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-4 flex-1 overflow-y-auto">
                    <div className="flex items-center gap-3 mb-3">
                      {post.authorImage && (
                        <img
                          src={getImageUrl(post.authorImage)}
                          alt={post.authorName || "Author"}
                          className="w-8 h-8 rounded-full object-cover border-2 border-[#0093FF]"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-200">
                          {post.authorName || "Unknown Author"}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <HiCalendar className="text-xs" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="text-xs text-blue-400">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {post.content.replace(/<[^>]*>/g, "").substring(0, 120)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 flex items-center">
                        <HiClock className="mr-1" />
                        {estimateReadTime(post.content)}
                      </span>
                      <span className="text-xs text-[#0093FF] hover:text-blue-300 transition-colors">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop View - Side-by-side Layout */}
        <div className="hidden md:block">
          {featuredBlogs.map((post, index) => (
            <motion.div
              key={post._id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
            >
              <Link to={`/blog/${post._id}`} className="block h-full">
                <div className="flex h-full">
                  {/* Image Section - Half width on desktop */}
                  <div className="w-1/2 h-full overflow-hidden">
                    {post.blogImage && (
                      <img
                        src={getImageUrl(post.blogImage)}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    )}
                  </div>
                  
                  {/* Content Section - Half width on desktop */}
                  <div className="w-1/2 p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      {post.authorImage && (
                        <img
                          src={getImageUrl(post.authorImage)}
                          alt={post.authorName || "Author"}
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#0093FF]"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-200">
                          {post.authorName || "Unknown Author"}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <HiCalendar className="text-xs" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-blue-400">
                        {post.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-3">{post.title}</h2>
                    <p className="text-gray-300 mb-4">
                      {post.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-sm text-gray-400 flex items-center">
                        <HiClock className="mr-1" />
                        {estimateReadTime(post.content)}
                      </span>
                      <span className="text-sm text-[#0093FF] hover:text-blue-300 transition-colors">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Navigation Arrows - Positioned differently for mobile */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-20"
        >
          &lt;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-20"
        >
          &gt;
        </button>

      </div>
    </div>
  );
};

const LatestPosts = ({
  posts,
  selectedCategory,
  getImageUrl,
  formatDate,
  estimateReadTime,
}) => {
  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto mb-16">
      <h2 className="text-2xl font-bold mb-6 text-white">Latest Articles</h2>
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
                      e.target.src = "/placeholder-image.jpg";
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
                <div className="flex items-center gap-3 mb-4">
                  {post.authorImage && (
                    <img
                      src={getImageUrl(post.authorImage)}
                      alt={post.authorName || "Author"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#0093FF]"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-avatar.jpg";
                      }}
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-200">
                      {post.authorName || "Unknown Author"}
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
                <h2 className="text-xl font-bold mb-3 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {post.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
                </p>
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
    </div>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState(null);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

   useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const postsResponse = await fetch("/api/blog/get?showAll=true");
        if (!postsResponse.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await postsResponse.json();
        const allPosts = data.blogs || [];
        
        // Sort by createdAt in descending order (newest first)
        const sortedPosts = [...allPosts].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        const featuredOnly = sortedPosts.filter((post) => post.isFeatured);
        const uniqueCategories = [
          "All",
          ...new Set(sortedPosts.map((post) => post.category)),
        ];

        setPosts(sortedPosts); // Use the sorted array
        setFeaturedBlogs(featuredOnly);
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const estimateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `http://localhost:3000${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white pt-24 pb-12 px-4 md:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white pt-24 pb-12 px-4 md:px-8 flex flex-col items-center justify-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white rounded-full hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="aMusicBible Blog - Christian Spiritual Insights & Faith Articles"
        description="Read inspiring Christian blog posts, spiritual insights, and faith-based articles on aMusicBible. Discover biblical wisdom, worship guidance, and spiritual growth content for your Christian journey through music and faith."
        keywords="aMusicBible blog, Christian blog, spiritual articles, faith blog, biblical insights, Christian wisdom, worship guidance, spiritual growth, Christian lifestyle, devotional articles, faith stories"
        url="/blog"
        schema={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "aMusicBible Blog",
          "description": "Christian blog with spiritual insights and faith-based articles from aMusicBible",
          "url": "https://amusicbible.com/blog",
          "author": {
            "@type": "Organization",
            "name": "aMusicBible"
          },
          "publisher": {
            "@type": "Organization",
            "name": "FAITE (PVT) Ltd",
            "url": "http://www.faite.tech/"
          }
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white pt- pb-12 px-4 md:px-8">
      <BlogHeroSection />

      {featuredBlogs.length > 0 && (
        <FeaturedSlideshow
          featuredBlogs={featuredBlogs}
          getImageUrl={getImageUrl}
          formatDate={formatDate}
          estimateReadTime={estimateReadTime}
        />
      )}

      <FilterTabs
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <LatestPosts
        posts={posts}
        selectedCategory={selectedCategory}
        getImageUrl={getImageUrl}
        formatDate={formatDate}
        estimateReadTime={estimateReadTime}
      />
      </div>
    </>
  );
};

export default Blog;
