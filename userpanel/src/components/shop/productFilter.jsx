"use client";
import {
  setCurrentPage,
  setFilteredProducts,
  setSelectedFilterVariations,
  setSelectedSettingStyles,
  setSelectedPrices,
  setSelectedSortByValue,
  resetFilters,
  setSelectedGenders,
  setIsFilterMenuOpen,
  setIsFilterFixed,
  toggleSMOpenFilter,
  setProductLoading,
} from "@/store/slices/productSlice";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import filterIcon from "@/assets/icons/filter.svg";
import settingsSlidersIcon from "@/assets/icons/settings-sliders.svg";
import { CustomImg, ProgressiveImg, RangeSlider } from "../dynamiComponents";
import {
  DIAMOND_SHAPE,
  GOLD_COLOR,
  helperFunctions,
  sortByList,
} from "@/_helper";
import { RxCross1 } from "react-icons/rx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { HeaderLinkButton } from "../ui/button";
import { FiMinus } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const filterHeadingClass =
  "text-[14px] lg:text-base leading-4 font-semibold pb-[15px]";

export default function ProductFilter({
  productList,
  isDiamondSettingPage = false,
}) {
  const {
    selectedSortByValue,
    selectedFilterVariations,
    selectedSettingStyles,
    selectedPrices,
    uniqueFilterOptions,
    selectedGenders,
    isFilterFixed,
    isFilterMenuOpen,
    smOpenFilter,
  } = useSelector(({ product }) => product);

  // Swiper
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [showNavigationButtons, setShowNavigationButtons] = useState(false);
  const dispatch = useDispatch();

  const router = useRouter();
  const swiperRef = useRef(null);
  const filterMenuRef = useRef(null);
  const filterSectionRef = useRef(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleScroll = () => {
      if (filterSectionRef.current) {
        const rect = filterSectionRef.current.getBoundingClientRect();
        dispatch(setIsFilterFixed(rect.top <= 0));
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleFilteredProductsChange([]);
    };
  }, []);

  const handleSwiperInit = (swiper) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    const currentBreakpoint = swiper.currentBreakpoint;
    const slidesPerView =
      swiper.params.breakpoints?.[currentBreakpoint]?.slidesPerView ||
      swiper.params.slidesPerView;
    const totalSlides = swiper.slides.length;

    setShowNavigationButtons(totalSlides > slidesPerView);
  };

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    const currentBreakpoint = swiper.currentBreakpoint;
    const slidesPerView =
      swiper.params.breakpoints?.[currentBreakpoint]?.slidesPerView ||
      swiper.params.slidesPerView;
    const totalSlides = swiper.slides.length;

    setShowNavigationButtons(totalSlides > slidesPerView);
  };

  const toggleDropdown = (filter) => {
    dispatch(toggleSMOpenFilter(filter));
  };

  const updateURL = useCallback(
    (newFilters) => {
      // Start with existing URL parameters to preserve non-filter params
      const params = new URLSearchParams(searchParams.toString());

      // Define filter-related parameter keys that we manage
      const filterParamKeys = [
        "setting_style",
        "min_price",
        "max_price",
        "sort_by",
        "gender",
      ];

      // Add variation keys dynamically
      uniqueFilterOptions?.uniqueVariations?.forEach((variation) => {
        const key = helperFunctions?.stringReplacedWithUnderScore(
          variation.variationName
        );
        filterParamKeys.push(key);
      });

      // Remove existing filter parameters to avoid duplicates
      filterParamKeys.forEach((key) => {
        params.delete(key);
      });

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

      // Handle genders
      if (newFilters.genders && newFilters.genders.length > 0) {
        newFilters.genders.forEach((gender) => {
          params.append(
            "gender",
            helperFunctions?.stringReplacedWithUnderScore(gender)
          );
        });
      }

      const queryString = params.toString();
      const newURL = queryString ? `?${queryString}` : window.location.pathname;
      router.replace(newURL, { scroll: false });
    },
    [router, uniqueFilterOptions, searchParams]
  );
  const onPriceChange = useCallback(
    (value) => {
      dispatch(setSelectedPrices(value));
      updateURL({
        variations: selectedFilterVariations,
        settingStyles: selectedSettingStyles,
        priceRange: value,
        sortBy: selectedSortByValue,
        genders: selectedGenders,
      });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedSortByValue,
      selectedGenders,
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
    helperFunctions?.debounce((value) => {
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
        dispatch(setIsFilterMenuOpen(false));
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
    dispatch(setProductLoading(false));
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
        genders: selectedGenders,
      });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedSortByValue,
      selectedGenders,
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
        genders: selectedGenders,
      });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedSortByValue,
      selectedGenders,
      updateURL,
    ]
  );
  const onSelectGender = useCallback(
    (gender) => {
      const normalizedGender = helperFunctions?.stringReplacedWithSpace(gender);
      const currentGenders = selectedGenders || [];
      let newGenders = currentGenders.includes(normalizedGender)
        ? currentGenders.filter((g) => g !== normalizedGender)
        : [...currentGenders, normalizedGender];

      dispatch(setSelectedGenders(newGenders));
      updateURL({
        variations: selectedFilterVariations,
        settingStyles: selectedSettingStyles,
        priceRange: selectedPrices,
        sortBy: selectedSortByValue,
        genders: newGenders,
      });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedSortByValue,
      selectedGenders,
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
        genders: selectedGenders,
        sortBy: sortValue,
      });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedGenders,
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
        genders: selectedGenders,
      };
      if (filterType === "gender") {
        newFilters.genders = specificValue
          ? selectedGenders.filter((g) => g !== specificValue)
          : [];
        dispatch(setSelectedGenders(newFilters.genders));
      }
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
      selectedGenders,
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

    if (selectedGenders?.length) {
      filteredItemsList = filteredItemsList.filter((product) =>
        selectedGenders.includes(
          helperFunctions?.stringReplacedWithSpace(product.gender)
        )
      );
    }
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
      if (!selectedSortByValue) return 0; // Default case if no sort value
      try {
        switch (
          helperFunctions?.stringReplacedWithUnderScore(selectedSortByValue)
        ) {
          case "alphabetically_a_to_z":
            return (a.productName || "").localeCompare(b.productName || "");
          case "alphabetically_z_to_a":
            return (b.productName || "").localeCompare(a.productName || "");
          case "price_low_to_high":
            return (
              parseFloat(a.baseSellingPrice || 0) -
              parseFloat(b.baseSellingPrice || 0)
            );
          case "price_high_to_low":
            return (
              parseFloat(b.baseSellingPrice || 0) -
              parseFloat(a.baseSellingPrice || 0)
            );
          case "date_old_to_new":
            return new Date(a.createdDate || 0) - new Date(b.createdDate || 0);
          case "date_new_to_old":
            return new Date(b.createdDate || 0) - new Date(a.createdDate || 0);
          default:
            return 0;
        }
      } catch (error) {
        console.log("Sorting error:", error);
        return 0;
      }
    });

    return filteredItemsList;
  }, [
    productList,
    selectedFilterVariations,
    selectedSettingStyles,
    selectedPrices,
    selectedSortByValue,
    selectedGenders,
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
    dispatch(
      setSelectedSortByValue(
        sortBy
          ? helperFunctions?.stringReplacedWithUnderScore(sortBy)
          : "date_new_to_old" // or set a default sort value like "alphabetically_a_to_z"
      )
    );
    const genders = urlParams
      .getAll("gender")
      .map((g) =>
        helperFunctions?.stringReplacedWithSpace(decodeURIComponent(g))
      );
    dispatch(setSelectedGenders(genders));
    dispatch(setSelectedGenders(genders));
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

    if (selectedGenders?.length) {
      selectedGenders.forEach((gender) => {
        const displayGender =
          {
            male: "Men",
            female: "Women",
            unisex: "Unisex",
          }[gender] || gender;
        selectedFilters.push({
          type: "gender",
          key: `gender-${helperFunctions?.stringReplacedWithUnderScore(
            gender
          )}`,
          label: displayGender,
          value: null,
          specificValue: gender,
        });
      });
    }

    return selectedFilters;
  };

  const selectedFilters = renderSelectedFilters();
  return (
    <>
      <div
        ref={filterSectionRef}
        className={` ${isFilterFixed ? "h-[70px]" : "h-0"}`}
      ></div>
      <div
        // className={`z-30 transition-all duration-700 ease-in-out ${
        //   isFilterFixed
        //     ? "fixed top-[110px] lg:top-[60px] clear-both w-full pt-6 bg-white shadow-[0_5px_5px_0_rgba(0,0,0,0.21)] animate-slideDown animate-duration-900 animate-ease-in-out"
        //     : "top-0 border-b-2 border-primary bg-transparent "
        // }`}
        className={`z-30 transition-all duration-700 ease-in-out ${
          isFilterFixed
            ? "fixed top-[110px] lg:top-[50px] clear-both w-full pt-6 bg-white shadow-[0_5px_5px_0_rgba(0,0,0,0.21)] animate-slideDown animate-duration-900 animate-ease-in-out"
            : "top-0  bg-transparent border-b-2 "
        }`}
      >
        <div className="container">
          <div className="gap-2 flex flex-col lg:flex-row lg:items-center lg:justify-between lg:h-[45px] relative pb-4">
            <div className="flex flex-wrap items-center w-[90%] lg:w-[45%] gap-x-2 lg:gap-x-6 gap-y-1.5">
              {/* Display selected filters */}
              {selectedFilters.map((filter) => (
                <span
                  key={filter.key}
                  onClick={() =>
                    removeFilter(
                      filter.type,
                      filter.value,
                      filter.specificValue
                    )
                  }
                  className="rounded flex items-center gap-1 text-[14px] lg:text-[15px] cursor-pointer "
                >
                  {filter.label}
                  <RxCross1 className="text-[14px] lg:text-base" />
                </span>
              ))}
              {/* Reset all button - only show if there are active filters */}
              {activeFilterCount > 0 && selectedFilters.length ? (
                <button
                  className="text-baseblack hover:underline font-semibold text-[14px] lg:text-base"
                  onClick={() => {
                    resetAllFilters();
                  }}
                >
                  Reset All
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-5 relative">
              {/* Filter Button */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 filter-button"
                  onClick={() =>
                    dispatch(setIsFilterMenuOpen(!isFilterMenuOpen))
                  }
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
                <div className="absolute -right-full lg:right-0 mt-2 w-48 bg-white border border-baseblack shadow-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 z-10">
                  <ul className="text-[14px] leading-[17px] font-semibold text-baseblack">
                    {sortByList?.length
                      ? sortByList.map((item) => (
                          <li
                            key={item?.value}
                            style={{ textTransform: "capitalize" }}
                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                              selectedSortByValue === item?.value
                                ? "bg-gray-200 font-bold"
                                : ""
                            }`}
                            onClick={() => onSelectSortBy(item?.value)}
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

        {isFilterMenuOpen ? (
          <div
            // className="w-full bg-white shadow-md border-t-2 z-50 border-baseblack text-baseblack pt-2"
            className="w-full bg-white shadow-md text-baseblack border-t-2 pt-2"
            ref={filterMenuRef}
          >
            <div className={`max-h-[65vh] overflow-y-auto`}>
              <div className="container">
                <div className="w-full flex justify-between lg:!justify-end items-center py-3">
                  <div className="lg:hidden">
                    <h3 className="text-base font-semibold">Filters</h3>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-5">
                    <button
                      className="text-baseblack font-medium underline underline-offset-2 hover:no-underline transition-all duration-300 uppercase text-[14px] lg:text-base"
                      onClick={() => {
                        dispatch(setIsFilterMenuOpen());
                        resetAllFilters();
                      }}
                    >
                      Reset <span className="lg:hidden">Filters</span>
                    </button>
                    <RxCross1
                      className="text-lg cursor-pointer"
                      onClick={() => dispatch(setIsFilterMenuOpen(false))}
                    />
                  </div>
                </div>
                <div className="flex justify-center w-full">
                  <div className="w-full">
                    {/* Mobile Dropdowns */}
                    <div className="lg:hidden flex flex-col w-full">
                      {!isDiamondSettingPage && (
                        // <div className="border-b border-baseblack ">
                        <div>
                          <button
                            className="w-full flex justify-between items-center py-3 font-medium text-base"
                            onClick={() => toggleDropdown("shape")}
                          >
                            Shape
                            <span>
                              {smOpenFilter?.includes("shape") ? (
                                <FiMinus />
                              ) : (
                                <FaPlus />
                              )}
                            </span>
                          </button>
                          {smOpenFilter?.includes("shape") && (
                            <div className="p-3 relative">
                              {showNavigationButtons && (
                                <button
                                  className={`absolute top-1/2 left-[25px] -translate-x-8 -translate-y-1/2 ${
                                    isBeginning
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  onClick={() => swiperRef.current?.slidePrev()}
                                  disabled={isBeginning}
                                >
                                  <SlArrowLeft className="text-sm md:text-base" />
                                </button>
                              )}
                              {showNavigationButtons && (
                                <button
                                  className={`absolute top-1/2 -right-[8px]  -translate-y-1/2 ${
                                    isEnd ? "opacity-50 cursor-not-allowed" : ""
                                  }`}
                                  onClick={() => swiperRef.current?.slideNext()}
                                  disabled={isEnd}
                                >
                                  <SlArrowRight className="text-sm md:text-base" />
                                </button>
                              )}
                              <Swiper
                                modules={[Navigation]}
                                slidesPerView={7}
                                spaceBetween={10}
                                breakpoints={{
                                  0: {
                                    slidesPerView: 4,
                                    spaceBetween: 8,
                                  },
                                  320: {
                                    slidesPerView: 5,
                                    spaceBetween: 8,
                                  },
                                  480: {
                                    slidesPerView: 6,
                                    spaceBetween: 10,
                                  },
                                  768: {
                                    slidesPerView: 7,
                                    spaceBetween: 10,
                                  },
                                }}
                                className="shape-filter-swiper"
                                onSwiper={handleSwiperInit}
                                onSlideChange={handleSlideChange}
                              >
                                {uniqueFilterOptions.uniqueVariations
                                  .filter(
                                    (variation) =>
                                      variation.variationName === DIAMOND_SHAPE
                                  )
                                  .flatMap((variation) =>
                                    variation.variationTypes.map(
                                      (item, index) => {
                                        const selectedDiamondShape =
                                          selectedFilterVariations[
                                            DIAMOND_SHAPE
                                          ] || [];
                                        const isSelected =
                                          selectedDiamondShape.includes(
                                            item.variationTypeName
                                          );
                                        return (
                                          <SwiperSlide
                                            key={`filter-diamond-shape-${index}`}
                                          >
                                            <div
                                              className={`flex flex-col items-center gap-2 group cursor-pointer p-1 rounded border ${
                                                isSelected
                                                  ? "border-baseblack bg-gray-50"
                                                  : "border-gray-200 hover:border-baseblack"
                                              }`}
                                              onClick={() =>
                                                onSelectVariant(
                                                  DIAMOND_SHAPE,
                                                  item.variationTypeName
                                                )
                                              }
                                            >
                                              <span
                                                className={`flex items-center justify-center flex-[0_0_36px] max-w-[36px] h-[36px] overflow-hidden`}
                                              >
                                                <ProgressiveImg
                                                  className={`w-[25px] h-[25px] !transition-none`}
                                                  width={60}
                                                  height={60}
                                                  src={item?.variationTypeImage}
                                                  alt={item?.variationTypeName}
                                                  title={
                                                    item?.variationTypeName
                                                  }
                                                />
                                              </span>
                                              <span
                                                className={`text-[14px] font-light ${
                                                  isSelected
                                                    ? "font-semibold"
                                                    : ""
                                                }`}
                                              >
                                                {helperFunctions?.stringReplacedWithSpace(
                                                  item?.variationTypeName
                                                )}
                                              </span>
                                            </div>
                                          </SwiperSlide>
                                        );
                                      }
                                    )
                                  )}
                              </Swiper>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="border-b border-baseblack">
                        <button
                          className="w-full flex justify-between items-center py-3 font-medium text-base"
                          onClick={() => toggleDropdown("metal")}
                        >
                          Metal
                          <span>
                            {smOpenFilter?.includes("metal") ? (
                              <FiMinus />
                            ) : (
                              <FaPlus />
                            )}
                          </span>
                        </button>
                        {smOpenFilter?.includes("metal") && (
                          <div className="flex flex-col gap-[10px] p-2">
                            {uniqueFilterOptions?.uniqueVariations?.map(
                              (variation) =>
                                variation.variationName === GOLD_COLOR
                                  ? variation.variationTypes.map(
                                      (item, index) => {
                                        const selectedGoldColors =
                                          selectedFilterVariations[
                                            GOLD_COLOR
                                          ] || [];
                                        const isSelected =
                                          selectedGoldColors.includes(
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
                                                background:
                                                  item?.variationTypeHexCode,
                                              }}
                                            ></div>
                                            <span
                                              className={`text-[14px] font-light ${
                                                isSelected
                                                  ? "font-semibold"
                                                  : ""
                                              }`}
                                            >
                                              {helperFunctions?.stringReplacedWithSpace(
                                                item?.variationTypeName
                                              )}
                                            </span>
                                          </div>
                                        );
                                      }
                                    )
                                  : null
                            )}
                          </div>
                        )}
                      </div>
                      {uniqueFilterOptions?.uniqueSettingStyles?.length && (
                        <div className="border-b border-baseblack">
                          <button
                            className="w-full flex justify-between items-center py-3 font-medium text-base"
                            onClick={() => toggleDropdown("settingStyle")}
                          >
                            Setting Style
                            <span>
                              {smOpenFilter.includes("settingStyle") ? (
                                <FiMinus />
                              ) : (
                                <FaPlus />
                              )}
                            </span>
                          </button>
                          {smOpenFilter.includes("settingStyle") && (
                            <div className="flex flex-col gap-[10px] p-2">
                              {uniqueFilterOptions?.uniqueSettingStyles.map(
                                (item, index) => {
                                  const isSelected =
                                    selectedSettingStyles?.includes(item.title);
                                  return (
                                    <span
                                      key={`filter-variation-${index}4`}
                                      className={`text-[14px] font-light cursor-pointer p-1 gap-2 flex items-center ${
                                        isSelected ? "font-semibold" : ""
                                      }`}
                                      onClick={() =>
                                        onSelectSettingStyle(item.title)
                                      }
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
                          )}
                        </div>
                      )}
                      <div className="border-b border-baseblack">
                        <button
                          className="w-full flex justify-between items-center py-3 font-medium text-base"
                          onClick={() => toggleDropdown("price")}
                        >
                          Price
                          <span>
                            {smOpenFilter?.includes("price") ? (
                              <FiMinus />
                            ) : (
                              <FaPlus />
                            )}
                          </span>
                        </button>
                        {smOpenFilter?.includes("price") && (
                          <div className="p-3">
                            <RangeSlider
                              defaultValue={
                                uniqueFilterOptions?.availablePriceRange
                              }
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
                            <div className="flex justify-between mt-6">
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
                                  <div className="text-red-500 text-[14px]">
                                    {errors?.priceRange}
                                  </div>
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                      {uniqueFilterOptions?.uniqueGenders?.length ? (
                        <div className="border-b border-baseblack">
                          <button
                            className="w-full flex justify-between items-center py-3 font-medium text-base"
                            onClick={() => toggleDropdown("gender")}
                          >
                            Gender
                            <span>
                              {smOpenFilter?.includes("gender") ? (
                                <FiMinus />
                              ) : (
                                <FaPlus />
                              )}
                            </span>
                          </button>
                          {smOpenFilter?.includes("gender") ? (
                            <div className="flex gap-6 p-2">
                              {uniqueFilterOptions?.uniqueGenders.map(
                                (gender, index) => {
                                  const normalizedGender = gender;
                                  const isSelected =
                                    selectedGenders?.includes(normalizedGender);
                                  const displayGender =
                                    {
                                      male: "Men",
                                      female: "Women",
                                      unisex: "Unisex",
                                    }[gender] || gender;
                                  return (
                                    <span
                                      key={`filter-gender-${index}`}
                                      className={`text-[14px] font-light cursor-pointer p-1 gap-2 flex items-center ${
                                        isSelected ? "font-semibold" : ""
                                      }`}
                                      onClick={() =>
                                        onSelectGender(normalizedGender)
                                      }
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        readOnly
                                        className="form-checkbox h-5 w-5 accent-baseblack cursor-pointer"
                                      />
                                      {displayGender}
                                    </span>
                                  );
                                }
                              )}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                    {/* Desktop Layout */}
                    <div className="hidden lg:flex justify-between w-full gap-[30px]">
                      {!isDiamondSettingPage ? (
                        <div className="w-[30%]">
                          <h5 className={filterHeadingClass}>Shape</h5>
                          <div className="grid grid-cols-2 gap-[10px]">
                            {uniqueFilterOptions.uniqueVariations
                              .filter(
                                (variation) =>
                                  variation.variationName === DIAMOND_SHAPE
                              )
                              .flatMap((variation) =>
                                variation.variationTypes.map((item, index) => {
                                  const selectedDiamondShape =
                                    selectedFilterVariations[DIAMOND_SHAPE] ||
                                    [];
                                  const isSelected =
                                    selectedDiamondShape.includes(
                                      item.variationTypeName
                                    );
                                  return (
                                    <div
                                      key={`filter-diamond-shape-${index}`}
                                      className={`flex items-center gap-2 group cursor-pointer`}
                                      onClick={() =>
                                        onSelectVariant(
                                          DIAMOND_SHAPE,
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
                                        className={`text-[15px] font-light ${
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
                      <div className="w-[20%]">
                        <h5 className={filterHeadingClass}>Metal</h5>
                        {uniqueFilterOptions?.uniqueVariations?.map(
                          (variation, index) => (
                            <div
                              className="flex flex-col gap-[10px]"
                              key={`filter-variation-${index}`}
                            >
                              {variation.variationName === GOLD_COLOR
                                ? variation.variationTypes.map(
                                    (item, index) => {
                                      const selectedGoldColors =
                                        selectedFilterVariations[GOLD_COLOR] ||
                                        [];
                                      const isSelected =
                                        selectedGoldColors.includes(
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
                                              background:
                                                item?.variationTypeHexCode,
                                            }}
                                          ></div>
                                          <span
                                            className={`text-[14px] font-light ${
                                              isSelected ? "font-semibold" : ""
                                            }`}
                                          >
                                            {helperFunctions?.stringReplacedWithSpace(
                                              item?.variationTypeName
                                            )}
                                          </span>
                                        </div>
                                      );
                                    }
                                  )
                                : null}
                            </div>
                          )
                        )}
                      </div>
                      <div className="w-[20%]">
                        {uniqueFilterOptions?.uniqueSettingStyles?.length ? (
                          <div>
                            <h5 className={filterHeadingClass}>
                              Setting Style
                            </h5>
                            <div className="flex flex-col gap-[10px]">
                              {uniqueFilterOptions?.uniqueSettingStyles.map(
                                (item, index) => {
                                  const isSelected =
                                    selectedSettingStyles?.includes(item.title);
                                  return (
                                    <span
                                      key={`filter-variation-${index}4`}
                                      className={`text-[14px] font-light cursor-pointer p-1 gap-2 flex items-center ${
                                        isSelected ? "font-semibold" : ""
                                      }`}
                                      onClick={() =>
                                        onSelectSettingStyle(item.title)
                                      }
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
                      <div className="w-[30%] flex flex-col gap-y-6">
                        <div>
                          <h5 className={filterHeadingClass}>Price</h5>
                          <div>
                            <RangeSlider
                              defaultValue={
                                uniqueFilterOptions?.availablePriceRange
                              }
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
                              <div className="flex items-center border border-baseblack w-24">
                                <span className="pl-1">$</span>
                                <input
                                  type="text"
                                  value={values?.priceRange[0]}
                                  onChange={(e) => handleInputChange(e, 0)}
                                  onBlur={formik.handleBlur}
                                  onKeyDown={handleKeyDown}
                                  className="p-1 w-full border-none focus:outline-none"
                                />
                              </div>
                              <div className="flex items-center border border-baseblack w-24">
                                <span className="pl-1">$</span>
                                <input
                                  type="text"
                                  value={values?.priceRange[1]}
                                  onChange={(e) => handleInputChange(e, 1)}
                                  onBlur={formik.handleBlur}
                                  onKeyDown={handleKeyDown}
                                  className="p-1 w-full border-none focus:outline-none"
                                />
                              </div>
                              {touched?.priceRange &&
                                typeof errors?.priceRange === "string" && (
                                  <div className="text-red-500 text-[14px]">
                                    {errors?.priceRange}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                        {uniqueFilterOptions?.uniqueGenders?.length ? (
                          <div>
                            <h5 className={filterHeadingClass}>Gender</h5>
                            <div className="flex gap-6">
                              {uniqueFilterOptions?.uniqueGenders.map(
                                (gender, index) => {
                                  const normalizedGender = gender;
                                  const isSelected =
                                    selectedGenders?.includes(normalizedGender);
                                  const displayGender =
                                    {
                                      male: "Men",
                                      female: "Women",
                                      unisex: "Unisex",
                                    }[gender] || gender;
                                  return (
                                    <span
                                      key={`filter-gender-${index}`}
                                      className={`text-[14px] font-light cursor-pointer p-1 gap-2 flex items-center ${
                                        isSelected ? "font-semibold" : ""
                                      }`}
                                      onClick={() =>
                                        onSelectGender(normalizedGender)
                                      }
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        readOnly
                                        className="form-checkbox h-5 w-5 accent-baseblack cursor-pointer"
                                      />
                                      {displayGender}
                                    </span>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full bg-white z-30 flex justify-center py-4">
              <HeaderLinkButton
                onClick={() => {
                  dispatch(setIsFilterMenuOpen(false));
                }}
                className="transition-all !font-semibold !text-baseblack duration-300 capitalize !py-4 !px-20 hover:!text-white hover:!bg-[#393939] flex justify-center items-center border border-baseblack"
              >
                View {filteredProducts.length} Designs
              </HeaderLinkButton>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
