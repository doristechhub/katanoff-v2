"use client";
import bookAppointment from "@/assets/images/home/book-appointment-home.webp";
import bookAppointmentMobile from "@/assets/images/home/book-appointment-home-mobile.webp";

import { PrimaryLinkButton } from "./button";
import { PAGE_IMG_ALT_TITLE } from "@/_helper/pageImgAltTitle";
import { PAGE_CONSTANTS } from "@/_helper";
import CustomImg from "./custom-img";

export default function JewelryAppointment() {
  return (
    <>
      <section className="hidden lg:block relative w-full h-[60vh] sm:h-[70vh] overflow-hidden">
        <CustomImg
          srcAttr={bookAppointment}
          altAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].alt}
          titleAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 container mx-auto h-full flex pb-10 xs:pb-0 items-center">
          <div className="text-white max-w-xl">
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-medium text-baseblack font-gelasio mb-4">
              Expert Help, Just for You
            </h1>
            <p className="text-baseblack mb-6 max-w-lg mx-auto md:mx-0">
              Book a complimentary virtual appointment and let our experts guide
              you through every detail, making your jewelry journey simple and
              personalized.
            </p>
            <div className="flex mt-2 lg:mt-6">
              <PrimaryLinkButton
                variant="blackHover"
                className="!uppercase !rounded-none !text-baseblack"
                href={"/book-appointment"}
              >
                Meet an Expert
              </PrimaryLinkButton>
            </div>
          </div>
        </div>
      </section>
      <section className="lg:hidden relative w-full overflow-hidden">
        <div className="container flex text-center justify-center bg-[#F6F6EA] pt-12 md:pt-16 pb-12">
          <div className="text-white max-w-xl">
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-medium text-baseblack font-gelasio">
              Expert Help, Just for You
            </h1>
            <p className="text-sm md:text-base text-baseblack pt-2 sm:pt-4 max-w-lg">
              Book a complimentary virtual appointment and let our experts guide
              you through every detail, making your jewelry journey simple and
              personalized.
            </p>
            <div className="flex mt-4 sm:mt-6 justify-center">
              <PrimaryLinkButton
                variant="blackHover"
                className="!uppercase !rounded-none !text-baseblack"
                href={"/book-appointment"}
              >
                Meet an Expert
              </PrimaryLinkButton>
            </div>
          </div>
        </div>
        <CustomImg
          srcAttr={bookAppointmentMobile}
          altAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].alt}
          titleAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].title}
          className="w-full h-full"
        />
      </section>
    </>
  );
}
