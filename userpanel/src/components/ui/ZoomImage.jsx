// import { useState, useRef } from "react";

// export default function ZoomImage({ src, alt }) {
//   const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
//   const [isHovering, setIsHovering] = useState(false);
//   const imageRef = useRef(null);

//   const handleMouseMove = (e) => {
//     if (imageRef.current) {
//       const rect = imageRef.current.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       // Constrain position within image bounds
//       const constrainedX = Math.max(0, Math.min(rect.width, x));
//       const constrainedY = Math.max(0, Math.min(rect.height, y));
//       setLensPosition({ x: constrainedX, y: constrainedY });
//       setIsHovering(true);
//     }
//   };

//   const handleMouseLeave = () => {
//     setIsHovering(false);
//   };

//   // Calculate zoom level and dimensions
//   const zoomLevel = 2; // 2x zoom
//   const imageWidth = imageRef.current?.width || 100; // Fallback width
//   const imageHeight = imageRef.current?.height || 100; // Fallback height

//   // Calculate centered background position
//   const bgPosX = lensPosition.x * zoomLevel - imageWidth / 2;
//   const bgPosY = lensPosition.y * zoomLevel - imageHeight / 2;

//   // Constrain background position to prevent blank areas or compression
//   const boundedBgPosX = Math.max(
//     0, // Ensure right edge is fully visible
//     Math.min(imageWidth * (zoomLevel - 1), bgPosX)
//   );
//   const boundedBgPosY = Math.max(
//     0, // Adjusted to ensure top edge is fully visible
//     Math.min(imageHeight * (zoomLevel - 1), bgPosY)
//   );

//   return (
//     <div
//       className="zoom-container w-full h-full relative overflow-hidden"
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//     >
//       {/* Base Image */}
//       <img
//         ref={imageRef}
//         src={src}
//         alt={alt}
//         className="object-cover w-full h-full fixed-image"
//         style={{
//           width: "100%",
//           height: "100%",
//           opacity: isHovering ? 0 : 1, // Hide base image while zooming
//           transition: "opacity 0.2s ease-in-out",
//         }}
//         onError={() => console.error("Image failed to load:", src)} // Debug image issues
//       />
//       {/* Full-Width Magnified Area */}
//       {isHovering && (
//         <div
//           className="magnified-area"
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%", // Full width
//             height: "100%", // Full height
//             backgroundImage: `url(${src})`,
//             backgroundSize: `${imageWidth * zoomLevel}px ${
//               imageHeight * zoomLevel
//             }px`, // 2x zoom
//             backgroundPosition: `-${boundedBgPosX}px -${boundedBgPosY}px`, // Centered on cursor
//             backgroundRepeat: "no-repeat",
//             pointerEvents: "none",
//             zIndex: 10,
//             opacity: 1, // Fully opaque
//           }}
//         />
//       )}
//     </div>
//   );
// }

import { useState, useRef } from "react";
import { ProgressiveImg } from "../dynamiComponents";

export default function ZoomImage({ src, alt, placeholderSrc }) {
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Constrain position within image bounds
      const constrainedX = Math.max(0, Math.min(rect.width, x));
      const constrainedY = Math.max(0, Math.min(rect.height, y));
      setLensPosition({ x: constrainedX, y: constrainedY });
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Calculate zoom level and dimensions
  const zoomLevel = 2; // 2x zoom
  const imageWidth = imageRef.current?.width || 100; // Fallback width
  const imageHeight = imageRef.current?.height || 100; // Fallback height

  // Calculate centered background position
  const bgPosX = lensPosition.x * zoomLevel - imageWidth / 2;
  const bgPosY = lensPosition.y * zoomLevel - imageHeight / 2;

  // Constrain background position to prevent blank areas or compression
  const boundedBgPosX = Math.max(
    0, // Ensure right edge is fully visible
    Math.min(imageWidth * (zoomLevel - 1), bgPosX)
  );
  const boundedBgPosY = Math.max(
    0, // Ensure top edge is fully visible
    Math.min(imageHeight * (zoomLevel - 1), bgPosY)
  );

  return (
    <div
      className="zoom-container w-full h-full relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base Image with Progressive Loading */}
      <ProgressiveImg
        ref={imageRef}
        src={src}
        alt={alt}
        placeholderSrc={placeholderSrc}
        width={imageWidth}
        height={imageHeight}
        className="object-cover w-full h-full fixed-image"
        style={{
          width: "100%",
          height: "100%",
          opacity: isHovering ? 0 : 1, // Hide base image while zooming
          transition: "opacity 0.2s ease-in-out",
        }}
        onError={() => console.error("Image failed to load:", src)} // Debug image issues
      />
      {/* Full-Width Magnified Area */}
      {isHovering && (
        <div
          className="magnified-area"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%", // Full width
            height: "100%", // Full height
            backgroundImage: `url(${src})`, // Use high-res src
            backgroundSize: `${imageWidth * zoomLevel}px ${
              imageHeight * zoomLevel
            }px`, // 2x zoom
            backgroundPosition: `-${boundedBgPosX}px -${boundedBgPosY}px`, // Centered on cursor
            backgroundRepeat: "no-repeat",
            pointerEvents: "none",
            zIndex: 10,
            opacity: 1, // Fully opaque
          }}
        />
      )}
    </div>
  );
}
