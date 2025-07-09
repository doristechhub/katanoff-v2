import SkeletonLoader from "./skeletonLoader";

const ThreeGridSkeleton = ({ className }) => {
  return (
    <section className={`${className} container pt-8 lg:pt-6 2xl:pt-6`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {[...Array(3)].map((_, index) => (
          <div
            key={`skeleton-gift-collection-${index}`}
            className="flex flex-col"
          >
            <SkeletonLoader
              height="h-[300px] md:h-[350px] lg:h-[400px]"
              className="w-full"
            />
            <SkeletonLoader
              height="h-4 md:h-5"
              width="w-32 md:w-40"
              className="mt-4"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThreeGridSkeleton;
