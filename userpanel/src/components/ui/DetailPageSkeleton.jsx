import SkeletonLoader from "@/components/ui/skeletonLoader";

export default function DetailPageSkeleton() {
  const skeletons = [
    { width: "w-[40%]", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
    { width: "w-[40%]", height: "h-4", margin: "mt-6" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
  ];
  return (
    <div className={`container grid grid-cols-1 md:grid-cols-2 gap-12 pb-10`}>
      <div className=" auto-rows-min pt-6">
        <SkeletonLoader height="w-full h-[300px] md:h-[400px]  2xl:h-[500px]" />
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
