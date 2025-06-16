import { useState, useRef, useEffect } from "react";
import { ProgressiveImg } from "../dynamiComponents";

export default function ZoomImage({ src, alt }) {
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const imageRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (imageRef.current) {
        const { width, height } = imageRef.current.getBoundingClientRect();
        setImageDimensions({ width, height });
        if (isZoomed) {
          setLensPosition({
            x: width / 2,
            y: height / 2,
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const img = imageRef.current?.querySelector("img");
    if (img) {
      img.onload = updateDimensions;
      img.onerror = () => console.error("Image failed to load:", src);
    }

    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (img) img.onload = null;
    };
  }, [src, isZoomed]);

  const handleMouseMove = (e) => {
    if (!isZoomed || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const constrainedX = Math.max(0, Math.min(rect.width, x));
    const constrainedY = Math.max(0, Math.min(rect.height, y));
    setLensPosition({ x: constrainedX, y: constrainedY });
  };

  const handleClick = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1240) {
      setIsZoomed((prev) => {
        const newZoomed = !prev;
        if (newZoomed && imageRef.current) {
          const { width, height } = imageRef.current.getBoundingClientRect();
          setLensPosition({
            x: width / 2,
            y: height / 2,
          });
        }
        return newZoomed;
      });
    }
  };

  const zoomLevel = 2;
  const { width: imageWidth, height: imageHeight } = imageDimensions;

  const bgPosX = lensPosition.x * (zoomLevel - 1);
  const bgPosY = lensPosition.y * (zoomLevel - 1);

  const boundedBgPosX = Math.max(
    0,
    Math.min(imageWidth * (zoomLevel - 1), bgPosX)
  );
  const boundedBgPosY = Math.max(
    0,
    Math.min(imageHeight * (zoomLevel - 1), bgPosY)
  );

  return (
    <div
      className={`zoom-container w-full h-full relative ${
        isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
      }`}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <ProgressiveImg
        ref={imageRef}
        src={src}
        className="w-full h-full !object-cover"
        style={{ aspectRatio: "4/4", display: "block" }}
        alt={alt}
      />

      {isZoomed && imageWidth > 0 && imageHeight > 0 && (
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${imageWidth * zoomLevel}px ${
              imageHeight * zoomLevel
            }px`,
            backgroundPosition: `-${boundedBgPosX}px -${boundedBgPosY}px`,
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
    </div>
  );
}
