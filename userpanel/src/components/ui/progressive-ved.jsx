"use client";

import { memo, useCallback, useMemo, useState } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.webp";
import CustomImg from "./custom-img";

const ProgressiveVed = ({
  placeholderSrc = logo,
  src,
  type = "video/mp4",
  className = "",
  width = 200, // default width
  height = 200, // default height
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
    <>
      {isVideoLoading && (
        <CustomImg
          srcAttr={placeholderSrc}
          alt={"Loading..."}
          width={width}
          height={height}
          className={`object-cover w-full h-full image-rendering-optimize ${customClass} ${className}`}
          priority
          {...props}
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
    </>
  );
};

export default memo(ProgressiveVed);
