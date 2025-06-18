"use client";
import {
  CartNotFound,
  CheckoutCommonComponent,
  LatestProduct,
  ShippingForm,
} from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import KeyFeatures from "@/components/ui/KeyFeatures";

import { useSelector } from "react-redux";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import CheckoutBreadCrumbs from "../checkout/CheckoutBreadCrumbs";

const Shippingpage = () => {
  const { cartLoading, cartList } = useSelector(({ cart }) => cart);

  return (
    <div className="mx-auto pt-10 xl:pt-12">
      {cartLoading ? (
        <ShippingSkeleton />
      ) : (
        <>
          <CommonBgHeading
            title="Secure Checkout"
            backText="Back to Checkout"
            backHref="/checkout"
          />
          <div className="px-4 container mt-4 md:mt-8 lg:mt-12">
            <CheckoutBreadCrumbs currentStep={1} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[55%_auto] lg:gap-6 container mx-auto h-full">
            {cartList?.length ? (
              <div className="lg:hidden pt-8">
                <CheckoutCommonComponent />
              </div>
            ) : null}
            <ShippingForm />
            <div className="lg:block hidden">
              {cartList?.length ? (
                <CheckoutCommonComponent />
              ) : (
                <CartNotFound />
              )}
            </div>
          </div>

          <section className="container pt-16 lg:pt-20 2xl:pt-36">
            <LatestProduct />
          </section>
          <section className="container pt-16 lg:pt-20 2xl:pt-36">
            <KeyFeatures />
          </section>
        </>
      )}
    </div>
  );
};

export default Shippingpage;

const ShippingSkeleton = () => {
  const skeletons = [
    { width: "w-[60%]", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
    { width: "w-[60%]", height: "h-4", margin: "mt-6" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
  ];
  return (
    <div
      className={`container grid grid-cols-1 lg:grid-cols-[70%_auto] gap-12 pt-12`}
    >
      <div>
        {Array(2)
          .fill(skeletons)
          .flat()
          .map((skeleton, index) => (
            <SkeletonLoader
              key={index}
              width={skeleton.width}
              height={skeleton.height}
              className={skeleton.margin}
            />
          ))}
      </div>
      <div className="grid grid-cols-1 gap-4 auto-rows-min">
        <SkeletonLoader height="w-full h-[70] md:h-[220px]  2xl:h-[150px]" />
        <SkeletonLoader height="w-full h-[70] md:h-[220px]  2xl:h-[150px]" />
        <SkeletonLoader height="w-full h-[70] md:h-[220px]  2xl:h-[150px]" />

        <SkeletonLoader height="w-[20%] h-[40px]" />
      </div>
    </div>
  );
};
