import React from 'react';
import { Link } from 'react-router-dom';
import { HiThumbUp, HiDownload, HiStar } from 'react-icons/hi';

export default function Home() {
  return (
    <>
      <section className="relative bg-gradient-to-r from-purple-900 via-purple-700 to-pink-500 text-white py-20 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          
          {/* Left side content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold">
              Where words fail, music speaks
            </h1>
            <p className="text-lg md:text-xl mt-6">
              Music expresses that which cannot be said and on which it is impossible to be silent. 
              Music in itself is healing. It's an explosive expression of humanity. 
              It's something we are all touched by. No matter what culture we're from, 
              everyone loves music.
            </p>
            
            <div className="mt-10 flex justify-center md:justify-start space-x-8">
              <div className="flex flex-col items-center">
                <HiDownload className="text-4xl md:text-5xl text-pink-500" />
                <span className="text-2xl font-bold mt-2">59664</span>
                <span className="text-lg">Downloads</span>
              </div>
              <div className="flex flex-col items-center">
                <HiThumbUp className="text-4xl md:text-5xl text-pink-500" />
                <span className="text-2xl font-bold mt-2">489664</span>
                <span className="text-lg">Likes</span>
              </div>
              <div className="flex flex-col items-center">
                <HiStar className="text-4xl md:text-5xl text-pink-500" />
                <span className="text-2xl font-bold mt-2">59656</span>
                <span className="text-lg">Rating</span>
              </div>
            </div>
            <div className='py-9'>
            <Link to="/download" className="mt-10 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white py-3 px-6 rounded-full font-bold shadow-lg">
              Download
            </Link>
            </div>
            
           
          </div>

         
          
          {/* Right side image */}
          <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center md:justify-end">
            <img src="https://mir-s3-cdn-cf.behance.net/projects/404/dffaab192750951.65e07e89a1a5b.jpg" alt="Music App" className="w-full max-w-sm md:max-w-md h-auto" />
          </div>
          
        </div>

      
      </section>
   
    </>
  );
}
