import { CustomImg } from "@/components/dynamiComponents";
import breadCrumb from "@/assets/icons/breadCrumbBigArrow.svg";
import Link from "next/link";
const StepsGrid = ({ steps = [], currentStep }) => {
  return (
    <div className="flex justify-center items-center px-3 py-2 rounded-md  w-full flex-wrap gap-2">
      {steps.map((step, index) => (
        <div key={`breadcrumb-${index}`} className="flex items-center gap-4">
          <div className="flex flex-col items-start gap-0.5">
            {/* 👇 Shown on screens smaller than `sm` */}
            <span
              className={`block sm:hidden text-lg font-bold ${
                currentStep === step.id ? "text-baseblack" : "text-gray-500"
              }`}
            >
              {step.id}
            </span>

            {/* 👇 Shown on `sm` and larger screens */}
            <div className="hidden sm:grid grid-cols-[auto_1fr] gap-x-2 text-sm md:text-base lg:text-lg xl:text-xl">
              {/* ID that spans both lines */}
              <span
                className={`row-span-2 ${
                  currentStep === step.id
                    ? "font-bold text-baseblack"
                    : "text-gray-500"
                } text-lg md:text-xl lg:text-2xl 2xl:text-3xl 4xl:text-4xl leading-none pt-1`}
              >
                {step.id}
              </span>

              {/* First line: Label */}
              <span
                className={`${
                  currentStep === step.id ? "text-baseblack" : "text-gray-500"
                } !text-base`}
              >
                {step.label}
              </span>

              {/* Second line: Label Detail */}
              <span
                className={`${
                  currentStep === step.id
                    ? "font-bold text-baseblack"
                    : "text-gray-500"
                }`}
              >
                {step.labelDetail}
              </span>
            </div>

            {/* Sub Options */}
            {step?.subOption?.length > 0 && currentStep === step.id && (
              <div className="hidden sm:flex gap-2 text-xs md:text-sm text-gray-500">
                {step.subOption.map((sub, subIdx) => (
                  <Link key={subIdx} href={sub.route} className="underline">
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {index < steps.length - 1 && (
            <CustomImg
              srcAttr={breadCrumb}
              altAttr="Arrow"
              titleAttr="Arrow"
              className="w-[50px] sm:w-[50px] h-[12px] md:w-[120px] md:h-[20px] lg:w-[180px] lg:h-[20px] xl:w-[250px] xl:h-[20px]"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepsGrid;
