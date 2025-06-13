import { memo, useCallback, useRef } from "react";
import { CustomImg } from "../dynamiComponents";
import dropdownArrow from "@/assets/icons/dropdownArrow.svg";
import { RING_SIZE } from "@/_helper";

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

const VariationsList = ({
  variations,
  selectedVariations,
  handleSelect,
  setHoveredColor,
  hoveredColor,
}) => {
  const debouncedSetHoveredColor = useDebounce(setHoveredColor, 100);
  const isSelected = (variationId, variationTypeId) =>
    selectedVariations?.length &&
    selectedVariations?.some(
      (v) =>
        v?.variationId === variationId && v?.variationTypeId === variationTypeId
    );

  return (
    <div className="flex flex-col mt-4 lg:mt-6 gap-6">
      {variations?.map((variation) => {
        const selectedType = selectedVariations?.find(
          (v) => v?.variationId === variation?.variationId
        );

        const isSizeVariation = variation?.variationName === RING_SIZE;

        return (
          <div key={variation?.variationId} className="flex flex-col gap-2">
            <p className="font-semibold text-baseblack text-sm">
              {variation?.variationName}
              {selectedType?.variationTypeName
                ? `: ${selectedType.variationTypeName}`
                : ":"}
            </p>

            {isSizeVariation ? (
              <div className="relative w-fit">
                <select
                  className={`appearance-none px-3 py-2 pr-6  border border-grayborder rounded-sm text-sm font-semibold bg-transparent cursor-pointer`}
                  value={selectedType?.variationTypeId || ""}
                  onChange={(e) => {
                    const selectedOption = variation.variationTypes.find(
                      (type) => type.variationTypeId === e.target.value
                    );
                    handleSelect(
                      variation?.variationId,
                      selectedOption?.variationTypeId,
                      variation?.variationName,
                      selectedOption?.variationTypeName
                    );
                  }}
                >
                  <option value="" disabled>
                    Size
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
              // 👉 Render buttons/color/image for other types
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
                            className={`relative w-16 3xl:w-[72px] h-8 transition-all flex items-center justify-center outline-1 ${
                              selected ||
                              hoveredColor?.toLowerCase() ===
                                type.variationTypeName?.toLowerCase()
                                ? "outline outline-grayborder"
                                : "outline-none"
                            }
  `}
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
                              handleSelect(
                                variation?.variationId,
                                type?.variationTypeId,
                                variation?.variationName,
                                type?.variationTypeName
                              )
                            }
                            // onMouseEnter={() => {
                            //   setHoveredColor(type.variationTypeName);
                            // }}
                            // onMouseLeave={() => {
                            //   if (setHoveredColor) setHoveredColor("");
                            // }}
                            onMouseEnter={() => {
                              setHoveredColor(type.variationTypeName);
                            }}
                            onMouseLeave={() => {
                              setHoveredColor("");
                            }}
                          />
                        </div>
                      ) : type?.type === "image" ? (
                        <div className="relative flex flex-col items-center">
                          <button
                            className={`w-12 xs:w-16 4xl:w-20 p-1 flex items-center justify-center rounded-sm transition-all ${
                              selected
                                ? "border-grayborder text-baseblack border"
                                : "border-transparent border"
                            }`}
                            onClick={() =>
                              handleSelect(
                                variation?.variationId,
                                type?.variationTypeId,
                                variation?.variationName,
                                type?.variationTypeName
                              )
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
                          className={`px-8 py-2 text-[12px] font-semibold rounded-sm transition-all ${
                            selected
                              ? "border-grayborder text-baseblack border"
                              : "text-baseblack border-transparent border"
                          }`}
                          onClick={() =>
                            handleSelect(
                              variation?.variationId,
                              type?.variationTypeId,
                              variation?.variationName,
                              type?.variationTypeName
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
    </div>
  );
};

export default memo(VariationsList);
