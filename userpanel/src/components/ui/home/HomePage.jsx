"use client";
import "swiper/css";
import "swiper/css/navigation";
import banner from "@/assets/images/home/banner.webp";
import freeGiftBanner from "@/assets/images/home/free-gift-banner.webp";
import ring1 from "@/assets/images/home/ring-1.webp";
import ring2 from "@/assets/images/home/ring-2.webp";
import ring3 from "@/assets/images/home/ring-3.webp";

import home18 from "@/assets/images/home/home-18.webp";
import home19 from "@/assets/images/home/home-19.webp";
import home20 from "@/assets/images/home/home-20.webp";
import home21 from "@/assets/images/home/home-21.webp";
import home22 from "@/assets/images/home/home-22.webp";

import {
  AccordionDropdown,
  CustomImg,
  LatestProduct,
  ProgressiveImg,
  SwipperHomePageBig,
  TestimonialSlider,
} from "@/components/dynamiComponents";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import TextAboveImage from "@/components/ui/TextAboveImage";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@/components/ui/Alert";
import { setLoginMessage } from "@/store/slices/userSlice";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import HeroBanner from "../HeroBanner";
import CategoryGallery from "./categoryGallery";
import { messageType } from "@/_helper";
import KeyFeatures from "../KeyFeatures";
import { setAppointmentMessage } from "@/store/slices/appointmentSlice";
import { setCustomJewelryMessage } from "@/store/slices/customjewelrySlice";
import { fetchCustomizeProductsVariation } from "@/_actions/customize.action";
import GiftCollections from "../GiftCollections";

const categoryData = [
  {
    title: "New Aura",
    image: home18,
    titleAttr: "",
    altAttr: "",
    btnText: "SHOP NOW",
  },
  {
    title: "The Real Illusion",
    image: home19,
    titleAttr: "",
    altAttr: "",
    btnText: "SHOP HOOPS",
  },
];

const discoverOurWorld = [
  {
    title: "Sustainability Journey",
    videoSrc: "/videos/journey.mp4",
    thumbnailImage: home21,
    titleAttr: "",
    altAttr: "",
  },
  {
    title: "Our Process",
    videoSrc: "/videos/our-process.mp4",
    thumbnailImage: home22,
    titleAttr: "",
    altAttr: "",
  },
];

const testimonials = [
  {
    name: "David Gahan",
    location: "Detroit, Michigan",
    quote:
      "In an emergency situation, I was amazed by how quickly they accommodated me. The dentist’s skill and compassion were evident. I'm grateful for their prompt care.",
  },
  {
    name: "Sarah Jones",
    location: "Austin, Texas",
    quote:
      "Amazing experience from start to finish. Friendly staff and very professional team.",
  },
];

const faqData = [
  {
    title: "Get To Know Lab Grown Diamonds",
    content:
      "Lab-grown diamonds have the same chemical, physical, and optical properties as natural diamonds.",
  },
];

const images = [ring1, ring2, ring3];

