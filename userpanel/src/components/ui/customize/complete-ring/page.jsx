"use client";
import {
  ProductDetailPage,
  ProductNotFound,
} from "@/components/dynamiComponents";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import StepsGrid from "../StepsGrid";
import { setCustomProductDetails } from "@/store/slices/commonSlice";
import { helperFunctions } from "@/_helper";
import { useRouter } from "next/navigation";

export default function CompleteRingPage() {
  const { customProductDetails } = useSelector(({ common }) => common);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const customProduct = helperFunctions.getCustomProduct();
    if (customProduct?.diamondDetails && customProduct?.productId) {
      dispatch(setCustomProductDetails(customProduct));
    } else if (customProduct?.diamondDetails && !customProduct?.productId) {
      router.replace("/customize/select-setting");
    } else if (!customProduct?.diamondDetails && !customProduct?.productId) {
      router.replace("/customize/select-diamond");
    }
  }, [dispatch, router]);

  const pId = customProductDetails?.productId;
  const isDiamondSelected = customProductDetails?.diamondDetails;
  const currentStep = 3;

  const steps = useMemo(() => {
    if (pId && isDiamondSelected) {
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

          subOption: [
            {
              label: "Change",
              route: "/customize/select-setting",
              onClick: () => {
                const customProductData = helperFunctions?.getCustomProduct() || {};
                delete customProductData?.productId;
                delete customProductData?.selectedVariations;
                localStorage.setItem("customProduct", JSON.stringify(customProductData));
              },
            },
          ],
        },

        {
          id: 3,
          label: "Completed",
          labelDetail: "Ring",
          disabled: false,
        },
      ];
    }
  }, [pId, isDiamondSelected]);

  return (
    <>
      {customProductDetails && Object.keys(customProductDetails).length > 0 ? (
        <>
          <section className="container pt-8">
            <StepsGrid
              steps={steps}
              currentStep={currentStep}
              titleText="Design Your Own Lab Created Diamond Engagement Ring"
            />
          </section>
          <section className="pt-10 md:pt-14 lg:pt-10 2xl:pt-16">
            <ProductDetailPage customizePage="completeRing" />
          </section>
        </>
      ) : (
        <ProductNotFound textClassName="px-4 md:px-8 w-full md:w-[50%] lg:w-[35%] 2xl:w-[32%]" />
      )}
    </>
  );
}
