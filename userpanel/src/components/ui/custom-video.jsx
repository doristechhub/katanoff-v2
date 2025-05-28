"use client";
import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa6";
import { CustomImg } from "../dynamiComponents";
export default function CustomVideo({ videoSrc, thumbnail }) {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleThumbnailClick = () => {
    setIsPlaying(true);
    videoRef.current.play();
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section
      ref={sectionRef}
      className={`transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div
        className="relative aspect-video"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <video
          ref={videoRef}
          muted
          loop
          preload="none"
          aria-label="Video player"
          className="h-full w-full object-contain overflow-hidden"
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {!isPlaying && (
          <div
            className="absolute cursor-pointer inset-0 flex items-center justify-center z-40"
            onClick={handleThumbnailClick}
          >
            <CustomImg
              srcAttr={thumbnail}
              altAttr=""
              titleAttr=""
              fill
              className="absolute inset-0 h-full w-full object-cover overflow-hidden"
            />
            <div className="flex items-center justify-center z-40">
              <div className="h-12 w-12 2xl:h-14 2xl:w-14 rounded-full backdrop-blur bg-black/10 flex items-center justify-center">
                <FaPlay className="text-xl 2xl:text-2xl text-white" />
              </div>
            </div>
          </div>
        )}

        {isPlaying && (
          <div
            className={`absolute inset-0 flex items-center justify-center cursor-pointer z-40 ${
              isHovered ? "block" : "hidden"
            }`}
            onClick={togglePlayPause}
          >
            <div className="h-12 w-12 2xl:h-14 2xl:w-14 rounded-full backdrop-blur bg-black/10 flex items-center justify-center">
              <FaPause className="text-xl 2xl:text-2xl text-white" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
