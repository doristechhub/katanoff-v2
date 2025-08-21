"use client";
import { memo, useCallback, useRef, useMemo, useEffect } from "react";
import { CustomImg, ProgressiveImg } from "../dynamiComponents";
import dropdownArrow from "@/assets/icons/dropdownArrow.svg";
import { DIAMOND_CLARITY, DIAMOND_CLARITY_KEY, DIAMOND_COLOR, DIAMOND_COLOR_KEY, DIAMOND_SHAPE, DIAMOND_SHAPE_KEY, DIAMOND_WEIGHT, DIAMOND_WEIGHT_KEY, GOLD_COLOR, GOLD_TYPES, helperFunctions, LENGTH, RING_SIZE } from "@/_helper";
import { useDispatch, useSelector } from "react-redux";
import { setCustomProductDetails } from "@/store/slices/commonSlice";
import { setSelectedVariations } from "@/store/slices/productSlice";

const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  return useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
};

const DisplayVariationButtons = ({ variationName, variationKey, options, selectedVariations, isSelected, handleDiamondSelection }) => {
  const selectedType = selectedVariations?.find((v) => v?.variationId === variationKey)?.variationTypeName || "";

  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold text-baseblack text-sm">
        {variationName}:&nbsp;{selectedType}
      </p>
      <div className="flex flex-wrap gap-4 md:gap-6 items-start lg:items-center">
        {options?.map((option) => {

          const selected = isSelected(variationKey, option?.value);

          return (
            <button
              key={option?.value}
              className={`px-8 py-2 text-[12px] font-semibold rounded-sm transition-all ${selected ? "border-grayborder text-baseblack border" : "text-baseblack border-transparent border"
                } hover:!border-grayborder`}
              onClick={() =>
                handleDiamondSelection({
                  variationId: variationKey,
                  variationTypeId: option?.value,
                  variationName,
                  variationTypeName: option?.value,
                })
              }
            >
              {option?.value}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const VariationsList = ({
  productDetail = {},
  selectedVariations,
  handleSelect,
  setHoveredColor,
  hoveredColor,
  isCustomizePage,
}) => {
  const { variations, diamondFilters } = productDetail
  const dispatch = useDispatch();
  const debouncedSetHoveredColor = useDebounce(setHoveredColor, 100);
  const { customProductDetails } = useSelector(
    ({ common }) => common
  );
  const { customizeProductSettings } = useSelector(
    ({ selectedDiamond }) => selectedDiamond
  );

  const minCarat = diamondFilters?.caratWeightRange?.min || 0;
  const maxCarat = diamondFilters?.caratWeightRange?.max || 0;
  const diamondShapes = diamondFilters?.diamondShapes || [];

  const isSelected = (variationId, variationTypeId) =>
    selectedVariations?.length &&
    selectedVariations?.some(
      (v) =>
        v?.variationId === variationId && v?.variationTypeId === variationTypeId
    );

  // Memoize sorted variations and their variationTypes
  const sortedVariations = useMemo(() => {
    return [...(variations || [])]
      .map((variation) => ({
        ...variation,
        variationTypes: [...(variation?.variationTypes || [])].sort((a, b) => {
          const posA = a?.position ?? 0;
          const posB = b?.position ?? 0;
          return posA - posB;
        }),
      }))
      .sort((a, b) => {
        const posA = a?.position ?? 0;
        const posB = b?.position ?? 0;
        return posA - posB;
      });
  }, [variations]);

  // Filter variations for customize page
  const filteredVariations = useMemo(() => {
    if (isCustomizePage) {
      return sortedVariations.filter((variation) =>
        [GOLD_TYPES, GOLD_COLOR, RING_SIZE, LENGTH].includes(
          variation?.variationName
        )
      );
    }
    return sortedVariations;
  }, [sortedVariations, isCustomizePage]);


  const initialPickValidOption = (savedValue, allowedOptions) => {
    if (savedValue && allowedOptions.some((o) => o.value === savedValue)) {
      return allowedOptions.find((o) => o.value === savedValue);
    }

    if (allowedOptions.length > 0) {
      return allowedOptions[0];
    }

    return null;
  };


  const caratRangeOptions = useMemo(() => {
    if (!isCustomizePage) return [];
    return helperFunctions?.generateCaratValues({ minCarat, maxCarat, step: 0.5 }).map(value => ({
      variationTypeId: `carat-${value}`,
      variationTypeName: value,
    }));
  }, [isCustomizePage, minCarat, maxCarat]);

  const allowedClarityOptions = useMemo(() => {
    if (!isCustomizePage) return;

    const validValues =
      customizeProductSettings?.diamondClarities?.flatMap((c) => c.compatibleOptions) || [];

    return validValues.map((val) => ({
      title: val,
      value: val,
    }));
  }, [isCustomizePage, customizeProductSettings]);


  const allowedColorOptions = useMemo(() => {
    if (!isCustomizePage) return;

    const validValues =
      customizeProductSettings?.diamondColors?.flatMap((c) => c.compatibleOptions) || [];

    return validValues.map((val) => ({
      title: val,
      value: val,
    }));
  }, [isCustomizePage, customizeProductSettings]);

  let currentCustomProduct = helperFunctions?.getCustomProduct() || {
    diamondDetails: {},
  };

  // Set default selections
  useEffect(() => {
    if (!isCustomizePage) return;
    const diamondDetails = customProductDetails?.diamondDetails;

    if (
      !selectedVariations?.find((v) => v?.variationId === DIAMOND_SHAPE_KEY) &&
      diamondShapes.length > 0
    ) {
      let shapeId;
      let shapeTitle;
      if (diamondDetails?.shape) {
        shapeId = diamondDetails?.shape?.id;
        shapeTitle = diamondDetails?.shape?.title;
      } else {
        const firstShape = diamondShapes[0];
        shapeId = firstShape?.id;
        shapeTitle = firstShape?.title;
      }
      handleSelect({ variationId: DIAMOND_SHAPE_KEY, variationTypeId: shapeId, variationName: DIAMOND_SHAPE, variationTypeName: shapeTitle });
    }

    const currentWeight = selectedVariations?.find((v) => v?.variationId === DIAMOND_WEIGHT_KEY);
    if (caratRangeOptions.length > 0) {
      const isValidWeight = currentWeight && caratRangeOptions.some(
        (option) => option.variationTypeId === currentWeight?.variationTypeId
      );
      if (!isValidWeight) {
        let weightOption;

        if (
          diamondDetails?.caratWeight &&
          diamondDetails?.caratWeight >= minCarat &&
          diamondDetails?.caratWeight <= maxCarat
        ) {
          weightOption = caratRangeOptions.find(
            (o) => o?.variationTypeId === `carat-${diamondDetails?.caratWeight}`
          );
        }
        if (!weightOption) {
          weightOption = caratRangeOptions[0];
        }
        if (weightOption) {
          handleSelect({
            variationId: DIAMOND_WEIGHT_KEY,
            variationTypeId: weightOption?.variationTypeId,
            variationName: DIAMOND_WEIGHT,
            variationTypeName: weightOption?.variationTypeName,
          });
          const updatedCustomProduct = {
            ...currentCustomProduct,
            diamondDetails: {
              ...currentCustomProduct.diamondDetails,
              caratWeight: parseFloat(weightOption.variationTypeName),
            },
          };
          localStorage.setItem("customProduct", JSON.stringify(updatedCustomProduct));
          dispatch(setCustomProductDetails(updatedCustomProduct));
        }
      }
    }

    const currentClarity =
      selectedVariations?.find((v) => v?.variationId === DIAMOND_CLARITY_KEY);
    if (!currentClarity) {
      const chosenClarity = initialPickValidOption(
        diamondDetails?.clarity?.value,
        allowedClarityOptions
      );
      if (chosenClarity) {
        handleSelect({
          variationId: DIAMOND_CLARITY_KEY,
          variationTypeId: chosenClarity?.value,
          variationName: DIAMOND_CLARITY,
          variationTypeName: chosenClarity?.value,
        });
        const updatedCustomProduct = {
          ...currentCustomProduct,
          diamondDetails: {
            ...currentCustomProduct.diamondDetails,
            clarity: {
              title: chosenClarity?.title,
              value: chosenClarity?.value,
            },
          },
        };
        localStorage.setItem("customProduct", JSON.stringify(updatedCustomProduct));
        dispatch(setCustomProductDetails(updatedCustomProduct));
      }
    }

    const currentColor =
      selectedVariations?.find((v) => v?.variationId === DIAMOND_COLOR_KEY);
    if (!currentColor) {
      const chosenColor = initialPickValidOption(
        diamondDetails?.color?.value,
        allowedColorOptions
      );

      if (chosenColor) {
        handleSelect({
          variationId: DIAMOND_COLOR_KEY,
          variationTypeId: chosenColor?.value,
          variationName: DIAMOND_COLOR,
          variationTypeName: chosenColor?.value,
        });

        const updatedCustomProduct = {
          ...currentCustomProduct,
          diamondDetails: {
            ...currentCustomProduct?.diamondDetails,
            color: {
              title: chosenColor?.title,
              value: chosenColor?.value,
            },
          },
        };
        localStorage.setItem("customProduct", JSON.stringify(updatedCustomProduct));
        dispatch(setCustomProductDetails(updatedCustomProduct));
      }
    }

  }, [
    selectedVariations
  ]);


  const handleDiamondSelection = useCallback(
    ({ variationId, variationTypeId, variationName, variationTypeName }) => {
      if (!isCustomizePage) return;

      // Merge variation update
      const updated = [
        ...selectedVariations?.filter((v) => v?.variationId !== variationId),
        { variationId, variationTypeId, variationName, variationTypeName },
      ];
      dispatch(setSelectedVariations(updated));

      const updatedCustomProduct = {
        ...currentCustomProduct,
        diamondDetails: { ...currentCustomProduct?.diamondDetails },
      };

      switch (variationId) {
        case DIAMOND_WEIGHT_KEY:
          updatedCustomProduct.diamondDetails.caratWeight = parseFloat(variationTypeName);
          break;
        case DIAMOND_CLARITY_KEY: {
          const clarity = allowedClarityOptions?.find(c => c?.value === variationTypeId);
          updatedCustomProduct.diamondDetails.clarity = {
            title: clarity?.title || variationTypeId,
            value: variationTypeId,
          };
          break;
        }

        case DIAMOND_COLOR_KEY: {
          const color = allowedColorOptions?.find(c => c?.value === variationTypeId);
          updatedCustomProduct.diamondDetails.color = {
            title: color?.title || variationTypeId,
            value: variationTypeId
          };
          break;
        }
        case DIAMOND_SHAPE_KEY:
          const shape = diamondShapes.find(s => s?.id === variationTypeId);
          updatedCustomProduct.diamondDetails.shape = {
            title: shape?.title || variationTypeName,
            id: variationTypeId,
            image: shape?.image || "",
          };
          break;
      }

      localStorage.setItem("customProduct", JSON.stringify(updatedCustomProduct));
      dispatch(setCustomProductDetails(updatedCustomProduct));
    },
    [isCustomizePage, diamondShapes, selectedVariations, allowedClarityOptions, allowedColorOptions, dispatch]
  );


  return (
    <div className="flex flex-col mt-4 lg:mt-6 gap-6">
      {filteredVariations?.map((variation) => {
        const selectedType = selectedVariations?.find(
          (v) => v?.variationId === variation?.variationId
        );

        const isSizeVariation = variation?.variationName === RING_SIZE;
        const isLengthVariation = variation?.variationName === LENGTH;

        return (
          <div key={variation?.variationId} className="flex flex-col gap-2">
            <p className="font-semibold text-baseblack text-sm">
              {variation?.variationName}
              {selectedType?.variationTypeName
                ? `: ${selectedType.variationTypeName}`
                : ":"}
            </p>

            {isSizeVariation || isLengthVariation ? (
              <div className="relative w-fit">
                <select
                  className={`appearance-none px-3 py-2 pr-6 border border-grayborder rounded-sm text-sm font-semibold bg-transparent cursor-pointer`}
                  value={selectedType?.variationTypeId || ""}
                  onChange={(e) => {
                    const selectedOption = variation.variationTypes.find(
                      (type) => type.variationTypeId === e.target.value
                    );
                    handleSelect({
                      variationId: variation?.variationId,
                      variationTypeId: selectedOption?.variationTypeId,
                      variationName: variation?.variationName,
                      variationTypeName: selectedOption?.variationTypeName
                    });
                  }}
                >
                  <option value="" disabled>
                    {isSizeVariation
                      ? "Size"
                      : isLengthVariation
                        ? "Length"
                        : null}
                  </option>
                  {variation?.variationTypes?.map((type) => (
                    <option
                      key={type.variationTypeId}
                      value={type.variationTypeId}
                    >
                      {type.variationTypeName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center px-1 text-black">
                  <CustomImg
                    srcAttr={dropdownArrow}
                    altAttr="Arrow"
                    titleAttr="Arrow"
                    className="w-4 h-4"
                  />
                </div>
              </div>
            ) : (
              // Render buttons/color/image for other types
              <div className="flex flex-wrap gap-4 md:gap-6 items-start lg:items-center">
                {variation?.variationTypes?.map((type) => {
                  const selected = isSelected(
                    variation?.variationId,
                    type?.variationTypeId
                  );

                  return (
                    <div key={type?.variationTypeId} className="relative">
                      {type?.type === "color" ? (
                        <div className="relative flex flex-col items-center">
                          <button
                            className={`relative w-16 3xl:w-[72px] h-8 transition-all flex items-center justify-center outline-1 ${selected ||
                              hoveredColor?.toLowerCase() ===
                              type.variationTypeName?.toLowerCase()
                              ? "outline outline-grayborder"
                              : "outline-none"
                              }`}
                            style={{
                              backgroundColor: type?.variationTypeHexCode,
                              boxShadow:
                                selected ||
                                  hoveredColor?.toLowerCase() ===
                                  type.variationTypeName?.toLowerCase()
                                  ? "0 0 5px 2px #fff"
                                  : "none",
                              outlineOffset: "4px",
                            }}
                            onClick={() =>
                              handleSelect({
                                variationId: variation?.variationId,
                                variationTypeId: type?.variationTypeId,
                                variationName: variation?.variationName,
                                variationTypeName: type?.variationTypeName
                              })

                            }
                            onMouseEnter={() =>
                              debouncedSetHoveredColor(type.variationTypeName)
                            }
                            onMouseLeave={() => debouncedSetHoveredColor("")}
                          />
                        </div>
                      ) : type?.type === "image" ? (
                        <div className="relative flex flex-col items-center">
                          <button
                            className={`w-12 xs:w-16 4xl:w-20 p-1 flex items-center justify-center rounded-sm transition-all ${selected
                              ? "border-grayborder text-baseblack border"
                              : "border-transparent border"
                              } hover:!border-grayborder`}
                            onClick={() =>
                              handleSelect({
                                variationId: variation?.variationId,
                                variationTypeId: type?.variationTypeId,
                                variationName: variation?.variationName,
                                variationTypeName: type?.variationTypeName
                              })

                            }
                          >
                            <CustomImg
                              srcAttr={type?.variationTypeImage}
                              alt={type?.variationTypeName}
                              width={100}
                              height={100}
                              className="w-7 h-7 object-contain"
                            />
                          </button>
                        </div>
                      ) : (
                        <button
                          className={`px-8 py-2 text-[12px] font-semibold rounded-sm transition-all ${selected
                            ? "border-grayborder text-baseblack border"
                            : "text-baseblack border-transparent border"
                            } hover:!border-grayborder`}
                          onClick={() =>
                            handleSelect({
                              variationId: variation?.variationId,
                              variationTypeId: type?.variationTypeId,
                              variationName: variation?.variationName,
                              variationTypeName: type?.variationTypeName
                            }
                            )
                          }
                        >
                          {type?.variationTypeName}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {isCustomizePage && (
        <>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-baseblack text-sm">
              {DIAMOND_WEIGHT}:&nbsp;
              {selectedVariations?.find(
                (v) => v?.variationId === DIAMOND_WEIGHT_KEY
              )?.variationTypeName || ""}
            </p>
            <div className="relative w-fit">
              <select
                className="appearance-none px-3 py-2 pr-6 border border-grayborder rounded-sm text-sm font-semibold bg-transparent cursor-pointer"
                value={
                  selectedVariations?.find(
                    (v) => v.variationId === DIAMOND_WEIGHT_KEY
                  )?.variationTypeId || ""
                }
                onChange={(e) => {
                  const selectedOption = caratRangeOptions.find(
                    (option) => option.variationTypeId === e.target.value
                  );
                  handleDiamondSelection(
                    {
                      variationId: DIAMOND_WEIGHT_KEY,
                      variationTypeId: selectedOption?.variationTypeId,
                      variationName: DIAMOND_WEIGHT,
                      variationTypeName: selectedOption?.variationTypeName
                    }
                  );
                }}
              >
                <option value="" disabled>
                  Weight
                </option>
                {caratRangeOptions.map((option) => (
                  <option
                    key={option.variationTypeId}
                    value={option.variationTypeId}
                  >
                    {option.variationTypeName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center px-1 text-black">
                <CustomImg
                  srcAttr={dropdownArrow}
                  altAttr="Arrow"
                  titleAttr="Arrow"
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>




          {/* customized page Diamond Shapes */}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-baseblack text-sm">
              {DIAMOND_SHAPE}:&nbsp;
              {selectedVariations?.find(
                (v) => v?.variationId === DIAMOND_SHAPE_KEY
              )?.variationTypeName || ""}
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 items-start lg:items-center">
              {diamondShapes.map((shape) => {
                const selected = isSelected(DIAMOND_SHAPE_KEY, shape.id);
                return (
                  <div
                    key={shape.id}
                    className="relative flex flex-col items-center"
                  >
                    <button
                      className={`group flex flex-col justify-between items-center w-[70px] h-[76px] py-2 px-2 rounded-md cursor-pointer border transition-all duration-300 ${selected
                        ? "border-[1.5px] border-baseblack bg-opacity-10"
                        : "border-transparent hover:border-primary"
                        }`}
                      onClick={() =>
                        handleDiamondSelection({
                          variationId: DIAMOND_SHAPE_KEY,
                          variationTypeId: shape.id,
                          variationName: DIAMOND_SHAPE,
                          variationTypeName: shape.title
                        }
                        )
                      }
                    >
                      <ProgressiveImg
                        src={shape.image}
                        alt={shape.title}
                        className="w-8 h-8 mb-2"
                      />
                      <span
                        className={`text-xs uppercase transition-all duration-300 ${selected
                          ? "text-baseblack font-semibold"
                          : "text-transparent group-hover:text-baseblack"
                          }`}
                      >
                        {shape.title}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <DisplayVariationButtons
            variationName={DIAMOND_CLARITY}
            variationKey={DIAMOND_CLARITY_KEY}
            options={allowedClarityOptions}
            selectedVariations={selectedVariations}
            isSelected={isSelected}
            handleDiamondSelection={handleDiamondSelection}
          />

          <DisplayVariationButtons
            variationName={DIAMOND_COLOR}
            variationKey={DIAMOND_COLOR_KEY}
            options={allowedColorOptions}
            selectedVariations={selectedVariations}
            isSelected={isSelected}
            handleDiamondSelection={handleDiamondSelection}
          />
        </>
      )}
    </div>
  );
};

export default memo(VariationsList);
