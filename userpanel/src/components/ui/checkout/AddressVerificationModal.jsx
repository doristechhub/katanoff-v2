"use client";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import { GrayButton, LoadingPrimaryButton } from "../button";
import {
  setIsChecked,
  setIsHovered,
  setIsSubmitted,
  setShowModal,
} from "@/store/slices/commonSlice";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  setSelectedAddressType,
  setStandardizedAddress,
} from "@/store/slices/checkoutSlice";
import { setAddressLoader } from "@/store/slices/addressSlice";

const AddressVerificationModal = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { standardizedAddress, selectedShippingAddress, selectedAddressType } =
    useSelector(({ checkout }) => checkout);
  const { isHovered, isSubmitted, isChecked } = useSelector(
    ({ common }) => common
  );

  const { addressLoader } = useSelector(({ address }) => address);
  const { appliedPromoDetail } = useSelector(({ coupon }) => coupon);
  const enteredAddress = {
    address: selectedShippingAddress?.address,
    apartment: selectedShippingAddress?.apartment,
    city: selectedShippingAddress?.city,
    state: selectedShippingAddress?.state,
    country: selectedShippingAddress?.country,
    pinCode: selectedShippingAddress?.pinCode,
    stateCode: selectedShippingAddress?.stateCode,
  };

  const handleConfirm = useCallback(() => {
    dispatch(setIsSubmitted(true));

    if (!selectedAddressType || !selectedShippingAddress) {
      console.warn("Missing required values");
      return;
    }

    dispatch(setAddressLoader(true));

    const isVerified = selectedAddressType === "verified";

    const formsValue = {
      email: selectedShippingAddress?.email,
      countryName: selectedShippingAddress?.country,
      firstName: selectedShippingAddress?.firstName,
      lastName: selectedShippingAddress?.lastName,
      address: isVerified
        ? standardizedAddress?.firstAddressLine
        : selectedShippingAddress?.address,
      city: isVerified
        ? standardizedAddress?.city
        : selectedShippingAddress?.city,
      state: isVerified
        ? standardizedAddress?.state
        : selectedShippingAddress?.state,
      stateCode: selectedShippingAddress?.stateCode,
      pinCode: isVerified
        ? standardizedAddress?.zipCode
        : selectedShippingAddress?.pinCode,
      mobile: selectedShippingAddress?.mobile,
      companyName: selectedShippingAddress?.company,
      apartment: isVerified
        ? standardizedAddress?.apartment
        : selectedShippingAddress?.apartment,
    };

    localStorage.setItem("address", JSON.stringify(formsValue));
    dispatch(setAddressLoader(false));
    router.push("/shipping");
    localStorage.removeItem("selectedShippingMethod");
    checkoutModalClose();
  }, [selectedShippingAddress, selectedAddressType, standardizedAddress]);

  const checkoutModalClose = () => {
    resetValues();
  };

  const resetValues = useCallback(() => {
    dispatch(setIsSubmitted(false));
    dispatch(setIsChecked(false));
    dispatch(setShowModal(false));
    dispatch(setStandardizedAddress(""));
  }, []);

  const formatAddress = (addr) => {
    if (!addr) return "";
    const { address, apartment, city, state, pinCode } = addr;
    return [address, apartment, city, state, pinCode]
      .filter(Boolean)
      .join(", ");
  };

  const formatAddressViaResponse = (addr) => {
    if (!addr) return "";
    const { firstAddressLine, apartment, city, state, zipCode } = addr;

    return [firstAddressLine, apartment, city, state, zipCode]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Modal
      title="Address Verification"
      footer={
        <div className="flex gap-6">
          <GrayButton
            className={"!rounded-none"}
            title="CANCEL"
            onClick={checkoutModalClose}
          >
            Cancel
          </GrayButton>
          <div
            onMouseEnter={() => dispatch(setIsHovered(true))}
            onMouseLeave={() => dispatch(setIsHovered(false))}
          >
            <LoadingPrimaryButton
              title="CONFIRM"
              loading={addressLoader}
              disabled={addressLoader}
              loaderType={isHovered ? "" : "white"}
              onClick={handleConfirm}
              className={`uppercase`}
            >
              CONFIRM
            </LoadingPrimaryButton>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="relative flex flex-col md:flex-row justify-center items-stretch gap-6 md:gap-8 xl:gap-12 2xl:gap-20">
          <div className="bg-white p-4 w-full md:w-[380px] flex flex-col justify-between z-10">
            <h4 className="font-semibold rtext-lg md:text-xl mb-2">
              Entered Address:
            </h4>
            <p className="text-base text-basegray flex-1 uppercase">
              {formatAddress(enteredAddress)}
            </p>
          </div>

          <div className="hidden xl:flex absolute z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center">
            <div className="w-2 h-2 rounded-full bg-gray-lightest" />
            <div className="w-16 border-t-2 border-dotted border-gray-lightest mx-1" />
            <div className="w-2 h-2 rounded-full bg-gray-lightest" />
          </div>

          <div className="bg-white p-4 w-full md:w-[380px] flex flex-col justify-between z-10">
            <h4 className="font-semibold text-lg md:text-xl mb-2">
              Verified Address:
            </h4>
            <p className="text-base text-basegray flex-1 uppercase">
              {formatAddressViaResponse(standardizedAddress)}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-base md:text-lg text-baseblack">
          {/* Entered Address Option */}
          <div className="flex items-start gap-2">
            <input
              type="radio"
              id="entered-address"
              name="address-option"
              value="entered"
              className={`mt-1.5 cursor-pointer accent-primary ring-1 ring-transparent rounded-full w-5 h-5 ${
                isSubmitted && !selectedAddressType ? "!ring-red-500" : ""
              }`}
              checked={selectedAddressType === "entered"}
              onChange={() => {
                dispatch(setSelectedAddressType("entered"));
              }}
            />
            <label htmlFor="entered-address" className="cursor-pointer">
              Yes, I proceed with the{" "}
              <span className="font-semibold">entered address.</span>
            </label>
          </div>

          {/* Verified Address Option */}
          <div className="flex items-start gap-2">
            <input
              type="radio"
              id="verified-address"
              name="address-option"
              value="verified"
              className={`mt-1.5 cursor-pointer accent-primary ring-1 ring-transparent rounded-full w-5 h-5 ${
                isSubmitted && !selectedAddressType ? "!ring-red-500" : ""
              }`}
              checked={selectedAddressType === "verified"}
              onChange={() => dispatch(setSelectedAddressType("verified"))}
            />
            <label htmlFor="verified-address" className="cursor-pointer">
              Yes, I proceed with the{" "}
              <span className="font-semibold">verified address.</span>
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddressVerificationModal;
