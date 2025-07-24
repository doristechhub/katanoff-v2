"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import dropdownArrow from "@/assets/icons/dropdownArrow.svg";
import { companyEmail, helperFunctions } from "@/_helper";
import {
  addUpdateRecentlyViewedProducts,
  fetchProductDetailByProductName,
  fetchRecentlyViewedProducts,
  fetchSingleProductDataById,
} from "@/_actions/product.actions";
import { useDispatch, useSelector } from "react-redux";
import VariationsList from "@/components/ui/VariationsList";
import {
  CustomImg,
  ProductNotFound,
  ProductDetailPageImage,
  AccordionTabs,
  ProductSwiper,
} from "@/components/dynamiComponents";
import DetailPageSkeleton from "@/components/ui/DetailPageSkeleton";
import KeyFeatures from "@/components/ui/KeyFeatures";
import {
  setSelectedVariations,
  setProductQuantity,
  setProductDetail,
  setProductMessage,
} from "@/store/slices/productSlice";
import { insertProductIntoCart } from "@/_actions/cart.action";
import { LoadingPrimaryButton } from "@/components/ui/button";
import {
  setCustomizeLoader,
  setCustomProductDetails,
  setIsHovered,
  setIsSubmitted,
} from "@/store/slices/commonSlice";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { setCartMessage } from "@/store/slices/cartSlice";
import {
  DIAMOND_QUALITY,
  DIAMOND_SHAPE,
  GOLD_COLOR,
  GOLD_TYPES,
  MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT,
  messageType,
  METAL_COLOR,
  METAL_TYPES,
  RING_SIZE,
  SETTING_STYLE,
} from "@/_helper/constants";
import { paymentOptions } from "@/_utils/paymentOptions";
import appointment from "@/assets/icons/appointment.svg";
import emailIcon from "@/assets/icons/email.svg";
import paymentIcon from "@/assets/icons/paymentFinancing.svg";
import returnsIcon from "@/assets/icons/returns.svg";
import shippingIcon from "@/assets/icons/shippingDetail.svg";
import warrantyIcon from "@/assets/icons/warranty.svg";
import Link from "next/link";
export const minProductQuantity = 1;
export const maxProductQuantity = 5;

const supportItems = [
  {
    icon: paymentIcon,
    label: "Payment and Financing",
    link: "/payment-financing",
  },
  { icon: returnsIcon, label: "Returns", link: "/return-policy" },
  {
    icon: emailIcon,
    label: "Email Us",
    link: `mailto:${companyEmail}`,
  },
  { icon: shippingIcon, label: "Shipping", link: "/shipping-policy" },
  { icon: warrantyIcon, label: "Warranty", link: "/warranty" },
  {
    icon: appointment,
    label: "Book an Appointment",
    link: "/book-appointment",
  },
];

