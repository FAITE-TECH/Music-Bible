import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import cir1 from "../assets/Logo/cir1.png";
import cir2 from "../assets/Logo/cir2.png";
import cir3 from "../assets/Logo/cir3.png";
import cir4 from "../assets/Logo/cir4.png";

export default function ScrollSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isInSection, setIsInSection] = useState(false);
  const images = [cir1, cir2, cir3, cir4];

  const sectionRef = useRef(null);

  const handleScroll = () => {
    if (!sectionRef.current) return;

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const sectionTop = sectionRef.current.offsetTop;
    const sectionHeight = windowHeight * images.length;
    const sectionBottom = sectionTop + sectionHeight;

    if (scrollPosition >= sectionTop - windowHeight && scrollPosition < sectionBottom) {
      setIsInSection(true);
      const imageIndex = Math.min(
        Math.floor(((scrollPosition - sectionTop + windowHeight / 3) / sectionHeight) * images.length),
        images.length - 1
      );
      setCurrentImage(imageIndex);
    } else {
      setIsInSection(false);
      setCurrentImage(0);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white min-h-screen py-40"
      style={{ height: `${images.length * 100}vh` }}
    >
      <div className="fixed inset-0 flex items-center justify-center">
        {isInSection &&
          images.map((image, index) => (
            <motion.img
              key={index}
              src={image}
              alt={`Circular Image ${index + 1}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                currentImage === index
                  ? { opacity: 1, scale: 1, rotate: [0, 360] }
                  : { opacity: 0, scale: 0.5 }
              }
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 0.5, ease: "easeOut" },
                rotate: {
                  repeat: currentImage === index ? Infinity : 0,
                  duration: 10,
                  ease: "linear",
                },
              }}
              className="fixed w-[400px] h-[400px] sm:w-[400px] sm:h-[400px] md:w-[400px] md:h-[400px] lg:w-[670px] lg:h-[670px]"
            />
          ))}
      </div>
    </section>
  );
}
