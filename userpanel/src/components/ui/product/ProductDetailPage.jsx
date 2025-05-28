"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import diamondSvg from "@/assets/icons/3stepsDiamond.svg";
import stripe from "@/assets/images/cart/stripe.webp";
import paypal from "@/assets/images/cart/paypal.webp";
import { useParams } from "next/navigation";
import { helperFunctions } from "@/_helper";
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
  ProgressiveImg,
  ProductSwiper,
  ProgressiveVed,
  ProductNotFound,
} from "@/components/dynamiComponents";
import DetailPageSkeleton from "@/components/ui/DetailPageSkeleton";
import KeyFeatures from "@/components/ui/KeyFeatures";
import calender from "@/assets/icons/calender.svg";
import inspect from "@/assets/icons/inspect.svg";
import truck from "@/assets/icons/truck.svg";
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
import ProductDetailSwipperSm from "@/components/shop/ProductDetailSwipperSm";
import {
  MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT,
  messageType,
} from "@/_helper/constants";
import ZoomImage from "../ZoomImage";
import { paymentOptions } from "@/_utils/paymentOptions";

export const minProductQuantity = 1;
export const maxProductQuantity = 5;

const shippingInfo = [
  {
    icon: truck,
    altAttr: "",
    titleAttr: "",
    text: "Please call us: +1-800-282-2242",
  },
  {
    icon: calender,
    altAttr: "",
    titleAttr: "",
    text: "Free 30 Day Returns, Free Resizing, Free Lifetime Warranty.",
  },
  {
    icon: inspect,
    altAttr: "",
    titleAttr: "",
    text: "We inspect & verify authenticity before shipping. 100% Money-Back Guarantee.",
  },
];

