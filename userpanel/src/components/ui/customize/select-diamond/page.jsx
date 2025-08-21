"use client";

import {
  messageType,
} from "@/_helper/constants";
import { AccordionTabs, ProgressiveImg } from "@/components/dynamiComponents";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PrimaryLinkButton } from "../../button";
import {
  resetDiamondSelection,
  setDiamondLoading,
  setDiamondMessage,
  setDiamondSelection,
} from "@/store/slices/selectDiamondSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { setSelectedDiamondInfoModel } from "@/store/slices/commonSlice";

import StepsGrid from "../StepsGrid";
import {
  fetchCustomizeProductSettings,
  // fetchCustomizeProductSettings,
  fetchUniqueShapesAndCaratBounds,
} from "@/_actions/customize.action";
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
import { helperFunctions } from "@/_helper";

export default function SelectDiamondPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shapeFromUrl = searchParams?.get("shape")?.toLowerCase();
  const { customProductDetails } = useSelector(({ common }) => common);
  const { uniqueDiamondShapesAndCaratBounds } = useSelector(
    ({ common }) => common
  );
  const {
    diamondSelection,
    diamondMessage,
    diamondLoading,
    customizeProductSettings,
  } = useSelector(({ selectedDiamond }) => selectedDiamond);
  const dispatch = useDispatch();
  const caratWeightRange = uniqueDiamondShapesAndCaratBounds?.caratBounds;
  const minCarat = caratWeightRange?.[0] || 0;
  const maxCarat = caratWeightRange?.[1] || 0;
  const customProduct = helperFunctions?.getCustomProduct();
  const pId = customProduct?.productId;
  const isDiamondSelected = customProduct?.diamondDetails;
  const currentStep = 1;

  const steps = useMemo(() => {
    // if (!pId) {
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
        disabled: true,
      },
    ];
    // }
    // else if (isDiamondSelected && pId) {
    //   return [
    //     {
    //       id: 1,
    //       label: "Choose a",
    //       labelDetail: "Diamond",
    //     },
    //     {
    //       id: 2,
    //       label: "Choose a",
    //       labelDetail: "Setting",
    //       subOption: [
    //         {
    //           label: "Change",
    //           route: "/customize/select-setting",
    //           onClick: () => {
    //             const customProductData = helperFunctions?.getCustomProduct() || {};
    //             delete customProductData?.productId;
    //             localStorage.setItem("customProduct", JSON.stringify(customProductData));
    //           },
    //         },
    //       ],
    //     },

    //     {
    //       id: 3,
    //       label: "Completed",
    //       labelDetail: "Ring",
    //       subOption: [
    //         {
    //           label: "View",
    //           route: "/customize/complete-ring",
    //         },
    //       ],
    //     },
    //   ];
    // }
  }, [customProductDetails]);


  const allowedClarityOptions = useMemo(() => {
    const validValues =
      customizeProductSettings?.diamondClarities?.flatMap((c) => c.compatibleOptions) || [];

    return validValues.map((val) => ({
      title: val,
      value: val,
    }));
  }, [customizeProductSettings]);


  const allowedColorOptions = useMemo(() => {
    const validValues =
      customizeProductSettings?.diamondColors?.flatMap((c) => c.compatibleOptions) || [];

    return validValues.map((val) => ({
      title: val,
      value: val,
    }));
  }, [customizeProductSettings]);

  const loadData = useCallback(async () => {
    try {
      localStorage.removeItem("customProduct");
      dispatch(setDiamondLoading(true));
      await dispatch(fetchCustomizeProductSettings());
      await dispatch(fetchUniqueShapesAndCaratBounds());
      dispatch(setDiamondLoading(false));
    } catch (error) {
      console.error("Error loading data:", error);
      dispatch(setDiamondLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (shapeFromUrl) {
      dispatch(resetDiamondSelection());
    }
  }, [dispatch, shapeFromUrl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (
      diamondLoading ||
      !uniqueDiamondShapesAndCaratBounds ||
      !uniqueDiamondShapesAndCaratBounds?.distinctShapes?.length
    ) {
      return;
    }

    const noSelection =
      !diamondSelection.shape &&
      !diamondSelection.clarity &&
      !diamondSelection.color &&
      !diamondSelection.caratWeight;

    if (noSelection) {
      const allShapes = uniqueDiamondShapesAndCaratBounds?.distinctShapes;
      const urlShape =
        allShapes?.find(
          (shape) => shape?.title?.toLowerCase() === shapeFromUrl
        ) || null;
      const defaultShape = allShapes[0];
      // const defaultShape = uniqueDiamondShapesAndCaratBounds.distinctShapes[0];
      const finalShape = urlShape || defaultShape;
      const defaultClarity = allowedClarityOptions[0] || null;
      const defaultColor = allowedColorOptions[0] || null;
      const defaultCaratWeight =
        uniqueDiamondShapesAndCaratBounds?.caratBounds?.[0] || 0;
      const updatedSelection = {
        shape: finalShape,
        clarity: defaultClarity,
        color: defaultColor,
        caratWeight: defaultCaratWeight,
      };
      dispatch(setDiamondSelection(updatedSelection));
    }
  }, [
    diamondLoading,
    uniqueDiamondShapesAndCaratBounds,
    diamondSelection,
    dispatch,
    shapeFromUrl,
  ]);

  const handleContinueClick = () => {
    try {
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

      const customProduct = helperFunctions?.getCustomProduct() || {};

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

  const caratOptions = useMemo(
    () => helperFunctions?.generateCaratValues({ minCarat, maxCarat, step: 0.5 }),
    [minCarat, maxCarat]
  );


  const accordianContent = [
    {
      label: "Design Your Own Diamond Ring with Katanoff",
      content: (
        <>
          <div className="flex flex-col gap-3">
            <p>
              Design your own diamond ring with Katanoff and bring your dream
              piece to life. Choose your diamond, customize the setting, and
              create a one of a kind ring that reflects your style and story.
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
              Transform your imagination into a one of a kind necklace that
              reflects your personal style and story. Whether you envision a
              minimalist gold pendant or a detailed diamond-studded design, our
              artisans bring your ideas to life with precision and care. With
              endless customization options, you're free to choose every detail
              from metal type to gemstone arrangement and craft a piece that’s
              truly yours.
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
          <StepsGrid
            steps={steps}
            currentStep={currentStep}
            titleText="Design Your Own Lab Created Diamond Engagement Ring"
          />
        </div>

        {diamondLoading ? (
          <SelectDiamondSkeleton />
        ) : uniqueDiamondShapesAndCaratBounds?.distinctShapes?.length > 0 &&
          (caratWeightRange?.[0] > 0 || caratWeightRange?.[1] > 0) ? (
          <div className="pt-8 lg:pt-12">
            <div
              className="grid lg:grid-cols-[27%_44%_27%] gap-4 2xl:gap-5 w-full rounded-md"
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
                      className="w-5 h-5"
                      titleAttr="Shape"
                    />
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5 gap-6 mt-4">
                  {uniqueDiamondShapesAndCaratBounds?.distinctShapes?.map(
                    (item, index) => (
                      <div
                        className="text-center flex flex-col items-center gap-1"
                        key={`diamond-shape-${index}`}
                      >
                        <div
                          className={`group flex flex-col justify-between items-center w-[70px] h-[76px] py-2 px-2 rounded-md cursor-pointer border  ${diamondSelection.shape?.id === item.id
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
                            className={`text-xs uppercase transition-all duration-300 ${diamondSelection.shape?.id === item?.id
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
                <div className="block lg:hidden w-full h-px bg-[#0000001A] my-4" />
              </div>
              <div className="w-full flex flex-col pt-4 lg:pt-10 px-8 lg:px-4 relative lg:pb-4">
                <div className="mb-4 items-center">
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
                        className={`w-[50px] flex justify-center items-center px-2 py-1.5 cursor-pointer transition-all duration-100
                            rounded-[3px] border ${isSelected
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
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="font-semibold text-base uppercase">
                        CLARITY
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
                          titleAttr="Clarity"
                        />
                      </button>
                    </div>
                    <div className="flex gap-2 2xl:gap-1">
                      {allowedClarityOptions.map((item, index) => (
                        <div
                          key={`diamond-clarity-${index}`}
                          title={item?.title}
                          className={`hover:border !w-[60px] flex justify-center items-center px-2 py-1 2xl:py-1.5 cursor-pointer transition-all duration-100 ${diamondSelection.clarity?.value === item.value
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
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="font-semibold text-base uppercase">
                        COLOR
                      </h3>
                      <button
                        onClick={() =>
                          dispatch(setSelectedDiamondInfoModel("color"))
                        }
                      >
                        <CustomImg
                          srcAttr={question3steps}
                          className="w-5 h-5"
                          titleAttr="Color"
                        />
                      </button>
                    </div>
                    <div className="flex  gap-2 2xl:gap-1">
                      {allowedColorOptions?.map((item, index) => (
                        <div
                          key={`diamond-color-${index}`}
                          title={item?.title}
                          className={`hover:border !w-10 px-2 flex justify-center items-center py-1 2xl:py-1.5 cursor-pointer transition-all duration-100 ${diamondSelection.color?.value === item.value
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
                    variant="blackHover"
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
        ) : (
          <div className="pt-8 lg:pt-12 text-center">
            <p className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-700 mb-4">
              Currently, we don’t have any diamonds available that support all
              three steps of customization.
            </p>
            <div className="flex justify-center mt-4">
              <PrimaryLinkButton
                variant="blackHover"
                className="!uppercase"
                href="/"
              >
                Back To Home
              </PrimaryLinkButton>
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

      <div className="pt-8 lg:pt-12 xl:pt-16">
        <KeyFeatures />
      </div>
      <DiamondShapeModal />
      <DiamondClarityModal />
      <DiamondColorModal />
    </>
  );
}

const SelectDiamondSkeleton = () => {
  const renderShapeSkeletons = Array(10)
    .fill(null)
    .map((_, i) => (
      <div
        key={`shape-${i}`}
        className="w-10 h-10 rounded border mt-2 bg-gray-200 animate-pulse"
      ></div>
    ));

  const renderCaratSkeletons = Array(7)
    .fill(null)
    .map((_, i) => (
      <div
        key={`carat-${i}`}
        className="w-16 h-6 rounded bg-gray-200 animate-pulse"
      ></div>
    ));

  const renderLabel = (width = "w-32") => (
    <div
      className={`${width} h-4 bg-gray-200 rounded animate-pulse mt-2`}
    ></div>
  );

  const renderOptionGroup = (count) =>
    Array(count)
      .fill(null)
      .map((_, i) => (
        <div
          key={i}
          className="w-16 h-6 rounded bg-gray-200 animate-pulse"
        ></div>
      ));

  return (
    <div className="container pt-10 xl:pt-16">
      <div
        className="grid lg:grid-cols-[27%_44%_27%] gap-8 lg:gap-4  w-full rounded-md p-4 lg:p-6 bg-white"
        style={{ boxShadow: "0px 4px 15px rgba(112, 112, 112, 0.53)" }}
      >
        <div className="flex-1 min-w-[200px] px-6">
          {renderLabel("w-40")}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-3 2xl:grid-cols-5 gap-6 mt-4">
            {renderShapeSkeletons}
          </div>
        </div>

        <div className="flex-1 min-w-[300px] px-6">
          {renderLabel("w-40")}
          <div className="flex flex-wrap gap-2 mt-4">
            {renderCaratSkeletons}
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col 3xl:flex-row gap-4 mt-4">
            <div>
              {renderLabel("w-24")}
              <div className="flex gap-2 mt-4">{renderOptionGroup(3)}</div>
            </div>
            <div>
              {renderLabel("w-20")}
              <div className="flex gap-2 mt-4">{renderOptionGroup(3)}</div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[150px] flex flex-col lg:pl-0 pl-6">
          <div className="grid gird-cols-1 3xl:grid-cols-2">
            <div className="w-28 h-4 bg-gray-200 rounded animate-pulse mt-2" />
            <div className="w-28 h-4 bg-gray-200 rounded animate-pulse mt-2" />
            <div className="w-28 h-4 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
          <div className="mt-6">
            <div className="w-36 h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
