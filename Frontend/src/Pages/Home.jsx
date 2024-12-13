import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import video from '../assets/Logo/design.mp4';
import logo from '../assets/Logo/logo.png';
import AOS from "aos";
import "aos/dist/aos.css";


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

    {/* Logo and Title */}
    <div className="absolute top-6 left-6 flex items-center" data-aos="fade-right">
      <img
        src={logo} // Replace with the actual logo path
        alt="Logo"
        className="h-12 mr-4"
      />
      <h2 className="text-2xl text-white font-bold">aMusicBible</h2>
    </div>

    {/* Text Content */}
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
        src="/path-to-phone-image.jpg" // Replace with the actual image path
        alt="App Screenshot"
        className="w-80 md:w-96"
      />
    </motion.div>
  </div>
</section>


    </>
  );
}
