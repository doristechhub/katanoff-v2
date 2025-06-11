"use client";
import "swiper/css";
import "swiper/css/navigation";
import freeGiftBanner from "@/assets/images/home/free-gift-banner.webp";
import ring1 from "@/assets/images/home/ring-1.webp";
import ring2 from "@/assets/images/home/ring-2.webp";
import ring3 from "@/assets/images/home/ring-3.webp";

import home18 from "@/assets/images/home/home-18.webp";
import home19 from "@/assets/images/home/home-19.webp";
import home20 from "@/assets/images/home/home-20.webp";
import home21 from "@/assets/images/home/home-21.webp";
import home22 from "@/assets/images/home/home-22.webp";
import home36 from "@/assets/images/home/home-36.webp";

import marquee1 from "@/assets/images/home/marquee-1.webp";
import marquee2 from "@/assets/images/home/marquee-2.webp";
import marquee3 from "@/assets/images/home/marquee-3.webp";
import marquee4 from "@/assets/images/home/marquee-4.webp";
import marquee5 from "@/assets/images/home/marquee-5.webp";
import marquee6 from "@/assets/images/home/marquee-6.webp";
import marquee7 from "@/assets/images/home/marquee-7.webp";

import {
  AccordionDropdown,
  AnimatedSection,
  CustomImg,
  DiamondShapeSwipper,
  GetToKnowUsSection,
  LatestProduct,
  ReviewSlider,
  SwipperHomePageBig,
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
import { fetchUniqueShapesAndCaratBounds } from "@/_actions/customize.action";
import GiftCollections from "../GiftCollections";
import Marquee from "../Marquee";
import fiveStar from "@/assets/icons/fiveStar.svg";
import fourStar from "@/assets/icons/fourStar.svg";
import fourAndHalfStar from "@/assets/icons/fourAndHalfStar.svg";
const categoryData = [
  {
    title: "Quick Ship Gifts",
    image: home19,
    titleAttr: "",
    altAttr: "",
    btnText: "SHOP NOW",
  },
  {
    title: "Special Buys",
    image: home18,
    titleAttr: "",
    altAttr: "",
    btnText: "SHOP NOW",
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

const faqData = [
  {
    title: "Get To Know Lab Grown Diamonds",
    content:
      "Lab-grown diamonds have the same chemical, physical, and optical properties as natural diamonds.",
  },
];

const images = [ring1, ring2, ring3];
const marqueeItems = [
  {
    id: 1,
    image: marquee1,
  },
  {
    id: 2,
    image: marquee2,
  },
  {
    id: 3,
    image: marquee3,
  },
  {
    id: 4,
    image: marquee4,
  },
  {
    id: 5,
    image: marquee5,
  },
  {
    id: 6,
    image: marquee6,
  },
  {
    id: 7,
    image: marquee7,
  },
];

const mockReviews = [
  {
    date: "10/21/24",
    title: "Love my heart shaped ring.",
    content:
      "Love my heart shaped ring. The band is nice and thick very comfortable. The diamond is spectacular.",
    author: "Anamaria M.",
    starImage: fiveStar,
  },
  {
    date: "10/25/24",
    title: "Best purchase ever! Fast shipping",
    content:
      "Best purchase ever! Fast shipping got it to my door in time even after a last minute decision. The diamonds are dazzling and brilliant.",
    author: "Mark T.",
    starImage: fourStar,
  },
  {
    date: "11/04/24",
    title: "Best site out there",
    content:
      "The ring was everything and more. My fiancé loves it 💍. Cheapest price and best quality. I shopped around multiple stores who weren’t even close.",
    author: "Evan B.",
    starImage: fourAndHalfStar,
  },
  {
    date: "10/21/24",
    title: "Love my heart shaped ring.",
    content: "Love my ",
    author: "Anamaria M.",
    starImage: fiveStar,
  },
  {
    date: "10/25/24",
    title: "Best purchase ever! Fast shipping",
    content: "Best purchase ever! Fast shipping got it to my door in ",
    author: "Mark T.",
    starImage: fourStar,
  },
  {
    date: "11/04/24",
    title: "Best site out there",
    content: "The ring was everything and more. My fiancé loves it 💍",
    author: "Evan B.",
    starImage: fourAndHalfStar,
  },
  // Add more reviews as needed
];

const animatedContent = [
  {
    img: home36,
    titleAttr: "",
    direction: "RTF",
    altAttr: "",
    title: "Meet our jewelry specialists",
    description: [
      "Book a Complimentary Virtual or In-Person appointment at one of our stores, and let our jewelry specialists guide you every step of the way.",
    ],
    btnText: "Book an Appointment",
    btnLink: "/book-appointment",
  },
];
const Home = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { loginMessage } = useSelector(({ user }) => user);
  const { uniqueDiamondShapesAndCaratBounds } = useSelector(
    ({ common }) => common
  );
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
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useAlertTimeout(appointmentMessage, () =>
    dispatch(setAppointmentMessage({ message: "", type: "" }))
  );
  useAlertTimeout(customJewelryMessage, () =>
    dispatch(setCustomJewelryMessage({ message: "", type: "" }))
  );

  const loadData = useCallback(async () => {
    await dispatch(fetchUniqueShapesAndCaratBounds());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <HeroBanner isHomePage={true} titleAttr="" altAttr="Hero Banner" />

      {uniqueDiamondShapesAndCaratBounds?.distinctShapes ? (
        <section className="mt-10 lg:mt-12 2xl:mt-12">
          <DiamondShapeSwipper
            shapes={uniqueDiamondShapesAndCaratBounds?.distinctShapes || []}
            title="Shop for Lab Grown Diamonds"
          />
        </section>
      ) : null}

      <section className="bg-alabaster mt-10 lg:mt-12 2xl:mt-12 container">
        <div className="container grid grid-cols-1 lg:grid-cols-[40%_60%] items-center py-6 md:py-16 lg:py-0 lg:h-[100vh]">
          {/* Left Image */}
          <div className="relative w-full h-auto lg:h-full flex justify-center items-center">
            <CustomImg
              srcAttr={home20}
              altAttr="Complimentary Ring"
              className="object-contain w-full h-auto max-h-[400px] md:max-h-[500px] lg:max-h-[650px]"
            />
          </div>

          <div className="flex flex-col justify-center items-center text-center px-4">
            <h2 className="text-2xl lg:text-2xl 2xl:text-3xl 4xl:text-4xl font-castoro mb-6">
              Complimentary Ring Setting
            </h2>

            <div className="flex items-center justify-center gap-6 text-sm md:text-base mb-6 pt-8 4xl:pt-20">
              <div className="flex flex-col items-center">
                <span className=" text-lg 3xl:text-2xl">1</span>
                <span className="text-xs md:text-lg xl:text-xl mt-1">
                  Pick your diamond
                </span>
              </div>
              <div className="w-16 md:w-20 lg:w-24 2xl:w-28 4xl:w-32 h-px bg-black/40" />
              <div className="flex flex-col items-center">
                <span className="text-lg 3xl:text-2xl">2</span>
                <span className="text-xs md:text-lg xl:text-xl mt-1">
                  Add your unique touch
                </span>
              </div>
              <div className="w-16 md:w-20 lg:w-24 2xl:w-28 4xl:w-32 h-px bg-black/40" />

              <div className="flex flex-col items-center">
                <span className="text-lg 3xl:text-2xl">3</span>
                <span className="text-xs md:text-lg xl:text-xl mt-1">
                  Find your setting
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base mb-6 pt-8 md:pt-12 xl:pt-16">
              Design your engagement ring. Receive a free setting with the
              purchase of a 3.0 ct or larger diamond.
            </p>

            {/* Button */}
            <Link
              href="/customize/start-with-setting"
              className="py-2 text-sm md:text-base xl:text-lg font-semibold border-b border-black text-black tracking-wide hover:border-primary hover:text-primary transition-all"
            >
              START DESIGNING
            </Link>
          </div>
        </div>
      </section>

      <section className="pt-10 lg:pt-12 2xl:pt-12">
        <CustomImg
          srcAttr={freeGiftBanner}
          className="h-[20vh] lg:h-auto w-full"
          altAttr=""
          titleAttr=""
        />
      </section>

      <section className="container pt-10 lg:pt-12 2xl:pt-12 ">
        <CategoryGallery />
      </section>
      <section className="pt-12 xl:pt-24 container">
        <Marquee items={marqueeItems} />
      </section>

      <section className="container pt-10 lg:pt-16 2xl:pt-20">
        <TextAboveImage categoryData={categoryData} textClassName={"castoro"} />
      </section>
      <section className="container mx-auto pt-8 lg:pt-6 2xl:pt-6">
        <GiftCollections />
      </section>
      <section className="bg-[#f1eee7] mt-8">
        <ReviewSlider reviews={mockReviews} totalCount={120} />
      </section>
      <section className="mx-auto pt-10 lg:pt-12 2xl:pt-12 container">
        <SwipperHomePageBig />
      </section>
      <section className="container pt-10">
        <GetToKnowUsSection />
      </section>
      <section className="container pt-8 lg:pt-10 2xl:pt-12">
        <KeyFeatures />
      </section>

      <section className="mt-16 lg:mt-28 container">
        {animatedContent.map((content, index) => (
          <AnimatedSection
            key={index}
            img={content.img}
            titleAttr={content.titleAttr}
            altAttr={content.altAttr}
            title={content.title}
            description={content.description}
            pointsDescription={content.pointsDescription}
            points={content.points}
            direction={content.direction}
            btnText={content.btnText}
            btnLink={content.btnLink}
          />
        ))}
      </section>
      <section className="pt-10 lg:pt-12 2xl:pt-12 container">
        <LatestProduct />
      </section>

      <section className="container pt-10 lg:pt-12 2xl:pt-16">
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
