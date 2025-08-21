"use client";
import { fetchCustomizeProducts } from "@/_actions/customize.action";
import { ProductFilter, ProductGrid } from "@/components/dynamiComponents";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import StepsGrid from "../StepsGrid";
import { helperFunctions } from "@/_helper";
import { setCustomProductDetails } from "@/store/slices/commonSlice";
import SettingStyleCategorySwiper from "../../settingStyleSwiper";
import { useRouter } from "next/navigation";

export default function StartWithSettingPage() {

  const {
    customizeProductList,
    customizeProductLoading,
    uniqueFilterOptions,
    filteredProducts,
  } = useSelector(({ product }) => product);
  const router = useRouter();
  const dispatch = useDispatch();

  const currentStep = 2;
  const customProduct = helperFunctions?.getCustomProduct();
  const pId = customProduct?.productId;
  const isDiamondSelected = customProduct?.diamondDetails;

  const steps = useMemo(() => {
    if (!pId) {
      return [
        {
          id: 1,
          label: "Choose a",
          labelDetail: "Diamond",
          subOption: [
            {
              label: "Change",
              route: `/customize/select-diamond`,
              onClick: () => {
                localStorage.removeItem("customProduct");
              },
            },
          ],
        },
        {
          id: 2,
          label: "Choose a",
          labelDetail: "Setting",
        },

        {
          id: 3,
          label: "Completed",
          labelDetail: "Ring",
          disabled: true,
        },
      ];
    } else if (isDiamondSelected && pId) {
      return [
        {
          id: 1,
          label: "Choose a",
          labelDetail: "Diamond",
          subOption: [
            {
              label: "Change",
              route: `/customize/select-diamond`,
              onClick: () => {
                localStorage.removeItem("customProduct");
              },
            },
          ],
        },
        {
          id: 2,
          label: "Choose a",
          labelDetail: "Setting",
        },

        {
          id: 3,
          label: "Completed",
          labelDetail: "Ring",
          subOption: [
            {
              label: "View",
              route: "/customize/complete-ring",
            },
          ],
        },
      ];
    }
  }, []);

  const loadData = useCallback(() => {
    const customProduct = helperFunctions.getCustomProduct();
    if (customProduct) {
      dispatch(setCustomProductDetails(customProduct));
    }
    const { caratWeight, shape } = customProduct?.diamondDetails || {};

    if (!caratWeight || !shape?.id) {
      router.push("/customize/select-diamond");
      return;
    }

    const payload = {
      caratWeight,
      diamondShapeId: shape.id,
    };

    dispatch(fetchCustomizeProducts(payload));
  }, [dispatch, router]);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <section className="pt-10 md:pt-14 lg:pt-10 2xl:pt-12">
        <StepsGrid steps={steps} currentStep={currentStep} />
        {customizeProductList?.length ? (
          <ProductFilter
            productList={customizeProductList}
            isDiamondSettingPage={true}
          />
        ) : null}
        <div className="container">
          <div className="pb-8">
            <SettingStyleCategorySwiper
              settingStyleCategories={uniqueFilterOptions.uniqueSettingStyles}
              loading={customizeProductLoading}
            />
          </div>
          <ProductGrid
            productsList={filteredProducts}
            pagination={true}
            isDiamondSettingPage={true}
            isLoading={customizeProductLoading}
          />
        </div>
      </section>
    </>
  );
}
