import SkeletonLoader from "@/components/ui/skeletonLoader";

export default function DetailPageSkeleton() {
  const skeletons = [
    { width: "w-[40%]", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
    { width: "w-[40%]", height: "h-4", margin: "mt-6" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
  ];
  return (
    <div
      className={`container grid grid-cols-1 lg:grid-cols-[55%_auto] gap-12`}
    >
      <div className="grid grid-cols-2 gap-4 auto-rows-min">
        <SkeletonLoader height="w-full h-[200px] md:h-[300px]  2xl:h-[400px]" />
        <SkeletonLoader height="w-full h-[200px] md:h-[300px]  2xl:h-[400px]" />
        <SkeletonLoader height="w-full h-[200px] md:h-[300px]  2xl:h-[400px]" />
        <SkeletonLoader height="w-full h-[200px] md:h-[300px]  2xl:h-[400px]" />
      </div>
      <div>
        {Array(4)
          .fill(skeletons)
          .flat()
          .map((skeleton, index) => (
            <SkeletonLoader
              key={index}
              width={skeleton.width}
              height={skeleton.height}
              className={skeleton.margin}
            />
          ))}
      </div>
    </div>
  );
}
