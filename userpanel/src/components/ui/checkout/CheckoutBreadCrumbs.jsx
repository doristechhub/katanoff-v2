const steps = ["Delivery", "Shipping", "Payment", "Order Success"];
import breadCrumbArrow from "@/assets/icons/breadCrumbArrow.svg";
import { CustomImg } from "@/components/dynamiComponents";

const CheckoutBreadCrumbs = ({ currentStep }) => {
  return (
    <div className="flex  bg-[#F7F7F7] border border-gray-e2 w-fit">
      {steps.map((step, index) => (
        <div key={`breadcrumb-${index}`} className="flex items-center">
          {/* Step */}
          <div className="px-3 py-3 xss:px-5 text-center whitespace-nowrap">
            <span
              className={`text-base  ${
                index === currentStep
                  ? "font-bold text-baseblack md:!text-xl"
                  : "text-gray-500"
              }`}
            >
              <span className="hidden md:inline">
                {index + 1}. {step}
              </span>
              <span className="inline md:hidden">
                {index === currentStep ? `${index + 1}. ${step}` : index + 1}
              </span>
            </span>
          </div>

          {index < steps?.length - 1 && (
            <div className="h-full">
              <CustomImg srcAttr={breadCrumbArrow} altAttr="" titleAttr="" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutBreadCrumbs;
