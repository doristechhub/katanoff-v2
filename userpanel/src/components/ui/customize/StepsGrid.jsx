import { CustomImg } from "@/components/dynamiComponents";
import breadCrumb from "@/assets/icons/breadCrumbBigArrow.svg";
import Link from "next/link";
const StepsGrid = ({ steps = [], currentStep, titleText }) => {
  return (
    <>
      <div className="flex justify-center items-center sm:px-3 py-2 rounded-md  w-full flex-wrap xs:gap-2">
        {steps.map((step, index) => (
          <div
            key={`breadcrumb-${index}`}
            className="flex items-center gap-1 sm:gap-4"
          >
            <div className="flex flex-col items-start gap-0.5">
              <span
                className={`block xss:hidden text-sm font-bold ${
                  currentStep === step.id ? "text-baseblack" : "text-gray-500"
                }`}
              >
                {step?.labelDetail}
              </span>
              {/* 👇 Shown on screens smaller than `sm` */}
              <span
                className={`hidden xss:block sm:hidden text-sm font-bold ${
                  currentStep === step.id ? "text-baseblack" : "text-gray-500"
                }`}
              >
                {step?.label}
                <br />
                {step?.labelDetail}
              </span>

              <div className="hidden sm:grid grid-cols-[auto_1fr] gap-x-2 text-sm md:text-base">
                <span
                  className={`row-span-2 ${
                    currentStep === step.id
                      ? "font-bold text-baseblack"
                      : "text-gray-500"
                  } text-lg md:text-xl lg:text-2xl 2xl:text-3xl 4xl:text-4xl leading-none pt-1`}
                >
                  {step.id}
                </span>
                <span
                  className={`${
                    currentStep === step?.id
                      ? "text-baseblack"
                      : "text-gray-500"
                  } !text-base`}
                >
                  {step.label}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`${
                      currentStep === step?.id
                        ? "font-bold text-baseblack"
                        : "text-gray-500"
                    }`}
                  >
                    {step.labelDetail}
                  </span>

                  {step?.subOption?.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs md:text-sm text-gray-500 pt-1">
                      {step.subOption.map((sub, subIdx) => (
                        <Link
                          key={subIdx}
                          href={sub.route}
                          className="underline"
                          onClick={(e) => {
                            sub.onClick?.();
                          }}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:hidden">
                {step?.subOption?.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs md:text-sm text-gray-500">
                    {step.subOption.map((sub, subIdx) => (
                      <Link
                        key={subIdx}
                        href={sub.route}
                        className="underline"
                        onClick={(e) => {
                          sub.onClick?.();
                        }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {index < steps.length - 1 && (
              <CustomImg
                srcAttr={breadCrumb}
                altAttr="Arrow"
                titleAttr="Arrow"
                className="w-[60px] h-[30px] md:w-[120px] md:h-[20px] lg:w-[180px] lg:h-[20px] xl:w-[250px] xl:h-[20px]"
              />
            )}
          </div>
        ))}
      </div>
      <div className="pt-6 lg:pt-8 2xl:pt-10 text-center flex justify-center">
        <p className="font-castoro text-lg xss::text-xl xs:text-2xl lg:text-3xl 2xl:text-4xl xs:w-[70%] lg:w-[45%] 2xl:w-[40%] 4xl:w-[35%]">
          {titleText}
        </p>
      </div>
    </>
  );
};

export default StepsGrid;
