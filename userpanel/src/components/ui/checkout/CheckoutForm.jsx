"use client";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { Country, State } from "country-state-city";
import {
  defaultCountry,
  defaultCountryDisplay,
} from "@/store/slices/addressSlice";
import {
  handleAddressMessage,
  handleInvalidAddressDetail,
  validateAddress,
} from "@/_actions/address.action";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { GrayLinkButton, LoadingPrimaryButton } from "@/components/ui/button";
import { messageType, ONE_TIME } from "@/_helper/constants";
import {
  setIsChecked,
  setIsHovered,
  setShowModal,
} from "@/store/slices/commonSlice";
import {
  setSelectedAddressType,
  setSelectedShippingAddress,
  setStandardizedAddress,
  setStateList,
} from "@/store/slices/checkoutSlice";
import { helperFunctions } from "@/_helper";
import Link from "next/link";

import { verifyCouponCode } from "@/_actions/coupon.action";

const countries = Country.getAllCountries();

const validationSchema = yup.object({
  firstName: yup.string().trim().required("First Name is required"),
  lastName: yup.string().trim().required("Last Name is required"),
  mobile: yup
    .string()
    .matches(/^\+?[0-9]{6,14}$/, "Invalid Mobile Number")
    .required("Phone is Required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is Required"),
  country: yup.string().required("Select a Country"),
  city: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
    .required("City is Required"),
  state: yup.string().required("Select a State"),
  pinCode: yup
    .string()
    .required("Zip code is a required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(5, "Must be exactly 5 digits")
    .max(6, "Must be exactly 6 digits"),
  address: yup.string().required("Address is Required"),
});

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);
  const { cartList } = useSelector(({ cart }) => cart);
  const { stateList, selectedShippingAddress } = useSelector(
    ({ checkout }) => checkout
  );
  const { appliedPromoDetail } = useSelector(({ coupon }) => coupon);

  const { validateAddressLoader, addressMessage, invalidAddressDetail } =
    useSelector(({ address }) => address);
  const { isHovered } = useSelector(({ common }) => common);

  useEffect(() => {
    setCountryWiseStateList(defaultCountry);
    dispatch(handleAddressMessage({ message: "", type: "" }));

    return () => {
      clearAbortController(); // Cancel request on unmount/route change
    };
  }, []);

  const getCoupon = localStorage.getItem("appliedCoupon");

  useEffect(() => {
    const subTotal = helperFunctions?.getSubTotal(cartList);
    if (!appliedPromoDetail && getCoupon) {
      dispatch(
        verifyCouponCode({
          promoCode: getCoupon,
          orderValue: subTotal,
        })
      );
    }
  }, [dispatch, appliedPromoDetail, cartList]);

  let initialValues = useMemo(() => {
    return {
      email: "",
      firstName: "",
      lastName: "",
      country: defaultCountry,
      city: "",
      state: "",
      stateCode: "",
      pinCode: "",
      company: "",
      address: "",
      apartment: "",
      mobile: "",
      ...(selectedShippingAddress || {}), // override from Redux
    };
  }, [selectedShippingAddress]);

  const currentUser = helperFunctions.getCurrentUser();
  if (currentUser) {
    initialValues.email = currentUser?.email;
    initialValues.firstName = currentUser?.firstName;
    initialValues.lastName = currentUser?.lastName;
  }

  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null;
  }, []);

  const checkValidationAddress = useCallback(
    async (fieldValues) => {
      try {
        dispatch(handleAddressMessage({ message: "", type: "" }));
        dispatch(setSelectedAddressType(""));
        dispatch(
          handleInvalidAddressDetail({
            setInvalidAddressDetail: {},
          })
        );
        if (!abortControllerRef.current) {
          abortControllerRef.current = new AbortController();
        }
        if (!cartList?.length) {
          dispatch(
            handleAddressMessage({
              message: "cart data not found",
              type: messageType?.ERROR,
            })
          );

          return;
        }

        const {
          address = "",
          apartment = "",
          city = "",
          state = "",
          country = "",
          pinCode = "",
        } = fieldValues;
        const addressLine = `${address} ${apartment} ${city} ${state} ${country} ${pinCode}`;
        const payload = {
          regionCode: country,
          addressLine: addressLine?.trim(),
        };
        const response = await dispatch(
          validateAddress(payload, abortControllerRef?.current)
        );
        if (response?.status === 200) {
          dispatch(setIsChecked(false));
          dispatch(setShowModal(true));
          dispatch(setSelectedShippingAddress(fieldValues));
          dispatch(setStandardizedAddress(response?.standardizedAddress));
        } else if (response?.status === 422) {
          dispatch(
            handleAddressMessage({
              message: response?.message || "Invalid address provided",
              type: messageType?.ERROR,
            })
          );
          dispatch(
            handleInvalidAddressDetail({
              setInvalidAddressDetail: {
                unconfirmedComponentTypes:
                  response?.unconfirmedComponentTypes?.map((x) =>
                    x?.replace("_", " ")
                  ),
                missingComponentTypes: response?.missingComponentTypes?.map(
                  (x) => x?.replace("_", " ")
                ),
              },
            })
          );
        } else if (response?.message) {
          dispatch(
            handleAddressMessage({
              message: response?.message,
              type: messageType?.ERROR,
            })
          );
        }
      } catch (error) {
        console.error("Error occurred while validating address:", error);
      } finally {
        clearAbortController();
      }
    },
    [cartList.length, clearAbortController, dispatch]
  );

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: checkValidationAddress,
  });

  useEffect(() => {
    let address = localStorage.getItem("address");

    if (address) {
      address = JSON.parse(address);
      const updatedValues = {
        ...initialValues,
        email: address?.email,
        firstName: address?.firstName,
        lastName: address?.lastName,
        country: defaultCountry,
        state: address?.state,
        stateCode: address?.stateCode,
        city: address?.city,
        pinCode: address?.pinCode,
        company: address?.companyName,
        address: address?.address,
        apartment: address?.apartment,
        mobile: address?.mobile,
      };

      setValues(updatedValues);
      dispatch(setSelectedShippingAddress(updatedValues));
      setCountryWiseStateList(address?.countryName);
    }
  }, []);

  const setCountryWiseStateList = (selectedCountry) => {
    const matchedCountry = countries.find(
      (item) => item?.isoCode === selectedCountry
    );
    if (matchedCountry) {
      const countryWiseStatesList = State.getStatesOfCountry(
        matchedCountry?.isoCode
      );
      dispatch(setStateList(countryWiseStatesList));
    }
  };

  const handleCountryChange = (value) => {
    setValues((prevValues) => ({
      ...prevValues,
      country: value,
      state: "",
    }));
    setCountryWiseStateList(value);
  };

  const handleStateChange = (stateCode) => {
    const selectedState = stateList.find(
      (state) => state && state?.isoCode === stateCode
    );
    if (selectedState) {
      setValues((values) => ({
        ...values,
        stateCode: selectedState?.isoCode,
        state: selectedState?.name,
      }));
    } else {
      setValues((values) => ({
        ...values,
        stateCode: "",
        state: "",
      }));
    }
  };

  const inputClassName =
    "bg-transparent !border !rounded-md !border-grayborder !font-medium md:!text-base placeholder:font-medium w-full  2xl:!p-2";
  const labelClassName =
    "block uppercase text-sm font-medium text-[#666666] mb-1";
  return (
    <>
      <form>
        <div className="flex flex-col gap-4 pt-4 md:pt-8 lg:pt-12">
          <section className="px-4">
            <div className="flex xs:flex-row flex-col justify-between">
              <h2 className="text-lg xs:text-xl 4xl:text-2xl text-baseblack font-medium pt-4 font-castoro">
                Contact Information
              </h2>

              {!currentUser && (
                <p className="xs:pt-4 pt-1 text-baseblack font-medium">
                  Already have an account? &nbsp;
                  <Link
                    href="/auth/login"
                    onClick={() => {
                      localStorage.setItem("postLoginRedirect", "/checkout");
                    }}
                  >
                    <span className="underline font-semibold">Log in</span>
                  </Link>
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              <div>
                <label className={labelClassName}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  className={`custom-input ${inputClassName}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.firstName || ""}
                />
                {touched?.firstName && errors?.firstName && (
                  <ErrorMessage message={errors?.firstName}></ErrorMessage>
                )}
              </div>
              <div>
                <label className={labelClassName}>Last Name</label>
                <input
                  type="text"
                  placeholder="Last name"
                  name="lastName"
                  className={`custom-input ${inputClassName}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.lastName || ""}
                />
                {touched?.lastName && errors?.lastName && (
                  <ErrorMessage message={errors?.lastName}></ErrorMessage>
                )}
              </div>
              <div className="md:col-span-2 ">
                <label className={labelClassName}> Phone Number</label>
                <input
                  type="text"
                  placeholder="Phone number"
                  className={`custom-input ${inputClassName}`}
                  name="mobile"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.mobile || ""}
                />
                {touched?.mobile && errors?.mobile && (
                  <ErrorMessage message={errors?.mobile}></ErrorMessage>
                )}
              </div>
              <div className="md:col-span-2">
                <label className={labelClassName}>Email Address</label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className={`custom-input ${inputClassName} ${
                    !!currentUser?.email
                      ? "!bg-[#f1f1f1] cursor-not-allowed"
                      : ""
                  }`}
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.email || ""}
                  readOnly={!!currentUser?.email}
                />

                {touched?.email && errors?.email && (
                  <ErrorMessage message={errors?.email}></ErrorMessage>
                )}
              </div>
            </div>
          </section>

          <section className="px-4">
            <h2 className="text-lg lg:text-xl 4xl:text-2xl text-baseblack font-medium pt-4 font-castoro">
              Shipping Address
            </h2>
            <div className="flex flex-col gap-4 pt-6">
              <div>
                <label className={labelClassName}> House No, Street Name</label>
                <input
                  type="text"
                  placeholder="Street Address"
                  className={`custom-input ${inputClassName}`}
                  name="address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.address || ""}
                />
                {touched?.address && errors?.address && (
                  <ErrorMessage message={errors?.address}></ErrorMessage>
                )}
              </div>
              <div>
                <label className={labelClassName}>Country *</label>
                <input
                  type="text"
                  placeholder="Country"
                  disabled={true}
                  className={`custom-input ${inputClassName}`}
                  name="country"
                  onChange={(event) => handleCountryChange(event.target.value)}
                  onBlur={handleBlur}
                  value={defaultCountryDisplay || ""}
                />
                {touched?.country && errors?.country && (
                  <ErrorMessage message={errors?.country}></ErrorMessage>
                )}
              </div>
              <div>
                <label className={labelClassName}>Company</label>
                <input
                  type="text"
                  placeholder="Enter Company (Optional)"
                  className={`custom-input ${inputClassName}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.company || ""}
                  name="company"
                />
              </div>
              <div>
                <label className={labelClassName}>Apartment</label>
                <input
                  type="text"
                  placeholder="Enter Apartment"
                  className={`custom-input ${inputClassName}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.appartment || ""}
                  name="appartment"
                />
              </div>
              <div>
                <label className={labelClassName}>Town / City *</label>
                <input
                  type="text"
                  placeholder="Town / City"
                  className={`custom-input ${inputClassName}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.city || ""}
                  name="city"
                />
                {touched?.city && errors?.city && (
                  <ErrorMessage message={errors?.city}></ErrorMessage>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
                <div>
                  <label className={labelClassName}>State</label>
                  <select
                    name="stateCode"
                    value={values.stateCode || ""}
                    onChange={(e) => handleStateChange(e.target.value)}
                    onBlur={handleBlur}
                    className={`custom-input appearance-none ${inputClassName} ${
                      touched?.stateCode && errors?.stateCode
                        ? "border-rose-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="" hidden>
                      Select State
                    </option>
                    {stateList.length > 0 ? (
                      stateList.map((state) => (
                        <option key={state?.isoCode} value={state?.isoCode}>
                          {state?.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No Records Found</option>
                    )}
                  </select>

                  {touched?.stateCode && errors?.stateCode && (
                    <ErrorMessage message={errors?.stateCode}></ErrorMessage>
                  )}
                </div>

                <div>
                  <label className={labelClassName}>Zip Code</label>
                  <input
                    type="text"
                    placeholder="Zip Code"
                    className={`custom-input ${inputClassName}`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.pinCode || ""}
                    name="pinCode"
                  />
                  {touched?.pinCode && errors?.pinCode && (
                    <ErrorMessage message={errors?.pinCode}></ErrorMessage>
                  )}
                </div>
              </div>
            </div>
          </section>

          <div>
            <div
              onMouseEnter={() => dispatch(setIsHovered(true))}
              onMouseLeave={() => dispatch(setIsHovered(false))}
            >
              <LoadingPrimaryButton
                className="w-full uppercase hover:!text-primary !border-primary"
                loading={validateAddressLoader}
                loaderType={isHovered ? "" : "white"}
                onClick={handleSubmit}
              >
                CONTINUE SHIPPING
              </LoadingPrimaryButton>
            </div>
            <GrayLinkButton href="/cart" variant="grayHover" className="mt-4">
              Back To Cart
            </GrayLinkButton>
            {addressMessage?.message ? (
              <ErrorMessage message={addressMessage?.message} />
            ) : null}
            {invalidAddressDetail?.unconfirmedComponentTypes?.length > 0 ||
              (invalidAddressDetail?.missingComponentTypes?.length > 0 && (
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  {invalidAddressDetail?.unconfirmedComponentTypes?.length >
                    0 && (
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-600 mb-2">
                        Unconfirmed:
                      </h4>
                      <ul className="list-inside text-red-500 text-sm">
                        {invalidAddressDetail?.unconfirmedComponentTypes?.map(
                          (componentType, index) => (
                            <li key={index}>
                              {componentType?.replace(/_/g, " ")}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {invalidAddressDetail?.missingComponentTypes?.length > 0 && (
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-600 mb-2">
                        Missing:
                      </h4>
                      <ul className="list-inside text-red-500 text-sm">
                        {invalidAddressDetail?.missingComponentTypes?.map(
                          (componentType, index) => (
                            <li key={index}>{componentType}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </form>
    </>
  );
};

export default CheckoutForm;
