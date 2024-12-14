import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import video from '../assets/Logo/design.mp4';
import logo from '../assets/Logo/logo.png';
import AOS from "aos";
import "aos/dist/aos.css";
import { FaUser, FaCogs, FaShieldAlt } from 'react-icons/fa';


export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
    AOS.refresh();
  }, []);
  return (
    <>
      {/* Main Section */}
      <section className="relative bg-black text-white py-20 px-6 min-h-screen flex flex-col items-center justify-center">
        {/* Background Video */}
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


       

        {/* Bottom Animated Images */}
        <motion.div
          className="fixed bottom-4 left-4 flex flex-col space-y-4 z-10"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80, duration: 0.1 }}
        >
          {/* Google Play Badge */}
          <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
            <motion.img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png"
              alt="Google Play"
              className="w-[150px] h-auto"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          </a>

          {/* Apple Store Badge */}
          <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
            <motion.img
              src="https://p7.hiclipart.com/preview/422/842/453/app-store-android-google-play-get-started-now-button.jpg"
              alt="Apple Store"
              className="w-[150px] h-auto"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          </a>
        </motion.div>
      </section>

      {/* Second Section */}
      <section className="relative bg-gradient-to-br from-black via-orange-600 to-blue-800 min-h-screen flex items-center px-6" data-aos="fade-up">
  <div className="container mx-auto flex flex-wrap items-center">
    {/* History Text */}
    <div className="absolute top-6 right-6" data-aos="fade-down">
      <p className="text-yellow-400 text-lg font-semibold">
        THE HISTORY CREATORS
      </p>
    </div>

    
    <div className="absolute top-6 left-6 flex items-center" data-aos="fade-right">
      <img
        src={logo}
        alt="Logo"
        className="h-12 mr-4"
      />
      <h2 className="text-2xl text-white font-bold">aMusicBible</h2>
    </div>

    
    <div className="w-full md:w-1/2 text-center md:text-left" data-aos="fade-up">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Enjoy your <span className="text-orange-400">Music version</span> Holy Bible
      </h1>
      <p className="text-lg text-gray-200 mb-8">
        Discover spiritual teachings with melodies and sacred words. Enrich your soul.
      </p>
      <motion.a
        href="#"
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
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      data-aos="zoom-in"
    >
      <img
        src="/path-to-phone-image.jpg" 
        alt="App Screenshot"
        className="w-80 md:w-96"
      />
    </motion.div>
  </div>
</section>

<section className="relative min-h-screen flex items-center justify-center px-6" style={{ backgroundImage: 'radial-gradient(circle, #ffa500 20%, #000000 90%)' }}>
  <div className="container mx-auto flex flex-wrap items-center justify-between">
   
    <div className="w-full md:w-1/2 p-8 bg-white bg-opacity-10 rounded-2xl shadow-2xl" data-aos="fade-right">
      <h2 className="text-4xl font-bold text-white mb-4">What is the Partnership?</h2>
      <p className="text-lg text-gray-300 leading-relaxed">
        We warmly invite you to continue your spiritual journey with us. At <strong>aMusicBible</strong>,
        we are dedicated to supporting your spiritual growth by providing everything you need to deepen your faith.
        Discover new and uplifting resources, such as guided meditations, peaceful rhythms, and insights into
        the true essence of a Christian life. We’d also love to hear from you—share your testimonies and
        feedback with us, and let’s grow together in faith and love. Your journey is our joy!
      </p>
    </div>

    {/* Image */}
    <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0" data-aos="fade-up">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        <img
          src="/path-to-your-image.png" 
          alt="Partnership Screenshot"
          className="w-full h-auto"
        />
      </div>
    </div>
  </div>
</section>

<section className="relative min-h-screen flex items-center justify-center px-6" style={{ backgroundImage: 'radial-gradient(circle at bottom, #60a5fa, #000000 50%)' }}>
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

<section className="bg-black text-white py-16">
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


    </>
  );
}
