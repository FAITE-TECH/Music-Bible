import { useEffect, useState } from "react";
import logo from "../assets/Logo/newlogo.png";
import sendIcon from "../assets/Logo/sendlogo.png";
// import { Search } from "lucide-react";
import { motion } from "framer-motion";
import searchIcon from "../assets/Logo/searchIcon.png";
import shareIcon from "../assets/Logo/shareIcon.png";
import copyIcon from "../assets/Logo/copyIcon.png";
const ChatAI = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareClicked, setSharedClicked] = useState(false);

  useEffect(() => {
    if (shareClicked) {
      setTimeout(() => {
          setSharedClicked(false);
        }, 1000);
    }
  },[shareClicked])

  const sendQuery = async () => {
    try {
      if (query !== "") {
        setLoading(true);
        setAnswer("");
        const response = await fetch("https://amusicbible.com/api/ai/ask", {
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

  return (
    <>
      <div className="max-h-screen overflow-hidden">
        <div className="flex item-center text-3xl text-gray-800 bg-gradient-to-r from-sky-200 to-pink-200 px-16 py-8" >
          <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0, x: -300 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 60, duration: 1.6 }}
                >
                   <div className="w-12 h-12">
            <img
              src={logo}
              alt="logo"
              className="max-w-100 "
              // onError={(e) => {
              //   e.target.src = defaultLogo;
              // }}
            />
          </div>
          <h1 className="text-3xl  text-gray-800 bg-gradient-to-r from-sky-200 ">
            aMusicBible/AI
          </h1>
                </motion.div>
          
        </div>
        <div className="flex flex-col items-center  min-h-screen bg-gradient-to-r from-sky-200 to-pink-200 " >
          <div className="mr-56 text-gray-500 font-semibold mb-1">
            Ask your thoughts
          </div>
          <div className="relative flex ">
            <input
              type="text"
              className="px-4 py-2 w-80 rounded-full shadow-2xl border border-gray-300 focus:outline-none bg-gradient-to-r from-blue-100 to-pink-200 "
              placeholder="Type here"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendQuery();
                }
              }}
            />
            <div className="absolute w-8 h-8 flex justify-end ml-[280px] mt-3">
              <img src={searchIcon} alt="send" className="w-8 h-8" />
            </div>
            <button
              className="ml-2 p-1 rounded-full hover:scale-110 transition "
              onClick={sendQuery}
            >
              <div className="w-12 h-12 flex items-center ">
                <img src={sendIcon} alt="send" className="" />
              </div>
            </button>
          </div>
          <div className="flex gap-4 mt-4 -ml-12">
            <a
              href="https://play.google.com/store/apps/details?id=com.faite.project.music_bible_music_player&pcampaignid=web_share
"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png"
                  alt="Google Play"
                  className="w-[95px] h-auto mt-0.5"
                />
              </motion.div>
            </a>
            <a
              href="https://apps.apple.com/app/id6618135650 "
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <img
                  src="https://p7.hiclipart.com/preview/422/842/453/app-store-android-google-play-get-started-now-button.jpg"
                  alt="Apple Store"
                  className="w-[80px] h-auto"
                />
              </motion.div>
            </a>
          </div>

          <div className=" w-3/4 max-w-md">
            {" "}
            <p className="text-gray-500 w-full font-semibold ml-4">
              Answer
            </p>{" "}
            <div className="mt-2 p-4 bg-white border-t rounded-t-2xl shadow-2xl relative h-screen flex flex-col justify-between bg-gradient-to-r from-blue-100 to-pink-200 ">
              {loading ? (
                <div className="type_loader_container">
                  <div className="typing_loader"></div>
                </div>
              ) : (
                <div>............</div>
              )}
              
              <div className="mt-2 text-gray-800 font-medium flex-grow break-words">
                <div className="  h-[400px] overflow-y-auto text-gray-600">
                  {answer}
                </div>
              </div>
              
              <div className="absolute top-3 right-3 flex space-x-2">
                {/* <button className="text-gray-500 hover:text-gray-700">↩</button> */}
                {
                  shareClicked && (<div className="text-gray-500 mx-10 animate-view-content">Link copied</div>)
                }
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl hover:scale-110 transition"
                  onClick={() => {
                    setSharedClicked(true);
                    const textArea = document.createElement("textarea");
                    textArea.value = "https://amusicbible.com/bible/ai";
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand("copy"); // Copies text
                    document.body.removeChild(textArea);
                    console.log("Copied to clipboard");
                  }}
                >
                  <div className="w-8 h-8 flex items-center ">
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
                    document.execCommand("copy"); // Copies text
                    document.body.removeChild(textArea);
                    console.log("Copied to clipboard");
                  }}
                >
                  <div className="w-8 h-8 flex items-center ">
                <img src={copyIcon} alt="Copy" className="" />
              </div>
                </button>
              </div>
            </div>
          </div>

          {/* <div className="mt-4 flex items-center gap-2 text-gray-700">
                <p>Feedbacks</p>
                <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => (
                        <span key={index} className="text-yellow-500 text-xl">⭐</span>
                    ))}
                </div>
            </div> */}
        </div>
      </div>
    </>
  );
};

export default ChatAI;
