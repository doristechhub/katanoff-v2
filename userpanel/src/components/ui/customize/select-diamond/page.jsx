"use client";

import { fetchSingleProductDataById } from "@/_actions/product.actions";
import { helperFunctions } from "@/_helper";
import {
  ALLOWED_DIA_CLARITIES,
  ALLOWED_DIA_COLORS,
  messageType,
} from "@/_helper/constants";
import {
  AccordionTabs,
  ProgressiveImg,
  RangeSlider,
} from "@/components/dynamiComponents";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PrimaryLinkButton } from "../../button";
import {
  setDiamondMessage,
  setDiamondSelection,
} from "@/store/slices/selectDiamondSlice";
import { useRouter } from "next/navigation";
import {
  setCustomProductDetails,
  setSelectedDiamondInfoModel,
} from "@/store/slices/commonSlice";
import ring from "@/assets/images/customize/customize-ring-black.svg";
import diamond from "@/assets/images/customize/customize-diamond-black.svg";
import ringWithDiamondBlack from "@/assets/images/customize/customize-ringWithDiamond-black.svg";
import StepsGrid from "../StepsGrid";
import diamondNotFound from "@/assets/images/diamond-not-found.webp";
import CommonNotFound from "../../CommonNotFound";
import { setProductLoading } from "@/store/slices/productSlice";
import SkeletonLoader from "../../skeletonLoader";
import { fetchUniqueShapesAndCaratBounds } from "@/_actions/customize.action";
import CustomImg from "../../custom-img";
import question3steps from "@/assets/icons/question3steps.svg";
import checkMark3Step from "@/assets/icons/checkmark3step.svg";
import KeyFeatures from "../../KeyFeatures";
import ErrorMessage from "../../ErrorMessage";
import {
  DiamondClarityModal,
  DiamondColorModal,
  DiamondShapeModal,
} from "../DiamondInfoModel";
export default function SelectDiamondPage() {
  const router = useRouter();
  const { productLoading } = useSelector(({ product }) => product);
  const { customProductDetails } = useSelector(({ common }) => common);
  const { uniqueDiamondShapesAndCaratBounds } = useSelector(
    ({ common }) => common
  );
  const { diamondSelection, diamondMessage } = useSelector(
    ({ selectedDiamond }) => selectedDiamond
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const caratWeightRange = uniqueDiamondShapesAndCaratBounds?.caratBounds;
  const minCarat = caratWeightRange?.[0] || 0;
  const maxCarat = caratWeightRange?.[1] || 0;
  const pId = customProductDetails?.productId;
  const isDiamondSelected = customProductDetails?.diamondDetails;
  const currentStep = 1;
  const steps = useMemo(() => {
    if (pId && isDiamondSelected) {
      return [
        {
          id: 1,
          label: "Choose Diamond",
          icon: diamond,
        },
        {
          id: 2,
          label: "Choose Setting",
          icon: ring,
          subOption: [
            {
              label: "View",
              route: `/customize/start-with-setting/${pId}`,
            },
            {
              label: "Change",
              route: "/customize/start-with-setting",
            },
          ],
        },
        {
          id: 3,
          label: "Complete Ring",
          icon: ringWithDiamondBlack,
          iconBlack: ringWithDiamondBlack,
          disabled: false,
          subOption: [
            {
              label: "View",
              route: `/customize/complete-ring`,
            },
          ],
        },
      ];
    } else {
      return [
        {
          id: 1,
          label: "Choose a",
          labelDetail: "Diamond",
        },
        {
          id: 2,
          label: "Choose a",
          labelDetail: "Setting",
          disabled: true,
        },

        {
          id: 3,
          label: "Completed",
          labelDetail: "Ring",
          iconBlack: ringWithDiamondBlack,
          disabled: true,
        },
      ];
    }
  }, [customProductDetails]);

  // Get initial values from localStorage or set defaults
  // Get initial values from localStorage
  const initialCustomProduct =
    JSON.parse(localStorage.getItem("customProduct")) || {};
  const initialShape = initialCustomProduct?.diamondDetails?.shape || null;
  const initialClarity = initialCustomProduct?.diamondDetails?.clarity || null;
  const initialColor = initialCustomProduct?.diamondDetails?.color?.value
    ? initialCustomProduct?.diamondDetails?.color
    : null;
  const initialCaratWeight =
    initialCustomProduct?.diamondDetails?.caratWeight || null;

  const loadData = useCallback(async () => {
    try {
      await dispatch(fetchUniqueShapesAndCaratBounds());
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (isLoading || !uniqueDiamondShapesAndCaratBounds) return;

    // Only initialize if diamondSelection is empty (i.e., on first mount)
    if (
      !diamondSelection.shape &&
      !diamondSelection.clarity &&
      !diamondSelection.color &&
      !diamondSelection.caratWeight
    ) {
      const defaultShape =
        uniqueDiamondShapesAndCaratBounds?.distinctShapes?.[0] || null;
      const defaultClarity = ALLOWED_DIA_CLARITIES[0] || null;
      const defaultColor = ALLOWED_DIA_COLORS[0] || null;
      const defaultCaratWeight =
        uniqueDiamondShapesAndCaratBounds?.caratBounds?.[0] || 0;

      const updatedSelection = {
        shape: initialShape || defaultShape,
        clarity: initialClarity || defaultClarity,
        color: initialColor || defaultColor,
        caratWeight: initialCaratWeight || defaultCaratWeight,
      };
      dispatch(setDiamondSelection(updatedSelection));
    }
  }, [
    dispatch,
    isLoading,
    uniqueDiamondShapesAndCaratBounds,
    initialShape,
    initialClarity,
    initialColor,
    initialCaratWeight,
  ]);

  const handleContinueClick = () => {
    try {
      // Check if all required fields are selected
      if (
        !diamondSelection.shape?.id ||
        !diamondSelection.clarity?.value ||
        !diamondSelection.color?.value ||
        !diamondSelection?.caratWeight
      ) {
        dispatch(
          setDiamondMessage({
            message: "Please Select All Options",
            type: messageType.ERROR,
          })
        );
        return;
      }
      dispatch(setDiamondMessage(null));

      const customProduct =
        JSON.parse(localStorage.getItem("customProduct")) || {};

      const updatedCustomProduct = {
        ...customProduct,
        diamondDetails: {
          shape: diamondSelection?.shape,
          clarity: diamondSelection?.clarity,
          color: diamondSelection?.color,
          caratWeight: diamondSelection?.caratWeight,
        },
      };

      localStorage.setItem(
        "customProduct",
        JSON.stringify(updatedCustomProduct)
      );

      router.push("/customize/select-setting");
    } catch (error) {
      console.error("Error saving diamond selection:", error);
      dispatch(
        setDiamondMessage({
          message: "An error occurred while saving your selection.",
          type: messageType.ERROR,
        })
      );
    }
  };
  const generateCaratOptions = (min, max, step = 0.5) => {
    const options = [];
    for (let i = min; i <= max; i += step) {
      options.push(parseFloat(i.toFixed(2))); // avoid floating point issues
    }
    return options;
  };

  const caratOptions = generateCaratOptions(minCarat, maxCarat);

  const accordianContent = [
    {
      label: "Design Your Own Diamond Ring with Katanoff",
      content: (
        <>
          <div className="flex flex-col gap-3">
            <p>
              Design your own diamond ring with Katanoff and bring your dream
              piece to life. Choose your diamond, customize the setting, and
              create a one-of-a-kind ring that reflects your style and story.
            </p>
          </div>
        </>
      ),
    },
    {
      label: "FAQs",
      content: (
        <>
          <div className="flex flex-col gap-3">
            <p>
              Transform your imagination into a one-of-a-kind necklace that
              reflects your personal style and story. Whether you envision a
              minimalist gold pendant or a detailed diamond-studded design, our
              artisans bring your ideas to life with precision and care. With
              endless customization options, you're free to choose every detail
              — from metal type to gemstone arrangement — and craft a piece
              that’s truly yours.
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <section className="container">
        <div className="pt-12 lg:pt-16">
          <StepsGrid steps={steps} currentStep={currentStep} />
        </div>
        <div className="pt-6 lg:pt-8 2xl:pt-10 text-center flex justify-center">
          <p className="font-castoro text-lg xss::text-xl xs:text-2xl lg:text-3xl 2xl:text-4xl xs:w-[70%] lg:w-[45%] 2xl:w-[40%] 4xl:w-[35%]">
            Design Your Own Lab Created Diamond Engagement Ring
          </p>
        </div>
        {isLoading ? (
          <SelectDiamondSkeleton />
        ) : (
          <div className="pt-8 lg:pt-12">
            <div
              className="grid lg:grid-cols-[25%_50%_25%] gap-4 2xl:gap-5 w-full rounded-md"
              style={{ boxShadow: "0px 4px 15px rgba(112, 112, 112, 0.53)" }}
            >
              <div className="pt-10 px-6 w-full relative lg:pb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold">SHAPE</h3>
                  <button
                    className="cursor-pointer"
                    onClick={() =>
                      dispatch(setSelectedDiamondInfoModel("shape"))
                    }
                  >
                    <CustomImg
                      srcAttr={question3steps}
                      altAttr="Question Marks"
                      className="w-5 h-5 "
                    />
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 2xl:grid-cols-5 gap-6 mt-4">
                  {uniqueDiamondShapesAndCaratBounds?.distinctShapes?.map(
                    (item, index) => (
                      <div
                        className="text-center flex flex-col items-center gap-1"
                        key={`diamond-shape-${index}`}
                      >
                        <div
                          className={`group flex flex-col justify-between items-center w-[70px] h-[72px] py-2 px-2 rounded-md cursor-pointer border  ${
                            diamondSelection.shape?.id === item.id
                              ? "border-[1.5px] border-baseblack bg-opacity-10"
                              : "border-transparent hover:border-primary"
                          } transition-all duration-300`}
                          onClick={() => {
                            dispatch(setDiamondSelection({ shape: item }));
                            if (diamondMessage?.type === messageType.ERROR) {
                              dispatch(setDiamondMessage(null));
                            }
                          }}
                        >
                          <ProgressiveImg
                            src={item?.image}
                            alt={item?.name}
                            className="w-8 h-8 mb-2"
                          />
                          {/* Reserve space for label, even when not selected */}
                          <span
                            className={`text-xs uppercase transition-all duration-300 ${
                              diamondSelection.shape?.id === item?.id
                                ? "text-baseblack font-semibold"
                                : "text-transparent group-hover:text-baseblack"
                            }`}
                          >
                            {item?.title}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="hidden lg:block absolute right-0 top-6 h-[80%] w-px bg-[#0000001A]" />

                {/* Horizontal line for below lg */}
                <div className="block lg:hidden w-full h-px bg-[#0000001A] my-4" />
              </div>
              <div className="w-full flex flex-col pt-4 lg:pt-10 px-8 relative lg:pb-4">
                <div className="mb-2 items-center">
                  <h3 className="font-semibold text-base uppercase">
                    TOTAL CARAT WEIGHT
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {caratOptions.map((value, index) => {
                    const isSelected =
                      parseFloat(diamondSelection.caratWeight) === value;
                    return (
                      <div
                        key={`carat-option-${index}`}
                        className={`w-[55px] flex justify-center items-center px-2 py-1.5 cursor-pointer transition-all duration-100
         rounded-[3px] border ${
           isSelected
             ? "text-baseblack border-baseblack"
             : "border-transparent hover:border-baseblack"
         }`}
                        onClick={() => {
                          dispatch(setDiamondSelection({ caratWeight: value }));
                          if (diamondMessage?.type === messageType.ERROR) {
                            dispatch(setDiamondMessage(null));
                          }
                        }}
                      >
                        <p className="text-sm font-medium text-baseblack">
                          {value}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col xs:flex-row  2xl:flex-row lg:flex-col gap-6 xl:gap-10 w-full pt-6">
                  <div className="">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-base uppercase">
                        Clarity
                      </h3>
                      <button
                        onClick={() =>
                          dispatch(setSelectedDiamondInfoModel("clarity"))
                        }
                      >
                        <CustomImg
                          srcAttr={question3steps}
                          altAttr="Question Marks"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                    <div className="flex 2xl:gap-1">
                      {ALLOWED_DIA_CLARITIES.map((item, index) => (
                        <div
                          key={`diamond-clarity-${index}`}
                          title={item?.title}
                          className={`hover:border !w-[55px] flex justify-center items-center px-2 py-1 2xl:py-1.5 cursor-pointer transition-all duration-100 ${
                            diamondSelection.clarity?.value === item.value
                              ? "text-baseblack  border-baseblack rounded-[3px] border"
                              : "border-approxgray text-baseblack hover:border-baseblack hover:rounded-[3px]"
                          }`}
                          onClick={() => {
                            dispatch(setDiamondSelection({ clarity: item }));
                            if (diamondMessage?.type === messageType.ERROR) {
                              dispatch(setDiamondMessage(null));
                            }
                          }}
                        >
                          <p className="text-sm font-medium text-baseblack">
                            {item?.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-base uppercase">
                        Color
                      </h3>
                      <button
                        onClick={() =>
                          dispatch(setSelectedDiamondInfoModel("color"))
                        }
                      >
                        <CustomImg
                          srcAttr={question3steps}
                          altAttr="Question Marks"
                          className="w-5 h-5 "
                        />
                      </button>
                    </div>
                    <div className="flex  gap-2 2xl:gap-1">
                      {ALLOWED_DIA_COLORS.map((item, index) => (
                        <div
                          key={`diamond-color-${index}`}
                          title={item?.title}
                          className={`hover:border !w-10 px-2 flex justify-center items-center py-1 2xl:py-1.5 cursor-pointer transition-all duration-100 ${
                            diamondSelection.color?.value === item.value
                              ? "text-baseblack  border-baseblack rounded-[3px] border"
                              : "border-approxgray text-baseblack  hover:border-baseblack hover:rounded-[3px]"
                          }`}
                          onClick={() => {
                            dispatch(setDiamondSelection({ color: item }));
                            if (diamondMessage?.type === messageType.ERROR) {
                              dispatch(setDiamondMessage(null));
                            }
                          }}
                        >
                          <p className="text-sm">{item?.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* <div className="hidden lg:block absolute right-0 top-6 h-[80%] w-px bg-[#0000001A]" /> */}
                <div className="hidden lg:block absolute right-0 top-6 h-[80%] w-px bg-[#0000001A]" />

                {/* Horizontal line for below lg */}
                <div className="block lg:hidden w-full h-px bg-[#0000001A] mt-12" />
              </div>
              <div className="pl-8 flex flex-col items-start gap-4 my-5 pt-4 lg:pt-10 lg:pl-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 4xl:grid-cols-2 gap-y-6 items-start sm:items-center ">
                  <div className="flex items-center gap-2">
                    <CustomImg srcAttr={checkMark3Step} className="w-5 h-5" />
                    <p className="font-medium text-sm">Certified: IGI</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CustomImg srcAttr={checkMark3Step} className="w-5 h-5" />

                    <p className="font-medium text-sm">Diamond: LABGROWN</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CustomImg srcAttr={checkMark3Step} className="w-5 h-5" />

                    <p className="font-medium text-sm">Report</p>
                  </div>
                </div>

                <div className="pt-2">
                  <PrimaryLinkButton
                    className="!bg-transparent !text-baseblack !border !border-baseblack px-6 py-2 !rounded-[6px] hover:!bg-black hover:!text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      handleContinueClick();
                    }}
                  >
                    NEXT
                  </PrimaryLinkButton>
                  {diamondMessage?.type === messageType.ERROR ? (
                    <ErrorMessage message={diamondMessage?.message} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="pt-8 lg:pt-12 xl:pt-20">
          <div className="flex border-b border-grayborder pb-10 text-lg" />
          <AccordionTabs
            tabs={accordianContent}
            forceResetKey="return"
            contentCustomClass="md:text-lg"
          />
        </div>
      </section>

      <div className="pt-8 lg:pt-12 xl:pt-20">
        <KeyFeatures />
      </div>
      <DiamondShapeModal />
      <DiamondClarityModal />
      <DiamondColorModal />
    </>
  );
}

const SelectDiamondSkeleton = () => {
  const skeletons = [
    { width: "w-[80%]", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-4", margin: "mt-2" },
    { width: "w-[80%]", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-4", margin: "mt-2" },
  ];
  return (
    <div className={`container pt-10 `}>
      <div>
        {Array(2)
          .fill(skeletons)
          .flat()
          .map((skeleton, index) => (
            <SkeletonLoader
              key={index}
              width={skeleton.width}
              height={skeleton.height}
              className={skeleton.margin}
            />
          ))}
      </div>
    </div>
  );
};
