import { memo, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.webp";

const ProgressiveImg = ({
  placeholderSrc = logo,
  progressiveImgClassName = "",
  src,
  alt = "",
  title = "",
  className,
  width = 200, // default width
  height = 200, // default height
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);

  useEffect(() => {
    setImgSrc(placeholderSrc);
    const img = new window.Image();
    img.src = src;
    img.onload = () => setImgSrc(src);
  }, [src, placeholderSrc]);

  const customClass = useMemo(() => {
    return placeholderSrc && imgSrc === placeholderSrc
      ? `progressive-img-loading ${progressiveImgClassName}`
      : "progressive-img-loaded";
  }, [imgSrc, placeholderSrc]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      title={title}
      width={width}
      height={height}
      className={`object-contain image-rendering-optimize ${customClass} ${className}`}
      loading="lazy"
      fetchPriority="high"
      {...props}
    />
  );
};

export default memo(ProgressiveImg);
