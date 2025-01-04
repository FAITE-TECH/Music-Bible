import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import cir1 from "../assets/Logo/cir1.png";
import cir2 from "../assets/Logo/cir2.png";
import cir3 from "../assets/Logo/cir3.png";
import cir4 from "../assets/Logo/cir4.png";

export default function ScrollSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isInSection, setIsInSection] = useState(false); // Tracks if we are within the section
  const images = [cir1, cir2, cir3, cir4];

  const handleScroll = () => {
    const scrollPosition = window.scrollY; // Current scroll position
    const windowHeight = window.innerHeight; // Height of the viewport
    const sectionTop = document.querySelector("section")?.offsetTop || 0; // Top of the section
    const sectionHeight = windowHeight * images.length; // Total height of the section (100vh per image)
    const sectionBottom = sectionTop + sectionHeight;

    // Check if we are within the section's scrollable area
    if (scrollPosition >= sectionTop - windowHeight && scrollPosition < sectionBottom) {
      setIsInSection(true);

      // Calculate the image index based on scroll position
      const imageIndex = Math.min(
        Math.floor(((scrollPosition - sectionTop) / sectionHeight) * images.length),
        images.length - 1
      );
      setCurrentImage(imageIndex);
    } else {
      setIsInSection(false); // Outside the section, hide all images
      setCurrentImage(0); // Reset the image index
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="relative bg-black text-white"
      style={{ height: `${images.length * 100}vh` }} // Total height based on number of images
    >
      <div className="fixed inset-0 flex items-center justify-center">
        {isInSection &&
          images.map((image, index) => (
            <motion.img
              key={index}
              src={image}
              alt={`Circular Image ${index + 1}`}
              initial={{ opacity: 0, scale: 0.5 }} // Initially scaled down and invisible
              animate={
                currentImage === index
                  ? { opacity: 1, scale: 1, rotate: [0, 360] }
                  : { opacity: 0, scale: 0.5 }
              }
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 0.5, ease: "easeOut" }, // Smooth scaling
                rotate: {
                  repeat: currentImage === index ? Infinity : 0,
                  duration: 10,
                  ease: "linear",
                },
              }}
              className="absolute items-center w-[670px] h-[670px]" // Use Tailwind to control size
            />
          ))}
      </div>
    </section>
  );
}
