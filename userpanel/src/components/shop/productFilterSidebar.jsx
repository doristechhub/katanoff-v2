import {
  defaultOpenKeys,
  resetFilters,
  setOpenKeys,
  setSelectedDiamondShape,
  setSelectedPrices,
  setSelectedSettingStyle,
  setSelectedVariations,
  setShowFilterSidebar,
  setSortByValue,
  toggleOpenKey,
} from "@/store/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useEffect } from "react";
import { useWindowSize } from "@/_helper/hooks";
import { sortByList } from "@/_helper/constants";
import * as Yup from "yup";
import { ProgressiveImg, RangeSlider } from "../dynamiComponents";
import { useFormik } from "formik";

export default function ProductFilterSidebar({ uniqueVariations = [] }) {
  const dispatch = useDispatch();
  const screen = useWindowSize();
  const {
    showFilterSidebar,
    openKeys,
    selectedSortByValue,
    selectedVariations,
    selectedSettingStyles,
    selectedDiamondShape,
    uniqueFilterOptions,
  } = useSelector(({ product }) => product);
  const isOpenKey = (key) => openKeys.includes(key);

  const priceRangeAvailable =
    Array.isArray(uniqueFilterOptions?.availablePriceRange) &&
    uniqueFilterOptions.availablePriceRange.length === 2;
  const onSelectVariant = (variationName, variationTypeName) => {
    dispatch(
      setSelectedVariations({
        ...selectedVariations,
        [variationName]: variationTypeName,
      })
    );
    closeSidebarIfMobile();
  };
  const onPriceChange = (value) => {
    dispatch(setSelectedPrices(value));
  };
  const formik = useFormik({
    initialValues: {
      priceRange: uniqueFilterOptions?.availablePriceRange || [0, 0],
    },
    validationSchema: Yup.object({
      priceRange: Yup.array()
        .of(Yup.number().required("Required"))
        .length(2, "Both min and max are required")
        .test(
          "min-max",
          "Min must be less than or equal to max",
          (value) => value && value[0] <= value[1]
        ),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {}, // Not needed for onChange usage
  });

  const { values, setFieldValue, errors, touched } = formik;

  const handleInputChange = (e, index) => {
    const val = parseFloat(e.target.value) || 0;
    const newRange = [...values.priceRange];
    newRange[index] = val;
    if (newRange[0] > newRange[1]) newRange.sort((a, b) => a - b);
    setFieldValue("priceRange", newRange);
  };

  const handleKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Enter",
      "Escape",
      "ArrowLeft",
      "ArrowRight",
      ".",
    ];
    if (/^\d$/.test(e.key)) return;
    if (!allowedKeys.includes(e.key)) e.preventDefault();
    if (e.key === "." && e.target.value.includes(".")) e.preventDefault();
  };

  useEffect(() => {
    const isSmallScreen = screen.isMobile || screen.isTablet;

    if (showFilterSidebar && isSmallScreen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [showFilterSidebar]);

  // Call onPriceChange whenever priceRange changes and is valid
  useEffect(() => {
    if (!formik.errors.priceRange && typeof onPriceChange === "function") {
      onPriceChange(values.priceRange);
    }
  }, [values.priceRange, formik.errors.priceRange, onPriceChange]);

  const multipleTrack = (props, state) => (
    <div
      {...props}
      key={state.index}
      className={`absolute top-0 bottom-0 rounded-md ${
        [0, 2].includes(state.index) ? "bg-gray-200" : "bg-primary"
      }`}
    />
  );

  const closeSidebarIfMobile = () => {
    const isSmallScreen = screen.isMobile || screen.isTablet;
    if (isSmallScreen) {
      dispatch(setShowFilterSidebar(false));
    }
  };
  return (
    <div
      className={`w-full lg:w-[300px] 2xl:w-[400px] flex-shrink-0 bg-white lg:bg-transparent transition-transform duration-300 ease-in-out lg:sticky lg:top-20 lg:h-screen lg:overflow-y-auto lg:translate-x-0 lg:z-0 z-[60] ${
        showFilterSidebar
          ? "fixed inset-y-0 left-0 translate-x-0 block"
          : "fixed -translate-x-full lg:translate-x-0 hidden"
      }`}
    >
      {showFilterSidebar && (
        <div>
          <div
            className="fixed inset-0 bg-white lg:hidden"
            onClick={() => {
              dispatch(setShowFilterSidebar(false));
              dispatch(setOpenKeys(defaultOpenKeys));
            }}
          />
        </div>
      )}

      <div className="relative z-3 bg-transparent p-4 h-full">
        <div className="flex justify-between items-center border-b border-gray-c8 pb-4">
          <h2 className="text-lg font-medium">All Filters</h2>
          <button
            onClick={() => {
              dispatch(setShowFilterSidebar(false));
              dispatch(setOpenKeys(defaultOpenKeys));
            }}
          >
            <AiOutlineClose />
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => dispatch(resetFilters())}
            className="text-xs underline hover:underline mt-3"
          >
            Reset Filters
          </button>
        </div>

        <div>
          <div className="border-b border-gray-c8">
            <button
              className={`w-full flex items-center justify-between ${
                isOpenKey("sortBy") ? "pt-4 pb-2" : "py-4"
              }`}
              onClick={() => dispatch(toggleOpenKey("sortBy"))}
            >
              <p className="font-medium mb-1">Sort By</p>
              <span className="text-xl">
                {isOpenKey("sortBy") ? <FiMinus /> : <FiPlus />}
              </span>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpenKey("sortBy")
                  ? "max-h-screen opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-wrap gap-2 pb-4">
                {sortByList?.length
                  ? sortByList.map((item) => (
                      <button
                        key={item.value}
                        onClick={() => {
                          dispatch(setSortByValue(item.value));
                          closeSidebarIfMobile();
                        }}
                        className={`px-3 py-1 border text-sm ${
                          selectedSortByValue === item.value
                            ? "bg-primary text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {item.title}
                      </button>
                    ))
                  : null}
              </div>
            </div>
          </div>
          {uniqueFilterOptions?.uniqueSettingStyles?.length ? (
            <div className="border-b border-gray-c8">
              <button
                className={`w-full flex items-center justify-between ${
                  isOpenKey("settingStyle") ? "pt-4 pb-2" : "py-4"
                }`}
                onClick={() => dispatch(toggleOpenKey("settingStyle"))}
              >
                <p className="font-medium mb-1">Setting Style</p>
                <span className="text-xl">
                  {isOpenKey("settingStyle") ? <FiMinus /> : <FiPlus />}
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpenKey("settingStyle")
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-2 pb-4">
                  {uniqueFilterOptions?.uniqueSettingStyles.map(
                    (settingStyle) => {
                      const isSelected =
                        selectedSettingStyles === settingStyle.value;

                      return (
                        <div
                          className={`text-center cursor-pointer`}
                          onClick={() => {
                            dispatch(
                              setSelectedSettingStyle(settingStyle.value)
                            );
                            closeSidebarIfMobile();
                          }}
                          key={`setting-style-${settingStyle.value}`}
                        >
                          <ProgressiveImg
                            className={`w-full  aspect-square object-cover !transition-none  border-2 border-transparent ${
                              isSelected ? "border-2 !border-primary" : ""
                            }`}
                            src={settingStyle.image}
                            alt={settingStyle.title}
                            title={settingStyle.title}
                          />
                          <h2 className="text-base lg:text-sm font-medium mt-2">
                            {settingStyle.title}
                          </h2>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {uniqueFilterOptions?.uniqueDiamondShapes?.length ? (
            <div className="border-b border-gray-c8">
              <button
                className={`w-full flex items-center justify-between ${
                  isOpenKey("diamondShape") ? "pt-4 pb-2" : "py-4"
                }`}
                onClick={() => dispatch(toggleOpenKey("diamondShape"))}
              >
                <p className="font-medium mb-1">Diamond Shapes</p>
                <span className="text-xl">
                  {isOpenKey("diamondShape") ? <FiMinus /> : <FiPlus />}
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpenKey("diamondShape")
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-4 pb-4 justify-center">
                  {uniqueFilterOptions?.uniqueDiamondShapes.map(
                    (diamondShape) => {
                      const isSelected =
                        selectedDiamondShape === diamondShape.id;
                      return (
                        <div
                          key={`setting-diamond-shape-${diamondShape.id}`}
                          className={`text-center cursor-pointer`}
                          onClick={() => {
                            dispatch(setSelectedDiamondShape(diamondShape.id));
                            closeSidebarIfMobile();
                          }}
                        >
                          <div
                            className={`p-1.5 border-2 ${
                              isSelected
                                ? "border-primary"
                                : "border-transparent"
                            }`}
                          >
                            <ProgressiveImg
                              className={`w-full aspect-square object-cover !transition-none`}
                              src={diamondShape.image}
                              alt={diamondShape.title}
                              title={diamondShape.title}
                            />
                          </div>
                          <h2 className="text-base lg:text-sm font-medium mt-2">
                            {diamondShape.title}
                          </h2>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {uniqueVariations?.length
            ? uniqueVariations.map((variation) => (
                <div
                  key={variation.variationId}
                  className="border-b border-gray-c8"
                >
                  <button
                    className={`w-full flex items-center justify-between ${
                      isOpenKey(variation.variationName) ? "pt-4 pb-2" : "py-4"
                    }`}
                    onClick={() =>
                      dispatch(toggleOpenKey(variation.variationName))
                    }
                  >
                    <p className="font-medium mb-1">
                      {variation.variationName}
                    </p>
                    <span className="text-xl">
                      {isOpenKey(variation.variationName) ? (
                        <FiMinus />
                      ) : (
                        <FiPlus />
                      )}
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpenKey(variation.variationName)
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex flex-wrap pb-4">
                      {variation.variationTypes.map((type) => (
                        <button
                          key={type.variationTypeId}
                          onClick={() =>
                            onSelectVariant(
                              variation.variationName,
                              type.variationTypeName
                            )
                          }
                          className={`px-3 flex items-center gap-2 py-1.5 m-1 border  text-sm ${
                            selectedVariations[variation.variationName] ===
                            type.variationTypeName
                              ? "bg-primary text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {type.variationTypeHexCode ? (
                            <div
                              className="w-6 h-6 "
                              style={{
                                backgroundColor: type.variationTypeHexCode,
                              }}
                            ></div>
                          ) : null}{" "}
                          {type.variationTypeName}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            : null}

          {priceRangeAvailable ? (
            <div>
              <button
                className={`w-full flex items-center justify-between ${
                  isOpenKey("price") ? "pt-4 pb-2" : "py-4"
                }`}
                onClick={() => dispatch(toggleOpenKey("price"))}
              >
                <p className="font-medium mb-1">Setting Price</p>
                <span className="text-xl">
                  {isOpenKey("price") ? <FiMinus /> : <FiPlus />}
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpenKey("price")
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-4 mt-5">
                  <RangeSlider
                    defaultValue={uniqueFilterOptions?.availablePriceRange}
                    min={uniqueFilterOptions?.availablePriceRange[0]}
                    max={uniqueFilterOptions?.availablePriceRange[1]}
                    rangeValue={values.priceRange}
                    setRangeValue={(value) =>
                      setFieldValue("priceRange", value)
                    }
                    setInputValues={(value) =>
                      setFieldValue("priceRange", value)
                    }
                    step={1}
                    renderTrack={multipleTrack}
                  />

                  <div className="flex justify-between gap-4">
                    <input
                      type="text"
                      value={values?.priceRange[0]}
                      onChange={(e) => handleInputChange(e, 0)}
                      onBlur={formik.handleBlur}
                      onKeyDown={handleKeyDown}
                      className="border px-2 py-1 w-20 text-center"
                    />
                    <input
                      type="text"
                      value={values?.priceRange[1]}
                      onChange={(e) => handleInputChange(e, 1)}
                      onBlur={formik.handleBlur}
                      onKeyDown={handleKeyDown}
                      className="border px-2 py-1 w-20 text-center"
                    />
                    {touched?.priceRange &&
                      typeof errors?.priceRange === "string" && (
                        <div className="text-red-500 text-sm">
                          {errors?.priceRange}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
