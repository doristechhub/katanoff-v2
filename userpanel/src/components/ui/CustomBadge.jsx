import { helperFunctions } from "@/_helper";

const CustomBadge = ({ status, children, className = "" }) => {
  const color = helperFunctions.getStatusCustomBadge(status); // e.g., "green" or "#58a4bd"

  const isHex = color.startsWith("#");

  // Inline styles if color is a hex code
  const style = isHex
    ? {
        color: color,
        backgroundColor: hexToRgba(color, 0.2),
      }
    : {};

  // Tailwind class-based for named colors
  const textClass = isHex ? "" : `text-${color}-600`;
  const bgClass = isHex ? "" : `bg-${color}-600/20`;

  return (
    <span
      className={`px-3 py-[6px] capitalize text-[13px] font-semibold ${textClass} ${bgClass} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};

// Helper to convert hex to rgba
function hexToRgba(hex, opacity) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default CustomBadge;
