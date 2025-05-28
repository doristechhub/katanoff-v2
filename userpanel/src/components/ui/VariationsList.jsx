// import { memo } from "react";
// import { CustomImg } from "../dynamiComponents";

// const VariationsList = ({ variations, selectedVariations, handleSelect }) => {
//   const isSelected = (variationId, variationTypeId) =>
//     selectedVariations?.length &&
//     selectedVariations?.some(
//       (v) =>
//         v?.variationId === variationId && v?.variationTypeId === variationTypeId
//     );
//   const filteredVariations = variations?.filter(
//     (variation) => variation?.variationName !== "Size"
//   );
//   return (
//     <div className="flex flex-col mt-4 lg:mt-6 gap-6">
//       {variations?.map((variation) => (
//         <div key={variation?.variationId} className="flex flex-col gap-2">
//           <p className="font-semibold text-baseblack text-sm">
//             {variation?.variationName}
//             {(() => {
//               const selectedType = selectedVariations?.find(
//                 (v) => v?.variationId === variation?.variationId
//               );
//               return selectedType?.variationTypeName
//                 ? `: ${selectedType.variationTypeName}`
//                 : ":";
//             })()}
//           </p>

//           <div className="flex flex-wrap gap-2 md:gap-3 items-start lg:items-center">
//             {variation?.variationTypes?.map((type) => {
//               const selected = isSelected(
//                 variation?.variationId,
//                 type?.variationTypeId,
//                 variation?.variationName,
//                 type?.variationTypeName
//               );

//               return (
//                 <div key={type?.variationTypeId} className="relative">
//                   {type?.type === "color" ? (
//                     <div className="relative flex flex-col items-center">
//                       <button
//                         className={`relative w-12 xs:w-16 3xl:w-20 h-10 xs:h-8 3xl:h-10 p-1 transition-all flex items-center justify-center rounded-sm
//                      ${
//                        selected
//                          ? "border-grayborder rounded-sm border"
//                          : "border-transparent border"
//                      }
//                    `}
//                         style={{
//                           backgroundColor: type?.variationTypeHexCode,
//                           boxShadow: selected ? "inset 0 0 0 4px #fff" : "none",
//                         }}
//                         onClick={() =>
//                           handleSelect(
//                             variation?.variationId,
//                             type?.variationTypeId,
//                             variation?.variationName,
//                             type?.variationTypeName
//                           )
//                         }
//                       />
//                     </div>
//                   ) : type?.type === "image" ? (
//                     <>
//                       <div className="relative flex flex-col items-start lg:items-center">
//                         <button
//                           className={`relative w-12 xs:w-16 4xl:w-20 h-10 xs:h-8 4xl:h-10 p-1 transition-all flex items-center justify-center rounded-sm ${
//                             selected
//                               ? "border-grayborder rounded-sm border text-baseblack"
//                               : "border-transparent border"
//                           }`}
//                           onClick={() =>
//                             handleSelect(
//                               variation?.variationId,
//                               type?.variationTypeId,
//                               variation?.variationName,
//                               type?.variationTypeName
//                             )
//                           }
//                         >
//                           <CustomImg
//                             srcAttr={type?.variationTypeImage}
//                             alt={type?.variationTypeName}
//                             width={100}
//                             height={100}
//                             className="w-7 h-7 object-contain"
//                           />
//                         </button>
//                       </div>
//                     </>
//                   ) : (
//                     <button
//                       className={`px-8 py-2 text-[12px] font-semibold transition-all rounded-sm ${
//                         selected
//                           ? "border-grayborder rounded-sm text-baseblack border"
//                           : "text-baseblack border-transparent border"
//                       }`}
//                       onClick={() =>
//                         handleSelect(
//                           variation?.variationId,
//                           type?.variationTypeId,
//                           variation?.variationName,
//                           type?.variationTypeName
//                         )
//                       }
//                     >
//                       {type?.variationTypeName}
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default memo(VariationsList);

import { memo } from "react";
import { CustomImg } from "../dynamiComponents";
import dropdownArrow from "@/assets/icons/dropdownArrow.svg";

function toCamelCase(str) {
  if (!str) return "";
  const [first, ...rest] = str.trim().split(" ");
  return (
    first.toLowerCase() +
    rest.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("")
  );
}

const VariationsList = ({
  variations,
  selectedVariations,
  handleSelect,
  setHoveredColor,
}) => {
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
        const isGoldColor =
          variation?.variationName?.toLowerCase() === "gold color";

        const isSizeVariation = variation?.variationName === "Size";

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
                  className={`appearance-none px-4 py-2 pr-10 border border-grayborder rounded-sm text-sm font-semibold bg-transparent cursor-pointer`}
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
                <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center px-2 text-black">
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
              <div className="flex flex-wrap gap-2 md:gap-3 items-start lg:items-center">
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
                            className={`relative w-16 xs:w-16 3xl:w-20 h-10 xs:h-8 3xl:h-10 p-1 transition-all flex items-center justify-center rounded-sm
                            ${
                              selected
                                ? "border-grayborder border"
                                : "border-transparent"
                            }`}
                            style={{
                              backgroundColor: type?.variationTypeHexCode,
                              boxShadow: selected
                                ? "inset 0 0 0 4px #fff"
                                : "none",
                            }}
                            onClick={() =>
                              handleSelect(
                                variation?.variationId,
                                type?.variationTypeId,
                                variation?.variationName,
                                type?.variationTypeName
                              )
                            }
                            onMouseEnter={() => {
                              if (setHoveredColor)
                                setHoveredColor(
                                  toCamelCase(type.variationTypeName)
                                );
                            }}
                            onMouseLeave={() => {
                              if (setHoveredColor) setHoveredColor("");
                            }}
                          />
                        </div>
                      ) : type?.type === "image" ? (
                        <div className="relative flex flex-col items-center">
                          <button
                            className={`w-12 xs:w-16 4xl:w-20 h-10 xs:h-8 4xl:h-10 p-1 flex items-center justify-center rounded-sm transition-all ${
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
