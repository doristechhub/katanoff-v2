import breadCrumbArrow from "@/assets/icons/customizeBreadCrumbArrow.svg";
import { CustomImg } from "@/components/dynamiComponents";
import Link from "next/link";

const StepsGrid = ({ steps = [], currentStep }) => {
  return (
    <div className="flex bg-[#F7F7F7] border border-gray-e2 mx-auto w-fit md:w-full">
      {/* Fixed label on the left */}
      <div className="hidden lg:block">
        <div className="flex items-center">
          <div className="px-4  text-sm md:text-lg font-medium text-black whitespace-nowrap">
            Design Your Ring
          </div>
          <div className="flex items-center pr-2">
            <CustomImg srcAttr={breadCrumbArrow} altAttr="" titleAttr="" />
          </div>
        </div>
      </div>

      {/* Steps with logic */}
      {steps.map((step, index) => (
        <div
          key={`breadcrumb-${index}`}
          className="flex items-center md:flex-1"
        >
          {/* Step text and suboptions */}
          <div className="md:flex-1 px-3 xss:px-5 whitespace-nowrap">
            <span
              className={` flex gap-2 text-lg ${
                currentStep === step.id
                  ? "font-medium text-baseblack md:!text-xl"
                  : "text-gray-500"
              }`}
            >
              <span className="inline text-3xl md:text-5xl px-2">
                {step.id}
              </span>

              <div className="flex flex-col align-middle items-center justify-center">
                <span className="hidden md:inline">{step.label}</span>
                {/* <span className="inline md:hidden">
                  {currentStep === step.id
                    ? `${step.id}. ${step.label}`
                    : step.id}
                </span> */}
                {step?.subOption?.length > 0 && (
                  <div className="hidden md:block">
                    <div className="mt-1 flex gap-2 !text-sm md:text-base !text-gray-500 ">
                      {step.subOption.map((sub, subIdx) => (
                        <Link
                          key={`sub-${subIdx}`}
                          href={sub.route}
                          className="underline"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </span>
          </div>
          {step.icon && (
            <div className="hidden xl:block mt-1  2xl:pr-8">
              <CustomImg
                srcAttr={step.icon}
                altAttr={`${step.label} icon`}
                titleAttr=""
                className={`w-10 h-10 transition-opacity duration-300 ${
                  currentStep === step.id ? "opacity-100" : "opacity-50"
                }`}
              />
            </div>
          )}

          {/* Arrow after each step except the last */}
          {index < steps.length - 1 && (
            <div className="flex items-center 2xl:pr-2">
              <CustomImg
                srcAttr={breadCrumbArrow}
                altAttr=""
                titleAttr=""
                className="!h-[71px]"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepsGrid;
