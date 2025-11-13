"use client";
import "swiper/css";
import "swiper/css/navigation";
import newArrivalBannerMobile from "@/assets/images/home/newArrivalBannerMobile.webp";
import newArrivalBannerDesktop from "@/assets/images/home/newArrivalBanner-desktop.webp";
import threeGrid1 from "@/assets/images/home/three-grid-gifts-for-her.webp";
import threeGrid2 from "@/assets/images/home/three-grid-gifts-for-him.webp";
import threeGrid3 from "@/assets/images/home/three-grid-gift-under-1000.webp";

import {
  AccordionDropdown,
  CenterFocusSlider,
  GetToKnowUsSection,
  HeroBanner,
  HomePagePopup,
  // HomePagePopupWithLogin,
  JewelryAppointment,
  LatestProduct,
  ReviewSlider,
  RingSettingCenterStone,
} from "@/components/dynamiComponents";

import TextAboveImage from "@/components/ui/TextAboveImage";
import { useDispatch, useSelector } from "react-redux";
import FixedAlert from "@/components/ui/FixedAlert";
import { setLoginMessage } from "@/store/slices/userSlice";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import CategoryGallery from "./categoryGallery";
import {
  DEALS_OF_THE_WEEK,
  GENERAL,
  GIFTS_FOR_HER,
  GIFTS_FOR_HIM,
  GIFTS_UNDER_1000,
  helperFunctions,
  messageType,
  NEW_ARRIVAL,
  PAGE_CONSTANTS,
  SLIDER_GRID,
  THREE_GRID,
  TWO_GRID,
} from "@/_helper";
import KeyFeatures from "../KeyFeatures";
import { setAppointmentMessage } from "@/store/slices/appointmentSlice";
import { setCustomJewelryMessage } from "@/store/slices/customjewelrySlice";
// import GiftCollections from "../GiftCollections";
import ThreeGridHomePage from "../ThreeGridHomePage";
import ResponsiveImageAndContent from "../ResponsiveImageAndContent";
import { useEffect } from "react";
import { fetchCollectionsByTypes } from "@/_actions/collection.action";
import HomePageSliderSkeleton from "../HomePageSliderSkeleton";
import TwoGridSkeleton from "../TwoGridSkeleton";
import CollectionHighlights from "./CollectionHighlights";
import { PAGE_IMG_ALT_TITLE } from "@/_helper/pageImgAltTitle";
import dealsOfWeekDesktop from "@/assets/images/home/deals-of-the-week-desktop.webp";
import dealsOfWeekMobile from "@/assets/images/home/deals-of-the-week-mobile.webp";
import CustomImg from "../custom-img";
import { LinkButton } from "../button";
// import ThreeGridSkeleton from "../ThreeGridSkeleton";

const faqData = [
  {
    title: "Get To Know Lab Grown Diamonds",
    content:
      "Lab-grown diamonds have the same chemical, physical, and optical properties as natural diamonds.",
  },
];

