"use client";

import {
  setSelectedShippingAddress,
  setSelectedShippingCharge,
} from "@/store/slices/checkoutSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddressSummary = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { selectedShippingAddress } = useSelector(({ checkout }) => checkout);

  useEffect(() => {
    const storedAddress = localStorage.getItem("address");
    const parsedAddress = storedAddress ? JSON.parse(storedAddress) : null;
    const storedShippingMethod = localStorage.getItem("selectedShippingMethod");
    const parsedShippingMethod = storedShippingMethod
      ? JSON.parse(storedShippingMethod)
      : null;

    if (!parsedAddress) {
      router.push("/checkout");
      return;
    }

    dispatch(setSelectedShippingAddress(parsedAddress));
    const shippingPrice = parsedShippingMethod?.price || 0;
    dispatch(setSelectedShippingCharge(shippingPrice));
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6 lg:gap-10 pt-8 lg:pt-12">
      <div className="border border-grayborder rounded-md px-4 lg:px-6 flex flex-col">
        <div className="flex justify-between items-center border-b py-4">
          <div>
            <p className="text-baseblack text-lg md:text-xl font-semibold">
              Contact
            </p>
            <p className="text-basegray text-base md:text-lg">
              {selectedShippingAddress?.email}
            </p>
          </div>
          <Link href="/checkout">
            <span className="text-baseblack md:text-xl font-semibold text-lg underline">
              Change
            </span>
          </Link>
        </div>
        <div className="flex justify-between items-center py-4">
          <div>
            <p className="text-baseblack text-lg md:text-xl font-semibold">
              Ship To
            </p>
            <div>
              {selectedShippingAddress &&
              Object.keys(selectedShippingAddress)?.length > 0 ? (
                <span className="text-basegray text-base md:text-lg">
                  {selectedShippingAddress?.address}{" "}
                  {selectedShippingAddress?.apartment},{" "}
                  {selectedShippingAddress?.city},{" "}
                  {selectedShippingAddress?.state},{" "}
                  {selectedShippingAddress?.countryName} -{" "}
                  {selectedShippingAddress?.pinCode}
                </span>
              ) : null}
            </div>
          </div>
          <Link href="/checkout">
            <span className="text-baseblack md:text-xl font-semibold text-lg underline">
              Change
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddressSummary;
