import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { HiArrowLeft, HiCalendar, HiUser, HiTag } from "react-icons/hi";
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin } from "react-icons/fa";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [nextPostId, setNextPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Function to get complete image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `http://localhost:3000${imagePath}`;
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch blog post
        const response = await fetch(`/api/blog/get/${id}`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Blog post not found"
              : "Failed to fetch blog post"
          );
        }

        const data = await response.json();
        setPost(data);

        // Fetch next post ID
        try {
          const nextResponse = await fetch(`/api/blog/next/${id}`);
          if (nextResponse.ok) {
            const nextData = await nextResponse.json();
            setNextPostId(nextData.nextId);
          }
        } catch (nextError) {
          console.error("Error fetching next post ID:", nextError);
        }

        // Increment view count
        try {
          await fetch(`/api/blog/${id}/view`, {
            method: "POST",
          });
        } catch (viewError) {
          console.error("Error incrementing view count:", viewError);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const sharePost = (platform) => {
    const url = window.location.href;
    const text = `Check out this article: ${post?.title}`;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            url
          )}&title=${encodeURIComponent(post?.title)}`,
          "_blank"
        );
        break;
      default:
        break;
    }
  };

  const handleNextArticle = () => {
    if (nextPostId) {
      navigate(`/blog/${nextPostId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white pt-20 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-blue-400">Loading article...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-block mb-6"
            >
              <svg
                className="w-16 h-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Error Loading Article</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">{error}</p>
            <Link
              to="/blog"
              className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white px-8 py-3 rounded-full font-medium inline-block"
            >
              Explore Other Articles
            </Link>
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
            <div className="mb-14">
              <div className="flex items-center space-x-4 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900 text-blue-300">
                  <HiTag className="mr-1" />
                  {post.category}
                </span>
                <span className="text-gray-400 text-sm flex items-center">
                  <HiCalendar className="mr-1" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-gray-400 text-sm flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  5 min read
                </span>
              </div>

              <motion.h1
                className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] bg-clip-text text-transparent mb-3"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                {post.title}
              </motion.h1>

              <div className="flex items-center space-x-4 pt-5">
                <img
                  src={getImageUrl(post.authorImage)}
                  alt={post.authorName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-avatar.jpg";
                  }}
                />
                <div>
                  <p className="font-medium">{post.authorName}</p>
                </div>
              </div>
            </div>

            {/* Content section - blog image on left, text on right */}
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              {/* Blog image on left */}
              <div className="lg:w-1/2">
                <div className="rounded-xl overflow-hidden relative">
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
                    src={getImageUrl(post.blogImage)}
                    alt={post.title}
                    className={`w-full h-auto object-cover transition-opacity duration-500 ${
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg";
                      setIsImageLoaded(true);
                    }}
                    initial={{ scale: 0.98 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Content on right */}
              <div
                className="prose prose-invert lg:w-1/2"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Share buttons */}
            <div className="mb-12">
              <h3 className="text-lg font-medium mb-4">Share this post</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => sharePost("facebook")}
                  className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <FaFacebook size={18} />
                </button>
                <button
                  onClick={() => sharePost("twitter")}
                  className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <FaTwitter size={18} />
                </button>
                <button
                  onClick={() => sharePost("whatsapp")}
                  className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                  aria-label="Share on WhatsApp"
                >
                  <FaWhatsapp size={18} />
                </button>
                <button
                  onClick={() => sharePost("linkedin")}
                  className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <FaLinkedin size={18} />
                </button>
              </div>
            </div>

            {/* Navigation */}
            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 border-t border-gray-700">
              <Link
                to="/blog"
                className="inline-flex items-center bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white px-4 py-2 rounded-full font-medium"
              >
                Back to Blog
              </Link>
              <button
                onClick={handleNextArticle}
                disabled={!nextPostId}
                className={`inline-flex items-center px-4 py-2 rounded-full font-medium transition-colors ${
                  nextPostId
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next Blog
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
              <svg
                className="w-16 h-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              The article you're looking for couldn't be found.
            </p>
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
