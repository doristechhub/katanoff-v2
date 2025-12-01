"use client";
import {
  setCurrentPage,
  setFilteredProducts,
  setSelectedFilterVariations,
  setSelectedSettingStyles,
  setSelectedPrices,
  setSelectedCaratWeights,
  setSelectedSortByValue,
  resetFilters,
  setSelectedGenders,
  setIsFilterMenuOpen,
  setIsFilterFixed,
  toggleSMOpenFilter,
  setProductLoading,
  setSelectedProductTypes,
  setSelectedSubCategories,
  setVisibleItemCount,
  setFilterProductLoading,
} from "@/store/slices/productSlice";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import filterIcon from "@/assets/icons/filter.svg";
import settingsSlidersIcon from "@/assets/icons/settings-sliders.svg";
import { ProgressiveImg, RangeSlider } from "../dynamiComponents";
import {
  DIAMOND_SHAPE,
  GOLD_COLOR,
  helperFunctions,
  PRODUCT_TYPE_KEY,
  sortByList,
  SUB_CATEGORIES_KEY,
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
import { ITEMS_PER_PAGE } from "@/_utils/common";
import CustomImg from "../ui/custom-img";

const filterHeadingClass =
  "text-[14px] lg:text-base leading-4 font-semibold pb-[15px]";

export default function ProductFilter({
  productList,
  isDiamondSettingPage = false,
  displayRef,
}) {
  const {
    selectedSortByValue,
    selectedFilterVariations,
    selectedSettingStyles,
    selectedProductTypes,
    selectedSubCategories,
    selectedPrices,
    selectedCaratWeights,
    uniqueFilterOptions,
    selectedGenders,
    isFilterFixed,
    isFilterMenuOpen,
    smOpenFilter,
    activeFilterType,
  } = useSelector(({ product }) => product);

  const { lastScrollY } = useSelector(({ common }) => common);
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
        "product_type",
        "sub_category",
        "setting_style",
        "min_price",
        "max_price",
        "min_carat",
        "max_carat",
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
          const styleId = style?.value;
          const styleTitle = helperFunctions?.stringReplacedWithUnderScore(
            style?.title
          );

          // Combine title and ID with '/'
          params.append("setting_style", `${styleTitle}/${styleId}`);
        });
      }

      // Handle product types
      if (newFilters.productType && newFilters.productType.length > 0) {
        newFilters.productType.forEach((productType) => {
          const typeId = productType?.value;
          const typeTitle = helperFunctions?.stringReplacedWithUnderScore(
            productType?.title
          );
          // Combine title and ID with '/'
          params.append("product_type", `${typeTitle}/${typeId}`);
        });
      }

      // Handle sub-categories
      if (newFilters.subCategory && newFilters.subCategory.length > 0) {
        newFilters.subCategory.forEach((subCategory) => {
          const subCategoryId = subCategory?.value;
          const subCategoryTitle =
            helperFunctions?.stringReplacedWithUnderScore(subCategory?.title);
          // Combine title and ID with '/'
          params.append("sub_category", `${subCategoryTitle}/${subCategoryId}`);
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

      // Handle carat range
      if (newFilters.caratRange && newFilters.caratRange.length === 2) {
        const defaultRange = uniqueFilterOptions?.availableCaratRange || [0, 0];
        const [minCarat, maxCarat] = newFilters.caratRange;
        const [defaultMin, defaultMax] = defaultRange;
        if (minCarat !== defaultMin || maxCarat !== defaultMax) {
          params.set("min_carat", minCarat);
          params.set("max_carat", maxCarat);
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
      const prettyQueryString = queryString.replace(/%2F/gi, "/");
      const newURL = prettyQueryString
        ? `?${prettyQueryString}`
        : window.location.pathname;
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
        caratRange: selectedCaratWeights,
        sortBy: selectedSortByValue,
        genders: selectedGenders,
        productType: selectedProductTypes,
        subCategory: selectedSubCategories,
      });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedSortByValue,
      selectedGenders,
      selectedProductTypes,
      selectedSubCategories,
      selectedCaratWeights,
      updateURL,
    ]
  );

  const onCaratChange = useCallback(
    (value) => {
      dispatch(setSelectedCaratWeights(value));
      updateURL({
        variations: selectedFilterVariations,
        settingStyles: selectedSettingStyles,
        priceRange: selectedPrices,
        caratRange: value,
        sortBy: selectedSortByValue,
        genders: selectedGenders,
        productType: selectedProductTypes,
        subCategory: selectedSubCategories,
      });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedSortByValue,
      selectedGenders,
      selectedProductTypes,
      selectedSubCategories,
      selectedPrices,
      updateURL,
    ]
  );

  const formikPrice = useFormik({
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

  const formikCarat = useFormik({
    initialValues: {
      caratRange: uniqueFilterOptions?.availableCaratRange || [0, 0],
    },
    validationSchema: Yup.object({
      caratRange: Yup.array()
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

  const {
    values: priceValues,
    setFieldValue: setPriceFieldValue,
    errors: priceErrors,
    touched: priceTouched,
  } = formikPrice;
  const {
    values: caratValues,
    setFieldValue: setCaratFieldValue,
    errors: caratErrors,
    touched: caratTouched,
  } = formikCarat;

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
      if (
        !formikPrice.errors.priceRange &&
        typeof onPriceChange === "function"
      ) {
        onPriceChange(value);
      }
    }, 300),
    [formikPrice.errors.priceRange, onPriceChange]
  );

  const debouncedOnCaratChange = useCallback(
    helperFunctions?.debounce((value) => {
      if (
        !formikCarat.errors.caratRange &&
        typeof onCaratChange === "function"
      ) {
        onCaratChange(value);
      }
    }, 300),
    [formikCarat.errors.caratRange, onCaratChange]
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
    debouncedOnPriceChange(priceValues.priceRange);
  }, [priceValues.priceRange, debouncedOnPriceChange]);

  useEffect(() => {
    debouncedOnCaratChange(caratValues.caratRange);
  }, [caratValues.caratRange, debouncedOnCaratChange]);

  const multipleTrack = (props, state) => (
    <div
      {...props}
      key={state.index}
      className={`absolute top-0 bottom-0 rounded-md ${
        [0, 2].includes(state.index) ? "bg-gray-200" : "bg-primary"
      }`}
    />
  );
  const handlePriceInputChange = (e, index) => {
    // Remove the dollar sign and any non-numeric characters except decimal point
    const rawValue = e.target.value.replace(/[^0-9.]/g, "");
    const val = parseFloat(rawValue) || 0;
    const newRange = [...priceValues.priceRange];
    newRange[index] = val;
    if (newRange[0] > newRange[1]) newRange.sort((a, b) => a - b);
    setPriceFieldValue("priceRange", newRange);
  };

  const handleCaratInputChange = (e, index) => {
    // Remove any non-numeric characters except decimal point
    const rawValue = e.target.value.replace(/[^0-9.]/g, "");
    const val = parseFloat(rawValue) || 0;
    const newRange = [...caratValues.caratRange];
    newRange[index] = val;
    if (newRange[0] > newRange[1]) newRange.sort((a, b) => a - b);
    setCaratFieldValue("caratRange", newRange);
  };

  const handleFilteredProductsChange = (filtered) => {
    dispatch(setFilteredProducts(filtered));
    dispatch(setCurrentPage(0));
    dispatch(setFilterProductLoading(false));
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

      dispatch(setVisibleItemCount(ITEMS_PER_PAGE));
      dispatch(setSelectedFilterVariations(newVariations));
      updateURL({
        variations: newVariations,
        settingStyles: selectedSettingStyles,
        priceRange: selectedPrices,
        caratRange: selectedCaratWeights,
        sortBy: selectedSortByValue,
        genders: selectedGenders,
        productType: selectedProductTypes,
        subCategory: selectedSubCategories,
      });
      helperFunctions?.scrollToRefWithExtraSpacing({ ref: displayRef });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedCaratWeights,
      selectedSortByValue,
      selectedProductTypes,
      selectedSubCategories,
      selectedGenders,
      updateURL,
      displayRef,
      ITEMS_PER_PAGE,
    ]
  );

  const onSelectSettingStyle = useCallback(
    (style) => {
      const styleTitle = typeof style === "object" ? style.title : style;
      const styleValue = typeof style === "object" ? style.value : styleTitle;

      const currentStyles = selectedSettingStyles || [];
      const isSelected = currentStyles?.some((s) => s.value === styleValue);

      const newStyles = isSelected
        ? currentStyles.filter((s) => s.value !== styleValue)
        : [...currentStyles, { value: styleValue, title: styleTitle }];

      dispatch(setSelectedSettingStyles(newStyles));
      dispatch(setVisibleItemCount(ITEMS_PER_PAGE));

      updateURL({
        variations: selectedFilterVariations,
        settingStyles: newStyles,
        priceRange: selectedPrices,
        caratRange: selectedCaratWeights,
        sortBy: selectedSortByValue,
        productType: selectedProductTypes,
        subCategory: selectedSubCategories,
        genders: selectedGenders,
      });
      helperFunctions?.scrollToRefWithExtraSpacing({ ref: displayRef });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedCaratWeights,
      selectedProductTypes,
      selectedSubCategories,
      selectedSortByValue,
      selectedGenders,
      updateURL,
      displayRef,
      ITEMS_PER_PAGE,
    ]
  );

  const onSelectProductType = useCallback(
    (style) => {
      const styleTitle = typeof style === "object" ? style?.title : style;
      const styleValue = typeof style === "object" ? style?.value : styleTitle;

      const currentStyles = selectedProductTypes || [];
      const isSelected = currentStyles?.some((s) => s?.value === styleValue);

      const newStyles = isSelected
        ? currentStyles?.filter((s) => s?.value !== styleValue)
        : [...currentStyles, { value: styleValue, title: styleTitle }];

      dispatch(setVisibleItemCount(ITEMS_PER_PAGE));
      dispatch(setSelectedProductTypes(newStyles));
      updateURL({
        variations: selectedFilterVariations,
        settingStyles: selectedSettingStyles,
        priceRange: selectedPrices,
        caratRange: selectedCaratWeights,
        productType: newStyles,
        subCategory: selectedSubCategories,
        genders: selectedGenders,
      });
      helperFunctions?.scrollToRefWithExtraSpacing({ ref: displayRef });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedCaratWeights,
      selectedGenders,
      selectedProductTypes,
      updateURL,
      ITEMS_PER_PAGE,
      displayRef,
    ]
  );

  const onSelectSubCategory = useCallback(
    (style) => {
      const styleTitle = typeof style === "object" ? style.title : style;
      const styleValue = typeof style === "object" ? style.value : styleTitle;

      const currentStyles = selectedSubCategories || [];
      const isSelected = currentStyles?.some((s) => s?.value === styleValue);

      const newStyles = isSelected
        ? currentStyles?.filter((s) => s?.value !== styleValue)
        : [...currentStyles, { value: styleValue, title: styleTitle }];
      dispatch(setVisibleItemCount(ITEMS_PER_PAGE));
      dispatch(setSelectedSubCategories(newStyles));
      updateURL({
        variations: selectedFilterVariations,
        settingStyles: selectedSettingStyles,
        priceRange: selectedPrices,
        caratRange: selectedCaratWeights,
        productType: selectedProductTypes,
        subCategory: newStyles,
        genders: selectedGenders,
      });
      helperFunctions?.scrollToRefWithExtraSpacing({ ref: displayRef });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedCaratWeights,
      selectedGenders,
      selectedProductTypes,
      selectedSubCategories,
      updateURL,
      ITEMS_PER_PAGE,
      displayRef,
    ]
  );

  const onSelectGender = useCallback(
    (gender) => {
      const normalizedGender = helperFunctions?.stringReplacedWithSpace(gender);
      const currentGenders = selectedGenders || [];
      let newGenders = currentGenders.includes(normalizedGender)
        ? currentGenders.filter((g) => g !== normalizedGender)
        : [...currentGenders, normalizedGender];

      dispatch(setVisibleItemCount(ITEMS_PER_PAGE));
      dispatch(setSelectedGenders(newGenders));
      updateURL({
        variations: selectedFilterVariations,
        settingStyles: selectedSettingStyles,
        priceRange: selectedPrices,
        caratRange: selectedCaratWeights,
        productType: selectedProductTypes,
        subCategory: selectedSubCategories,
        sortBy: selectedSortByValue,
        genders: newGenders,
      });
      helperFunctions?.scrollToRefWithExtraSpacing({ ref: displayRef });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedProductTypes,
      selectedSubCategories,
      selectedPrices,
      selectedCaratWeights,
      selectedSortByValue,
      selectedGenders,
      updateURL,
      ITEMS_PER_PAGE,
      displayRef,
    ]
  );

  const onSelectSortBy = useCallback(
    (sortValue) => {
      dispatch(setSelectedSortByValue(sortValue));
      updateURL({
        variations: selectedFilterVariations,
        settingStyles: selectedSettingStyles,
        priceRange: selectedPrices,
        caratRange: selectedCaratWeights,
        productType: selectedProductTypes,
        subCategory: selectedSubCategories,
        genders: selectedGenders,
        sortBy: sortValue,
      });
      helperFunctions?.scrollToRefWithExtraSpacing({ ref: displayRef });
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedCaratWeights,
      selectedGenders,
      updateURL,
      selectedProductTypes,
      selectedSubCategories,
    ]
  );

  const removeFilter = useCallback(
    (filterType, filterValue = null, specificValue = null) => {
      let newFilters = {
        variations: selectedFilterVariations,
        settingStyles: selectedSettingStyles,
        priceRange: selectedPrices,
        caratRange: selectedCaratWeights,
        sortBy: selectedSortByValue,
        genders: selectedGenders,
        productType: selectedProductTypes,
        subCategory: selectedSubCategories,
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
              (style) => style?.value !== specificValue // compare by value
            );
            newFilters.settingStyles = newStyles;
            dispatch(setSelectedSettingStyles(newStyles));
          } else {
            newFilters.settingStyles = [];
            dispatch(setSelectedSettingStyles([]));
          }
          break;

        case "productType":
          if (specificValue) {
            const newStyles = (selectedProductTypes || []).filter(
              (pt) => pt.value !== specificValue
            );
            newFilters.productType = newStyles;
            dispatch(setSelectedProductTypes(newStyles));
          } else {
            newFilters.productType = [];
            dispatch(setSelectedProductTypes([]));
          }
          break;

        case "subCategory":
          if (specificValue) {
            const newStyles = (selectedSubCategories || []).filter(
              (sub) => sub.value !== specificValue
            );
            newFilters.subCategory = newStyles;
            dispatch(setSelectedSubCategories(newStyles));
          } else {
            newFilters.subCategory = [];
            dispatch(setSelectedSubCategories([]));
          }
          break;

        case "priceRange":
          const defaultPriceRange =
            uniqueFilterOptions?.availablePriceRange || [0, 0];
          newFilters.priceRange = null;
          dispatch(setSelectedPrices(defaultPriceRange));
          setPriceFieldValue("priceRange", defaultPriceRange);
          break;
        case "caratRange":
          const defaultCaratRange =
            uniqueFilterOptions?.availableCaratRange || [0, 0];
          newFilters.caratRange = null;
          dispatch(setSelectedCaratWeights(defaultCaratRange));
          setCaratFieldValue("caratRange", defaultCaratRange);
          break;
        case "sortBy":
          newFilters.sortBy = null;
          dispatch(setSelectedSortByValue(null));
          break;
      }
      dispatch(setVisibleItemCount(ITEMS_PER_PAGE));
      helperFunctions?.scrollToRefWithExtraSpacing({ ref: displayRef });

      updateURL(newFilters);
    },
    [
      dispatch,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedCaratWeights,
      selectedSortByValue,
      uniqueFilterOptions,
      selectedProductTypes,
      selectedSubCategories,
      selectedGenders,
      setPriceFieldValue,
      setCaratFieldValue,
      updateURL,
      displayRef,
    ]
  );

  const resetAllFilters = () => {
    dispatch(resetFilters());

    // Reset formik values to default price range
    const defaultPriceRange = uniqueFilterOptions?.availablePriceRange || [
      0, 0,
    ];
    setPriceFieldValue("priceRange", defaultPriceRange);
    // Reset formik values to default carat range
    const defaultCaratRange = uniqueFilterOptions?.availableCaratRange || [
      0, 0,
    ];
    setCaratFieldValue("caratRange", defaultCaratRange);
    router.replace(window.location.pathname, { scroll: false });
    dispatch(setVisibleItemCount(ITEMS_PER_PAGE));
    helperFunctions?.scrollToRefWithExtraSpacing({ ref: displayRef });
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
      const selectedIds = selectedSettingStyles.map((pt) => pt.value);
      filteredItemsList = filteredItemsList.filter((product) => {
        return product?.settingStyleNamesWithImg?.some((item) =>
          selectedIds.includes(item?.id)
        );
      });
    }

    // Filter by product type (now supports multiple selections)
    if (selectedProductTypes && selectedProductTypes.length > 0) {
      const selectedIds = selectedProductTypes.map((pt) => pt.value);
      filteredItemsList = filteredItemsList.filter((product) => {
        return product?.productTypeNames?.some((type) =>
          selectedIds.includes(type?.id)
        );
      });
    }

    // Filter by subCategory (now supports multiple selections)
    if (selectedSubCategories && selectedSubCategories.length > 0) {
      const selectedIds = selectedSubCategories.map((pt) => pt.value);
      filteredItemsList = filteredItemsList.filter((product) => {
        return product?.subCategoryNames?.some((type) =>
          selectedIds.includes(type?.id)
        );
      });
    }

    // Price filter remains the same
    if (selectedPrices?.length === 2) {
      const [minPrice, maxPrice] = selectedPrices;
      filteredItemsList = filteredItemsList.filter((product) => {
        const price = parseFloat(product.baseSellingPrice);
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Carat filter
    if (selectedCaratWeights?.length === 2) {
      const [minCarat, maxCarat] = selectedCaratWeights;
      filteredItemsList = filteredItemsList.filter((product) => {
        const carat = parseFloat(product.totalCaratWeight || 0);
        return carat >= minCarat && carat <= maxCarat;
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
    selectedProductTypes,
    selectedSubCategories,
    selectedFilterVariations,
    selectedSettingStyles,
    selectedPrices,
    selectedCaratWeights,
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
      .map((item) => {
        const [titlePart, idPart] = item.split("/");
        if (!idPart || !titlePart) return null;

        const decodedTitle = helperFunctions?.stringReplacedWithSpace(
          decodeURIComponent(titlePart)
        );

        return { value: idPart, title: decodedTitle };
      })
      .filter(Boolean);

    dispatch(setSelectedSettingStyles(settingStyles));

    const productTypes = urlParams
      .getAll("product_type")
      .map((item) => {
        const [titlePart, idPart] = item.split("/");
        if (!idPart || !titlePart) return null;

        const decodedTitle = helperFunctions?.stringReplacedWithSpace(
          decodeURIComponent(titlePart)
        );

        return { value: idPart, title: decodedTitle };
      })
      .filter(Boolean);

    dispatch(setSelectedProductTypes(productTypes));

    const subCategories = urlParams
      .getAll("sub_category")
      .map((item) => {
        const [titlePart, idPart] = item.split("/");
        if (!idPart || !titlePart) return null;

        const decodedTitle = helperFunctions?.stringReplacedWithSpace(
          decodeURIComponent(titlePart)
        );

        return { value: idPart, title: decodedTitle };
      })
      .filter(Boolean);

    dispatch(setSelectedSubCategories(subCategories));

    // Parse price range
    const minPrice = urlParams.get("min_price");
    const maxPrice = urlParams.get("max_price");
    if (minPrice && maxPrice) {
      const parsedPrices = [
        parseFloat(decodeURIComponent(minPrice)),
        parseFloat(decodeURIComponent(maxPrice)),
      ];
      dispatch(setSelectedPrices(parsedPrices));
      setPriceFieldValue("priceRange", parsedPrices);
    } else {
      const defaultPriceRange = uniqueFilterOptions?.availablePriceRange || [
        0, 0,
      ];
      dispatch(setSelectedPrices(defaultPriceRange));
      setPriceFieldValue("priceRange", defaultPriceRange);
    }

    // Parse carat range
    const minCarat = urlParams.get("min_carat");
    const maxCarat = urlParams.get("max_carat");
    if (minCarat && maxCarat) {
      const parsedCarats = [
        parseFloat(decodeURIComponent(minCarat)),
        parseFloat(decodeURIComponent(maxCarat)),
      ];
      dispatch(setSelectedCaratWeights(parsedCarats));
      setCaratFieldValue("caratRange", parsedCarats);
    } else {
      const defaultCaratRange = uniqueFilterOptions?.availableCaratRange || [
        0, 0,
      ];
      dispatch(setSelectedCaratWeights(defaultCaratRange));
      setCaratFieldValue("caratRange", defaultCaratRange);
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
  }, [
    searchParams,
    dispatch,
    setPriceFieldValue,
    setCaratFieldValue,
    uniqueFilterOptions,
  ]);
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
    const defaultPriceRange = uniqueFilterOptions?.availablePriceRange || [
      0, 0,
    ];
    const [defaultMinPrice, defaultMaxPrice] = defaultPriceRange;
    if (
      selectedPrices?.length === 2 &&
      (selectedPrices[0] !== defaultMinPrice ||
        selectedPrices[1] !== defaultMaxPrice)
    ) {
      count += 1;
    }
    // Count carat range
    const defaultCaratRange = uniqueFilterOptions?.availableCaratRange || [
      0, 0,
    ];
    const [defaultMinCarat, defaultMaxCarat] = defaultCaratRange;
    if (
      selectedCaratWeights?.length === 2 &&
      (selectedCaratWeights[0] !== defaultMinCarat ||
        selectedCaratWeights[1] !== defaultMaxCarat)
    ) {
      count += 1;
    }
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
    if (selectedSettingStyles && selectedSettingStyles?.length) {
      selectedSettingStyles.forEach(({ value: styleId, title: styleTitle }) => {
        const matchedStyle = uniqueFilterOptions?.uniqueSettingStyles?.find(
          (s) => s.value === styleId
        );
        selectedFilters.push({
          type: "settingStyle",
          key: `settingStyle-${helperFunctions?.stringReplacedWithUnderScore(
            styleId
          )}`,
          label: helperFunctions?.stringReplacedWithSpace(
            matchedStyle?.title || styleTitle
          ),
          value: null,
          specificValue: styleId,
        });
      });
    }

    if (selectedProductTypes && selectedProductTypes?.length) {
      selectedProductTypes.forEach(
        ({ value: productTypeId, title: productTypeTitle }) => {
          const matchedType = uniqueFilterOptions?.uniqueProductTypes?.find(
            (p) => p.value === productTypeId
          );

          selectedFilters.push({
            type: "productType",
            key: `productType-${helperFunctions?.stringReplacedWithUnderScore(
              productTypeId
            )}`,
            label: helperFunctions?.stringReplacedWithSpace(
              matchedType?.title || productTypeTitle
            ),
            value: null,
            specificValue: productTypeId,
          });
        }
      );
    }

    if (selectedSubCategories && selectedSubCategories?.length) {
      selectedSubCategories.forEach(
        ({ value: subCategoryId, title: subCategoryTitle }) => {
          const matchedSubCategory =
            uniqueFilterOptions?.uniqueSubCategories?.find(
              (sc) => sc?.value === subCategoryId
            );

          selectedFilters.push({
            type: "subCategory",
            key: `subCategory-${helperFunctions?.stringReplacedWithUnderScore(
              subCategoryId
            )}`,
            label: helperFunctions?.stringReplacedWithSpace(
              matchedSubCategory?.title || subCategoryTitle
            ),
            value: null,
            specificValue: subCategoryId,
          });
        }
      );
    }
    // Add price range filter
    const defaultPriceRange = uniqueFilterOptions?.availablePriceRange || [
      0, 0,
    ];
    const [defaultMinPrice, defaultMaxPrice] = defaultPriceRange;
    if (
      selectedPrices?.length === 2 &&
      (selectedPrices[0] !== defaultMinPrice ||
        selectedPrices[1] !== defaultMaxPrice)
    ) {
      selectedFilters.push({
        type: "priceRange",
        key: "priceRange",
        label: `$${selectedPrices[0]} - $${selectedPrices[1]}`,
        value: null,
      });
    }

    // Add carat range filter
    const defaultCaratRange = uniqueFilterOptions?.availableCaratRange || [
      0, 0,
    ];
    const [defaultMinCarat, defaultMaxCarat] = defaultCaratRange;
    if (
      selectedCaratWeights?.length === 2 &&
      (selectedCaratWeights[0] !== defaultMinCarat ||
        selectedCaratWeights[1] !== defaultMaxCarat)
    ) {
      selectedFilters.push({
        type: "caratRange",
        key: "caratRange",
        label: `${selectedCaratWeights[0]} - ${selectedCaratWeights[1]} ct`,
        value: null,
      });
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

  const haveUniqueDiamondShapeOptions =
    uniqueFilterOptions?.uniqueVariations?.some(
      (variation) => variation.variationName === DIAMOND_SHAPE
    );

  const selectedFilters = renderSelectedFilters();
  return (
    <>
      <div
        ref={filterSectionRef}
        className={` ${isFilterFixed ? "h-[70px]" : "h-0"}`}
      ></div>
      <div
        // className={`z-30 transition-all duration-700 ease-in-out ${
        // isFilterFixed
        // ? "fixed top-[110px] lg:top-[60px] clear-both w-full pt-6 bg-white shadow-[0_5px_5px_0_rgba(0,0,0,0.21)] animate-slideDown animate-duration-900 animate-ease-in-out"
        // : "top-0 border-b-2 border-primary bg-transparent "
        // }`}
        className={`z-30 transition-all duration-700 ease-in-out ${
          isFilterFixed
            ? "fixed top-[39px] lg:top-[50px] clear-both w-full pt-6 bg-white shadow-[0_5px_5px_0_rgba(0,0,0,0.21)] animate-slideDown animate-duration-900 animate-ease-in-out"
            : "top-0 bg-transparent border-b-2 "
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
                  onClick={() => {
                    if (displayRef?.current) {
                      const rect = displayRef.current.getBoundingClientRect();
                      if (rect.top > 0) {
                        helperFunctions?.scrollToRefWithExtraSpacing({
                          ref: displayRef,
                        });
                      }
                    }
                    dispatch(setIsFilterMenuOpen(!isFilterMenuOpen));
                  }}
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
                      {!isDiamondSettingPage &&
                      haveUniqueDiamondShapeOptions ? (
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
                                  className={`absolute top-1/2 -right-[8px] -translate-y-1/2 ${
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
                      ) : null}
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
                      {uniqueFilterOptions?.uniqueSettingStyles?.length ? (
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
                                    selectedSettingStyles?.some(
                                      (s) => s.value === item.value
                                    );
                                  return (
                                    <span
                                      key={`filter-variation-${index}4`}
                                      className={`text-[14px] font-light cursor-pointer p-1 gap-2 flex items-center ${
                                        isSelected ? "font-semibold" : ""
                                      }`}
                                      onClick={() => onSelectSettingStyle(item)}
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
                      ) : null}
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
                              rangeValue={priceValues.priceRange}
                              setRangeValue={(value) =>
                                setPriceFieldValue("priceRange", value)
                              }
                              setInputValues={(value) =>
                                setPriceFieldValue("priceRange", value)
                              }
                              step={1}
                              renderTrack={multipleTrack}
                            />
                            <div className="flex justify-between mt-6">
                              <div className="flex items-center border border-baseblack w-20">
                                <span className="pl-1">$</span>
                                <input
                                  type="text"
                                  value={priceValues?.priceRange[0]}
                                  onChange={(e) => handlePriceInputChange(e, 0)}
                                  onBlur={formikPrice.handleBlur}
                                  onKeyDown={handleKeyDown}
                                  className="p-1 w-full text-center border-none focus:outline-none"
                                />
                              </div>
                              <div className="flex items-center border border-baseblack w-20">
                                <span className="pl-1">$</span>
                                <input
                                  type="text"
                                  value={priceValues?.priceRange[1]}
                                  onChange={(e) => handlePriceInputChange(e, 1)}
                                  onBlur={formikPrice.handleBlur}
                                  onKeyDown={handleKeyDown}
                                  className="p-1 w-full text-center border-none focus:outline-none"
                                />
                              </div>
                              {priceTouched?.priceRange &&
                                typeof priceErrors?.priceRange === "string" && (
                                  <div className="text-red-500 text-[14px]">
                                    {priceErrors?.priceRange}
                                  </div>
                                )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Total Carat Weight */}
                      {!isDiamondSettingPage ? (
                        <div className="border-b border-baseblack">
                          <button
                            className="w-full flex justify-between items-center py-3 font-medium text-base"
                            onClick={() => toggleDropdown("carat")}
                          >
                            Total Carat Weight
                            <span>
                              {smOpenFilter?.includes("carat") ? (
                                <FiMinus />
                              ) : (
                                <FaPlus />
                              )}
                            </span>
                          </button>
                          {smOpenFilter?.includes("carat") && (
                            <div className="p-3">
                              <RangeSlider
                                defaultValue={
                                  uniqueFilterOptions?.availableCaratRange
                                }
                                min={
                                  uniqueFilterOptions?.availableCaratRange[0]
                                }
                                max={
                                  uniqueFilterOptions?.availableCaratRange[1]
                                }
                                rangeValue={caratValues.caratRange}
                                setRangeValue={(value) =>
                                  setCaratFieldValue("caratRange", value)
                                }
                                setInputValues={(value) =>
                                  setCaratFieldValue("caratRange", value)
                                }
                                step={0.01}
                                renderTrack={multipleTrack}
                              />
                              <div className="flex justify-between mt-6">
                                <div className="flex items-center border border-baseblack w-20">
                                  <input
                                    type="text"
                                    value={caratValues?.caratRange[0]}
                                    onChange={(e) =>
                                      handleCaratInputChange(e, 0)
                                    }
                                    onBlur={formikCarat.handleBlur}
                                    onKeyDown={handleKeyDown}
                                    className="p-1 w-full text-center border-none focus:outline-none"
                                  />
                                  <span className="pr-1">ct</span>
                                </div>
                                <div className="flex items-center border border-baseblack w-20">
                                  <input
                                    type="text"
                                    value={caratValues?.caratRange[1]}
                                    onChange={(e) =>
                                      handleCaratInputChange(e, 1)
                                    }
                                    onBlur={formikCarat.handleBlur}
                                    onKeyDown={handleKeyDown}
                                    className="p-1 w-full text-center border-none focus:outline-none"
                                  />
                                  <span className="pr-1">ct</span>
                                </div>
                                {caratTouched?.caratRange &&
                                  typeof caratErrors?.caratRange ===
                                    "string" && (
                                    <div className="text-red-500 text-[14px]">
                                      {caratErrors?.caratRange}
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : null}

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
                      {/* PRODUCT TYPE FILTER */}
                      {activeFilterType === PRODUCT_TYPE_KEY &&
                      uniqueFilterOptions?.uniqueProductTypes?.length ? (
                        <div className="border-b border-baseblack">
                          <button
                            className="w-full flex justify-between items-center py-3 font-medium text-base"
                            onClick={() => toggleDropdown("productType")}
                          >
                            Product Type
                            <span>
                              {smOpenFilter.includes("productType") ? (
                                <FiMinus />
                              ) : (
                                <FaPlus />
                              )}
                            </span>
                          </button>
                          {smOpenFilter.includes("productType") && (
                            <div className="flex flex-col gap-[10px] p-2">
                              {uniqueFilterOptions?.uniqueProductTypes.map(
                                (item, index) => {
                                  const isSelected = selectedProductTypes?.some(
                                    (s) => s.value === item.value
                                  );
                                  return (
                                    <span
                                      key={`filter-productType-${index}`}
                                      className={`text-[14px] font-light cursor-pointer p-1 gap-2 flex items-center ${
                                        isSelected ? "font-semibold" : ""
                                      }`}
                                      onClick={() => onSelectProductType(item)}
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
                      ) : null}

                      {/* SUB CATEGORY FILTER */}
                      {activeFilterType === SUB_CATEGORIES_KEY &&
                      uniqueFilterOptions?.uniqueSubCategories?.length > 0 ? (
                        <div className="border-b border-baseblack">
                          <button
                            className="w-full flex justify-between items-center py-3 font-medium text-base"
                            onClick={() => toggleDropdown("subCategory")}
                          >
                            Sub Category
                            <span>
                              {smOpenFilter.includes("subCategory") ? (
                                <FiMinus />
                              ) : (
                                <FaPlus />
                              )}
                            </span>
                          </button>
                          {smOpenFilter.includes("subCategory") && (
                            <div className="flex flex-col gap-[10px] p-2">
                              {uniqueFilterOptions?.uniqueSubCategories.map(
                                (item, index) => {
                                  const isSelected =
                                    selectedSubCategories?.some(
                                      (s) => s.value === item.value
                                    );
                                  return (
                                    <span
                                      key={`filter-subCategory-${index}`}
                                      className={`text-[14px] font-light cursor-pointer p-1 gap-2 flex items-center ${
                                        isSelected ? "font-semibold" : ""
                                      }`}
                                      onClick={() => onSelectSubCategory(item)}
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
                      ) : null}
                    </div>
                    {/* Desktop Layout */}
                    <div className="hidden lg:flex justify-between w-full gap-[30px]">
                      {!isDiamondSettingPage &&
                      haveUniqueDiamondShapeOptions ? (
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
                                    selectedSettingStyles?.some(
                                      (s) => s.value === item.value
                                    );
                                  return (
                                    <span
                                      key={`filter-variation-${index}4`}
                                      className={`text-[14px] font-light cursor-pointer p-1 gap-2 flex items-center ${
                                        isSelected ? "font-semibold" : ""
                                      }`}
                                      onClick={() => onSelectSettingStyle(item)}
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
                              rangeValue={priceValues.priceRange}
                              setRangeValue={(value) =>
                                setPriceFieldValue("priceRange", value)
                              }
                              setInputValues={(value) =>
                                setPriceFieldValue("priceRange", value)
                              }
                              step={1}
                              renderTrack={multipleTrack}
                            />
                            <div className="flex justify-between mt-4">
                              <div className="flex items-center border border-baseblack w-24">
                                <span className="pl-1">$</span>
                                <input
                                  type="text"
                                  value={priceValues?.priceRange[0]}
                                  onChange={(e) => handlePriceInputChange(e, 0)}
                                  onBlur={formikPrice.handleBlur}
                                  onKeyDown={handleKeyDown}
                                  className="p-1 w-full border-none focus:outline-none"
                                />
                              </div>
                              <div className="flex items-center border border-baseblack w-24">
                                <span className="pl-1">$</span>
                                <input
                                  type="text"
                                  value={priceValues?.priceRange[1]}
                                  onChange={(e) => handlePriceInputChange(e, 1)}
                                  onBlur={formikPrice.handleBlur}
                                  onKeyDown={handleKeyDown}
                                  className="p-1 w-full border-none focus:outline-none"
                                />
                              </div>
                              {priceTouched?.priceRange &&
                                typeof priceErrors?.priceRange === "string" && (
                                  <div className="text-red-500 text-[14px]">
                                    {priceErrors?.priceRange}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        {!isDiamondSettingPage ? (
                          <div>
                            <h5 className={filterHeadingClass}>
                              Total Carat Weight
                            </h5>
                            <div>
                              <RangeSlider
                                defaultValue={
                                  uniqueFilterOptions?.availableCaratRange
                                }
                                min={
                                  uniqueFilterOptions?.availableCaratRange[0]
                                }
                                max={
                                  uniqueFilterOptions?.availableCaratRange[1]
                                }
                                rangeValue={caratValues.caratRange}
                                setRangeValue={(value) =>
                                  setCaratFieldValue("caratRange", value)
                                }
                                setInputValues={(value) =>
                                  setCaratFieldValue("caratRange", value)
                                }
                                step={0.01}
                                renderTrack={multipleTrack}
                              />
                              <div className="flex justify-between mt-4">
                                <div className="flex items-center border border-baseblack w-24">
                                  <input
                                    type="text"
                                    value={caratValues?.caratRange[0]}
                                    onChange={(e) =>
                                      handleCaratInputChange(e, 0)
                                    }
                                    onBlur={formikCarat.handleBlur}
                                    onKeyDown={handleKeyDown}
                                    className="p-1 w-full border-none focus:outline-none"
                                  />
                                  <span className="pr-1">ct</span>
                                </div>
                                <div className="flex items-center border border-baseblack w-24">
                                  <input
                                    type="text"
                                    value={caratValues?.caratRange[1]}
                                    onChange={(e) =>
                                      handleCaratInputChange(e, 1)
                                    }
                                    onBlur={formikCarat.handleBlur}
                                    onKeyDown={handleKeyDown}
                                    className="p-1 w-full border-none focus:outline-none"
                                  />
                                  <span className="pr-1">ct</span>
                                </div>
                                {caratTouched?.caratRange &&
                                  typeof caratErrors?.caratRange ===
                                    "string" && (
                                    <div className="text-red-500 text-[14px]">
                                      {caratErrors?.caratRange}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ) : null}

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

                        {activeFilterType === PRODUCT_TYPE_KEY &&
                        uniqueFilterOptions?.uniqueProductTypes?.length ? (
                          <div>
                            <h5 className={filterHeadingClass}>Product Type</h5>
                            <div className="flex gap-6">
                              {uniqueFilterOptions?.uniqueProductTypes?.map(
                                (item, index) => {
                                  const isSelected = selectedProductTypes?.some(
                                    (s) => s.value === item.value
                                  );
                                  return (
                                    <span
                                      key={`filter-productType-${index}`}
                                      className={`text-[14px] font-light cursor-pointer p-1 gap-2 flex items-center ${
                                        isSelected ? "font-semibold" : ""
                                      }`}
                                      onClick={() => onSelectProductType(item)}
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

                        {activeFilterType === SUB_CATEGORIES_KEY &&
                        uniqueFilterOptions?.uniqueSubCategories?.length ? (
                          <div>
                            <h5 className={filterHeadingClass}>Sub Category</h5>
                            <div className="grid grid-cols-3 gap-3">
                              {uniqueFilterOptions.uniqueSubCategories.map(
                                (item, index) => {
                                  const isSelected =
                                    selectedSubCategories?.some(
                                      (s) => s.value === item.value
                                    );
                                  return (
                                    <span
                                      key={`filter-subCategory-${index}`}
                                      className={`text-[14px] font-light cursor-pointer p-1 gap-2 flex items-center ${
                                        isSelected ? "font-semibold" : ""
                                      }`}
                                      onClick={() => onSelectSubCategory(item)}
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
