import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/Logo/newlogo.png";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faMicrophone,
  faVolumeUp,
  faCopy,
  faShareAlt,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

const TamilFontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil&display=swap');
    .font-tamil {
      font-family: 'Noto Sans Tamil', sans-serif;
      word-wrap: break-word;
      line-height: 2;
      letter-spacing: 0.4px;
    }
  `}</style>
);

// SizeSelector component for mobile view
const SizeSelector = ({ selectedSize, setSelectedSize }) => {
  const sizes = [
    { id: "Square", icon: "⬛", className: "h-[400px] w-full" },
    { id: "Landscape", icon: "▭", className: "h-[300px] w-full" },
    { id: "Portrait", icon: "▯", className: "h-[500px] w-full" },
  ];

  return (
    <div className="bg-black text-white p-4 rounded-lg w-full max-w-md mx-auto mt-4">
      <h2 className="text-lg font-semibold mb-4">
        {selectedSize === "Square"
          ? "Square Size"
          : selectedSize === "Landscape"
          ? "Landscape Size"
          : "Portrait Size"}
      </h2>
      <div className="flex space-x-4 justify-center">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => setSelectedSize(size.id)}
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg border transition 
              ${
                selectedSize === size.id
                  ? "border-blue-500 bg-blue-500/20"
                  : "border-gray-600 hover:border-gray-400"
              }`}
          >
            <div className="w-8 h-8 flex items-center justify-center text-xl">
              {size.icon}
            </div>
            <span className="mt-1 text-xs">{size.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const ChatAI = () => {
  
  // Custom style for hiding textarea scrollbar
  const HideScrollbarStyle = () => (
    <style>{`
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
    `}</style>
  );
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareClicked, setSharedClicked] = useState(false);
  const [copyClicked, setCopyClicked] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedSize, setSelectedSize] = useState("Square");
  const [voices, setVoices] = useState([]);
  const [voiceSupport, setVoiceSupport] = useState({
    recognition: false,
    synthesis: false,
    tamilVoice: false,
    tamilRecognition: false,
  });
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // Speech recognition setup
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (shareClicked) {
      setTimeout(() => setSharedClicked(false), 1000);
    }
  }, [shareClicked]);

  useEffect(() => {
    if (copyClicked) {
      setTimeout(() => setCopyClicked(false), 1000);
    }
  }, [copyClicked]);

  // Check voice support
  useEffect(() => {
    const checkVoiceSupport = () => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const hasRecognition = !!SpeechRecognition;
      const hasSynthesis = "speechSynthesis" in window;

      // Check for Tamil recognition support
      let tamilRecognitionSupported = false;
      if (hasRecognition) {
        try {
          const testRecognition = new SpeechRecognition();
          testRecognition.lang = "ta-IN";
          tamilRecognitionSupported = true;
        } catch (e) {
          console.warn("Tamil recognition not supported:", e);
        }
      }

      if (hasSynthesis) {
        const availableVoices = window.speechSynthesis.getVoices();
        const hasTamilVoice = availableVoices.some(
          (voice) => voice.lang.includes("ta-IN") || voice.lang.includes("ta-")
        );
        setVoices(availableVoices);
        setVoiceSupport((prev) => ({
          ...prev,
          synthesis: true,
          tamilVoice: hasTamilVoice,
          tamilRecognition: tamilRecognitionSupported,
        }));
        window.speechSynthesis.onvoiceschanged = () => {
          const updatedVoices = window.speechSynthesis.getVoices();
          setVoices(updatedVoices);
          setVoiceSupport((prev) => ({
            ...prev,
            tamilVoice: updatedVoices.some(
              (voice) =>
                voice.lang.includes("ta-IN") || voice.lang.includes("ta-")
            ),
          }));
        };
      }

      setVoiceSupport((prev) => ({
        ...prev,
        recognition: hasRecognition,
        tamilRecognition: tamilRecognitionSupported,
      }));
    };

    checkVoiceSupport();
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (voiceSupport.recognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;

      // Set language based on support
      if (language === "ta" && voiceSupport.tamilRecognition) {
        recognitionInstance.lang = "ta-IN";
      } else {
        recognitionInstance.lang = "en-US";
        if (language === "ta") {
          console.warn("Falling back to English recognition for Tamil input");
        }
      }

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          alert(
            language === "ta"
              ? "குரல் உள்ளீட்டைப் பயன்படுத்த மைக்ரோஃபோன் அனுமதியை வழங்கவும்"
              : "Please allow microphone access to use voice input"
          );
        } else if (event.error === "language-not-supported") {
          alert(
            language === "ta"
              ? "தமிழ் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. ஆங்கிலத்தில் முயற்சிக்கவும்"
              : "Selected language not supported. Trying English instead"
          );
          setLanguage("en");
        }
      };

      recognitionInstance.onend = () => {
        if (isListening) {
          setIsListening(false);
        }
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [language, voiceSupport.recognition, voiceSupport.tamilRecognition]);

  const startListening = () => {
    if (!voiceSupport.recognition) {
      alert(
        language === "ta"
          ? "உங்கள் உலாவியில் குரல் அங்கீகாரம் ஆதரிக்கப்படவில்லை"
          : "Voice recognition not supported in your browser"
      );
      return;
    }

    if (language === "ta" && !voiceSupport.tamilRecognition) {
      alert(
        language === "ta"
          ? "தமிழ் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. ஆங்கிலத்தில் முயற்சிக்கவும்"
          : "Tamil voice input not supported. Trying English instead"
      );
      setLanguage("en");
      return;
    }

    try {
      setIsListening(true);
      recognition.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsListening(false);
      alert(
        language === "ta"
          ? "குரல் அங்கீகாரத்தைத் தொடங்குவதில் பிழை"
          : "Error starting voice recognition"
      );
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const speakText = (text) => {
    if (!voiceSupport.synthesis) {
      alert(
        language === "ta"
          ? "உங்கள் உலாவியில் உரை-க்குரல் மாற்றம் ஆதரிக்கப்படவில்லை"
          : "Text-to-speech not supported in your browser"
      );
      return;
    }

    if (language === "ta" && !voiceSupport.tamilVoice) {
      alert(
        language === "ta"
          ? "தமிழ் குரல் வெளியீடு ஆதரிக்கப்படவில்லை. ஆங்கிலத்தில் முயற்சிக்கவும்"
          : "Tamil voice output not supported. Trying English instead"
      );
      setLanguage("en");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "ta" ? "ta-IN" : "en-US";
    utterance.rate = 0.9;

    if (language === "ta") {
      const tamilVoice = voices.find(
        (voice) => voice.lang === "ta-IN" || voice.lang.startsWith("ta-")
      );
      if (tamilVoice) {
        utterance.voice = tamilVoice;
      } else {
        console.log("No Tamil voice found, using default");
      }
    } else {
      const englishVoice = voices.find(
        (voice) => voice.lang === "en-US" || voice.lang.startsWith("en-")
      );
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const sendQuery = async () => {
    if (query.trim() === "") return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("https://api.amusicbible.com/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ question: query, language }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      const result = typeof data === "string" ? data : data.answer;
      setAnswer(result);

      if (result.length < 500) {
        speakText(result);
      }
    } catch (error) {
      setAnswer(`Error: ${error.message}`);
    } finally {
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
        .catch((error) => console.error("Error sharing link:", error));
    } else {
      alert(
        language === "ta"
          ? "உங்கள் உலாவியில் பகிர்வு செயல்பாடு ஆதரிக்கப்படவில்லை"
          : "Web Share API not supported in your browser"
      );
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
        "https://api.amusicbible.com/api/aistripe/create-ai-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId: currentUser._id }),
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

  const handleContactUs = () => navigate("/contactus");

  const ParseText = ({ text, isTamil }) => {
    const formatText = (text) => {
      const sentences = text.split(/(?<=[.!?])\s+/);
      const paragraphs = [];
      for (let i = 0; i < sentences.length; i += 2) {
        paragraphs.push(sentences.slice(i, i + 2).join(" "));
      }
      return paragraphs;
    };

    const paragraphs = formatText(text);

    return (
      <div className={`space-y-4 px-2 sm:px-4 ${isTamil ? "font-tamil" : ""}`}>
        {paragraphs.map((para, index) => (
          <p
            key={index}
            className="text-justify text-sm sm:text-base leading-snug sm:leading-relaxed indent-3 sm:indent-6 tracking-wide"
          >
            {para}
          </p>
        ))}
      </div>
    );
  };

  // Get the height class based on selected size
  const getAnswerBoxHeight = () => {
    switch (selectedSize) {
      case "Square":
        return "h-[400px]";
      case "Landscape":
        return "h-[300px]";
      case "Portrait":
        return "h-[500px]";
      default:
        return "h-[400px]";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#D4E8FF]">
      <TamilFontStyle />
      <HideScrollbarStyle />

      {/* Header and Info Box Container */}
      <div className="relative px-4 sm:px-6 md:px-8 lg:px-12 pb-2 sm:pb-3 md:pb-4 flex-shrink-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 60, duration: 1.6 }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12">
              <img src={logo} alt="logo" className="w-full h-full" />
            </div>
            <div className="flex flex-col ml-2 sm:ml-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl text-gray-800">
                aMusicBible/AI
              </h1>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-xs sm:text-sm text-gray-500">
                  {language === "ta" ? "மொழி:" : "Language:"}
                </span>
                <div className="flex space-x-1">
                  <button
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      language === "en"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setLanguage("en")}
                  >
                    English
                  </button>
                  <button
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      language === "ta"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => {
                      if (
                        voiceSupport.tamilRecognition ||
                        window.confirm(
                          language === "ta"
                            ? "தமிழ் குரல் உள்ளீடு உங்கள் உலாவியில் ஆதரிக்கப்படாது. தமிழ் உரை உள்ளீட்டுடன் தொடரவா?"
                            : "Tamil voice input may not be supported in your browser. Continue with Tamil text input?"
                        )
                      ) {
                        setLanguage("ta");
                      }
                    }}
                  >
                    தமிழ்
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info Box - Now part of the flex layout */}
          <div className="mt-6 sm:mt-8 w-full sm:w-auto sm:max-w-xs p-3 rounded-xl bg-gradient-to-b from-gray-900 to-black shadow-xl text-white text-sm font-light flex flex-col items-center text-center">
            <h3 className="text-sm font-semibold mb-1">
              {language === "ta" ? "கிடைக்கும்" : "Available"}
            </h3>
            <h3 className="text-lg sm:text-xl text-yellow-400 font-semibold mb-1">
              Bible AI API KEY
            </h3>
            <p className="text-xs sm:text-sm mb-3 leading-snug">
              {language === "ta"
                ? "ஆங்கிலத்தில் அரட்டை பெட்டி கிடைக்கும்"
                : "Chatbox available in English"}
            </p>
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0 w-full justify-center">
              <button
                onClick={handleBuyNow}
                disabled={isPurchasing}
                className="px-3 py-1 text-xs sm:text-sm bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center"
              >
                {isPurchasing ? (
                  language === "ta" ? (
                    "செயலாக்கம்..."
                  ) : (
                    "Processing..."
                  )
                ) : (
                  <>
                    <FontAwesomeIcon icon={faShoppingCart} className="mr-1" />
                    {language === "ta" ? "வாங்க ($500)" : "Buy Now ($500)"}
                  </>
                )}
              </button>
              <button
                onClick={handleContactUs}
                className="px-3 py-1 text-xs sm:text-sm bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white rounded-full font-semibold hover:opacity-90 transition"
              >
                {language === "ta" ? "தொடர்பு கொள்ள" : "Contact Us"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-2 sm:pt-3 md:pt-4 mb-4">
        <div className="max-w-4xl mx-auto">
          {/* Ask your thoughts and Search Input column-wise */}
          <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto mb-4 sm:mb-6">
            <div className="text-gray-500 text-start text-sm sm:text-base">
              {language === "ta"
                ? "உங்கள் எண்ணங்களைக் கேளுங்கள்"
                : "Ask your thoughts"}
            </div>
            <div className="w-full flex flex-col items-stretch">
              <div className="relative w-full">
                <div className="flex items-center w-full border border-gray-300 rounded-2xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 px-2 py-2">
                  <textarea
                    className="flex-1 px-2 py-2 text-gray-800 bg-transparent border-none outline-none rounded-2xl text-base min-w-0 resize-none h-14 sm:h-16 max-h-40 hide-scrollbar"
                    placeholder={
                      language === "ta"
                        ? "ஒரு நல்ல கிறிஸ்தவராக எப்படி இருக்க வேண்டும்?"
                        : "How to be a good Christian?"
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendQuery();
                      }
                    }}
                    style={{
                      whiteSpace: "pre-wrap",
                      overflow: "auto",
                    }}
                    rows={2}
                  />
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`ml-2 w-10 h-10 flex items-center justify-center rounded-full ${
                      isListening ? "bg-red-500 animate-pulse" : "bg-blue-500"
                    }`}
                    disabled={
                      !voiceSupport.recognition ||
                      (language === "ta" && !voiceSupport.tamilRecognition)
                    }
                    title={
                      !voiceSupport.recognition
                        ? language === "ta"
                          ? "குரல் உள்ளீடு ஆதரிக்கப்படவில்லை"
                          : "Voice input not supported"
                        : language === "ta" && !voiceSupport.tamilRecognition
                        ? "தமிழ் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை"
                        : language === "ta"
                        ? "குரல் உள்ளீடு"
                        : "Voice input"
                    }
                  >
                    <FontAwesomeIcon
                      icon={faMicrophone}
                      className={`text-white ${
                        isListening ? "text-lg" : "text-md"
                      }`}
                    />
                  </button>
                  <button
                    onClick={sendQuery}
                    className="ml-2 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white px-3 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition flex items-center justify-center"
                  >
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      className="text-sm"
                    />
                    <span className="hidden sm:inline ml-2">Ask Question</span>
                  </button>
                </div>
              </div>
            </div>
            {/* App Store Buttons: only show on mobile (block on xs, hidden on sm+) */}
            <div className="flex sm:hidden flex-col gap-3 mt-6 mb-4 justify-center items-center">
              <a
                href="https://play.google.com/store/apps/details?id=com.faite.project.music_bible_music_player&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png"
                    alt="Google Play"
                    className="h-10 w-auto mx-auto"
                  />
                </motion.div>
              </a>
              <a
                href="https://apps.apple.com/app/id6618135650"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src="https://p7.hiclipart.com/preview/422/842/453/app-store-android-google-play-get-started-now-button.jpg"
                    alt="Apple Store"
                    className="h-10 w-auto mx-auto"
                  />
                </motion.div>
              </a>
            </div>
            {/* SizeSelector only on mobile view, under answer section */}
            <div className="block sm:hidden">
              <SizeSelector
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />
            </div>
          </div>

          {/* Answer Section */}
          <div className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 text-start text-sm md:text-base">
                {language === "ta" ? "பதில்" : "Answer"}
              </p>
              {answer && (
                <button
                  onClick={isSpeaking ? stopSpeaking : () => speakText(answer)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    isSpeaking
                      ? "bg-red-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                  disabled={
                    !voiceSupport.synthesis ||
                    (language === "ta" && !voiceSupport.tamilVoice)
                  }
                  title={
                    !voiceSupport.synthesis
                      ? language === "ta"
                        ? "குரல் வெளியீடு ஆதரிக்கப்படவில்லை"
                        : "Voice output not supported"
                      : language === "ta" && !voiceSupport.tamilVoice
                      ? "தமிழ் குரல் வெளியீடு ஆதரிக்கப்படவில்லை"
                      : language === "ta"
                      ? "குரல் வெளியீடு"
                      : "Voice output"
                  }
                >
                  <FontAwesomeIcon icon={faVolumeUp} />
                  <span>
                    {isSpeaking
                      ? language === "ta"
                        ? "நிறுத்து"
                        : "Stop"
                      : language === "ta"
                      ? "கேளுங்கள்"
                      : "Listen"}
                  </span>
                </button>
              )}
            </div>
            <div className="relative">
              {/* Answer box with dynamic height based on selected size */}
              <div
                className={`p-4 border border-gray-600 shadow-2xl relative flex flex-col justify-between bg-gray-50 bg-opacity-70 backdrop-blur-sm rounded-[30px] ${getAnswerBoxHeight()}`}
              >
                {loading ? (
                  <div className="flex h-full text-gray-400 italic items-center justify-center">
                    {language === "ta"
                      ? "உங்கள் பதில் தயாராகிறது..."
                      : "Preparing your answer..."}
                  </div>
                ) : answer ? (
                  <div className="h-full overflow-y-auto">
                    <ParseText text={answer} isTamil={language === "ta"} />
                  </div>
                ) : (
                  <div className="flex h-full text-gray-400 italic items-center justify-center">
                    {language === "ta"
                      ? "உங்கள் பதில் இங்கே தோன்றும்..."
                      : "Your answer will appear here..."}
                  </div>
                )}

                {/* Copy and Share buttons at the bottom */}
                {answer && (
                  <div className="flex justify-center space-x-4 mt-4 pt-4 border-t border-gray-300">
                    {/* Copy confirmation message */}
                    <AnimatePresence>
                      {copyClicked && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
                        >
                          {language === "ta"
                            ? "உரை நகலெடுக்கப்பட்டது"
                            : "Text copied"}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Share button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      <FontAwesomeIcon icon={faShareAlt} />
                      <span>{language === "ta" ? "பகிர்" : "Share"}</span>
                    </motion.button>

                    {/* Copy button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigator.clipboard.writeText(answer);
                        setCopyClicked(true);
                      }}
                      className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                      <span>{language === "ta" ? "நகலெடு" : "Copy"}</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
            {/* App Store Buttons: only show on tab/desktop (sm+) and below answer section */}
            <div className="hidden sm:flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 mb-4 justify-center items-center">
              <a
                href="https://play.google.com/store/apps/details?id=com.faite.project.music_bible_music_player&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png"
                    alt="Google Play"
                    className="h-10 sm:h-12 w-auto mx-auto"
                  />
                </motion.div>
              </a>
              <a
                href="https://apps.apple.com/app/id6618135650"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src="https://p7.hiclipart.com/preview/422/842/453/app-store-android-google-play-get-started-now-button.jpg"
                    alt="Apple Store"
                    className="h-10 sm:h-12 w-auto mx-auto"
                  />
                </motion.div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;
