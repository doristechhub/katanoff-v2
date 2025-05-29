"use client";
import { fetchCustomizeProducts } from "@/_actions/customize.action";
import { ProductGrid } from "@/components/dynamiComponents";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import StepsGrid from "../StepsGrid";
import ring from "@/assets/images/customize/customize-ring-black.svg";
import diamond from "@/assets/images/customize/customize-diamond-black.svg";
import ringWithDiamondBlack from "@/assets/images/customize/customize-ringWithDiamond-black.svg";
import { helperFunctions } from "@/_helper";
import { setCustomProductDetails } from "@/store/slices/commonSlice";
import SettingStyleCategorySwiper from "../../settingStyleSwiper";
import { useSearchParams } from "next/navigation";
import {
  resetFilters,
  setSelectedDiamondShape,
  setSelectedSettingStyle,
  setSelectedVariations,
} from "@/store/slices/productSlice";

export default function StartWithSettingPage() {
  const { customizeProductList, customizeProductLoading, uniqueFilterOptions } =
    useSelector(({ product }) => product);
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  useEffect(() => {
    const customProduct = helperFunctions.getCustomProduct();
    if (customProduct) {
      dispatch(setCustomProductDetails(customProduct));
    }
  }, [dispatch]);

  const currentStep = 1;

  const steps = useMemo(() => {
    return [
      {
        id: 1,
        label: "Choose Setting",
        icon: ring,
      },
      {
        id: 2,
        label: "Choose Diamond",
        icon: diamond,
      },

      {
        id: 3,
        label: "Complete Ring",
        icon: ringWithDiamondBlack,
        iconBlack: ringWithDiamondBlack,
        disabled: true,
      },
    ];
  }, []);

  const loadData = useCallback(() => {
    dispatch(fetchCustomizeProducts());
    localStorage.removeItem("customProduct");
    dispatch(setCustomProductDetails(null));
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, []);

  const applySearchParamsFilters = useCallback(() => {
    dispatch(resetFilters());

    const settingStyle = searchParams.get("settingStyle");
    const diamondShape = searchParams.get("diamondShape");
    const variationName = searchParams.get("variationName");
    const variationTypeName = searchParams.get("variationTypeName");

    if (settingStyle) {
      dispatch(setSelectedSettingStyle(settingStyle));
    }
    if (diamondShape) {
      dispatch(setSelectedDiamondShape(diamondShape));
    }
    if (variationName && variationTypeName) {
      dispatch(
        setSelectedVariations({
          [variationName]: variationTypeName,
        })
      );
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    applySearchParamsFilters();
  }, [applySearchParamsFilters]);
  return (
    <>
      <section className="container pt-10 md:pt-14 lg:pt-10 2xl:pt-12">
        <StepsGrid steps={steps} currentStep={currentStep} />
        <div className="pb-8">
          <SettingStyleCategorySwiper
            settingStyleCategories={uniqueFilterOptions.uniqueSettingStyles}
            loading={customizeProductLoading}
            className={""}
          />
        </div>
        <ProductGrid
          productList={customizeProductList}
          pagination={true}
          isDiamondSettingPage={true}
          isLoading={customizeProductLoading}
        />
      </section>
    </>
  );
}
