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

    const constrainedX = Math.max(0, Math.min(rect.width, x));
    const constrainedY = Math.max(0, Math.min(rect.height, y));
    setLensPosition({ x: constrainedX, y: constrainedY });
  };

  const handleClick = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1240) {
      setIsZoomed((prev) => !prev);
    }
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
      style={{ display: "flex", flexDirection: "column" }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <ProgressiveImg
        ref={imageRef}
        src={src}
        alt={alt}
        placeholderSrc={placeholderSrc}
        className="w-full h-full object-cover"
        style={{ aspectRatio: "4/3", display: "block" }}
        onError={() => console.error("Image failed to load:", src)}
      />

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
