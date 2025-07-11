import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/Logo/newlogo.png";
import { motion } from "framer-motion";
import searchIcon from "../assets/Logo/circleArrow.png";
import shareIcon from "../assets/Logo/shareIcon.png";
import copyIcon from "../assets/Logo/copyIcon.png";
import leftDecor from "../assets/Logo/left-decor.png";
import rightDecor from "../assets/Logo/right-decor.png";
import bgImage from "../assets/Logo/ai-bg.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const ChatAI = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareClicked, setSharedClicked] = useState(false);
  const [copyClicked, setCopyClicked] = useState(false);
  const [language, setLanguage] = useState("en");
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
          body: JSON.stringify({ question: query, language: language }),
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
        .then(() => console.log("Link shared successfully"))
        .catch((error) => console.error("Error sharing link:", error));
    } else {
      alert("Web Share API not supported in your browser.");
    }
  };

  const handleBuyNow = async () => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }

    setIsPurchasing(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/aistripe/create-ai-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId: currentUser._id,
          }),
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No URL returned from Stripe session creation");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleContactUs = () => {
    navigate("/contactus");
  };

  const ParseText = (text) => {
    const formatText = (text) => {
      const sentences = text.match(/[^.!?]+[.!?]/g) || [text];
      const paragraphs = [];

      for (let i = 0; i < sentences.length; i += 2) {
        paragraphs.push(sentences.slice(i, i + 2).join(" "));
      }

      return paragraphs;
    };

    return (
      <div className="space-y-4 p-4">
        {formatText(text).map((para, index) => (
          <p key={index} className="text-md leading-relaxed text-gray-100">
            {para}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div
      className="h-screen w-full overflow-y-auto"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "absolute",
      }}
    >
      {/* Header and Info Box Container */}
      <div className="relative px-4 md:px-8 lg:px-16 py-8  bg-opacity-50">
        {/* Header */}
        <div className="flex items-center text-3xl text-gray-800">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 60, duration: 1.6 }}
          >
            <div className="w-12 h-12">
              <img src={logo} alt="logo" className="max-w-100" />
            </div>
            <div className="flex flex-col ml-2">
              <h1 className="text-3xl text-gray-800 bg-transparent">
                aMusicBible/AI
              </h1>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-base text-gray-500">Language:</span>
                <div className="flex space-x-1">
                  <button
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      language === "en"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                    onClick={() => setLanguage("en")}
                  >
                    English
                  </button>
                  <button
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      language === "ta"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                    onClick={() => setLanguage("ta")}
                  >
                    தமிழ்
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Box */}
        <div className="lg:absolute lg:top-8 lg:right-8 mt-4 lg:mt-0 w-full max-w-xs mx-auto lg:mx-0 p-3 sm:p-4 rounded-xl bg-gradient-to-b from-gray-900 to-black shadow-xl text-white text-sm font-light z-20 flex flex-col items-center text-center">
          <h3 className="text-sm font-semibold mb-1">Available</h3>
          <h3 className="text-xl text-yellow-400 font-semibold mb-1">
            Bible AI API KEY
          </h3>
          <p className="text-sm mb-3 leading-snug">
            Chatbox available in English
          </p>
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0 w-full justify-center">
            <button
              onClick={handleBuyNow}
              disabled={isPurchasing}
              className="px-3 py-1 text-sm bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center"
            >
              {isPurchasing ? (
                "Processing..."
              ) : (
                <>
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-1" />
                  Buy Now ($500)
                </>
              )}
            </button>
            <button
              onClick={handleContactUs}
              className="px-3 py-1 text-sm bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white rounded-full font-semibold hover:opacity-90 transition"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center relative">
        {/* Left Decorative Image */}
        <div className="hidden md:block absolute left-0 h-full w-[20%] md:w-[20%] lg:w-[28%]">
          <img
            src={leftDecor}
            alt="Left decoration"
            className="h-full object-contain object-left"
          />
        </div>

        <div className="w-full max-w-4xl z-[9999] px-4">
          <div className="text-gray-500 mb-6 text-start text-sm md:text-base">
            Ask your thoughts
          </div>

          {/* Search Input */}
          <div className="flex justify-between w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
            <div className="relative flex flex-1">
              <input
                type="text"
                className="px-4 py-2 w-full h-14 text-black rounded-full border border-gray-400 focus:outline-none shadow-lg bg-transparent bg-opacity-70 placeholder-gray-400"
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
          <div className="flex gap-4 mt-6 mb-4 justify-center">
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
          <div className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
            <p className="text-gray-500 text-start text-sm md:text-base mb-2">
              Answer
            </p>
            <div className="relative">
              {/* Answer box with decorative images touching edges */}
              <div className="p-4 border border-gray-600 shadow-2xl relative min-h-[400px] flex flex-col justify-between bg-gray-50 bg-opacity-70 backdrop-blur-sm rounded-t-[30px]">
                {loading ? (
                  <div className="type_loader_container text-center">
                    <div className="typing_loader"></div>
                  </div>
                ) : (
                  <div className="text-start text-gray-400">............</div>
                )}

                <div className="mt-2 text-gray-200 font-medium flex-grow break-words">
                  <div className="h-[400px] overflow-y-auto">
                    {answer && answer !== "" && ParseText(answer)}
                  </div>
                </div>

                <div className="absolute top-3 right-4 flex space-x-2">
                  {copyClicked && (
                    <div className="text-gray-300 mx-10 animate-view-content text-xs sm:text-sm">
                      Text copied
                    </div>
                  )}
                  <button
                    className="text-gray-300 hover:text-white text-2xl hover:scale-110 transition"
                    onClick={handleShare}
                    aria-label="Share"
                  >
                    <div className="w-8 h-8 flex items-center">
                      <img src={shareIcon} alt="Share" className="" />
                    </div>
                  </button>
                  <button
                    className="text-gray-300 hover:text-white text-2xl hover:scale-110 transition"
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

        {/* Right Decorative Image */}
        <div className="hidden md:block absolute right-0 h-full w-[20%] md:w-[20%] lg:w-[28%]">
          <img
            src={rightDecor}
            alt="Right decoration"
            className="h-full object-contain mt-12 object-right"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatAI;
