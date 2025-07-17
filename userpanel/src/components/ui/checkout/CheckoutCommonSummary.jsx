import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { CustomImg } from "@/components/dynamiComponents";
import { helperFunctions, SALES_TAX_PERCENTAGE_VALUE } from "@/_helper";
import { useMemo } from "react";

export default function CheckoutCommonSummary({
  isMobile = false,
  getSubTotal,
  getSalesTaxAmount,
  selectedShippingCharge,
  getGrandTotal,
  paymentOptions,
}) {
  const pathname = usePathname();

  const { appliedPromoDetail, discountAmount } = useSelector(
    ({ coupon }) => coupon
  );
  const calculateNextStep = useMemo(() => {
    return <span className="text-lg font-normal">Calculated at next step</span>;
  }, []);

  return (
    <section
      className={`${isMobile ? "px-4 pt-4 pb-4" : "px-2 xs:px-10 pt-6"}`}
    >
      <p className="text-base sm:text-lg text-baseblack flex justify-between font-semibold pt-4">
        Subtotal:{" "}
        <span>{helperFunctions?.formatCurrencyWithDollar(getSubTotal())}</span>
      </p>

      {appliedPromoDetail && (
        <div className="flex justify-between pt-2 sm:pt-4 text-baseblack">
          <p className="text-base sm:text-lg font-semibold">
            Discount ({appliedPromoDetail?.promoCode})
          </p>
          <span className="text-lg font-medium">
            -{helperFunctions?.formatCurrencyWithDollar(discountAmount)}
          </span>
        </div>
      )}

      {pathname === "/checkout" ? (
        <p className="text-base sm:text-lg font-semibold pt-2 sm:pt-4 flex justify-between text-baseblack">
          Sales Tax {calculateNextStep}
        </p>
      ) : (
        <div className="flex justify-between pt-2 sm:pt-4 text-baseblack">
          <p className="text-base sm:text-lg font-semibold max-w-[75%]">
            Sales Tax ({SALES_TAX_PERCENTAGE_VALUE})
            <br />
            <span className="text-xs text-gray-500 font-normal leading-snug">
              *Applies to New York addresses only.
            </span>
          </p>
          <span className="text-base sm:text-lg font-medium">
            {helperFunctions?.formatCurrencyWithDollar(getSalesTaxAmount())}
          </span>
        </div>
      )}

      {pathname === "/checkout" ? (
        <p className="text-base sm:text-lg font-semibold flex justify-between pt-4 text-baseblack">
          Shipping {calculateNextStep}
        </p>
      ) : (
        <div className="flex justify-between pt-2 sm:pt-4 text-baseblack">
          <p className="text-base sm:text-lg font-semibold max-w-[75%]">
            Shipping
          </p>
          <span className="text-lg font-medium">
            {selectedShippingCharge > 0 ? "$" + selectedShippingCharge : "Free"}
          </span>
        </div>
      )}

      <p className="my-2 sm:my-4 border-t border-grayborder" />

      <p className="text-base sm:text-lg flex font-semibold pt-2 justify-between  text-baseblack">
        Grand Total:{" "}
        <span>
          {helperFunctions?.formatCurrencyWithDollar(getGrandTotal())}
        </span>
      </p>

      <div className="py-3 sm:py-6">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="flex-grow h-px bg-gray-300" />
          <p className="text-sm md:text-base font-medium uppercase">
            We Accept Payment
          </p>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <div className="flex items-center gap-3">
          <p className="font-medium text-gray-500">Pay With:</p>
          <div className="flex gap-3 xl:gap-6 flex-wrap">
            {paymentOptions?.map((option, index) => (
              <CustomImg
                key={index}
                srcAttr={option?.img}
                titleAttr={option?.titleAttr}
                altAttr={option?.altAttr}
                className="object-contain w-8 h-10 xs:w-10 xs:h-10"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
