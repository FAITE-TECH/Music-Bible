import { useEffect, useState } from "react";
import logo from "../assets/Logo/newlogo.png";
// import { Search } from "lucide-react";
import { motion } from "framer-motion";
import searchIcon from "../assets/Logo/circleArrow.png";
import shareIcon from "../assets/Logo/shareIcon.png";
import copyIcon from "../assets/Logo/copyIcon.png";

const ChatAI = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareClicked, setSharedClicked] = useState(false);
  const [copyClicked, setCopyClicked] = useState(false);

  useEffect(() => {
    if (shareClicked) {
      setTimeout(() => {
          setSharedClicked(false);
        }, 1000);
    }
  },[shareClicked])

  useEffect(() => {
    if (copyClicked) {
      setTimeout(() => {
          setCopyClicked(false);
        }, 1000);
    }
    
  }, [copyClicked])
  
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

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Bible AI",
          url: "https://amusicbible.com/bible/ai",
        })
        .then(() => console.log('Link successfully'))
        .catch((error) => console.error('Error sharing link:', error));
    } else {
      alert('Web Share API not supported in your browser.');
    }
  };

  const ParseText = ( text )=> {
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
}

  return (
    <>
      <div className="max-h-screen overflow-hidden lg:bg-[url(../assets/bg5.png)] md:bg-[url(../assets/bg-md.png)] bg-[url(../assets/bg-sm.png)] bg-cover bg-center">
        <div className="flex item-center text-3xl text-gray-800 px-16 py-8" >
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
          <h1 className="text-3xl  text-gray-800 bg-transparent">
            aMusicBible/AI
          </h1>
                </motion.div>
        </div>
        <div className="flex justify-start">
          <div className="lg:w-1/5 mt-36">
            {/* <img src="../assets/big_3D-setting_image.png" alt="align-image1" className="w-48 justify-self-end relative top-20 sm:left-12 z-[999]" />
            <img src="../assets/align-image1.png" alt="align-image1" className="absolute lg:w-[500px] -mt-6" /> */}
          </div>
          <div className="lg:w-3/5 w-full z-[9999]">
            <div className=" text-gray-500 mb-6 lg:ml-36 md:ml-36 ml-12">
            Ask your thoughts
          </div>
            <div className="flex flex-col items-center min-h-screen" >
          
              <div className="flex justify-between">
                <div className="relative flex ">
            <input
              type="text"
              className="px-4 py-2 lg:w-[650px] md:w-[460px] w-[280px] lg:-ml-2 h-14 rounded-full shadow-2xl border border-gray-300 focus:outline-none shadow-gray-600 bg-transparent shadow-lg"
              placeholder="How to be a good Christian?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendQuery();
                }
              }}
            />
            
            {/* <button
              className="ml-2 p-1 rounded-full hover:scale-110 transition "
              onClick={sendQuery}
            >
              <div className="w-12 h-12 flex items-center ">
                <img src={sendIcon} alt="send" className="" />
              </div>
            </button> */}
          </div><div className=" w-14 h-14 flex justify-end mt-3 -ml-16 z-[999] cursor-pointer">
              <img src={searchIcon} alt="send" className="w-14 h-12 -mt-2" onClick={sendQuery}/>
            </div>
          </div>
          <div className="flex gap-4 mt-6 mb-4 ">
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
                  className="w-[110px] h-auto mt-0.5"
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
                  className="w-[104px] h-auto"
                />
              </motion.div>
            </a>
          </div>
          <div className="w-3/4 lg:max-w-2xl max-w-lg">
            {" "}
            <p className="text-gray-500 w-full ml-4">
              Answer
            </p>{" "}
            <div className="mt-2 p-4 bg-white border-t shadow-2xl relative h-screen flex flex-col justify-between shadow-black bg-gray-50  rounded-t-[50px]">
              {loading ? (
                <div className="type_loader_container ml-4">
                  <div className="typing_loader"></div>
                </div>
              ) : (
                <div className="ml-4">............</div>
              )}
              
              <div className="mt-2 text-gray-800 font-medium flex-grow break-words">
                <div className="h-[400px] overflow-y-auto text-gray-600">
                  {answer && answer!=="" && ParseText(answer)}
                </div>
              </div>
              
              <div className="absolute top-3 lg:right-8 right-4 flex space-x-2">
                {/* <button className="text-gray-500 hover:text-gray-700">↩</button> */}
                {
                  copyClicked && (<div className="text-gray-500 mx-10 animate-view-content">Text copied</div>)
                }
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl hover:scale-110 transition"
                  onClick={handleShare}
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
                    setCopyClicked(true)
                  }}
                >
                  <div className="w-8 h-8 flex items-center ">
                <img src={copyIcon} alt="Copy" className="" />
              </div>
                </button>
              </div>
            </div>
          </div>   
            </div>
          </div>
          <div className="lg:w-1/5 mt-36">
            {/* <img src="../assets/big_3D-setting_image.png" alt="align-image1" className="w-48 justify-self-start relative top-20  z-[999]" /> */}
            {/* <img src="../assets/align-image2.png" alt="align-image2" className="absolute lg:w-[480px] -ml-36 mt-24" /> */}
          </div>

        </div>
      </div>
      
    </>
  );
};

export default ChatAI;
