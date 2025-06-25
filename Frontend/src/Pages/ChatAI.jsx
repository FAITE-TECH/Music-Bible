import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/Logo/newlogo.png";
import { motion } from "framer-motion";
import searchIcon from "../assets/Logo/circleArrow.png";
import shareIcon from "../assets/Logo/shareIcon.png";
import copyIcon from "../assets/Logo/copyIcon.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const ChatAI = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareClicked, setSharedClicked] = useState(false);
  const [copyClicked, setCopyClicked] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (shareClicked) {
      setTimeout(() => {
        setSharedClicked(false);
      }, 1000);
    }
  }, [shareClicked]);

  useEffect(() => {
    if (copyClicked) {
      setTimeout(() => {
        setCopyClicked(false);
      }, 1000);
    }
  }, [copyClicked]);

  const sendQuery = async () => {
    try {
      if (query !== "") {
        setLoading(true);
        setAnswer("");
        const response = await fetch("/api/ai/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ question: query }),
        });
        if (response.ok) {
          const data = await response.json();
          setAnswer(data);
          setLoading(false);
          setQuery("");
        }
      }
    } catch (error) {
      setAnswer(error.message);
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Bible AI",
          url: "https://amusicbible.com/bible/ai",
        })
        .then(() => console.log('Link shared successfully'))
        .catch((error) => console.error('Error sharing link:', error));
    } else {
      alert('Web Share API not supported in your browser.');
    }
  };

  const handleBuyNow = async () => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    setIsPurchasing(true);
    try {
      const response = await fetch('http://localhost:3000/api/aistripe/create-ai-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: currentUser._id
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No URL returned from Stripe session creation');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleContactUs = () => {
    navigate('/contactus');
  };

  const ParseText = (text) => {
    const formatText = (text) => {
      const sentences = text.match(/[^.!?]+[.!?]/g) || [text];
      const paragraphs = [];

      for (let i = 0; i < sentences.length; i += 2) {
        paragraphs.push(sentences.slice(i, i + 2).join(' '));
      }

      return paragraphs;
    };

    return (
      <div className="space-y-4 p-4">
        {formatText(text).map((para, index) => (
          <p key={index} className="text-md leading-relaxed">{para}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="max-h-screen overflow-hidden lg:bg-[url(../assets/bg5.png)] md:bg-[url(../assets/bg-md.png)] bg-[url(../assets/bg-sm.png)] bg-cover bg-center">
        {/* Header */}
        <div className="flex item-center text-3xl text-gray-800 px-4 md:px-16 py-8">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 60, duration: 1.6 }}
          >
            <div className="w-12 h-12">
              <img src={logo} alt="logo" className="max-w-100" />
            </div>
            <h1 className="text-3xl text-gray-800 bg-transparent">
              aMusicBible/AI
            </h1>
          </motion.div>
        </div>

        {/* Responsive Info Container */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-6 lg:top-12 lg:right-8 w-40 sm:w-48 md:w-56 p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-b from-gray-900 to-black shadow-xl text-white text-xs sm:text-sm md:text-base font-light z-20 flex flex-col items-center text-center">
          <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-1">Available</h3>
          <h3 className="text-xs sm:text-sm md:text-xl text-yellow-400 font-semibold mb-1">Bible AI API KEY</h3>
          <p className="text-xs sm:text-sm md:text-base mb-2 sm:mb-3 leading-snug">Chatbox available in English</p>
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0 w-full justify-center">
            <button 
              onClick={handleBuyNow} 
              disabled={isPurchasing}
              className="px-2 py-1 sm:px-3 text-xs sm:text-sm bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center"
            >
              {isPurchasing ? (
                'Processing...'
              ) : (
                <>
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-1" />
                  Buy Now ($500)
                </>
              )}
            </button>
            <button 
              onClick={handleContactUs} 
              className="px-2 py-1 sm:px-3 text-xs sm:text-sm bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white rounded-full font-semibold hover:opacity-90 transition"
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-start">
          <div className="lg:w-1/5 mt-36 hidden lg:block"></div>
          
          <div className="lg:w-3/5 w-full z-[9999]">
            <div className="text-gray-500 mb-6 lg:ml-36 md:ml-36 ml-12 text-sm md:text-base">
              Ask your thoughts
            </div>
            
            <div className="flex flex-col items-center min-h-screen px-4 sm:px-0">
              {/* Search Input */}
              <div className="flex justify-between w-full max-w-lg md:max-w-xl lg:max-w-2xl">
                <div className="relative flex flex-1">
                  <input
                    type="text"
                    className="px-4 py-2 w-full h-14 text-black rounded-full border border-gray-300 focus:outline-none shadow-gray-600 bg-transparent shadow-lg placeholder-gray-400"
                    placeholder="How to be a good Christian?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendQuery();
                      }
                    }}
                  />
                </div>
                <div className="w-14 h-14 flex justify-end mt-3 -ml-16 z-[999] cursor-pointer">
                  <img 
                    src={searchIcon} 
                    alt="send" 
                    className="w-14 h-12 -mt-2 hover:opacity-80 transition" 
                    onClick={sendQuery}
                  />
                </div>
              </div>
              
              {/* App Store Buttons */}
              <div className="flex gap-4 mt-6 mb-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.faite.project.music_bible_music_player&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png"
                      alt="Google Play"
                      className="w-[110px] h-auto mt-0.5"
                    />
                  </motion.div>
                </a>
                <a
                  href="https://apps.apple.com/app/id6618135650"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <img
                      src="https://p7.hiclipart.com/preview/422/842/453/app-store-android-google-play-get-started-now-button.jpg"
                      alt="Apple Store"
                      className="w-[104px] h-auto"
                    />
                  </motion.div>
                </a>
              </div>
              
              {/* Answer Section */}
              <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl">
                <p className="text-gray-500 w-full ml-4 text-sm md:text-base">Answer</p>
                <div className="mt-2 p-4 border-t shadow-2xl relative h-screen flex flex-col justify-between shadow-black bg-gray-50 rounded-t-[50px]">
                  {loading ? (
                    <div className="type_loader_container ml-4">
                      <div className="typing_loader"></div>
                    </div>
                  ) : (
                    <div className="ml-4 text-black">............</div>
                  )}
                  
                  <div className="mt-2 text-gray-800 font-medium flex-grow break-words">
                    <div className="h-[400px] overflow-y-auto text-gray-600">
                      {answer && answer!=="" && ParseText(answer)}
                    </div>
                  </div>
                  
                  <div className="absolute top-3 right-4 lg:right-8 flex space-x-2">
                    {copyClicked && (
                      <div className="text-gray-500 mx-10 animate-view-content text-xs sm:text-sm">
                        Text copied
                      </div>
                    )}
                    <button
                      className="text-gray-500 hover:text-gray-700 text-2xl hover:scale-110 transition"
                      onClick={handleShare}
                      aria-label="Share"
                    >
                      <div className="w-8 h-8 flex items-center">
                        <img src={shareIcon} alt="Share" className="" />
                      </div>
                    </button>
                    <button
                      className="text-gray-500 hover:text-gray-700 text-2xl hover:scale-110 transition"
                      onClick={() => {
                        const textArea = document.createElement("textarea");
                        textArea.value = answer;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textArea);
                        setCopyClicked(true);
                      }}
                      aria-label="Copy"
                    >
                      <div className="w-8 h-8 flex items-center">
                        <img src={copyIcon} alt="Copy" className="" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/5 mt-36 hidden lg:block"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;