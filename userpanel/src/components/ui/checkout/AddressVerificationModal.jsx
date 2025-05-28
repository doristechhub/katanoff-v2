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
import { setStandardizedAddress } from "@/store/slices/checkoutSlice";
import { setAddressLoader } from "@/store/slices/addressSlice";

const AddressVerificationModal = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { standardizedAddress, selectedShippingAddress } = useSelector(
    ({ checkout }) => checkout
  );
  const { isHovered, isSubmitted, isChecked } = useSelector(
    ({ common }) => common
  );

  const { addressLoader } = useSelector(({ address }) => address);

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
    if (!selectedShippingAddress || !isChecked) return;
    dispatch(setAddressLoader(true));
    const formsValue = {
      email: selectedShippingAddress?.email,
      countryName: selectedShippingAddress?.country,
      firstName: selectedShippingAddress?.firstName,
      lastName: selectedShippingAddress?.lastName,
      address: selectedShippingAddress?.address,
      city: selectedShippingAddress?.city,
      state: selectedShippingAddress?.state,
      stateCode: selectedShippingAddress?.stateCode,
      pinCode: selectedShippingAddress?.pinCode,
      mobile: selectedShippingAddress?.mobile,
      companyName: selectedShippingAddress?.company,
      apartment: selectedShippingAddress?.apartment,
    };
    localStorage.setItem("address", JSON.stringify(formsValue));
    dispatch(setAddressLoader(false));
    router.push("/shipping");
    localStorage.removeItem("selectedShippingMethod");
    checkoutModalClose();
  }, [selectedShippingAddress, isChecked]);

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
    const { firstAddressLine, apartment, city, state, pinCode } = addr;

    return [firstAddressLine, apartment, city, state, pinCode]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Modal
      title="Address Verification"
      footer={
        <div className="flex gap-6">
          <GrayButton title="CANCEL" onClick={checkoutModalClose}>
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
        <div className="flex items-start gap-2 text-base md:text-lg text-baseblack">
          <input
            type="checkbox"
            id="addreess-confirm"
            className={`mt-2 cursor-pointer accent-primary rounded-sm ring-1 ring-transparent ${
              isSubmitted && !isChecked
                ? " !ring-red-500 appearance-none p-1.5"
                : ""
            }`}
            checked={isChecked}
            onChange={(e) => dispatch(setIsChecked(e.target.checked))}
          />
          <label htmlFor="addreess-confirm">
            I understand that my address is verified, and I want to proceed with
            this entered address.
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default AddressVerificationModal;
