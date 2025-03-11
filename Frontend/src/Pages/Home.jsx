import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import video from "../assets/Logo/design.mp4";
import logo from "../assets/Logo/newlogo.png";
import first from "../assets/Logo/firstpage.png";
import img1 from "../assets/Logo/1.png";
import img2 from "../assets/Logo/2.png";
import img3 from "../assets/Logo/3.png";
import txtLogo from "../assets/Logo/txtnewlogo.png";
import historycreator from "../assets/Logo/historycreatorremovebg.png";
import network from "../assets/Logo/netwokremovebg.png";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollSection from "../Components/ScrollSection";
import { FaCogs, FaShieldAlt, FaUser } from "react-icons/fa";

export default function Home() {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const logoControls = useAnimation();
  const networkControls = useAnimation();
  const historyControls = useAnimation();


  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
    });
  }, []);

  useEffect(() => {
    if (inView) {
      logoControls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 1 },
      });

      networkControls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 3, ease: "easeInOut" },
      });

      historyControls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 3, ease: "easeInOut" },
      });
    } else {
      logoControls.start({ opacity: 0, scale: 0.5 });
      networkControls.start({ x: "-100vw", opacity: 0 });
      historyControls.start({ x: "100vw", opacity: 0 });
    }
  }, [inView, logoControls, networkControls, historyControls]);

  
  

  return (
    <>
<section
  className="relative bg-black text-white py-6 px-4 min-h-screen flex flex-col items-center justify-center overflow-hidden h-full  "
  ref={ref}
>
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover z-0"
  >
    <source src={video} type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <div className="relative flex flex-col items-center justify-center  lg:mt-[-150px]">
    {/* Logo */}
    <motion.img
      src={logo}
      alt="Logo"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={logoControls}
      className="w-48 h-48  sm:h-[500px] sm:w-[500px]  lg:w-[530px] lg:h-[470px]"
    />

    {/* Network */}
    <motion.img
      src={network}
      alt="Network"
      initial={{ x: "-100vw", opacity: 0 }}
      animate={networkControls}
      className="  lg:w-[770px]"
    />

    {/* History Creator */}
    <div className="mt-[-8px] ">
    <motion.img
      src={historycreator}
      alt="History Creator"
      initial={{ x: "100vw", opacity: 0 }}
      animate={historyControls}
      className="lg:w-[880px]"
    />
    </div>
    
  </div>

  <motion.div className="fixed bottom-4 left-4 z-10">
  <a href="https://play.google.com/store/apps/details?id=com.faite.project.music_bible_music_player&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png"
        alt="Google Play"
        className="w-[150px] h-auto"
      />
    </motion.div>
  </a>
</motion.div>

<motion.div className="fixed bottom-4 right-4 z-10">
  <a href="https://apps.apple.com/app/id6618135650" target="_blank" rel="noopener noreferrer">
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <img
        src="https://p7.hiclipart.com/preview/422/842/453/app-store-android-google-play-get-started-now-button.jpg"
        alt="Apple Store"
        className="w-[150px] h-auto"
      />
    </motion.div>
  </a>
</motion.div>

</section>


    {/* Scrolling Section */}
    <section
       className="overflow-hidden "
      >
        <ScrollSection/>
      </section>

     {/* Second Section */}
     <section
      className="relative bg-gradient-to-br from-black via-orange-600 to-blue-800 min-h-screen flex items-center px-6 overflow-hidden"
      data-aos="fade-up"
    >
      <div className="container mx-auto flex flex-wrap items-center">
        {/* History Text */}
        <div className="absolute top-6 right-6" data-aos="fade-down">
          <p className="text-yellow-400 text-lg font-semibold">
            THE HISTORY CREATORS
          </p>
        </div>

        {/* Logos */}
        <div
          className="absolute top-6 left-6 flex items-center"
          data-aos="fade-right"
        >
          <img src={logo} alt="Logo" className="h-12 mr-1 ml-2" />
          <img src={txtLogo} alt="Logo" className="h-10 mr-4 ml-1 mt-5 " />
        </div>

        {/* Text Content */}
        <div
          className="w-full md:w-1/2 text-center md:text-left"
          data-aos="fade-up"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Enjoy your <span className="text-orange-400">Music version</span>{" "}
            Holy Bible
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Discover spiritual teachings with melodies and sacred words.
            Enrich your soul.
          </p>
          <motion.a
            href="/album"
            className="inline-block bg-orange-500 text-white py-3 px-8 rounded-full text-lg shadow-lg hover:bg-orange-600 transition duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Visit here
          </motion.a>
        </div>

        {/* Phone Image */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          data-aos="zoom-in"
        >
          <img src={first} alt="App Screenshot" className="w-80 md:w-96" />
        </motion.div>
      </div>
    </section>

    <section
  className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
  style={{
    backgroundImage: 'radial-gradient(circle, #ffa500 20%, #000000 90%)',
  }}
>
  <div className="container mx-auto flex flex-wrap items-center justify-between">
    <div
      className="w-full md:w-1/2 p-8 pb-20 bg-white bg-opacity-10 rounded-2xl shadow-2xl relative"
      data-aos="fade-right"
    >
      <h2 className="text-4xl font-bold text-white mb-4">What is the Partnership?</h2>
      <p className="text-lg text-gray-300 leading-relaxed">
        We warmly invite you to continue your spiritual journey with us. At <strong>aMusicBible</strong>,
        we are dedicated to supporting your spiritual growth by providing everything you need to deepen your faith.
        Discover new and uplifting resources, such as guided meditations, peaceful rhythms, and insights into
        the true essence of a Christian life. We’d also love to hear from you—share your testimonies and
        feedback with us, and let’s grow together in faith and love. Your journey is our joy!
      </p>
      <motion.a
        href="/membership"
        className="absolute bottom-4 right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-6 md:px-8 rounded-full text-sm md:text-lg shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition-transform duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Visit here
      </motion.a>
    </div>

    {/* Image */}
    <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0" data-aos="fade-up">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        <img
          src={img2}
          alt="Partnership Screenshot"
          className="w-full h-96"
        />
      </div>
    </div>
  </div>
</section>



<section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at bottom, #60a5fa, #000000 50%)' }}>
  <div className="w-full md:w-3/4 bg-black bg-opacity-70 rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-md flex flex-col md:flex-row justify-between" data-aos="fade-up">
    
    <div className="flex flex-col justify-center mb-8 md:mb-0 md:w-1/2">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Features Of <span className="text-yellow-400">aMusicBible</span> App</h2>
    </div>

  
    <div className="space-y-6 md:space-y-8 w-full md:w-1/2 border border-gray-600 rounded-lg p-6" data-aos="fade-left">
     
      <div className="flex flex-col md:flex-row justify-start items-center md:justify-start space-y-4 md:space-y-0" data-aos="fade-left">
        <div className="flex items-center justify-center w-14 h-14  rounded-full text-white text-2xl md:w-16 md:h-16 md:text-3xl mr-2">
          <FaUser />
        </div>
        <div className="text-center md:text-left ">
          <h3 className="text-xl md:text-2xl text-white font-semibold mb-2">User-friendly</h3>
          <p className="text-gray-300 text-base md:text-lg">You can enjoy with the best spiritual experience.</p>
        </div>
      </div>

      
      <div className="flex flex-col md:flex-row justify-start items-center md:justify-start space-y-4 md:space-y-0" data-aos="fade-right">
      <div className="flex items-center justify-center w-16 h-16 rounded-full text-white text-2xl md:w-16 md:h-16 md:text-3xl mr-8">
          <FaCogs />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-xl md:text-2xl text-white font-semibold mb-2">Seamless integration</h3>
          <p className="text-gray-300 text-base md:text-lg">Write here a key feature of the app or software that is being advertised here.</p>
        </div>
      </div>

     
      <div className="flex flex-col md:flex-row justify-start items-center md:justify-start space-y-4 md:space-y-0" data-aos="fade-left">
        <div className="flex items-center justify-center w-14 h-14  rounded-full text-white text-2xl md:w-16 md:h-16 md:text-3xl">
          <FaShieldAlt />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-xl md:text-2xl text-white font-semibold mb-2">Secure & Safe</h3>
          <p className="text-gray-300 text-base md:text-lg">Complete data protection with top-tier security.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="bg-black text-white py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold  mb-12">Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          
          <div
            className="bg-gradient-to-t from-gray-900 via-gray-800 to-black rounded-xl p-6 shadow-lg"
            data-aos="fade-up"
          >
            <div className="flex items-center mb-4">
              <img
                src="https://via.placeholder.com/50"
                alt="Suthakaran"
                className="w-12 h-12 rounded-full mr-4"
              />
              <h3 className="text-xl font-semibold">Suthakaran.T</h3>
            </div>
            <p className="text-gray-400">
              I install aMusicBible app recently and I got more knowledge of
              bible in my spiritual life. I can suggest to everyone.
            </p>
          </div>
         
          <div
            className="bg-gradient-to-t from-gray-900 via-gray-800 to-black rounded-xl p-6 shadow-lg"
            data-aos="fade-up"
          >
            <div className="flex items-center mb-4">
              <img
                src="https://via.placeholder.com/50"
                alt="Mason"
                className="w-12 h-12 rounded-full mr-4"
              />
              <h3 className="text-xl font-semibold">Mason</h3>
            </div>
            <p className="text-gray-400">
              A powerful new platform created with your ministry in mind.
            </p>
          </div>
         
          <div
            className="bg-gradient-to-t from-gray-900 via-gray-800 to-black rounded-xl p-6 shadow-lg"
            data-aos="fade-up"
          >
            <div className="flex items-center mb-4">
              <img
                src="https://via.placeholder.com/50"
                alt="Jonah"
                className="w-12 h-12 rounded-full mr-4"
              />
              <h3 className="text-xl font-semibold">Jonah</h3>
            </div>
            <p className="text-gray-400">
              With people using the app in every country, YouVersion has been
              covered by press all over the world. We occasionally issue press
              releases to announce significant milestones accomplished by the
              global YouVersion community.
            </p>
          </div>
        </div>
      </div>
    </section>
    <section className="bg-gradient-to-r from-blue-900 via-black to-black py-16 overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left Content */}
        <div
          className="md:w-1/2 text-white"
          data-aos="fade-right"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Reading Bible with better preference
          </h1>
          <p className="text-lg text-gray-300">
            Reading HolyBible will touch your mouth with sweet verses.
          </p>
        </div>

        {/* Right Image */}
        <div
          className="md:w-1/2 flex justify-center mt-8 md:mt-0"
          data-aos="fade-left"
        >
          <img
            src={img3}
            alt="Bible App UI"
             className="rounded-xl shadow-xl w-3/5 sm:w-2/5 lg:w-3/5"
          />
        </div>
      </div>
    </section>

    <section className="bg-gradient-to-r from-blue-400 to-green-500 py-16 overflow-hidden">
  <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
    {/* Left Image */}
    <div
      className="lg:w-1/2 flex justify-center mb-8 lg:mb-0 lg:pr-8"
      data-aos="fade-right"
    >
      <img
        src={img1}
        alt="Research Student"
        className="rounded-xl shadow-xl w-3/5 sm:w-2/5 lg:w-3/5"
      />
    </div>

    {/* Right Content */}
    <div
      className="lg:w-1/2 text-white text-center lg:text-left"
      data-aos="fade-left"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-snug">
        Are you the Research student about Christianity?
      </h2>
      <p className="text-lg text-gray-300">
        Come with your valuable Questions and get the more knowledge from
        aMusicBible
      </p>
    </div>
  </div>
</section>


    <section
      className="relative w-full min-h-screen flex justify-center items-center px-4 py-12 bg-gradient-to-r from-yellow-900 via-black to-blue-500 text-white overflow-hidden"
      data-aos="fade-up"
    >
      <div className="max-w-4xl text-center">
        {/* Title */}
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          About the <span className="text-blue-300">aMusicBible</span>
        </h2>

        {/* Content */}
        <p className="text-lg sm:text-xl leading-relaxed">
          aMusicBible is a revolutionary app designed for everyone, offering a
          unique way to experience the Bible. This innovative platform
          transforms the Scriptures into a musical journey, presenting the Bible
          in a beautifully composed music format. With aMusicBible, users can
          immerse themselves in the Word of God through melodies that inspire
          worship, reflection, and spiritual growth. Perfect for personal
          devotion, group studies, or simply enjoying the uplifting power of
          Scripture-based music, aMusicBible makes the Bible more accessible and
          engaging for believers worldwide.
        </p>
      </div>
    </section>  

      
    </>
  );
}
