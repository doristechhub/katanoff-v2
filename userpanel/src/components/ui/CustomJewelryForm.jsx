"use client";

import { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "../ui/ErrorMessage";
import { LoadingPrimaryButton } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setIsHovered } from "@/store/slices/commonSlice";
import FileUpload from "../ui/FileUpload";
import { setCustomJewelryMessage } from "@/store/slices/customjewelrySlice";
import { getCustomJewelry } from "@/_actions/customjewelry.action";
import { messageType } from "@/_helper";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is Required"),
  lastName: Yup.string().required("Last Name is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
  phone: Yup.string().required("Mobile Number is Required"),
  attachment: Yup.mixed().required("Attachment is Required"),
  message: Yup.string().required("Description is Required"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  attachment: null,
  message: "",
};

const CustomJewelryForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { customJewelryLoading, customJewelryMessage } = useSelector(
    ({ customJewelry }) => customJewelry
  );
  const { isHovered } = useSelector(({ common }) => common);

  const [selectedFile, setSelectedFile] = useState(null);

  const onSubmit = useCallback(async (fields, { resetForm }) => {
    const payload = {
      name: fields?.firstName + " " + fields?.lastName,
      email: fields?.email,
      mobile: fields?.phone,
      imageFile: fields?.attachment,
      description: fields?.message,
    };
    const response = await dispatch(getCustomJewelry(payload));
    if (response) {
      router.push("/");
      resetForm();
    }
  }, []);
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    initialValues,
  });

  useEffect(() => {
    dispatch(setCustomJewelryMessage({ message: "", type: "" }));
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-md text-gray-66 uppercase mb-1"
          >
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            className={`custom-input !bg-transparent !border !rounded-md !border-grayborder w-full 2xl:py-3 ${
              touched?.firstName && errors?.firstName
                ? "border-red-500 border"
                : ""
            }`}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.firstName}
          />
          {touched?.firstName && errors?.firstName && (
            <ErrorMessage message={errors?.firstName} />
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-md text-gray-66 uppercase mb-1"
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            className={`custom-input !bg-transparent !border !rounded-md !border-grayborder w-full 2xl:py-3 ${
              touched?.lastName && errors?.lastName
                ? "border-red-500 border"
                : ""
            }`}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.lastName}
          />
          {touched?.lastName && errors?.lastName && (
            <ErrorMessage message={errors?.lastName} />
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-md text-gray-66 uppercase mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className={`custom-input !bg-transparent !border !rounded-md !border-grayborder w-full 2xl:py-3 ${
              touched?.email && errors?.email ? "border-red-500 border" : ""
            }`}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.email}
          />
          {touched?.email && errors?.email && (
            <ErrorMessage message={errors?.email} />
          )}
        </div>

        <div>
          <label
            htmlFor="mobile"
            className="block text-md text-gray-66 uppercase mb-1"
          >
            Mobile number
          </label>
          <input
            type="tel"
            name="phone"
            id="mobile"
            placeholder="Mobile number"
            className={`custom-input !bg-transparent !border !rounded-md !border-grayborder w-full 2xl:py-3 ${
              touched?.phone && errors?.phone ? "border-red-500 border" : ""
            }`}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.phone}
          />
          {touched?.phone && errors?.phone && (
            <ErrorMessage message={errors?.phone} />
          )}
        </div>
      </div>

      <div>
        <div className="mb-3 attachment-box">
          <label
            htmlFor="attachment"
            className="block text-md text-gray-66 uppercase mb-1"
          >
            Attachment
          </label>
          <div className="custom-input !bg-transparent !border !rounded-md !border-grayborder w-full 2xl:py-3 bg-white">
            <FileUpload
              values={values}
              setFieldValue={setFieldValue}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          </div>
          {touched?.attachment && errors?.attachment && (
            <ErrorMessage message={errors?.attachment} />
          )}
        </div>
        <label
          htmlFor="description"
          className="block text-md text-gray-66 uppercase mb-1"
        >
          Description
        </label>
        <textarea
          name="message"
          id="description"
          rows={4}
          className={`custom-input !bg-transparent !border !rounded-md !border-grayborder w-full 2xl:py-3 ${
            touched?.message && errors?.message ? "border-red-500 border" : ""
          }`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values?.message}
        />
        {touched?.message && errors?.message && (
          <ErrorMessage message={errors?.message} />
        )}
      </div>

      <div
        onMouseEnter={() => dispatch(setIsHovered(true))}
        onMouseLeave={() => dispatch(setIsHovered(false))}
      >
        <LoadingPrimaryButton
          className="uppercase"
          loading={customJewelryLoading}
          loaderType={isHovered ? "" : "white"}
          onClick={handleSubmit}
        >
          Request a Jewelry Design
        </LoadingPrimaryButton>
      </div>
      {customJewelryMessage &&
        customJewelryMessage?.type !== messageType?.SUCCESS && (
          <ErrorMessage message={customJewelryMessage?.message} />
        )}
    </form>
  );
};

export default CustomJewelryForm;
