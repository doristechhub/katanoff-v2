"use client";
import { useCallback, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "../ui/ErrorMessage";
import { LoadingPrimaryButton } from "../ui/button";
import { helperFunctions } from "@/_helper";
import { useDispatch, useSelector } from "react-redux";
import { setIsHovered } from "@/store/slices/commonSlice";
import { setAppointmentMessage } from "@/store/slices/appointmentSlice";
import { bookNewAppointment } from "@/_actions/appointment.action";
import { messageType } from "@/_helper/constants";
import { useRouter } from "next/navigation";
import moment from "moment";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is Required"),
  lastName: Yup.string().required("Last Name is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
  date: Yup.string().required("Date is Required"),
  time: Yup.string().required("Time is Required"),
  mobile: Yup.string().required("Mobile Number is Required"),
  message: Yup.string(),
});

export const timeSlots = [
  { label: "Enter Time", value: "" },
  { label: "10:00", value: "10:00" },
  { label: "10:30", value: "10:30" },
  { label: "11:00", value: "11:00" },
  { label: "11:30", value: "11:30" },
  { label: "12:00", value: "12:00" },
  { label: "12:30", value: "12:30" },
  { label: "13:00", value: "13:00" },
  { label: "13:30", value: "13:30" },
  { label: "14:00", value: "14:00" },
  { label: "14:30", value: "14:30" },
  { label: "15:00", value: "15:00" },
  { label: "15:30", value: "15:30" },
  { label: "16:00", value: "16:00" },
  { label: "16:30", value: "16:30" },
  { label: "17:00", value: "17:00" },
  { label: "17:30", value: "17:30" },
  { label: "18:00", value: "18:00" },
];
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  date: "",
  time: "",
  mobile: "",
  message: "",
};

const AppointmentForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { appointmentLoading, appointmentMessage } = useSelector(
    ({ appointment }) => appointment
  );
  const { isHovered } = useSelector(({ common }) => common);

  const onSubmit = useCallback(async (fields, { resetForm }) => {
    const convertedDate = moment(fields?.date, "YYYY-MM-DD").format(
      "DD-MM-YYYY"
    );
    const payload = {
      name: fields?.firstName + " " + fields?.lastName,
      dateTime: `${convertedDate} ${fields?.time}`,
      email: fields?.email,
      mobile: fields?.mobile,
      message: fields?.message,
    };
    const response = await dispatch(bookNewAppointment(payload));
    if (response) {
      resetForm();
      router.push("/");
    }
  }, []);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      onSubmit,
      validationSchema,
      enableReinitialize: true,
      initialValues,
    });

  useEffect(() => {
    dispatch(setAppointmentMessage({ message: "", type: "" }));
  }, []);

  const handleDateChange = (selectedDates) => {
    const date = selectedDates[0]; // First selected date or undefined
    const dateValue =
      date instanceof Date && !isNaN(date)
        ? date.toISOString().split("T")[0]
        : "";
    handleChange({
      target: {
        name: "date",
        value: dateValue,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-castoro font-normal text-[35px] xxs:mt-12 leading-[46px] tracking-[0.8px] text-left text-baseblack mb-4">
        Send a message
      </h3>
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
            className={`custom-input 2xl:py-4 bg-transparent border border-grayborder rounded ${touched?.firstName && errors?.firstName
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
            id="lastName"
            placeholder="Last name"
            className={`custom-input 2xl:py-4 bg-transparent border border-grayborder rounded 
              ${touched?.lastName && errors?.lastName
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
            id="email"
            placeholder="Your Email"
            className={`custom-input 2xl:py-4 bg-transparent border border-grayborder rounded ${touched?.email && errors?.email ? "border-red-500 border" : ""
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
            htmlFor="date"
            className="block text-md text-gray-66 uppercase mb-1"
          >
            Date
          </label>
          <div className="relative">
            <Flatpickr
              onChange={handleDateChange}
              onBlur={handleBlur}
              name="date"
              id="date"
              placeholder="Select a date (dd/mm/yyyy)"
              className={`custom-input bg-transparent border border-grayborder rounded 2xl:py-4 pr-10 ${touched?.date && errors?.date ? "border-red-500 border" : ""
                }`}
              options={{
                dateFormat: "d/m/Y", // Formik-compatible format: DD/MM/YYYY
                altInput: true,
                altFormat: "d/m/Y", // Display format: DD/MM/YYYY
                allowInput: true, // Allow manual typing
                clickOpens: true, // Open calendar on input click
                enableClear: true, // Show clear button
                minDate: "today", // Restrict to today or future
                inline: false, // Popup calendar (not inline)
                parseDate: (datestr) => {
                  // Parse manually entered dates in DD/MM/YYYY format
                  const [day, month, year] = datestr.split("/");
                  return new Date(year, month - 1, day);
                },
                formatDate: (date) => {
                  // Format date to DD/MM/YYYY
                  const day = String(date.getDate()).padStart(2, "0");
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const year = date.getFullYear();
                  return `${day}/${month}/${year}`;
                },
              }}
            />
          </div>
          {touched?.date && errors?.date && (
            <ErrorMessage message={errors?.date} />
          )}
        </div>

        <div>
          <label
            htmlFor="mobile"
            className="block text-md text-gray-66 uppercase mb-1"
          >
            Phone number
          </label>
          <input
            type="tel"
            name="mobile"
            id="mobile"
            placeholder="Phone number"
            className={`custom-input 2xl:py-4 bg-transparent border border-grayborder rounded ${touched?.mobile && errors?.mobile ? "border-red-500 border" : ""
              }`}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.mobile}
          />
          {touched?.mobile && errors?.mobile && (
            <ErrorMessage message={errors?.mobile} />
          )}
        </div>

        <div>
          <label
            htmlFor="time"
            className="block text-md text-gray-66 uppercase mb-1"
          >
            Time
          </label>
          <select
            type="time"
            name="time"
            className={`custom-input 2xl:py-4 bg-transparent border border-grayborder rounded${errors?.time && touched?.time ? "border-red-500 border" : ""
              }`}
            id="time"
            value={values?.time || ""}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            {timeSlots?.map((x) => (
              <option
                value={x?.value}
                key={helperFunctions?.getRandomValue()}
                disabled={x?.value === ""}
                hidden={x?.value === ""}
              >
                {x?.label}
              </option>
            ))}
          </select>
          {touched?.time && errors?.time && (
            <ErrorMessage message={errors?.time} />
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-md text-gray-66 uppercase mb-1 mt-4"
        >
          Message
        </label>
        <textarea
          name="message"
          id="message"
          placeholder="Type your Message"
          rows={4}
          className={`custom-input 2xl:py-4 bg-transparent border border-grayborder rounded${touched?.message && errors?.message ? "border-red-500 border" : ""
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
          loading={appointmentLoading}
          loaderType={isHovered ? "" : "white"}
          onClick={handleSubmit}
        >
          Send Message
        </LoadingPrimaryButton>
      </div>

      {appointmentMessage &&
        appointmentMessage?.type !== messageType?.SUCCESS && (
          <ErrorMessage message={appointmentMessage?.message} />
        )}
    </form>
  );
};

export default AppointmentForm;
