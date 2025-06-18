const steps = ["Delivery", "Shipping", "Payment", "Order Success"];
import breadCrumb from "@/assets/icons/breadCrumb.svg";
import { CustomImg } from "@/components/dynamiComponents";

const CheckoutBreadCrumbs = ({ currentStep }) => {
  return (
    <div className="flex  items-center px-3 py-2 rounded-md w-fit">
      {steps.map((step, index) => (
        <div key={`breadcrumb-${index}`} className="flex items-center">
          <span
            className={`text-sm md:text-base lg:text-lg ${
              index === currentStep
                ? "font-bold text-baseblack"
                : "text-gray-500"
            }`}
          >
            {index + 1}.{" "}
            {index === steps.length - 1 ? (
              <>
                <span className="hidden sm:inline">Order Success</span>
                <span className="inline sm:hidden">Success</span>
              </>
            ) : (
              step
            )}
          </span>

          {index < steps.length - 1 && (
            <div className="mx-2">
              <CustomImg
                srcAttr={breadCrumb}
                altAttr="Arrow"
                titleAttr="Arrow"
                className="w-[30px] h-[12px] md:w-[24px] md:h-[20px]"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutBreadCrumbs;