const ProductDetailPage = ({ customizePage }) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const [hoveredColor, setHoveredColor] = useState("");

  const {
    productDetail,
    productLoading,
    recentlyProductLoading,
    selectedVariations,
    productQuantity,
    recentlyViewProductList,
  } = useSelector(({ product }) => product);
  const { cartMessage, cartLoading } = useSelector(({ cart }) => cart);
  const { isHovered, isSubmitted, customProductDetails } = useSelector(
    ({ common }) => common
  );

  const isCustomizePage = customizePage === "completeRing";
  const goldColor = helperFunctions?.stringReplacedWithSpace(
    searchParams.get("goldColor")
  );
  let { productName, productId } = params;
  let availableQty = 0;

  productName = helperFunctions?.stringReplacedWithSpace(productName);
  let customProductIdFromLocalStorage = customProductDetails?.productId;

  const loadData = useCallback(async () => {
    dispatch(setProductMessage({ message: "", type: "" }));

    if (productName) {
      const response = await dispatch(
        fetchProductDetailByProductName(productName)
      );
      if (response) {
        dispatch(addUpdateRecentlyViewedProducts({ productName }));
        const initialSelections = response?.variations?.map((variation) => {
          if (
            variation?.variationName?.toLowerCase() ===
              GOLD_COLOR.toLowerCase() &&
            goldColor
          ) {
            const matchedType = variation.variationTypes.find(
              (vt) =>
                vt.variationTypeName?.toLowerCase() === goldColor.toLowerCase()
            );

            if (matchedType) {
              return {
                variationId: variation?.variationId,
                variationTypeId: matchedType.variationTypeId,
                variationName: variation?.variationName,
                variationTypeName: matchedType.variationTypeName,
              };
            }
          }
          return {
            variationId: variation?.variationId,
            variationTypeId: variation?.variationTypes[0]?.variationTypeId,
            variationName: variation?.variationName,
            variationTypeName: variation?.variationTypes[0]?.variationTypeName,
          };
        });
        dispatch(setSelectedVariations(initialSelections));
      }
    } else if (productId || customProductIdFromLocalStorage) {
      const response = await dispatch(
        fetchSingleProductDataById(productId || customProductIdFromLocalStorage)
      );
      if (response) {
        dispatch(
          addUpdateRecentlyViewedProducts({
            productName: response?.productName || "",
          })
        );

        let initialSelections = [];
        if (customProductDetails?.selectedVariations?.length > 0) {
          initialSelections = customProductDetails?.selectedVariations?.map(
            (variation) => ({
              variationId: variation?.variationId,
              variationTypeId: variation?.variationTypeId,
              variationName: variation?.variationName,
              variationTypeName: variation?.variationTypeName,
            })
          );
        } else {
          initialSelections = response?.variations?.map((variation) => {
            // Handle Gold Color variation with goldColor from search params
            if (
              variation?.variationName?.toLowerCase() ===
                GOLD_COLOR.toLowerCase() &&
              goldColor
            ) {
              const matchedType = variation.variationTypes.find(
                (vt) =>
                  vt.variationTypeName?.toLowerCase() ===
                  goldColor.toLowerCase()
              );
              if (matchedType) {
                return {
                  variationId: variation?.variationId,
                  variationTypeId: matchedType.variationTypeId,
                  variationName: variation?.variationName,
                  variationTypeName: matchedType.variationTypeName,
                };
              }
            }

            // Default to first variation type
            return {
              variationId: variation?.variationId,
              variationTypeId: variation?.variationTypes[0]?.variationTypeId,
              variationName: variation?.variationName,
              variationTypeName:
                variation?.variationTypes[0]?.variationTypeName,
            };
          });
        }

        dispatch(setSelectedVariations(initialSelections));
      }
    } else {
      dispatch(
        setProductMessage({
          message: "Product information is missing.",
          type: messageType?.ERROR,
        })
      );
      dispatch(setProductDetail({}));
    }
  }, [dispatch, productName, productId, customProductIdFromLocalStorage]);

  // This use effect is used to handle the condtion as in the three steps if already selected product in cart and in complete ring i am getting so to remove the customProduct from local storage and redirect to cart page
  useEffect(() => {
    if (
      isSubmitted &&
      cartMessage?.message === "Product already exists in cart"
    ) {
      localStorage.removeItem("customProduct");
      dispatch(setCustomProductDetails(null));
      router.push("/cart");
      dispatch(setIsSubmitted(false));
    }
  }, [cartMessage, customizePage, isSubmitted, dispatch, router]);

  useEffect(() => {
    loadData();
    dispatch(setProductQuantity(1));
    dispatch(setSelectedVariations([]));
  }, [productName, productId, customProductIdFromLocalStorage]);

  useEffect(() => {
    const customProduct = helperFunctions?.getCustomProduct();
    if (customProduct) {
      dispatch(setCustomProductDetails(customProduct));
    }
  }, [dispatch]);

  useEffect(() => {
    if (isCustomizePage) {
      const customProduct = helperFunctions?.getCustomProduct();
      if (customProduct) {
        dispatch(setCustomProductDetails(customProduct));
      }
    }
  }, [dispatch]);

  const loadRecentlyViewProduct = useCallback(() => {
    dispatch(fetchRecentlyViewedProducts());
  }, [dispatch]);

  useEffect(() => {
    loadRecentlyViewProduct();
  }, [loadRecentlyViewProduct]);

  if (
    Array.isArray(productDetail?.variComboWithQuantity) &&
    Array.isArray(selectedVariations) &&
    selectedVariations?.length
  ) {
    const { price, quantity } = helperFunctions?.getVariComboPriceQty(
      productDetail?.variComboWithQuantity,
      selectedVariations
    );
    availableQty = quantity;
  }

  const handleSelect = useCallback(
    (variationId, variationTypeId, variationName, variationTypeName) => {
      dispatch(setCartMessage({ message: "", type: "" }));
      const updated = [
        ...selectedVariations?.filter(
          (item) => item.variationId !== variationId
        ),
        { variationId, variationTypeId, variationName, variationTypeName },
      ];
      dispatch(
        setSelectedVariations({
          ...updated,
          [variationName]: variationTypeName,
        })
      );
      dispatch(setSelectedVariations(updated));
      if (variationName?.toLowerCase() === GOLD_COLOR) {
        helperFunctions?.updateGoldColorInUrl(variationTypeName);
      }
    },
    [dispatch, selectedVariations]
  );

  const selectedPrice = useMemo(() => {
    if (
      !productDetail?.variComboWithQuantity?.length ||
      !selectedVariations?.length
    )
      return null;

    return productDetail?.variComboWithQuantity?.find((combo) =>
      combo.combination.every((item) =>
        selectedVariations?.some(
          (selected) =>
            selected?.variationId === item?.variationId &&
            selected?.variationTypeId === item?.variationTypeId
        )
      )
    )?.price;
  }, [productDetail?.variComboWithQuantity, selectedVariations]);

  const isInValidSelectedVariation = useMemo(() => {
    if (productDetail?.variations?.length !== selectedVariations?.length) {
      return true;
    }
    return false;
  }, [productDetail?.variations?.length, selectedVariations?.length]);

  const hasDiamondDetails = !!customProductDetails?.diamondDetails;
  let diamondDetail;

  if (customProductDetails?.diamondDetails) {
    const caratWeight = customProductDetails?.diamondDetails?.caratWeight;
    const clarity = customProductDetails?.diamondDetails?.clarity?.value;
    const color = customProductDetails?.diamondDetails?.color?.value;

    diamondDetail = {
      shapeId: customProductDetails?.diamondDetails?.shape?.id,
      caratWeight,
      clarity,
      color,
    };
  }

  const addToCartHandler = useCallback(async () => {
    dispatch(setIsSubmitted(true));
    if (isInValidSelectedVariation) return;

    const isStandardProductInvalid =
      !hasDiamondDetails &&
      (!availableQty || !productQuantity || productQuantity > availableQty);

    const isCustomProductInvalid =
      hasDiamondDetails &&
      (!productQuantity || productQuantity > MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT);

    if (isStandardProductInvalid || isCustomProductInvalid) return;

    let payload = {
      productId: productDetail?.id,
      quantity: productQuantity,
      variations: selectedVariations?.map((selectedVari) => ({
        variationId: selectedVari?.variationId,
        variationTypeId: selectedVari?.variationTypeId,
      })),
    };
    if (customProductDetails?.diamondDetails && isCustomizePage) {
      payload.diamondDetail = diamondDetail;
    }
    const response = await dispatch(insertProductIntoCart(payload));

    if (response) {
      router.push("/cart");
      localStorage.removeItem("customProduct");
      dispatch(setCustomProductDetails(null));
      dispatch(setIsSubmitted(false));
    }
  }, [
    productQuantity,
    availableQty,
    dispatch,
    isInValidSelectedVariation,
    productDetail?.id,
    selectedVariations,
    customizePage,
  ]);

  const handleSelectSetting = useCallback(() => {
    if (isInValidSelectedVariation) return;

    dispatch(setCustomizeLoader(true));
    try {
      const newPayload = {
        productId: productDetail?.id,
        selectedVariations: selectedVariations?.map((selectedVari) => ({
          variationId: selectedVari?.variationId,
          variationTypeId: selectedVari?.variationTypeId,
        })),
      };

      const existingData = localStorage.getItem("customProduct");

      let updatedPayload;

      if (existingData) {
        const parsed = JSON.parse(existingData);
        updatedPayload = {
          ...parsed,
          ...newPayload,
        };
      } else {
        updatedPayload = newPayload;
      }

      localStorage.setItem("customProduct", JSON.stringify(updatedPayload));
      if (updatedPayload?.productId && updatedPayload?.diamondDetails) {
        router.push("/customize/complete-ring");
      } else if (updatedPayload?.diamondDetails && !updatedPayload?.productId) {
        router.push("/customize/select-setting");
      } else if (
        !updatedPayload?.diamondDetails &&
        !updatedPayload?.productId
      ) {
        router.push("/customize/select-diamond");
      }
    } finally {
      dispatch(setCustomizeLoader(false));
    }
  }, [isInValidSelectedVariation, productDetail?.id, selectedVariations]);

  let customProductPrice = 0;
  if (productDetail?.netWeight && productDetail?.sideDiamondWeight) {
    const customProductDetail = {
      netWeight: Number(productDetail?.netWeight),
      sideDiamondWeight: Number(productDetail?.sideDiamondWeight),
    };

    const centerDiamondDetail = {
      caratWeight: customProductDetails?.diamondDetails?.caratWeight,
      clarity: customProductDetails?.diamondDetails?.clarity,
      color: customProductDetails?.diamondDetails?.color,
    };

    customProductPrice = helperFunctions?.calculateCustomizedProductPrice({
      centerDiamondDetail,
      productDetail: customProductDetail,
    });
  }

  const variationLabels = [GOLD_TYPES, GOLD_COLOR, "Diamond Qualitiy"];

  const displayValues = variationLabels
    .map((label) =>
      helperFunctions?.getVariationValue(selectedVariations, label)
    )
    .filter(Boolean)
    .join(" ");

  return (
    <div className={` ${isCustomizePage ? "" : "pt-8 2xl:pt-12"}`}>
      {productLoading ? (
        <DetailPageSkeleton />
      ) : productDetail && Object.keys(productDetail).length > 0 ? (
        <>
          <div className="container grid grid-cols-1 md:grid-cols-2 gap-6 xs:gap-8">
            <div className="flex h-fit w-full">
              <ProductDetailPageImage
                productDetail={productDetail}
                selectedVariations={selectedVariations}
                hoveredColor={hoveredColor}
              />
            </div>

            <div className="flex flex-col pl-4 md:pl-0">
              <h2 className="text-xl font-semibold">
                {helperFunctions?.formatProductNameWithCarat({
                  caratWeight: productDetail?.totalCaratWeight,
                  productName: productDetail?.productName,
                })}
              </h2>
              {displayValues ? (
                <h2 className="text-sm md:text-sm text-basegray font-semibold pt-1">
                  {displayValues}
                </h2>
              ) : null}

              {isCustomizePage ? (
                <div className="flex items-center gap-2 mb-4 lg:mb-4">
                  <span className="text-xl md:text-xl 3xl:text-2xl font-normal font-castoro">
                    ${helperFunctions?.roundOffPrice(customProductPrice)}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mt-2  mb-6 lg:mb-6">
                    <span className="text-xl md:text-xl 3xl:text-2xl font-normal font-castoro">
                      {selectedPrice
                        ? `$${helperFunctions?.roundOffPrice(
                            selectedPrice *
                              productQuantity *
                              (1 - productDetail?.discount / 100)
                          )}`
                        : "$0"}
                    </span>
                    {productDetail?.discount && selectedPrice ? (
                      <span className="text-gray-500 line-through text-xl font-castoro">
                        $
                        {helperFunctions?.roundOffPrice(
                          selectedPrice * productQuantity
                        )}
                      </span>
                    ) : null}
                    {productDetail?.discount && selectedPrice ? (
                      <span className="bg-baseblack text-white px-2 py-2 text-xs font-medium">
                        {`You Save ${productDetail?.discount}%`}
                      </span>
                    ) : null}
                  </div>
                </>
              )}

              <div className="border-t border-grayborder" />

              {!isCustomizePage && (
                <div className="mt-6 lg:mt-6 flex flex-col gap-2">
                  <p className="font-semibold text-baseblack text-sm 3xl:text-sm">
                    Qty:
                  </p>
                  <div className="relative w-fit">
                    <select
                      className={`appearance-none px-4 py-2 pr-10 border border-grayborder rounded-sm text-sm font-semibold bg-transparent cursor-pointer
          ${!availableQty ? "opacity-50 cursor-not-allowed" : ""}
        `}
                      value={productQuantity}
                      onChange={(e) =>
                        dispatch(setProductQuantity(parseInt(e.target.value)))
                      }
                      disabled={!availableQty}
                    >
                      {Array.from(
                        {
                          length:
                            Math.min(
                              maxProductQuantity,
                              availableQty || maxProductQuantity
                            ) -
                            minProductQuantity +
                            1,
                        },
                        (_, i) => i + minProductQuantity
                      ).map((qty) => (
                        <option key={qty} value={qty}>
                          {qty}
                        </option>
                      ))}
                    </select>

                    {/* Custom arrow (optional) */}
                    <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center px-2 text-black">
                      <CustomImg
                        srcAttr={dropdownArrow}
                        altAttr="Arrow"
                        titleAttr="Arrow"
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              )}

              <VariationsList
                variations={productDetail?.variations}
                selectedVariations={selectedVariations}
                handleSelect={handleSelect}
                setHoveredColor={setHoveredColor}
                hoveredColor={hoveredColor}
              />

              {customizePage === "completeRing" &&
                customProductDetails?.diamondDetails && (
                  <>
                    <div className="border-t border-grayborder mt-10" />
                    <div className=" text-baseblack pt-4 md:pt-6">
                      <div className="flex  items-start gap-2">
                        <div className="flex flex-col gap-2">
                          <p className="font-semibold text-lg">
                            Diamond Detail:
                          </p>

                          <div className="mb-4  text-sm  3xl:text-base font-medium text-baseblack">
                            <div className="flex flex-col xs:flex-row xs:items-stretch">
                              <div className="flex flex-col xs:gap-2 xs:pr-4 ">
                                <p>
                                  Lab Created{"  "}
                                  {
                                    customProductDetails?.diamondDetails
                                      ?.caratWeight
                                  }
                                  {"  "}
                                  Carat
                                </p>
                                <p>
                                  {" "}
                                  {
                                    customProductDetails?.diamondDetails?.shape
                                      ?.title
                                  }{" "}
                                  Diamond
                                </p>
                              </div>
                              <div className="flex flex-col xs:gap-2 xs:pl-4">
                                <p>
                                  Clarity-
                                  {
                                    customProductDetails?.diamondDetails
                                      ?.clarity?.value
                                  }
                                </p>
                                <p>
                                  Color-{" "}
                                  {
                                    customProductDetails?.diamondDetails?.color
                                      ?.value
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

              <section className="pt-8">
                <div className="grid grid-cols-2 lg:grid-cols-3 max-w-4xl">
                  {supportItems.map((item) => (
                    <Link href={item.link} key={item.label} className="h-full">
                      <div className="flex flex-col h-full p-2 rounded-md">
                        <div className="flex items-start gap-3">
                          <CustomImg
                            srcAttr={item.icon}
                            altAttr={item.label}
                            titleAttr={item.label}
                            className="w-6 h-6 object-contain self-start"
                          />
                          <p className="text-sm md:text-base font-medium text-black">
                            {item.label}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="container pt-10 lg:pt-12 2xl:pt-16 md:p-6">
            <ProductDetailTabs selectedVariations={selectedVariations} />
          </div>
          <section className="pt-10 lg:pt-12 xl:pt-16 container">
            <KeyFeatures />
          </section>
          {!isCustomizePage &&
            recentlyViewProductList &&
            recentlyViewProductList?.length > 0 && (
              <>
                <section className="pt-16 lg:pt-20 2xl:pt-24 container">
                  <ProductSwiper
                    productList={recentlyViewProductList}
                    loading={recentlyProductLoading}
                    title="Recently viewed"
                  />
                </section>
              </>
            )}

          <StickyAddToBag
            customizePage={customizePage}
            availableQty={availableQty}
            cartLoading={cartLoading}
            isHovered={isHovered}
            isInValidSelectedVariation={isInValidSelectedVariation}
            onSelectSetting={handleSelectSetting}
            onAddToCart={addToCartHandler}
            onHoverChange={(hover) => dispatch(setIsHovered(hover))}
            paymentOptions={paymentOptions}
            isSubmitted={isSubmitted}
            cartMessage={cartMessage}
            selectedVariations={selectedVariations}
            isActive={productDetail?.active}
            selectedPrice={selectedPrice}
          />
        </>
      ) : (
        <ProductNotFound textClassName="px-4 md:px-8 w-full md:w-[50%] lg:w-[35%] 2xl:w-[32%]" />
      )}
    </div>
  );
};

export default ProductDetailPage;

const AddToBagBar = ({
  visible,
  position,
  customizePage,
  availableQty,
  cartLoading,
  isHovered,
  isInValidSelectedVariation,
  onSelectSetting,
  onAddToCart,
  onHoverChange,
  isSubmitted,
  cartMessage,
  selectedVariations,
  isActive,
  selectedPrice,
}) => {
  const getButtonLabel = useCallback(
    ({ isActive, availableQty, selectedPrice }) => {
      if (!isActive) {
        return "INACTIVE";
      }

      if (availableQty <= 0) {
        return "OUT OF STOCK";
      }

      if (selectedPrice <= 0) {
        return "PRODUCT UNAVAILABLE";
      }

      return "ADD TO BAG";
    },
    []
  );

  const baseClasses = `w-full bg-white shadow-md transition-opacity duration-300 z-40 ${
    position === "bottom" ? "fixed bottom-0 left-0" : "relative mt-4 lg:mt-12"
  }`;
  const estimatedDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 15);

    const options = { weekday: "long", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }, []);
  const visibility = visible
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";

  return (
    <>
      <div className={`${baseClasses} ${visibility}`}>
        <div
          className={`mx-auto py-4 px-4 grid xs:grid-cols-2  lg:grid-cols-3 justify-center items-center gap-4 container`}
        >
          <div className="hidden xs:block">
            <p className="font-medium font-castoro text-xl">
              Estimated Ship Date
            </p>

            <p className="text-base pt-1">
              {(isActive && availableQty && availableQty > 0) ||
              customizePage === "completeRing"
                ? "Made-to-Order"
                : isActive || !selectedPrice > 0
                ? "Out of Stock"
                : "Inactive"}{" "}
              | {estimatedDate}
            </p>
          </div>

          <div className="hidden lg:block text-sm text-gray-700">
            <div className="flex gap-3 xl:gap-6 flex-wrap">
              {paymentOptions?.map((option, index) => (
                <CustomImg
                  key={index}
                  srcAttr={option?.img}
                  titleAttr={option?.titleAttr}
                  altAttr={option?.altAttr}
                  className="object-contain h-10 w-10 md:h-12 md:w-12 xl:h-12 xl:w-auto"
                />
              ))}
            </div>
          </div>

          <div className="ml-auto justify-center lg:justify-start w-fit">
            <div
              onMouseEnter={() => onHoverChange(true)}
              onMouseLeave={() => onHoverChange(false)}
            >
              {customizePage === "completeRing" && (
                <LoadingPrimaryButton
                  className="w-full uppercase"
                  loading={cartLoading}
                  disabled={cartLoading || isInValidSelectedVariation}
                  loaderType={isHovered ? "" : "white"}
                  onClick={onAddToCart}
                >
                  ADD TO BAG
                </LoadingPrimaryButton>
              )}

              {!customizePage && (
                <LoadingPrimaryButton
                  className="w-full uppercase"
                  loading={cartLoading}
                  disabled={
                    cartLoading ||
                    !availableQty ||
                    availableQty < 0 ||
                    isInValidSelectedVariation ||
                    !isActive ||
                    !selectedPrice > 0
                  }
                  loaderType={isHovered ? "" : "white"}
                  onClick={onAddToCart}
                >
                  {/* {isActive && availableQty && availableQty > 0
                    ? "ADD TO BAG"
                    : "OUT OF STOCK"} */}
                  {getButtonLabel({ isActive, availableQty, selectedPrice })}
                </LoadingPrimaryButton>
              )}
            </div>
            {isSubmitted && !selectedVariations?.length ? (
              <ErrorMessage message={"Please select variants"} />
            ) : null}
            {isSubmitted &&
            cartMessage?.message &&
            !(cartMessage?.message === "Product already exists in cart") ? (
              <ErrorMessage message={cartMessage?.message} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

const StickyAddToBag = (props) => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const fullHeight = document.body.scrollHeight;
        const offset = 260;
        const isBottom = scrollY + windowHeight >= fullHeight - offset;
        setIsAtBottom(isBottom);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <AddToBagBar position="top" visible={isAtBottom} {...props} />
      <AddToBagBar position="bottom" visible={!isAtBottom} {...props} />
    </>
  );
};

const ProductDetailTabs = ({ selectedVariations = [] }) => {
  const { productDetail } = useSelector(({ product }) => product);

  const labelClass =
    "inline-block min-w-[130px] xl:min-w-[170px] 2xl:min-w-[220px] pt-[2px]";
  const valueClass = "text-baseblack";
  const valueLineClass = "text-baseblack";

  const renderInfoRow = (label, value) =>
    value ? (
      <div className="pt-[6px] 2xl:pt-[25px]">
        <div className="flex items-start gap-2 pb-4 border-b border-grayborder">
          <p className={`${labelClass} ${valueClass} font-semibold`}>
            {label}:
          </p>
          <div className={`${valueClass} font-medium`}>
            <p className={`${valueLineClass}`}>{value}</p>
          </div>
        </div>
      </div>
    ) : null;

  const tabData = [
    {
      label: "Description",
      content: productDetail?.description ? (
        <div
          className="text-sm md:text-[15px] font-medium text-baseblack"
          dangerouslySetInnerHTML={{ __html: productDetail?.description }}
        />
      ) : (
        <p className="text-sm md:text-[15px] font-medium text-baseblack">
          No Description Available
        </p>
      ),
    },
    {
      label: "Product Detail",
      content: (
        <div
          className={`grid xs:grid-cols-2 ${
            productDetail?.specifications?.length > 0
              ? "lg:grid-cols-3 lg:gap-12"
              : "lg:grid-cols-2 lg:gap-60"
          } gap-10 mt-4`}
        >
          <div className="text-sm lg:text-[15px] font-medium">
            <p className="text-base lg:text-lg inline-block font-semibold text-baseblack pb-2 3xl:pb-4">
              Item Details
            </p>

            {renderInfoRow("SKU", productDetail?.saltSKU)}
            {selectedVariations?.length > 0 ? (
              <>
                {renderInfoRow(
                  METAL_TYPES,
                  helperFunctions?.getVariationValue(
                    selectedVariations,
                    GOLD_TYPES
                  )
                )}
                {renderInfoRow(
                  METAL_COLOR,
                  helperFunctions?.getVariationValue(
                    selectedVariations,
                    GOLD_COLOR
                  )
                )}
                {renderInfoRow(
                  RING_SIZE,
                  helperFunctions?.getVariationValue(
                    selectedVariations,
                    RING_SIZE
                  )
                )}
                {renderInfoRow(
                  "Approx Weight",
                  productDetail?.grossWeight
                    ? `${productDetail?.grossWeight} gm`
                    : ""
                )}

                {/* {renderInfoRow(
                  "Approx Net Wt",
                  productDetail?.netWeight
                    ? `${productDetail?.netWeight} g`
                    : ""
                )} */}
              </>
            ) : null}
          </div>

          {/* Diamond Information */}
          <div className="text-sm lg:text-[15px] font-medium">
            <p className="text-base lg:text-lg inline-block font-semibold text-baseblack pb-2 3xl:pb-4">
              Diamond Information
            </p>
            {renderInfoRow("Diamond Type", "Lab Grown Diamond")}
            {renderInfoRow(
              DIAMOND_SHAPE,
              helperFunctions?.getVariationValue(
                selectedVariations,
                DIAMOND_SHAPE
              )
            )}
            {renderInfoRow(
              DIAMOND_QUALITY,
              helperFunctions?.getVariationValue(
                selectedVariations,
                DIAMOND_QUALITY
              )
            )}
            {renderInfoRow(
              "Total Carat Weight",
              productDetail?.totalCaratWeight
                ? `${productDetail?.totalCaratWeight} ctw`
                : ""
            )}

            {productDetail?.settingStyleNamesWithImg?.length > 0 &&
              renderInfoRow(
                SETTING_STYLE,
                productDetail?.settingStyleNamesWithImg?.length > 0
                  ? productDetail?.settingStyleNamesWithImg
                      .map((s) => s.title)
                      .join(", ")
                  : ""
              )}
          </div>

          {/* Other Information */}
          {productDetail?.specifications?.length > 0 && (
            <div className="text-sm lg:text-[15px] font-medium">
              <p className="text-base lg:text-lg inline-block font-semibold text-baseblack pb-2 3xl:pb-4">
                Other Information
              </p>
              {productDetail?.specifications.map((item, index) =>
                item?.title?.trim() && item?.description?.trim() ? (
                  <div
                    className="flex items-start gap-2 pb-4 border-b border-grayborder"
                    key={helperFunctions?.generateUniqueId()}
                  >
                    <p
                      key={index}
                      className={`pt-[25px] 2xl:pt-[25px] ${valueClass}`}
                    >
                      <span className={labelClass}>{item.title.trim()}:</span>{" "}
                      {item?.description?.trim()}
                    </p>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <AccordionTabs
      tabs={tabData}
      forceResetKey={selectedVariations}
      alwaysOpenFirst={true}
      hideFirstToggleIcon={true}
    />
  );
};
