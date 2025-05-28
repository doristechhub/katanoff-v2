import { useState, useRef } from "react";
import { ProgressiveImg } from "../dynamiComponents";

export default function ZoomImage({ src, alt, placeholderSrc }) {
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!isZoomed || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clamp inside bounds
    const constrainedX = Math.max(0, Math.min(rect.width, x));
    const constrainedY = Math.max(0, Math.min(rect.height, y));
    setLensPosition({ x: constrainedX, y: constrainedY });
  };

  const handleClick = () => {
    setIsZoomed((prev) => !prev);
  };

  const zoomLevel = 2;
  const imageWidth = imageRef.current?.width || 100;
  const imageHeight = imageRef.current?.height || 100;

  const bgPosX = lensPosition.x * zoomLevel - imageWidth / 2;
  const bgPosY = lensPosition.y * zoomLevel - imageHeight / 2;

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
      className={`zoom-container w-full h-full relative overflow-hidden ${
        isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
      }`}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Base Image */}
      <ProgressiveImg
        key={src}
        ref={imageRef}
        src={src}
        alt={alt}
        placeholderSrc={placeholderSrc}
        width={imageWidth}
        height={imageHeight}
        className="object-cover w-full h-full"
        style={{
          width: "100%",
          height: "100%",
          opacity: isZoomed ? 0 : 1,
          transition: "opacity 0.2s ease-in-out",
        }}
        onError={() => console.error("Image failed to load:", src)}
      />

      {/* Zoomed Area */}
      {isZoomed && (
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
