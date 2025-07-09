import SkeletonLoader from "./skeletonLoader";

const HomePageSliderSkeleton = () => {
  return (
    <section className="container pt-12 lg:pt-16 2xl:pt-24">
      {/* Skeleton for the title */}
      <div className="text-center">
        <SkeletonLoader
          height="h-8 md:h-8 xl:h-9 2xl:h-10"
          width="w-48 md:w-56 xl:w-64"
          className="mx-auto"
        />
      </div>

      {/* Skeleton for the Swiper container */}
      <div className="relative mt-8 lg:mt-12 mx-8">
        {/* Skeleton for navigation arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10">
          <SkeletonLoader height="h-8 w-8" className="rounded-full" />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10">
          <SkeletonLoader height="h-8 w-8" className="rounded-full" />
        </div>

        <div className="lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-5 overflow-x-auto flex flex-row snap-x snap-mandatory scrollbar-hide">
          {[...Array(4)].map((_, index) => (
            <div
              key={`skeleton-slide-${index}`}
              className="flex flex-col flex-none w-full md:w-1/2 lg:w-auto snap-center px-2.5 first:pl-0 last:pr-0"
            >
              <SkeletonLoader
                height="h-[300px] md:h-[350px] 3xl:h-[400px]"
                className="w-full"
              />
              <SkeletonLoader
                height="h-4 lg:h-5"
                width="w-24 lg:w-32"
                className="mt-3"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePageSliderSkeleton;
