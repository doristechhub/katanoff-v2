"use client";
import {
  CheckoutCommonComponent,
  CheckoutForm,
  AddressVerificationModal,
  LatestProduct,
  CartNotFound,
} from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { useSelector } from "react-redux";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import KeyFeatures from "@/components/ui/KeyFeatures";
import CheckoutBreadCrumbs from "./CheckoutBreadCrumbs";

const Checkout = () => {
  const { cartLoading, cartList } = useSelector(({ cart }) => cart);
  const { showModal } = useSelector(({ common }) => common);

  return (
    <div className="mx-auto pt-6 md:pt-10 2xl:pt-12">
      {cartLoading ? (
        <CheckoutSkeleton />
      ) : (
        <>
          <CommonBgHeading
            title="Secure Checkout"
            backText="Back to Cart"
            backHref="/cart"
          />
          <div className="px-4 container mt-4 md:mt-8 lg:mt-12">
            <CheckoutBreadCrumbs currentStep={0} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[55%_auto] lg:gap-16 4xl:gap-36 container mx-auto h-full">
            {cartList?.length ? (
              <div className="lg:hidden pt-8">
                <CheckoutCommonComponent />
              </div>
            ) : null}
            <CheckoutForm />
            <div className="lg:block hidden">
              {cartList?.length ? (
                <CheckoutCommonComponent />
              ) : (
                <CartNotFound />
              )}
            </div>
          </div>
          {showModal && <AddressVerificationModal />}

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

export default Checkout;

const CheckoutSkeleton = () => {
  const skeletons = [
    { width: "w-[40%]", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
    { width: "w-[40%]", height: "h-4", margin: "mt-6" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
  ];
  return (
    <div
      className={`container grid grid-cols-1 lg:grid-cols-[70%_auto] gap-12 pt-12`}
    >
      <div>
        {Array(4)
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
