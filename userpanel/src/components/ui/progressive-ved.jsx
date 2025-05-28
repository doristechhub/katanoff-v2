"use client";

import { memo, useCallback, useMemo, useState } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.webp";

const ProgressiveVed = ({
  placeholderSrc = logo,
  src,
  type = "video/mp4",
  className = "",
  width = 320,
  height = 240,
  ...props
}) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const handleVideoLoad = useCallback(() => {
    setIsVideoLoading(false);
  }, []);

  const customClass = useMemo(() => {
    return isVideoLoading
      ? "w-full h-full animate-fade-in"
      : "opacity-100 w-full h-full object-contain transition-all duration-500";
  }, [isVideoLoading]);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {isVideoLoading && (
        <Image
          src={placeholderSrc}
          alt="Loading video"
          width={width}
          height={height}
          className="opacity-25 absolute  animate-fade-in"
          style={{ zIndex: 5 }}
        />
      )}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        width={width}
        height={height}
        onLoadedData={handleVideoLoad}
        onCanPlay={handleVideoLoad}
        className={`${customClass} ${className}`}
        {...props}
      >
        <source src={src} type={type} />
      </video>
    </div>
  );
};

export default memo(ProgressiveVed);
