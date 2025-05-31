"use client";
import {
  setCurrentPage,
  setFilteredProducts,
  setSelectedFilterVariations,
  setSelectedSettingStyles,
  setSelectedPrices,
  setSelectedSortByValue,
  resetFilters,
} from "@/store/slices/productSlice";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import filterIcon from "@/assets/icons/filter.svg";
import settingsSlidersIcon from "@/assets/icons/settings-sliders.svg";
import { CustomImg, ProgressiveImg, RangeSlider } from "../dynamiComponents";
import { GOLD_COLOR, helperFunctions, sortByList } from "@/_helper";
import { RxCross1 } from "react-icons/rx";
import * as Yup from "yup";
import { useFormik } from "formik";

const filterHeadingClass = "text-base leading-4 font-semibold pb-[15px]";

export default function ProductFilter({ productList, isDiamondPage = false }) {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const router = useRouter();
  const filterMenuRef = useRef(null);
  const searchParams = useSearchParams();

  const {
    selectedSortByValue,
    selectedFilterVariations,
    selectedSettingStyles,
    selectedPrices,
    uniqueFilterOptions,
  } = useSelector(({ product }) => product);
  const dispatch = useDispatch();

  // Update URL when filters change
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const updateURL = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();

      // Handle variations
      if (
        newFilters.variations &&
        Object.keys(newFilters.variations).length > 0
      ) {
        Object.entries(newFilters.variations).forEach(
          ([variationName, values]) => {
            if (Array.isArray(values) && values.length > 0) {
              const key =
                helperFunctions?.stringReplacedWithUnderScore(variationName);
              values.forEach((value) => {
                params.append(
                  key,
                  helperFunctions?.stringReplacedWithUnderScore(value)
                );
              });
            }
          }
        );
      }

      // Handle setting styles
      if (newFilters.settingStyles && newFilters.settingStyles.length > 0) {
        newFilters.settingStyles.forEach((style) => {
          params.append(
            "setting_style",
            helperFunctions?.stringReplacedWithUnderScore(style)
          );
        });
      }

      // Handle price range
      if (newFilters.priceRange && newFilters.priceRange.length === 2) {
        const defaultRange = uniqueFilterOptions?.availablePriceRange || [0, 0];
        const [minPrice, maxPrice] = newFilters.priceRange;
        const [defaultMin, defaultMax] = defaultRange;

        if (minPrice !== defaultMin || maxPrice !== defaultMax) {
          params.set("min_price", minPrice);
          params.set("max_price", maxPrice);
        }
      }

      // Handle sort by
      if (newFilters.sortBy) {
        params.set(
          "sort_by",
          helperFunctions?.stringReplacedWithUnderScore(newFilters.sortBy)
        );
      }

      const queryString = params.toString();
      const newURL = queryString ? `?${queryString}` : window.location.pathname;
      router.replace(newURL, { scroll: false });
    },
    [router, uniqueFilterOptions]
  );
  const onPriceChange = useCallback(
    (value) => {
      dispatch(setSelectedPrices(value));
      updateURL({
        variations: selectedFilterVariations,
        settingStyles: selectedSettingStyles,
        priceRange: value,
        sortBy: selectedSortByValue,
      });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedSortByValue,
      updateURL,
    ]
  );
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
  const debouncedOnPriceChange = useCallback(
    debounce((value) => {
      if (!formik.errors.priceRange && typeof onPriceChange === "function") {
        onPriceChange(value);
      }
    }, 300),
    [formik.errors.priceRange, onPriceChange]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target) &&
        !event.target.closest(".filter-button")
      ) {
        setIsFilterMenuOpen(false);
      }
    };

    if (isFilterMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterMenuOpen]);

  useEffect(() => {
    debouncedOnPriceChange(values.priceRange);
  }, [values.priceRange, debouncedOnPriceChange]);

  const multipleTrack = (props, state) => (
    <div
      {...props}
      key={state.index}
      className={`absolute top-0 bottom-0 rounded-md ${
        [0, 2].includes(state.index) ? "bg-gray-200" : "bg-primary"
      }`}
    />
  );
  const handleInputChange = (e, index) => {
    // Remove the dollar sign and any non-numeric characters except decimal point
    const rawValue = e.target.value.replace(/[^0-9.]/g, "");
    const val = parseFloat(rawValue) || 0;
    const newRange = [...values.priceRange];
    newRange[index] = val;
    if (newRange[0] > newRange[1]) newRange.sort((a, b) => a - b);
    setFieldValue("priceRange", newRange);
  };

  const handleFilteredProductsChange = (filtered) => {
    dispatch(setFilteredProducts(filtered));
    dispatch(setCurrentPage(0));
  };

  const onSelectVariant = useCallback(
    (variationName, variationTypeName) => {
      const normalizedVariationTypeName =
        helperFunctions?.stringReplacedWithSpace(variationTypeName);
      const currentSelected = selectedFilterVariations[variationName] || [];
      let newSelected;

      if (currentSelected.includes(normalizedVariationTypeName)) {
        newSelected = currentSelected.filter(
          (item) => item !== normalizedVariationTypeName
        );
      } else {
        newSelected = [...currentSelected, normalizedVariationTypeName];
      }

      const newVariations = {
        ...selectedFilterVariations,
        [variationName]: newSelected.length > 0 ? newSelected : undefined,
      };

      Object.keys(newVariations).forEach((key) => {
        if (!newVariations[key] || newVariations[key].length === 0) {
          delete newVariations[key];
        }
      });

      dispatch(setSelectedFilterVariations(newVariations));
      updateURL({
        variations: newVariations,
        settingStyles: selectedSettingStyles,
        priceRange: selectedPrices,
        sortBy: selectedSortByValue,
      });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedSortByValue,
      updateURL,
    ]
  );
  const onSelectSettingStyle = useCallback(
    (styleTitle) => {
      const normalizedStyleTitle =
        helperFunctions?.stringReplacedWithSpace(styleTitle);
      const currentStyles = selectedSettingStyles || [];
      let newStyles;

      if (currentStyles.includes(normalizedStyleTitle)) {
        newStyles = currentStyles.filter(
          (title) => title !== normalizedStyleTitle
        );
      } else {
        newStyles = [...currentStyles, normalizedStyleTitle];
      }

      dispatch(setSelectedSettingStyles(newStyles));
      updateURL({
        variations: selectedFilterVariations,
        settingStyles: newStyles,
        priceRange: selectedPrices,
        sortBy: selectedSortByValue,
      });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedSortByValue,
      updateURL,
    ]
  );

  const onSelectSortBy = useCallback(
    (sortValue) => {
      dispatch(setSelectedSortByValue(sortValue));
      updateURL({
        variations: selectedFilterVariations,
        settingStyles: selectedSettingStyles,
        priceRange: selectedPrices,
        sortBy: sortValue,
      });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      updateURL,
    ]
  );

  const removeFilter = useCallback(
    (filterType, filterValue = null, specificValue = null) => {
      let newFilters = {
        variations: selectedFilterVariations,
        settingStyles: selectedSettingStyles,
        priceRange: selectedPrices,
        sortBy: selectedSortByValue,
      };

      switch (filterType) {
        case "variation":
          const newVariations = { ...selectedFilterVariations };
          if (specificValue) {
            const currentArray = newVariations[filterValue] || [];
            const updatedArray = currentArray.filter(
              (item) => item !== specificValue
            );
            if (updatedArray.length > 0) {
              newVariations[filterValue] = updatedArray;
            } else {
              delete newVariations[filterValue];
            }
          } else {
            delete newVariations[filterValue];
          }
          newFilters.variations = newVariations;
          dispatch(setSelectedFilterVariations(newVariations));
          break;
        case "settingStyle":
          if (specificValue) {
            const newStyles = (selectedSettingStyles || []).filter(
              (title) => title !== specificValue
            );
            newFilters.settingStyles = newStyles;
            dispatch(setSelectedSettingStyles(newStyles));
          } else {
            newFilters.settingStyles = [];
            dispatch(setSelectedSettingStyles([]));
          }
          break;
        case "priceRange":
          const defaultRange = uniqueFilterOptions?.availablePriceRange || [
            0, 0,
          ];
          newFilters.priceRange = null;
          dispatch(setSelectedPrices([]));
          setFieldValue("priceRange", defaultRange);
          break;
        case "sortBy":
          newFilters.sortBy = null;
          dispatch(setSelectedSortByValue(null));
          break;
      }

      updateURL(newFilters);
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedSortByValue,
      uniqueFilterOptions,
      setFieldValue,
      updateURL,
    ]
  );
  const resetAllFilters = () => {
    dispatch(resetFilters());

    // Reset formik values to default price range
    const defaultRange = uniqueFilterOptions?.availablePriceRange || [0, 0];
    setFieldValue("priceRange", defaultRange);

    router.replace(window.location.pathname, { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    let filteredItemsList = [...productList];

    // Filter by variations (now supports multiple selections per variation)
    if (Object.keys(selectedFilterVariations)?.length) {
      Object.entries(selectedFilterVariations).forEach(
        ([variationName, selectedValues]) => {
          if (selectedValues && selectedValues.length > 0) {
            filteredItemsList = filteredItemsList.filter((product) => {
              return product.variations.some((variation) => {
                if (variation.variationName !== variationName) return false;
                return variation.variationTypes.some((type) => {
                  // Normalize both values for comparison
                  const normalizedTypeName =
                    helperFunctions?.stringReplacedWithUnderScore(
                      type.variationTypeName
                    );
                  return selectedValues.some((selectedValue) =>
                    normalizedTypeName.includes(
                      helperFunctions?.stringReplacedWithUnderScore(
                        selectedValue
                      )
                    )
                  );
                });
              });
            });
          }
        }
      );
    }

    // Filter by setting styles (now supports multiple)
    if (selectedSettingStyles && selectedSettingStyles.length > 0) {
      filteredItemsList = filteredItemsList.filter((product) =>
        product?.settingStyleNamesWithImg?.some((item) =>
          selectedSettingStyles.includes(item.title)
        )
      );
    }
    // Price filter remains the same
    if (selectedPrices?.length === 2) {
      const [minPrice, maxPrice] = selectedPrices;
      filteredItemsList = filteredItemsList.filter((product) => {
        const price = parseFloat(product.baseSellingPrice);
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Sorting remains the same (single selection)
    filteredItemsList = filteredItemsList.sort((a, b) => {
      if (selectedSortByValue === "alphabetically_a_to_z") {
        return a.productName.localeCompare(b.productName);
      }
      if (selectedSortByValue === "alphabetically_z_to_a") {
        return b.productName.localeCompare(a.productName);
      }
      if (selectedSortByValue === "price_low_to_high") {
        return parseFloat(a.baseSellingPrice) - parseFloat(b.baseSellingPrice);
      }
      if (selectedSortByValue === "price_high_to_low") {
        return parseFloat(b.baseSellingPrice) - parseFloat(a.baseSellingPrice);
      }
      if (selectedSortByValue === "date_old_to_new") {
        return new Date(a.createdDate) - new Date(b.createdDate);
      }
      if (selectedSortByValue === "date_new_to_old") {
        return new Date(b.createdDate) - new Date(a.createdDate);
      }
      return 0;
    });

    return filteredItemsList;
  }, [
    productList,
    selectedFilterVariations,
    selectedSettingStyles,
    selectedPrices,
    selectedSortByValue,
  ]);

  useEffect(() => {
    handleFilteredProductsChange(filteredProducts);
  }, [filteredProducts]);

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams.toString());

    // Parse variations
    const variations = {};
    uniqueFilterOptions?.uniqueVariations?.forEach((variation) => {
      const key = helperFunctions?.stringReplacedWithUnderScore(
        variation.variationName
      );
      const values = urlParams
        .getAll(key)
        .map((value) =>
          helperFunctions?.stringReplacedWithSpace(decodeURIComponent(value))
        );
      if (values.length > 0) {
        variations[variation.variationName] = values;
      }
    });
    if (Object.keys(variations).length > 0) {
      dispatch(setSelectedFilterVariations(variations));
    } else {
      dispatch(setSelectedFilterVariations({}));
    }

    // Parse setting styles
    const settingStyles = urlParams
      .getAll("setting_style")
      .map((style) =>
        helperFunctions?.stringReplacedWithSpace(decodeURIComponent(style))
      );
    dispatch(setSelectedSettingStyles(settingStyles));

    // Parse price range
    const minPrice = urlParams.get("min_price");
    const maxPrice = urlParams.get("max_price");
    if (minPrice && maxPrice) {
      const parsedPrices = [
        parseFloat(decodeURIComponent(minPrice)),
        parseFloat(decodeURIComponent(maxPrice)),
      ];
      dispatch(setSelectedPrices(parsedPrices));
      setFieldValue("priceRange", parsedPrices);
    } else {
      const defaultRange = uniqueFilterOptions?.availablePriceRange || [0, 0];
      dispatch(setSelectedPrices(defaultRange));
      setFieldValue("priceRange", defaultRange);
    }

    // Parse sort by
    const sortBy = urlParams.get("sort_by");
    if (sortBy) {
      dispatch(
        setSelectedSortByValue(
          helperFunctions?.stringReplacedWithSpace(decodeURIComponent(sortBy))
        )
      );
    } else {
      dispatch(setSelectedSortByValue(null));
    }
  }, [searchParams, dispatch, setFieldValue, uniqueFilterOptions]);

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;

    // Count variation selections
    Object.values(selectedFilterVariations).forEach((values) => {
      if (Array.isArray(values)) {
        count += values.length;
      }
    });

    // Count setting styles
    if (selectedSettingStyles && selectedSettingStyles.length > 0) {
      count += selectedSettingStyles.length;
    }

    // Count price range
    if (selectedPrices?.length === 2) count += 1;

    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Render selected filters display
  const renderSelectedFilters = () => {
    const selectedFilters = [];

    // Add variation filters
    Object.entries(selectedFilterVariations).forEach(
      ([variationName, variationValues]) => {
        if (Array.isArray(variationValues)) {
          variationValues.forEach((value) => {
            selectedFilters.push({
              type: "variation",
              key: `${variationName}-${helperFunctions?.stringReplacedWithUnderScore(
                value
              )}`,
              label: helperFunctions?.stringReplacedWithSpace(value),
              value: variationName,
              specificValue: value,
            });
          });
        }
      }
    );

    // Add setting style filters
    if (selectedSettingStyles && selectedSettingStyles.length > 0) {
      selectedSettingStyles.forEach((styleId) => {
        const originalStyleTitle =
          helperFunctions?.stringReplacedWithSpace(styleId);
        const style = uniqueFilterOptions?.uniqueSettingStyles?.find(
          (s) => s.title === originalStyleTitle
        );

        selectedFilters.push({
          type: "settingStyle",
          key: `settingStyle-${helperFunctions?.stringReplacedWithUnderScore(
            styleId
          )}`,
          label: style
            ? helperFunctions?.stringReplacedWithSpace(style.title)
            : originalStyleTitle,
          value: null,
          specificValue: styleId,
        });
      });
    }

    // Add price range filter
    if (selectedPrices?.length === 2) {
      const defaultRange = uniqueFilterOptions?.availablePriceRange || [0, 0];
      const [minPrice, maxPrice] = selectedPrices;
      const [defaultMin, defaultMax] = defaultRange;

      if (minPrice !== defaultMin || maxPrice !== defaultMax) {
        selectedFilters.push({
          type: "priceRange",
          key: "priceRange",
          label: `$${selectedPrices[0]} - $${selectedPrices[1]}`,
          value: null,
        });
      }
    }

    return selectedFilters;
  };

  const selectedFilters = renderSelectedFilters();

  return (
    <div className="border-b-2 border-primary bg-transparent relative">
      <div className="container">
        <div className="flex items-center justify-between h-[45px] relative pb-6">
          <div className="flex flex-wrap items-center w-[45%] gap-x-6 gap-y-1.5">
            {/* Display selected filters */}
            {selectedFilters.map((filter) => (
              <span
                key={filter.key}
                onClick={() =>
                  removeFilter(filter.type, filter.value, filter.specificValue)
                }
                className="rounded flex items-center gap-1 text-base cursor-pointer "
              >
                {filter.label}
                <RxCross1 className="text-base" />
              </span>
            ))}
            {/* Reset all button - only show if there are active filters */}
            {activeFilterCount > 0 && selectedFilters.length ? (
              <button
                className="text-baseblack hover:underline font-semibold text-base "
                onClick={resetAllFilters}
              >
                Reset All
              </button>
            ) : null}
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 text-base">
            {filteredProducts.length} Items
          </div>

          <div className="flex items-center gap-5 relative">
            {/* Filter Button */}
            <div className="relative">
              <button
                className="flex items-center gap-2 filter-button" // Add filter-button class
                onClick={() => setIsFilterMenuOpen((prev) => !prev)}
              >
                <CustomImg
                  srcAttr={settingsSlidersIcon}
                  altAttr="Filter Icon"
                  titleAttr="Filter"
                />
                <span>Filter</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2">
                <CustomImg srcAttr={filterIcon} altAttr="" titleAttr="" />
                <span>Sort</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-baseblack shadow-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 z-10">
                <ul className="py-2 text-[14px] leading-[17px] font-semibold text-baseblack">
                  {sortByList?.length
                    ? sortByList.map((item) => (
                        <li
                          key={item.value}
                          style={{ textTransform: "capitalize" }}
                          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer`}
                          onClick={() => onSelectSortBy(item.value)}
                        >
                          {item.title}
                        </li>
                      ))
                    : null}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mega Menu Filter Panel */}
      {isFilterMenuOpen && (
        <div
          ref={filterMenuRef}
          className="w-full bg-white shadow-md absolute top-full border-t-2 border-baseblack left-0 z-20 text-baseblack max-h-[70vh] block overflow-y-auto pt-2 pb-5"
        >
          {" "}
          <div className="container">
            <div className="w-full flex justify-end items-center gap-5 py-6">
              <button
                className="text-baseblack font-medium underline underline-offset-2 hover:no-underline transition-all duration-300 uppercase text-base "
                onClick={resetAllFilters}
              >
                Reset
              </button>
              <RxCross1
                className="text-lg cursor-pointer"
                onClick={() => setIsFilterMenuOpen(false)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
              {!isDiamondPage ? (
                <div className="col-span-4">
                  <h5 className={filterHeadingClass}>Shape</h5>
                  <div className="grid grid-cols-2 gap-[10px]">
                    {uniqueFilterOptions.uniqueVariations
                      .filter(
                        (variation) =>
                          variation.variationName === "Diamond Shape"
                      )
                      .flatMap((variation) =>
                        variation.variationTypes.map((item, index) => {
                          const selectedDiamondShape =
                            selectedFilterVariations["Diamond Shape"] || [];
                          const isSelected = selectedDiamondShape.includes(
                            item.variationTypeName
                          );
                          return (
                            <div
                              key={`filter-diamond-shape-${index}`}
                              className={`flex items-center gap-2 group cursor-pointer`}
                              onClick={() =>
                                onSelectVariant(
                                  "Diamond Shape",
                                  item.variationTypeName
                                )
                              }
                            >
                              <span
                                className={`flex items-center justify-center w-full flex-[0_0_36px] max-w-[36px] h-[36px] border ${
                                  isSelected
                                    ? "border-baseblack"
                                    : "border-transparent group-hover:border-baseblack"
                                } rounded-full overflow-hidden`}
                              >
                                <ProgressiveImg
                                  className={`w-[25px] h-[25px] !transition-none`}
                                  width={60}
                                  height={60}
                                  src={item?.variationTypeImage}
                                  alt={item?.variationTypeName}
                                  title={item?.variationTypeName}
                                />
                              </span>
                              <span
                                className={`text-[15px] font-medium ${
                                  isSelected ? "font-semibold" : ""
                                }`}
                              >
                                {helperFunctions?.stringReplacedWithSpace(
                                  item?.variationTypeName
                                )}
                              </span>
                            </div>
                          );
                        })
                      )}
                  </div>
                </div>
              ) : null}

              <div className="col-span-2">
                <h5 className={filterHeadingClass}>Metal</h5>
                {uniqueFilterOptions?.uniqueVariations?.map(
                  (variation, index) => (
                    <div
                      className="flex flex-col gap-[10px]"
                      key={`filter-variation-${index}`}
                    >
                      {variation.variationName === GOLD_COLOR
                        ? variation.variationTypes.map((item, index) => {
                            const selectedGoldColors =
                              selectedFilterVariations[GOLD_COLOR] || [];
                            const isSelected = selectedGoldColors.includes(
                              item.variationTypeName
                            );

                            return (
                              <div
                                className={`gap-1.5 flex items-center cursor-pointer p-1`}
                                key={`filter-variation-${index}2`}
                                onClick={() =>
                                  onSelectVariant(
                                    GOLD_COLOR,
                                    item.variationTypeName
                                  )
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  readOnly
                                  className="form-checkbox h-5 w-5 accent-baseblack cursor-pointer"
                                />
                                <div
                                  className={`rounded-full w-5 h-5 border ${
                                    isSelected
                                      ? "border-primary"
                                      : "border-black"
                                  }`}
                                  style={{
                                    background: item?.variationTypeHexCode,
                                  }}
                                ></div>
                                <span
                                  className={`text-[14px] font-medium ${
                                    isSelected ? "font-semibold" : ""
                                  }`}
                                >
                                  {helperFunctions?.stringReplacedWithSpace(
                                    item?.variationTypeName
                                  )}{" "}
                                </span>
                              </div>
                            );
                          })
                        : null}
                    </div>
                  )
                )}
              </div>

              <div className="col-span-2">
                {uniqueFilterOptions?.uniqueSettingStyles?.length ? (
                  <div>
                    <h5 className={filterHeadingClass}>Setting Style</h5>
                    <div className="flex flex-col gap-[10px]">
                      {uniqueFilterOptions?.uniqueSettingStyles.map(
                        (item, index) => {
                          const isSelected = selectedSettingStyles?.includes(
                            item.title
                          );

                          return (
                            <span
                              key={`filter-variation-${index}4`}
                              className={`text-[14px] font-medium cursor-pointer p-1 gap-1  flex items-center ${
                                isSelected ? "font-semibold" : ""
                              }`}
                              onClick={() => onSelectSettingStyle(item.title)}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="form-checkbox h-5 w-5 accent-baseblack cursor-pointer"
                              />
                              {item.title}
                            </span>
                          );
                        }
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="col-span-4">
                <h5 className={filterHeadingClass}>Price</h5>
                <div>
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

                  <div className="flex justify-between mt-4">
                    <div className="flex items-center border border-baseblack w-20">
                      <span className="pl-1">$</span>
                      <input
                        type="text"
                        value={values?.priceRange[0]}
                        onChange={(e) => handleInputChange(e, 0)}
                        onBlur={formik.handleBlur}
                        onKeyDown={handleKeyDown}
                        className="p-1 w-full text-center border-none focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center border border-baseblack w-20">
                      <span className="pl-1">$</span>
                      <input
                        type="text"
                        value={values?.priceRange[1]}
                        onChange={(e) => handleInputChange(e, 1)}
                        onBlur={formik.handleBlur}
                        onKeyDown={handleKeyDown}
                        className="p-1 w-full text-center border-none focus:outline-none"
                      />
                    </div>
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
          </div>
        </div>
      )}
    </div>
  );
}