const mockReviews = [
  {
    rating: 5,
    content:
      "Absolutely stunning! I was blown away by the sparkle. Can’t believe it’s lab-grown!",
    author: "Sarah L.",
  },
  {
    rating: 3,
    content:
      "Elegant, ethical, and affordable what more could you ask for? Got so many compliments on my necklace!",
    author: "Priya D.",
  },
  {
    rating: 3,
    content:
      "I love my ring, though I had to get it resized. The quality is undeniable.",
    author: "Jason K.",
  },
  {
    rating: 4,
    content:
      "My earrings are gorgeous! Light catches them perfectly. I’ll be back for more 💎",
    author: "Renee F.",
  },
  {
    rating: 5,
    content:
      "The bracelet I ordered is exquisite. Lab-grown is definitely the future of fine jewelry!",
    author: "Omar R.",
  },
  {
    rating: 4,
    content:
      "Shipping took a bit longer than expected, but the quality made it worth the wait.",
    author: "Natasha M.",
  },
  {
    rating: 5,
    content:
      "Bought this as a gift for my wife, she cried. The diamond sparkled just as much as she did 😊",
    author: "Marcus J.",
  },
  {
    rating: 4,
    content:
      "I’m obsessed with my lab-grown engagement ring! Ethically sourced AND stunning.",
    author: "Alina G.",
  },
  {
    rating: 5,
    content:
      "This is my second order from them. The consistency in brilliance and finish is amazing.",
    author: "Tara W.",
  },
  {
    rating: 3,
    content:
      "Great craftsmanship. Just wish there were more customizable options for the band.",
    author: "Aiden H.",
  },
  {
    rating: 5,
    content:
      "Shocked at how vibrant the diamonds are. You wouldn’t know they’re lab-grown. I love it!",
    author: "Chloe S.",
  },
  {
    rating: 4,
    content:
      "Got my custom pendant delivered last week—it’s flawless. Thank you!",
    author: "Rajan P.",
  },
  {
    rating: 4,
    content:
      "Beautiful jewelry and a guilt-free purchase. Minor issue with the clasp but customer service handled it fast.",
    author: "Naomi C.",
  },
  {
    rating: 5,
    content:
      "Lab-grown never looked so luxurious. Excellent finish, eco-friendly, and budget-friendly.",
    author: "James T.",
  },
  {
    rating: 5,
    content:
      "Perfect for our anniversary. My wife loved her new eternity band. Highly recommend!",
    author: "Daniel B.",
  },
  {
    rating: 5,
    content:
      "I was skeptical about lab diamonds until I saw this piece in person. I’m a believer now.",
    author: "Mira V.",
  },
];
// const staticThreeGridData = [
//   {
//     title: GIFTS_FOR_HER,
//     image: threeGrid1,
//     link: `/collections/${GENERAL}/${helperFunctions?.stringReplacedWithUnderScore(
//       GIFTS_FOR_HER
//     )}`,
//   },
//   {
//     title: GIFTS_UNDER_1000,
//     image: threeGrid3,
//     link: `/collections/${GENERAL}/${helperFunctions?.stringReplacedWithUnderScore(
//       GIFTS_UNDER_1000
//     )}`,
//   },
//   {
//     title: GIFTS_FOR_HIM,
//     image: threeGrid2,
//     link: `/collections/${GENERAL}/${helperFunctions?.stringReplacedWithUnderScore(
//       GIFTS_FOR_HIM
//     )}`,
//   },
// ];

