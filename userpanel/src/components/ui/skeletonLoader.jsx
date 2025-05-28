const SkeletonLoader = ({
  width = "w-full",
  height = "h-[300px]",
  className = "",
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${width} ${height} ${className}`}
    ></div>
  );
};

export default SkeletonLoader;
