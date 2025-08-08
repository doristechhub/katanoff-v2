"use client";
import { useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "./ErrorMessage";
import { LoadingPrimaryButton } from "./button";
import { useDispatch, useSelector } from "react-redux";
import { setIsHovered } from "@/store/slices/commonSlice";
import { emailPattern, phoneRegex } from "@/_utils/common";
import { sendContact } from "@/_actions/contact.action";
import {
  companyAddress,
  companyEmail,
  companyMapUrl,
  companyPhoneNo,
  formatPhoneNumber,
  messageType,
} from "@/_helper";
import FixedAlert from "./FixedAlert";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import { setContactMessage } from "@/store/slices/contactSlice";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is Required"),
  lastName: Yup.string().required("Last Name is Required"),
  email: Yup.string()
    .matches(emailPattern, "Email is not valid")
    .required("Email is required"),
  mobile: Yup.string()
    .matches(phoneRegex, "Phone number is not valid")
    .required("Phone number is required"),
  requirement: Yup.string().trim().notRequired(),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  requirement: "",
};

const ContactForm = () => {
  const dispatch = useDispatch();
  const { contactMessage, contactLoading } = useSelector(
    ({ contact }) => contact
  );
  const { isHovered } = useSelector(({ common }) => common);

  const { display } = formatPhoneNumber(companyPhoneNo);

  useAlertTimeout(contactMessage, () =>
    dispatch(setContactMessage({ message: "", type: "" }))
  );

  const onSubmit = useCallback(async (fields, { resetForm }) => {
    const payload = {
      firstName: fields?.firstName,
      lastName: fields?.lastName,
      email: fields?.email,
      mobile: fields?.mobile,
      requirement: fields?.requirement,
    };
    const response = await dispatch(sendContact(payload));
    if (response) {
      resetForm();
    }
  });
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      onSubmit,
      validationSchema,
      enableReinitialize: true,
      initialValues,
    });

  return (
    <>
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center text-baseblack mt-12 md:mt-12 lg:mt-12 2xl:mt-24">
            <p className="text-base sm:text-lg font-Figtree text-baseblack">
              Our customer service agents are available every day 9:00am to
              10:00pm ET.
              <br />
              (Closed on U.S. Federal Holidays)
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center xl:gap-4 gap-2 text-baseblack font-normal py-12">
            <div className="px-2 py-4 flex-1 text-center md:text-left">
              <h3 className="text-lg lg:text-xl 2xl:text-2xl font-castoro mb-2">
                Call:
              </h3>
              <p>{display}</p>
            </div>

            <div className="hidden md:flex items-center md:px-5 xl:px-8">
              <div className="w-px h-10 bg-gray-300"></div>
            </div>

            <div className="px-2 py-4 flex-1 text-center md:text-left">
              <h3 className="text-lg lg:text-xl 2xl:text-2xl font-castoro mb-2">
                Email:
              </h3>
              <p>{companyEmail}</p>
            </div>

            <div className="hidden md:flex items-center md:px-5 xl:px-8">
              <div className="w-px h-10 bg-gray-300"></div>
            </div>

            <div className="px-6 py-4 flex-1 text-center md:text-left">
              <h3 className="text-lg lg:text-xl 2xl:text-2xl font-castoro mb-2">
                Address:
              </h3>
              <p>{companyAddress}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <h3 className="font-castoro font-normal text-[40px] xxs:mt-12 leading-[46px] tracking-[0.8px] text-left text-baseblack mb-4">
              Send a message
            </h3>
            <div>
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
                    id="firstName"
                    placeholder="First name"
                    className={`custom-input 2xl:p-4 bg-transparent border border-grayborder rounded ${
                      touched?.lastName && errors?.lastName
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
                    className="block text-md text-gray-66 uppercase mb-1  "
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Last name"
                    className={`custom-input 2xl:p-4 bg-transparent border border-grayborder rounded ${
                      touched?.lastName && errors?.lastName
                        ? "border-red-500 border"
                        : ""
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastName}
                  />
                  {touched?.lastName && errors?.lastName && (
                    <ErrorMessage message={errors?.lastName} />
                  )}
                </div>
              </div>
              <div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-md text-gray-66 uppercase mb-1  mt-4"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your Email"
                    className={`custom-input 2xl:p-4 bg-transparent border border-grayborder rounded ${
                      touched?.email && errors?.email
                        ? "border-red-500 border"
                        : ""
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  {touched?.email && errors?.email && (
                    <ErrorMessage message={errors?.email} />
                  )}
                </div>

                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-md text-gray-66 uppercase mb-1  mt-4"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    id="mobile"
                    placeholder="Phone number"
                    className={`custom-input 2xl:p-4 bg-transparent border border-grayborder rounded ${
                      touched?.mobile && errors?.mobile
                        ? "border-red-500 border"
                        : ""
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.mobile}
                  />
                  {touched?.mobile && errors?.mobile && (
                    <ErrorMessage message={errors?.mobile} />
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="requirement"
                  className="block text-md text-gray-66 uppercase mb-1 mt-4"
                >
                  Message
                </label>
                <textarea
                  name="requirement"
                  id="requirement"
                  placeholder="Type your Message"
                  rows={4}
                  className={`custom-input 2xl:p-4 bg-transparent border border-grayborder rounded ${
                    touched.requirement && errors.requirement
                      ? "border-red-500 border"
                      : ""
                  }`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.requirement}
                />
                {touched?.requirement && errors?.requirement && (
                  <ErrorMessage message={errors?.requirement} />
                )}
              </div>

              <div
                className="uppercase mt-6 2xl:mt-8 w-full"
                onMouseEnter={() => dispatch(setIsHovered(true))}
                onMouseLeave={() => dispatch(setIsHovered(false))}
              >
                <LoadingPrimaryButton
                  type="submit"
                  className="uppercase"
                  loading={contactLoading}
                  loaderType={isHovered ? "" : "white"}
                >
                  Send Message
                </LoadingPrimaryButton>
              </div>
              {contactMessage?.message &&
              contactMessage?.type != messageType.SUCCESS ? (
                <ErrorMessage message={contactMessage?.message} />
              ) : null}
              {contactMessage?.type == messageType?.SUCCESS ? (
                <FixedAlert
                  message={contactMessage?.message}
                  type={contactMessage?.type}
                />
              ) : null}
            </div>
          </form>
        </div>
      </div>
      <div className="w-full h-[50vh] md:h-[550px] -mb-10 md:-mb-14 lg:-mb-20 2xl:-mb-20 mt-16 xl:mt-24">
        <iframe
          className="w-full h-full border-0 block"
          title="Google Maps Location"
          src={companyMapUrl}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </>
  );
};
export default ContactForm;