const Home = () => {
  const dispatch = useDispatch();
  const { loginMessage } = useSelector(({ user }) => user);

  const { appointmentMessage } = useSelector(({ appointment }) => appointment);
  const { customJewelryMessage } = useSelector(
    ({ customJewelry }) => customJewelry
  );
  const { collectionsData, collectionsLoading } = useSelector(
    ({ collection }) => collection
  );

  useAlertTimeout(loginMessage, () =>
    dispatch(setLoginMessage({ message: "", type: "" }))
  );

  useAlertTimeout(appointmentMessage, () =>
    dispatch(setAppointmentMessage({ message: "", type: "" }))
  );
  useAlertTimeout(customJewelryMessage, () =>
    dispatch(setCustomJewelryMessage({ message: "", type: "" }))
  );

  useEffect(() => {
    dispatch(fetchCollectionsByTypes([TWO_GRID, THREE_GRID, SLIDER_GRID]));
  }, [dispatch]);

  // const twoGridData =
  //   collectionsData.find((item) => item.type === TWO_GRID)?.data || [];
  // const threeGridData =
  //   collectionsData.find((item) => item.type === THREE_GRID)?.data || [];
  const sliderData =
    collectionsData.find((item) => item.type === SLIDER_GRID)?.data || [];

  let currentUser = helperFunctions?.getCurrentUser();

  const dealsOfWeekData = {
    title: DEALS_OF_THE_WEEK,
    description: "Where Glamour Meets Great Deals Weekly",
    link: `/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
      DEALS_OF_THE_WEEK
    )}`,
  };
  return (
    <>
      {/* {currentUser ? <HomePagePopupWithLogin /> : <HomePagePopup />} */}
      {!currentUser && <HomePagePopup />}
      <HeroBanner isHomePage={true} titleAttr="" altAttr="Hero Banner" />

      <section className="flex justify-center md:pt-6 4xl:pt-10">
        {/* For Desktop and tablet view */}
        <div className="relative hidden md:block">
          <CustomImg
            srcAttr={dealsOfWeekDesktop}
            altAttr=""
            titleAttr=""
            className="w-auto h-auto"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center  text-white w-full gap-3 md:gap-4 2xl:gap-6 4xl:gap-8">
            <div className="w-1/3 lg:w-full text-center">
              <h3 className="font-castoro text-2xl md:text-3xl lg:text-4xl  xl:text-5xl">
                {dealsOfWeekData?.title}
              </h3>
              <div>
                <p className="text-base md:text-lg xl:text-xl 4xl:text-xl font-light">
                  {dealsOfWeekData?.description}
                </p>
              </div>

              <LinkButton
                href={dealsOfWeekData?.link}
                className="!w-fit  mt-3 lg:mt-6  mx-auto !uppercase !rounded-none !text-primary hover:!text-white"
              >
                Shop Now
              </LinkButton>
            </div>
          </div>
        </div>

        {/* For Mobile View */}
        <div className="relative md:hidden">
          <CustomImg
            srcAttr={dealsOfWeekMobile}
            altAttr=""
            titleAttr=""
            className="w-auto h-auto"
          />
          <div className="absolute w-full mx-auto top-[10%] items-center px-4 text-white flex flex-col">
            <h3 className="font-castoro text-3xl md:text-3xl lg:text-4xl xl:text-5xl">
              {dealsOfWeekData?.title}
            </h3>
            <div>
              <p className="text-center text-base font-light pt-4">
                {dealsOfWeekData?.description}
              </p>
              <p className="text-center text-2xl font-light font-gelasio">
                {dealsOfWeekData?.price}
              </p>
            </div>
            <div className="pt-4">
              <LinkButton
                href={dealsOfWeekData?.link}
                className="!w-fit !uppercase !rounded-none !text-primary hover:!text-white"
                aria-label="Shop Deals of the Week"
              >
                Shop Now
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pt-6 lg:pt-0 pb-10 xl:pb-16">
        <RingSettingCenterStone />
      </section>

      <ResponsiveImageAndContent
        desktopImage={newArrivalBannerDesktop}
        mobileImage={newArrivalBannerMobile}
        altAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].alt}
        titleAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].title}
        title="New Arrivals"
        subtitle="New Designer Collection"
        linkText="Explore Collection"
        linkHref={`/collections/${GENERAL}/${helperFunctions?.stringReplacedWithUnderScore(
          NEW_ARRIVAL
        )}`}
      />
      {collectionsLoading ? (
        <HomePageSliderSkeleton />
      ) : sliderData?.length > 0 ? (
        <section className="container pt-12 lg:pt-16 2xl:pt-24">
          <CategoryGallery categories={sliderData} />
        </section>
      ) : null}

      <section className=" pt-12 lg:pt-16 2xl:pt-20">
        <CenterFocusSlider />
      </section>

      <section className="bg-[#F2F2F2] mt-0 sm:mt-2 md:mt-8 lg:mt-12 xl:mt-16">
        <ReviewSlider reviews={mockReviews} totalCount={100} />
      </section>
      <section className="container pt-12 lg:pt-20 2xl:pt-24">
        <KeyFeatures />
      </section>

      <section className="mt-10 lg:mt-12 xl:mt-16">
        <CollectionHighlights />
      </section>

      {/* {collectionsLoading ? (
        <TwoGridSkeleton />
      ) : twoGridData.length > 0 ? (
        <section className="container pt-12 md:pt-16 2xl:pt-20 4xl:pt-24">
          <TextAboveImage
            categoryData={twoGridData}
            textClassName={"gelasio"}
          />
        </section>
      ) : null} */}

      {/* {collectionsLoading ? (
        <ThreeGridSkeleton />
      ) : threeGridData.length > 0 ? (
        <section className="container mx-auto pt-8 lg:pt-6 2xl:pt-6">
          <GiftCollections giftCategories={threeGridData} />
        </section>
      ) : null} */}

      {/* <ThreeGridHomePage
        gridItems={staticThreeGridData}
        className="px-4 pt-8 lg:pt-6"
      /> */}

      <section className="pt-12 lg:pt-16 2xl:pt-24">
        <JewelryAppointment />
      </section>
      <section className="container pt-12 md:pt-16 lg:pt-16 2xl:pt-20  px-4">
        <GetToKnowUsSection />
      </section>

      <section className="pt-12 lg:pt-16 2xl:pt-20 container">
        <LatestProduct />
      </section>

      <section className="container pt-10 lg:pt-12 2xl:pt-16">
        <AccordionDropdown items={faqData} />
      </section>
      {loginMessage?.message && loginMessage?.type === messageType?.SUCCESS ? (
        <FixedAlert message={loginMessage?.message} type={loginMessage?.type} />
      ) : null}
      {appointmentMessage?.type === messageType?.SUCCESS && (
        <FixedAlert
          message={appointmentMessage?.message}
          type={appointmentMessage?.type}
        />
      )}
      {customJewelryMessage?.type === messageType?.SUCCESS && (
        <FixedAlert
          message={customJewelryMessage?.message}
          type={customJewelryMessage?.type}
        />
      )}
    </>
  );
};
export default Home;
