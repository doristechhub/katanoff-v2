import { CustomImg } from "@/components/dynamiComponents";
import stepArrow from "@/assets/icons/3stepArrow.svg";
import { helperFunctions } from "@/_helper";

const DiamondDetailDrawer = ({
  cartItem,
  isCheckoutPage = false,
  isOrderPage = false,
  openDiamondDetailDrawer,
  dispatch,
  setOpenDiamondDetailDrawer,
}) => {
  const drawerKey = helperFunctions?.getUniqueDrawerKey(cartItem);
  const isOpen = openDiamondDetailDrawer === drawerKey;
  if (!cartItem?.diamondDetail) return null;

  return (
    <div className="mt-2 xs:mt-4 border max-w-sm">
      <div
        className="flex w-full items-center justify-between px-4 py-1 md:py-1 border-b bg-alabaster  cursor-pointer"
        onClick={() =>
          dispatch(setOpenDiamondDetailDrawer(isOpen ? null : drawerKey))
        }
      >
        <h4 className="font-semibold text-sm md:text-base">Diamond Detail</h4>
        <button
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        >
          <CustomImg
            srcAttr={stepArrow}
            altAttr=""
            titleAttr=""
            className="md:w-4 md:h-4 h-3 w-3 transition-transform duration-200"
          />
        </button>
      </div>

      {isOpen && (
        <>
          <div className="flex flex-col xs:flex-row xs:items-stretch">
            <div className="flex flex-col">
              <p className="font-medium text-sm md:text-base text-baseblack pt-1 md:pt-2 px-4">
                Lab Created {cartItem.diamondDetail.caratWeight} Carat
              </p>
              <p className="font-medium text-sm md:text-base text-baseblack pt-1 md:pt-2 px-4">
                {cartItem.diamondDetail.shapeName} Diamond
              </p>
            </div>

            <div className="hidden xs:block border-l border-gray-300 mx-2 h-12 md:h-16" />

            <div className="flex flex-col">
              <p className="font-medium text-sm md:text-base text-baseblack pt-1 md:pt-2 px-4">
                Clarity- {cartItem.diamondDetail.clarity}
              </p>
              <p className="font-medium text-sm md:text-base text-baseblack pt-1 md:pt-2 px-4">
                Color- {cartItem.diamondDetail.color}
              </p>
            </div>
          </div>

          <div className="px-4 md:py-2 py-1 font-medium text-sm md:text-lg">
            Diamond Price:{" "}
            {isCheckoutPage && (
              <span className="font-bold">
                $
                {helperFunctions
                  .calculateDiamondPrice({
                    caratWeight: Number(cartItem?.diamondDetail?.caratWeight),
                    clarity: cartItem?.diamondDetail?.clarity,
                    color: cartItem?.diamondDetail?.color,
                  })
                  .toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                {` × ${cartItem?.quantity}`}
              </span>
            )}
            {isOrderPage && (
              <span className="font-bold">
                $
                {cartItem?.diamondDetail?.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
                {` × ${cartItem?.quantity || cartItem?.returnQuantity} `}
              </span>
            )}
            {!isCheckoutPage && !isOrderPage && (
              <span className="font-bold">
                $
                {(
                  helperFunctions.calculateDiamondPrice({
                    caratWeight: Number(cartItem?.diamondDetail?.caratWeight),
                    clarity: cartItem?.diamondDetail?.clarity,
                    color: cartItem?.diamondDetail?.color,
                  }) * (cartItem?.quantity || cartItem?.returnQuantity || 1)
                ).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DiamondDetailDrawer;
