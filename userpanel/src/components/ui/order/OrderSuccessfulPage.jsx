"use client";
import orderSuccess from "@/assets/images/order-complete/order-submitted.svg";
import { CustomImg } from "@/components/dynamiComponents";
import { PrimaryLinkButton } from "../button";
import { useParams } from "next/navigation";
import { helperFunctions } from "../../../_helper/helperFunctions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCartList } from "@/store/slices/cartSlice";

const OrderSuccessfulPage = () => {
  const params = useParams();
  let { orderNumber } = params;
  const currentUser = helperFunctions.getCurrentUser();
  const dispatch = useDispatch();

  useEffect(() => {
    // clear values after payment success
    localStorage.removeItem("address");
    localStorage.removeItem("selectedShippingMethod");
    dispatch(setCartList([]));
  }, []);

  return (
    <div className="min-h-[70vh] lg:min-h-[60vh] flex items-center justify-center bg-offwhite px-4">
      <div className="p-8 max-w-xl xl:max-w-3xl w-full text-center py-8 xl:py-16">
        {/* Check Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 md:w-20 md:h-20 2xl:w-24 2xl:h-20 bg-green-500 rounded-full flex items-center justify-center">
            <CustomImg srcAttr={orderSuccess} altAttr="" titleAttr="" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl 2xl:text-5xl font-medium font-castoro mt-10 mb-6 text-gray-900">
          Order Successfully
        </h2>

        {/* Subtext */}
        <p className="text-baseblack text-sm sm:text-base md:text-lg mb-1">
          Thank you so much for your order with your{" "}
          <span className="font-bold">Order No. {orderNumber}</span>
        </p>
        <p className="text-baseblack text-sm sm:text-base md:text-lg mb-6">
          Please wait for the confirmation email.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <PrimaryLinkButton
            className="uppercase w-full"
            href={`${currentUser ? "/order-history" : "/track-your-order"} `}
          >
            TRACK YOUR ORDER
          </PrimaryLinkButton>
          <PrimaryLinkButton className="uppercase w-full" href="/">
            CONTINUE SHOPPING
          </PrimaryLinkButton>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessfulPage;
