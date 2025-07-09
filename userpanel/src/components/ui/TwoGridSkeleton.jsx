import SkeletonLoader from "./skeletonLoader";

const TwoGridSkeleton = ({ className }) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 pt-12 md:pt-16 2xl:pt-20 4xl:pt-24 container ${className}`}
    >
      {[...Array(2)].map((_, index) => (
        <div key={`skeleton-text-above-image-${index}`} className="relative">
          <SkeletonLoader
            height="h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px]"
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
};

export default TwoGridSkeleton;