const shippingReturnContent = [
  {
    label: "Fast & Secure Shipping –",
    content:
      "Orders are processed within 1-2 business days and shipped via reliable carriers like UPS, FedEx, or USPS.",
  },
  {
    label: "Delivery Time –",
    content:
      "Standard shipping takes 3-7 business days, while expedited options are available for faster delivery.",
  },
  {
    label: "Shipping Fees – ",
    content:
      "Free shipping on orders over [Specify Amount], with calculated rates for express or international shipping.",
  },
  {
    label: "Order Tracking – ",
    content:
      "A tracking number is provided once your order ships, allowing you to monitor your package in real time.",
  },
  {
    label: "Return Window –",
    content:
      "Items can be returned within [Specify Days, e.g., 14-30 days] of delivery for a refund or exchange.",
  },
  {
    label: "Return Condition –",
    content:
      "Items must be unworn, in original packaging, and accompanied by proof of purchase.",
  },
  {
    label: "Non-Returnable Items –",
    content:
      "Custom or engraved jewelry, final sale items, and used pieces cannot be returned.",
  },
  {
    label: "Refund Processing –",
    content:
      "Refunds are issued to the original payment method within [Specify Days] after the return is received and inspected.",
  },
  {
    label: "Damaged or Incorrect Items –",
    content:
      "If your order arrives damaged or incorrect, contact us immediately for a resolution.",
  },
];
const ProductDetailPage = ({ customizePage }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  let { productName, productId } = params;
  let availableQty = 0;

  // Two Values avilable one is completeRing and other is setting used in 3 steps
  const isCustomizePage =
    customizePage === "completeRing" || customizePage === "setting";
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
        const initialSelections = response?.variations?.map((variation) => ({
          variationId: variation?.variationId,
          variationTypeId: variation?.variationTypes[0]?.variationTypeId,
          variationName: variation?.variationName,
          variationTypeName: variation?.variationTypes[0]?.variationTypeName,
        }));
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
          initialSelections = response?.variations?.map((variation) => ({
            variationId: variation?.variationId,
            variationTypeId: variation?.variationTypes[0]?.variationTypeId,
            variationName: variation?.variationName,
            variationTypeName: variation?.variationTypes[0]?.variationTypeName,
          }));
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
  }, [dispatch, productName, productId]);

  // This use effect is used to handle the condtion as in the three steps if already selected product in cart and in complete ring i am getting so to remove the customProduct from local storage and redirect to cart page
  useEffect(() => {
    if (
      isSubmitted &&
      customizePage === "completeRing" &&
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
  }, [productName]);

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
    },
    [selectedVariations]
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
      price: helperFunctions?.calculateDiamondPrice({
        caratWeight: Number(caratWeight),
        clarity,
        color,
      }),
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
      } else {
        router.push("/customize/select-diamond");
      }
    } finally {
      dispatch(setCustomizeLoader(false));
    }
  }, [isInValidSelectedVariation, productDetail?.id, selectedVariations]);

  const enrichedVariations =
    selectedVariations?.length &&
    selectedVariations?.map((selectedVar) => {
      const matchedVariation = productDetail?.variations?.find(
        (v) => v.variationId === selectedVar?.variationId
      );

      const matchedType = matchedVariation?.variationTypes?.find(
        (vt) => vt.variationTypeId === selectedVar?.variationTypeId
      );

      return {
        ...selectedVar,
        variationName: matchedVariation?.variationName,
        variationTypeName: matchedType?.variationTypeName,
      };
    });

  let customProductPrice = 0;
  if (productDetail?.netWeight && selectedVariations?.length) {
    customProductPrice = helperFunctions?.calculateCustomProductPrice({
      netWeight: Number(productDetail?.netWeight),
      variations: enrichedVariations,
    });
  }

  return (
    <div
      className={` ${
        isCustomizePage ? "pt-12 lg:pt-6 2xl:pt-8" : "pt-28 lg:pt-12 2xl:pt-16"
      }`}
    >
      {productLoading ? (
        <DetailPageSkeleton />
      ) : productDetail && Object.keys(productDetail).length > 0 ? (
        <>
          <div className="container grid grid-cols-1 lg:grid-cols-[55%_auto] 3xl:grid-cols-[55%_auto] gap-6 xs:gap-12">
            <div className="hidden lg:block">
              {" "}
              {/* <div className="grid grid-cols-2 gap-4 auto-rows-min ">
                {productDetail?.video && (
                  <ProgressiveVed
                    src={productDetail?.video}
                    type={helperFunctions?.getVideoType(productDetail?.video)}
                    className="w-full h-full object-cover"
                  />
                )}
                {productDetail?.thumbnailImage && (
                  <ProgressiveImg
                    src={productDetail?.thumbnailImage}
                    className="cursor-pointer transition-all duration-300 w-full"
                  />
                )}
                {productDetail?.images?.map((media, index) => (
                  <ProgressiveImg
                    key={index}
                    src={media?.image}
                    className="cursor-pointer transition-all duration-300 w-full"
                  />
                ))}
              </div> */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-min">
                {productDetail?.video && (
                  <div className="relative w-full h-60 sm:h-64 lg:h-[300px] xl:h-[350px] 4xl:h-[450px] overflow-hidden rounded-md">
                    <ProgressiveVed
                      src={productDetail?.video}
                      type={helperFunctions?.getVideoType(productDetail?.video)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {productDetail?.thumbnailImage && (
                  <div className="zoom-container relative w-full h-60  sm:h-64 lg:h-[300px] xl:h-[350px] 4xl:h-[450px] overflow-hidden rounded-md">
                    <ZoomImage
                      src={productDetail?.thumbnailImage}
                      alt="Product Thumbnail"
                    />
                  </div>
                )}

                {productDetail?.images?.map((media, index) => (
                  <div
                    key={index}
                    className="relative w-full h-60 sm:h-64 lg:h-[300px] xl:h-[350px] 4xl:h-[450px] overflow-hidden rounded-md"
                  >
                    <ZoomImage
                      src={media?.image}
                      alt="Zoom with Lens"
                      className="!w-full !h-full"
                    />
                    {/* <ProgressiveImg
                      src={media?.image}
                      className="cursor-pointer transition-all duration-300 w-full h-full object-cover"
                    /> */}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:hidden">
              <ProductDetailSwipperSm
                images={
                  productDetail?.thumbnailImage
                    ? [
                        { image: productDetail?.thumbnailImage },
                        ...productDetail?.images,
                      ]
                    : productDetail?.images ?? []
                }
                video={productDetail?.video}
              />
            </div>

            <div className="flex flex-col lg:p-6">
              <h2 className="text-xl  md:text-xl 3xl:text-3xl font-medium">
                {productDetail?.productName}
              </h2>
              {!isCustomizePage && (
                <h2 className="text-sm md:text-sm 3xl:text-base text-basegray mt-2 font-chong-modern">
                  sku: {productDetail?.sku}
                </h2>
              )}

              {isCustomizePage ? (
                <div className="flex items-center gap-2 mt-2 xl:mt-4  mb-4 lg:mb-4">
                  <span className="text-xl md:text-xl 3xl:text-4xl font-normal font-chong-modern">
                    ${customProductPrice}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mt-2 xl:mt-4  mb-6 lg:mb-6">
                    <span className="text-xl md:text-xl 3xl:text-4xl font-normal font-chong-modern">
                      {selectedPrice
                        ? `$${(
                            selectedPrice *
                            productQuantity *
                            (1 - productDetail?.discount / 100)
                          ).toFixed(2)}`
                        : "N/A"}
                    </span>
                    {productDetail?.discount && selectedPrice ? (
                      <span className="text-gray-500 line-through text-xl font-chong-modern">
                        ${(selectedPrice * productQuantity).toFixed(2)}
                      </span>
                    ) : null}
                    {productDetail?.discount && selectedPrice ? (
                      <span className="bg-primary text-white px-2 py-2 text-xs font-medium">
                        {`You Save ${productDetail?.discount}%`}
                      </span>
                    ) : null}
                  </div>
                </>
              )}

              <div className="border-t  border-black_opacity_10" />

              {!isCustomizePage && (
                <div className="mt-6 lg:mt-10 flex items-center lg:gap-6">
                  <p className="font-medium text-sm  3xl:text-base w-[130px] xs:w-[135px]">
                    Qty:
                  </p>
                  <div className="flex items-center py-2 bg-white">
                    <button
                      className={` px-1 3xl:px-2 text-sm  md:text-sm 3xl:text-xl font-medium text-baseblack ${
                        productQuantity <= minProductQuantity || !availableQty
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        dispatch(
                          setProductQuantity(Math.max(1, productQuantity - 1))
                        )
                      }
                      disabled={
                        productQuantity <= minProductQuantity || !availableQty
                      }
                    >
                      −
                    </button>

                    <span className="px-2 3xl:px-4 text-sm  md:text-sm 3xl:text-xl font-medium text-primary">
                      {productQuantity}
                    </span>
                    <button
                      className={`px-1 3xl:px-2  text-sm  md:text-sm 3xl:text-xl font-medium text-baseblack ${
                        productQuantity >= maxProductQuantity ||
                        productQuantity >= availableQty
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        dispatch(
                          setProductQuantity(
                            Math.min(maxProductQuantity, productQuantity + 1)
                          )
                        )
                      }
                      disabled={
                        productQuantity >= maxProductQuantity ||
                        productQuantity >= availableQty
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <VariationsList
                variations={productDetail?.variations}
                selectedVariations={selectedVariations}
                handleSelect={handleSelect}
              />

              {customizePage === "completeRing" &&
                customProductDetails?.diamondDetails && (
                  <>
                    <div className="border-t  border-black_opacity_10 mt-10" />
                    <div className=" text-baseblack pt-4 md:pt-6">
                      <div className="flex  items-start gap-2">
                        <div className="flex gap-1">
                          <CustomImg
                            srcAttr={diamondSvg}
                            altAttr=""
                            titleAttr=""
                            className="w-8 h-8"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="font-semibold text-xl">
                            Diamond Detail:
                          </p>
                          <p className="pt-2  text-sm  3xl:text-base font-medium text-baseblack">
                            Diamond Price:{" "}
                            <span className="font-bold">
                              ${diamondDetail?.price}
                            </span>
                          </p>

                          <div className="mb-4  text-sm  3xl:text-base font-medium text-baseblack">
                            <div className="flex flex-col xs:flex-row xs:items-stretch">
                              {/* Left column */}
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

                              <div className="hidden xs:block border-l border-gray-300 mx-2 h-16"></div>
                              {/* Right column */}
                              <div className="flex flex-col xs:gap-2 xs:pl-4 ">
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

                      <p className="font-medium  text-lg 3xl:text-xl">
                        Final Price: $
                        {(customProductPrice + diamondDetail?.price).toFixed(2)}
                        <span className="font-semibold font-chong-modern"></span>
                      </p>
                    </div>
                  </>
                )}

              <div className="mt-4 lg:mt-8 flex gap-4 items-center">
                <div
                  className="w-full"
                  onMouseEnter={() => dispatch(setIsHovered(true))}
                  onMouseLeave={() => dispatch(setIsHovered(false))}
                >
                  {/* In this the only setting page is there then only handle setting will be done expect then for compplete ring and normal product detail add to cart hanlder will come  */}
                  {customizePage === "setting" ? (
                    <LoadingPrimaryButton
                      className="w-full uppercase"
                      disabled={isInValidSelectedVariation}
                      loaderType={isHovered ? "" : "white"}
                      onClick={handleSelectSetting}
                    >
                      SELECT THIS OPTION
                    </LoadingPrimaryButton>
                  ) : null}

                  {customizePage === "completeRing" ? (
                    <LoadingPrimaryButton
                      className="w-full uppercase"
                      loading={cartLoading}
                      disabled={cartLoading || isInValidSelectedVariation}
                      loaderType={isHovered ? "" : "white"}
                      onClick={addToCartHandler}
                    >
                      ADD TO BAG
                    </LoadingPrimaryButton>
                  ) : null}

                  {!customizePage ? (
                    <LoadingPrimaryButton
                      className="w-full uppercase"
                      loading={cartLoading}
                      disabled={
                        cartLoading ||
                        !availableQty ||
                        availableQty < 0 ||
                        isInValidSelectedVariation
                      }
                      loaderType={isHovered ? "" : "white"}
                      onClick={addToCartHandler}
                    >
                      {availableQty && availableQty > 0
                        ? "ADD TO BAG"
                        : "OUT OF STOCK"}
                    </LoadingPrimaryButton>
                  ) : null}
                </div>
              </div>
              {isSubmitted && !selectedVariations?.length ? (
                <ErrorMessage message={"Please select variants"} />
              ) : null}
              {isSubmitted &&
              cartMessage?.message &&
              !(
                customizePage === "completeRing" &&
                cartMessage?.message === "Product already exists in cart"
              ) ? (
                <ErrorMessage message={cartMessage?.message} />
              ) : null}
              <div className="mt-4 3xl:mt-6 flex items-center gap-3">
                <p className="font-medium text-base 3xl:text-xl text-gray-500">
                  Pay With:
                </p>
                <div className="flex flex-wrap gap-3 md:gap-6">
                  {paymentOptions?.map((option, index) => (
                    <CustomImg
                      key={index}
                      srcAttr={option?.img}
                      titleAttr={option?.titleAttr}
                      altAttr={option?.altAttr}
                      className="object-contain  3xl:w-auto h-12 w-10"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 3xl:mt-8 p-4 bg-white">
                {/* <p className="font-medium text-base md:text-lg">
                  Estimate Ship Date Monday, April 7
                </p> */}
                <ul className="mt-3">
                  {shippingInfo.map((info, index) => (
                    <li
                      key={index}
                      className="flex gap-4 items-center text-base md:text-sm 3xl:text-lg mt-2"
                    >
                      <CustomImg
                        srcAttr={info?.icon}
                        altAttr={info?.altAttr}
                        className="w-6 h-6"
                        titleAttr={info?.titleAttr}
                      />
                      <span>{info.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="container pt-10 lg:pt-20 2xl:pt-28 md:p-6">
            <ProductDetailTabs selectedVariations={selectedVariations} />
          </div>
          {!isCustomizePage &&
            recentlyViewProductList &&
            recentlyViewProductList?.length > 0 && (
              <>
                <section className="pt-16 lg:pt-20 2xl:pt-40 container">
                  <ProductSwiper
                    productList={recentlyViewProductList}
                    loading={recentlyProductLoading}
                    title="Recently viewed"
                  />
                </section>
              </>
            )}
          <section className="pt-10 lg:pt-20 2xl:pt-28 container">
            <KeyFeatures />
          </section>
        </>
      ) : (
        <ProductNotFound textClassName="px-4 md:px-8 w-full md:w-[50%] lg:w-[35%] 2xl:w-[32%]" />
      )}
    </div>
  );
};

export default ProductDetailPage;

const ProductDetailTabs = ({ selectedVariations = [] }) => {
  const { productDetail } = useSelector(({ product }) => product);
  console.log("productDetail", productDetail);
  const [activeTab, setActiveTab] = useState("Product Detail");
  const [open, setOpen] = useState(false);
  const getVariationValue = (key) => {
    const variation = selectedVariations?.find(
      (v) => v.variationName?.trim().toLowerCase() === key.trim().toLowerCase()
    );
    return variation ? variation?.variationTypeName : null;
  };
  useEffect(() => {
    setActiveTab("Product Detail");
  }, [selectedVariations]);

  const labelClass =
    "inline-block min-w-[140px] xl:min-w-[170px] 2xl:min-w-[220px] pt-[2px]";
  const valueClass = "text-baseblack";
  const valueLineClass = "text-baseblack";

  const renderInfoRow = (label, value) =>
    value ? (
      <div className="pt-[6px] 2xl:pt-[30px] 3xl:pt-[40px] flex items-start gap-2">
        <p className={`${labelClass} ${valueClass}`}>{label}:</p>
        <div className={`${valueClass} `}>
          <p className={`${valueLineClass}`}>{value}</p>
        </div>
      </div>
    ) : null;

  const tabData = [
    {
      label: "Product Detail",
      content: (
        <div className="grid xs:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 mt-4 2xl:mt-8 3xl:mt-12">
          {/* Product Information */}
          <div className="text-sm md:text-sm 2xl:text-base 3xl:text-lg font-medium">
            <p className="inline-block font-semibold text-baseblack border-b-[2.5px] border-black_opacity_10 pt-[6px] pb-[6px] 3xl:pb-4">
              Product Information
            </p>

            {renderInfoRow("SKU", productDetail?.sku)}
            {selectedVariations?.length > 0 ? (
              <>
                {renderInfoRow("Gold Type", getVariationValue("Gold Type"))}
                {renderInfoRow("Gold Color", getVariationValue("Gold Color"))}
                {renderInfoRow("Size", getVariationValue("Size"))}
                {renderInfoRow(
                  "Approx Net Wt",
                  productDetail?.netWeight
                    ? `${productDetail?.netWeight} g`
                    : ""
                )}
              </>
            ) : null}
          </div>

          {/* Diamond Information */}
          <div className="text-sm md:text-sm 2xl:text-base 3xl:text-lg font-medium">
            <p className="inline-block font-semibold text-baseblack border-b-[2.5px] border-black_opacity_10 pt-[6px] pb-[6px] 3xl:pb-4">
              Diamond Information
            </p>
            {renderInfoRow("Diamond Type", "Lab Grown Diamond")}
            {renderInfoRow("Diamond Shape", getVariationValue("Diamond Shape"))}
            {renderInfoRow("Average Color", getVariationValue("Diamond Color"))}
            {renderInfoRow(
              "Diamond Clarity",
              getVariationValue("Average Clarity")
            )}

            {productDetail?.settingStyleNamesWithImg?.length > 0 &&
              renderInfoRow(
                "Setting Style",
                productDetail?.settingStyleNamesWithImg?.length > 0
                  ? productDetail?.settingStyleNamesWithImg
                      .map((s) => s.title)
                      .join(", ")
                  : ""
              )}
          </div>

          {/* Other Information */}
          {productDetail?.specifications?.length > 0 && (
            <div className="text-sm md:text-sm 2xl:text-base 3xl:text-lg font-medium">
              <p className="inline-block font-semibold text-baseblack border-b-[2.5px] border-black_opacity_10 pt-[6px] pb-[6px] 3xl:pb-4">
                Other Information
              </p>
              {productDetail?.specifications.map((item, index) =>
                item?.title?.trim() && item?.description?.trim() ? (
                  <p
                    key={index}
                    className={`pt-[25px] 2xl:pt-[30px] 3xl:pt-[40px] ${valueClass}`}
                  >
                    <span className={labelClass}>{item.title.trim()}:</span>{" "}
                    {item?.description?.trim()}
                  </p>
                ) : null
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Description",
      content: productDetail?.description ? (
        <div
          className="mt-4 2xl:mt-6 3xl:mt-8 text-sm md:text-sm 2xl:text-base 3xl:text-lg font-medium text-baseblack"
          dangerouslySetInnerHTML={{ __html: productDetail?.description }}
        />
      ) : (
        <p className="mt-4 2xl:mt-6 3xl:mt-8 text-sm md:text-sm 2xl:text-base 3xl:text-lg font-medium text-baseblack">
          No Description Available
        </p>
      ),
    },
    {
      label: "Shipping & Returns",
      content: (
        <div className="mt-4 2xl:mt-8 3xl:mt-12">
          {shippingReturnContent?.map((item) => (
            <div
              key={item?.label}
              className="flex flex-wrap gap-6 mt-4 lg:mt-8"
            >
              <p className="text-sm md:text-sm 2xl:text-base 3xl:text-lg text-baseblack">
                <span className="font-semibold">{item?.label} </span>
                {item?.content}
              </p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="mt-6">
      <div className="relative md:hidden mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="w-full border border-gray-300 px-4 py-2 text-sm bg-white text-left uppercase"
        >
          {activeTab}
          <span className="float-right">▼</span>
        </button>
        {open && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-md uppercase">
            {tabData.map(({ label }) => (
              <li
                key={label}
                onClick={() => {
                  setActiveTab(label);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer transition ${
                  activeTab === label
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-primary hover:text-white"
                }`}
              >
                {label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="hidden md:flex gap-6 lg:gap-20 2xl:gap-28 border-b">
        {tabData.map(({ label }) => (
          <button
            key={label}
            className={`py-2 3xl:text-[22px] font-medium ${
              activeTab === label
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(label)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {tabData?.find((tab) => tab?.label === activeTab)?.content || (
          <p>No Data</p>
        )}
      </div>
    </div>
  );
};