const Home = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { loginMessage } = useSelector(({ user }) => user);
  const { uniqueFilterOptionsForHeader } = useSelector(({ common }) => common);
  const { appointmentMessage } = useSelector(({ appointment }) => appointment);
  const { customJewelryMessage } = useSelector(
    ({ customJewelry }) => customJewelry
  );

  useAlertTimeout(loginMessage, () =>
    dispatch(setLoginMessage({ message: "", type: "" }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useAlertTimeout(appointmentMessage, () =>
    dispatch(setAppointmentMessage({ message: "", type: "" }))
  );
  useAlertTimeout(customJewelryMessage, () =>
    dispatch(setCustomJewelryMessage({ message: "", type: "" }))
  );

  const loadData = useCallback(async () => {
    await fetchCustomizeProductsVariation();
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <>
      {/* Hero Banner */}
      <HeroBanner isHomePage={true} imageSrc={banner} titleAttr="" altAttr="" />

      {/* SHOP FOR LAB GROWN DIAMOND PRODUCTS */}
      {uniqueFilterOptionsForHeader?.uniqueDiamondShapes?.length ? (
        <section className="pt-16 lg:pt-20 2xl:pt-40 grid grid-cols-1 lg:grid-cols-[0.7fr_1fr] items-center justify-center gap-10 container">
          <div className="flex flex-col items-center text-center bg-transparent">
            <CustomImg
              srcAttr={home20}
              altAttr=""
              className="w-40 md:w-48 2xl:w-64"
            />
            <h2 className="text-2xl 2xl:text-3xl font-chong-modern mt-4 text-center">
              SHOP FOR LAB GROWN
              <span className="lg:hidden"> </span>
              <br className="hidden lg:block" />
              DIAMOND PRODUCTS
            </h2>

            <div className="w-12 h-[2px] bg-black mt-4"></div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-12 text-center">
            {uniqueFilterOptionsForHeader?.uniqueDiamondShapes?.map(
              (shape, idx) => (
                <Link
                  href={`/customize/start-with-setting?diamondShape=${shape?.id}`}
                  key={shape?.title || idx}
                  className="flex flex-col items-center justify-center h-32 rounded-md transition-colors duration-200"
                >
                  <ProgressiveImg
                    src={shape?.image}
                    alt={shape?.title}
                    title={shape?.title}
                    className="w-16 h-16 object-contain"
                  />
                  <span className="text-base pt-4 transition-colors duration-200 text-baseblack">
                    {shape?.title}
                  </span>
                </Link>
              )
            )}
          </div>
        </section>
      ) : null}

      {/* Free Gift With Purchase */}
      <section className="pt-16 lg:pt-20 2xl:pt-40">
        <CustomImg
          srcAttr={freeGiftBanner}
          className="h-[20vh] lg:h-auto"
          altAttr=""
          titleAttr=""
        />
      </section>

      {/* Category Gallery */}
      <section className="container pt-16 lg:pt-20 2xl:pt-40 ">
        <CategoryGallery />
      </section>

      {/* Complimentary Matching Wedding Band */}
      <section className="bg-alabaster mt-16 lg:mt-20 2xl:mt-40">
        <div className="container grid grid-cols-1 lg:grid-cols-2 py-10 md:py-16 lg:py-0 relative h-[80vh] md:h-[60vh] place-items-center">
          <div className="relative w-full h-44">
            {images.map((img, index) => (
              <CustomImg
                key={index}
                srcAttr={img}
                altAttr=""
                className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col items-center justify-center text-center px-4">
            <p className="pt-2 text-base md:text-lg lg:text-xl 2xl:text-2xl font-chong-modern">
              Get a Complimentary Matching Wedding Band
            </p>
            <p className="pt-6 text-base 2xl:text-lg mb-6">
              Our intuitive ring design feature lets you craft the perfect
              engagement ring effortlessly.
            </p>
            <Link
              href="/customize/start-with-setting"
              className="pt-2 text-base 2xl:text-lg font-semibold tracking-wide border-b transition-all duration-300 
              border-baseblack text-baseblack 
              hover:text-primary hover:border-primary"
            >
              START WITH A SETTING
            </Link>
          </div>
        </div>
      </section>

      <section className="pt-16 lg:pt-20 2xl:pt-40">
        <TextAboveImage
          categoryData={categoryData}
          textClassName={"chong-modern"}
        />
      </section>
      <GiftCollections />

      <section className="mx-auto pt-16 lg:pt-20 2xl:pt-40">
        <SwipperHomePageBig />
      </section>
      <section className="pt-16 lg:pt-20 2xl:pt-40 container">
        <LatestProduct />
      </section>
      <section className="pt-16 lg:pt-20 2xl:pt-40">
        <div className="text-center">
          <h3 className="text-sm lg:text-base font-medium">
            DISCOVER OUR WORLD
          </h3>
          <h2 className="text-2xl lg:text-4xl font-normal font-chong-modern mt-2">
            Diamonds as Exceptional as You
          </h2>
        </div>
        <div className="pt-6 lg:pt-10 2xl:pt-18">
          <TextAboveImage categoryData={discoverOurWorld} />
        </div>
      </section>
      <section className="container pt-16 lg:pt-20 2xl:pt-20">
        <KeyFeatures />
      </section>

      <section className="mx-auto pt-16 lg:pt-20 2xl:pt-40">
        <TestimonialSlider testimonials={testimonials} />
      </section>

      <section className="mx-auto pt-16 lg:pt-20 2xl:pt-40">
        <AccordionDropdown items={faqData} />
      </section>
      <Alert message={loginMessage?.message} type={loginMessage?.type} />
      {appointmentMessage?.type === messageType?.SUCCESS && (
        <Alert
          message={appointmentMessage?.message}
          type={appointmentMessage?.type}
        />
      )}
      {customJewelryMessage?.type === messageType?.SUCCESS && (
        <Alert
          message={customJewelryMessage?.message}
          type={customJewelryMessage?.type}
        />
      )}
    </>
  );
};
export default Home;
