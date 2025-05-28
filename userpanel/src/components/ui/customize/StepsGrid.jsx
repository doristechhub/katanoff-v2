
import { CustomImg } from "@/components/dynamiComponents";
import breadCrumb from "@/assets/icons/breadCrumbBigArrow.svg";
import Link from "next/link";

const StepsGrid = ({ steps = [], currentStep }) => {
  return (
    <div className="flex justify-center items-center px-3 py-2 rounded-md w-fit md:w-full flex-wrap gap-2">
      {steps.map((step, index) => (
        <div key={`breadcrumb-${index}`} className="flex items-center gap-2">
          <div className="flex flex-col items-start gap-0.5">
            <span
              className={`hidden sm:inline text-sm md:text-base lg:text-lg ${
                currentStep === step.id
                  ? "font-bold text-baseblack"
                  : "text-gray-500"
              }`}
            >
              {step.id}. {step.label}
            </span>
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

          {step.icon && (
            <CustomImg
              srcAttr={step.icon}
              altAttr={`${step.label} icon`}
              titleAttr=""
              className={`w-6 h-6 md:w-7 md:h-7 transition-opacity duration-300 ${
                currentStep === step.id ? "opacity-100" : "opacity-50"
              }`}
            />
          )}

          {index < steps.length - 1 && (
            <CustomImg
              srcAttr={breadCrumb}
              altAttr="Arrow"
              titleAttr="Arrow"
              className="w-[50px] sm:w-[50px] h-[12px] md:w-[90px] md:h-[20px] lg:w-[150px] lg:h-[20px] xl:w-[200px] xl:h-[20px]"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepsGrid;
