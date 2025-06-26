// components/JewelryAppointment.tsx
"use client";
import { CustomImg } from "../dynamiComponents";
import bookAppointment from "@/assets/images/home/book-appointment-home.webp";
import bookAppointmentMobile from "@/assets/images/home/book-appointment-home-mobile.webp";

import { PrimaryLinkButton } from "./button";
export default function JewelryAppointment() {
  return (
    <>
      <section className="hidden lg:block relative w-full h-[60vh] sm:h-[70vh] overflow-hidden">
        <CustomImg
          srcAttr={bookAppointment}
          altAttr="New Arrivals Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 container mx-auto h-full flex pb-10 xs:pb-0 items-center">
          <div className="text-white max-w-xl">
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-medium text-baseblack font-castoro mb-4">
              Meet our jewelry specialists
            </h2>
            <p className="text-baseblack mb-6 max-w-lg mx-auto md:mx-0">
              Book a complimentary virtual or in-person appointment at one of
              our stores, and let our jewelry specialists guide you every step
              of the way.
            </p>
            <div className="flex mt-2 lg:mt-6">
              <PrimaryLinkButton
                variant="blackHover"
                className="!uppercase !rounded-none !text-baseblack"
                href={"/book-appointment"}
              >
                Book An Appointment
              </PrimaryLinkButton>
            </div>
          </div>
        </div>
      </section>
      <section className="lg:hidden relative w-full h-[70vh] sm:h-[80vh] overflow-hidden">
        <CustomImg
          srcAttr={bookAppointmentMobile}
          altAttr="New Arrivals Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 container mx-auto h-full flex pb-10 xs:pb-0 top-28 md:top-32 text-center justify-center">
          <div className="text-white max-w-xl">
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-medium text-baseblack font-castoro mb-4">
              Meet our jewelry specialists
            </h2>
            <p className="text-baseblack mb-6 max-w-lg mx-auto md:mx-0">
              Book a complimentary virtual or in-person appointment at one of
              our stores, and let our jewelry specialists guide you every step
              of the way.
            </p>
            <div className="flex mt-2 lg:mt-6 justify-center">
              <PrimaryLinkButton
                variant="blackHover"
                className="!uppercase !rounded-none !text-baseblack"
                href={"/book-appointment"}
              >
                Book An Appointment
              </PrimaryLinkButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
