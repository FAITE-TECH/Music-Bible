import React from 'react';
import { motion } from 'framer-motion';
import video from '../assets/Logo/design.mp4';

export default function Home() {
  return (
    <>
      {/* Main Section */}
      <section className="relative bg-black text-white py-20 px-6 min-h-screen flex flex-col items-center justify-center">
        
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={video}/>
          Your browser does not support the video tag.
        </video>

        {/* Content on top of the video */}
        <div className="relative z-10 container mx-auto text-center">
          {/* Example content */}
        </div>

        {/* Animated images at the bottom-left corner */}
        <motion.div
          className="fixed bottom-4 left-4 flex flex-col space-y-4 z-10"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80, duration: 0.1 }}
        >
          {/* First image (Google Play) */}
          <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png"
                alt="Google Play"
                className="w-[150px] h-auto"
              />
            </motion.div>
          </a>

          {/* Second image (Apple Store) */}
          <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
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
    </>
  );
}
