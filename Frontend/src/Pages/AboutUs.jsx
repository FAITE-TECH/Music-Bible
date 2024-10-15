import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AboutUs() {
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS for animations
  }, []);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col justify-center items-center relative">
      {/* Main content */}
      <div className="container px-6 py-10 mx-auto text-center" data-aos="fade-up">
        <h1 className="text-5xl font-extrabold mb-6 text-indigo-400" data-aos="fade-right">
          Welcome to aMusicBible
        </h1>
        <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-6" data-aos="fade-up">
          At aMusicBible, we believe music has the power to inspire, uplift, and connect us. 
          Our mission is to provide a space where every music lover can explore, discover, 
          and dive deep into the world of sound.
        </p>
        <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-6" data-aos="fade-left">
          Whether you're looking for the latest tracks, classic hits, or hidden gems, 
          aMusicBible offers something for everyone. We celebrate all genres, from 
          timeless ballads to electric beats, and our team is passionate about curating 
          the best musical experiences.
        </p>
        <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-8" data-aos="fade-right">
          Join us on a journey through melodies, rhythms, and harmonies, and let 
          the music be your guide.
        </p>
        <a 
          href="/contactus" 
          className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-full transition-colors duration-300"
          data-aos="zoom-in"
        >
          Contact Us
        </a>
      </div>

      {/* Image section */}
      <div className="w-full flex justify-center mt-12" data-aos="fade-up" data-aos-delay="300">
        <img 
          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/3c3bd85e-3a2d-412d-8791-509b8e76b7a8/d5ppvhl-ccdd44f0-10fd-479a-95d9-6adbac297604.jpg/v1/fill/w_900,h_675,q_75,strp/music_website_background_image_by_cooluani_d5ppvhl-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzNjM2JkODVlLTNhMmQtNDEyZC04NzkxLTUwOWI4ZTc2YjdhOFwvZDVwcHZobC1jY2RkNDRmMC0xMGZkLTQ3OWEtOTVkOS02YWRiYWMyOTc2MDQuanBnIiwiaGVpZ2h0IjoiPD02NzUiLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLndhdGVybWFyayJdLCJ3bWsiOnsicGF0aCI6Ilwvd21cLzNjM2JkODVlLTNhMmQtNDEyZC04NzkxLTUwOWI4ZTc2YjdhOFwvY29vbHVhbmktNC5wbmciLCJvcGFjaXR5Ijo5NSwicHJvcG9ydGlvbnMiOjAuNDUsImdyYXZpdHkiOiJjZW50ZXIifX0.dddpzBcUMRTWftBEjTNIfaMdysq_Px_rVyTYr3T6FCs" // Replace with your own image URL
          alt="Music Vibes" 
          className="rounded-lg shadow-lg object-cover w-3/4 md:w-1/2 lg:w-1/3"
        />
      </div>

      {/* Wave effect */}
      <div className="wave-bg absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-black"></div>

      {/* Style for wave background */}
      <style jsx>{`
        .wave-bg {
          background: url('https://www.transparenttextures.com/patterns/wave.png');
        }
      `}</style>
    </div>
  );
}
