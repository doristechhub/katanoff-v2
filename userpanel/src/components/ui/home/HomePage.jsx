"use client";
import "swiper/css";
import "swiper/css/navigation";
import newArrivalBannerMobile from "@/assets/images/home/newArrivalBannerMobile.png";
import newArrivalBannerDesktop from "@/assets/images/home/newArrivalBanner-desktop.png";

import {
  AccordionDropdown,
  CenterFocusSlider,
  GetToKnowUsSection,
  HeroBanner,
  HomePagePopup,
  HomePagePopupWithLogin,
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
  helperFunctions,
  messageType,
  SLIDER_GRID,
  THREE_GRID,
  TWO_GRID,
} from "@/_helper";
import KeyFeatures from "../KeyFeatures";
import { setAppointmentMessage } from "@/store/slices/appointmentSlice";
import { setCustomJewelryMessage } from "@/store/slices/customjewelrySlice";
import GiftCollections from "../GiftCollections";
import fiveStar from "@/assets/icons/fiveStar.svg";
import fourStar from "@/assets/icons/fourStar.svg";
import fourAndHalfStar from "@/assets/icons/fourAndHalfStar.svg";
import ResponsiveImageAndContent from "../ResponsiveImageAndContent";
import { useEffect } from "react";
import { fetchCollectionsByTypes } from "@/_actions/collection.action";
import HomePageSliderSkeleton from "../HomePageSliderSkeleton";
import TwoGridSkeleton from "../TwoGridSkeleton";
import ThreeGridSkeleton from "../ThreeGridSkeleton";

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

  const twoGridData =
    collectionsData.find((item) => item.type === TWO_GRID)?.data || [];
  const threeGridData =
    collectionsData.find((item) => item.type === THREE_GRID)?.data || [];
  const sliderData =
    collectionsData.find((item) => item.type === SLIDER_GRID)?.data || [];

  let currentUser = helperFunctions?.getCurrentUser();
  return (
    <>
      {/* {currentUser ? <HomePagePopupWithLogin /> : <HomePagePopup />} */}
      {!currentUser && <HomePagePopup />}
      <HeroBanner isHomePage={true} titleAttr="" altAttr="Hero Banner" />
      <section className="bg-white pt-16 pb-16 xl:pb-20">
        <RingSettingCenterStone />
      </section>

      <ResponsiveImageAndContent
        desktopImage={newArrivalBannerDesktop}
        mobileImage={newArrivalBannerMobile}
        title="New Arrivals"
        subtitle="New Designer Collection"
        linkText="Explore Collection"
        linkHref={`/collections/collection/${helperFunctions?.stringReplacedWithUnderScore(
          "New Arrival"
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
        <ReviewSlider reviews={mockReviews} totalCount={120} />
      </section>
      <section className="container pt-12 lg:pt-20 2xl:pt-24">
        <KeyFeatures />
      </section>

      {collectionsLoading ? (
        <TwoGridSkeleton />
      ) : twoGridData.length > 0 ? (
        <section className="container pt-12 md:pt-16 2xl:pt-20 4xl:pt-24">
          <TextAboveImage
            categoryData={twoGridData}
            textClassName={"castoro"}
          />
        </section>
      ) : null}

      {collectionsLoading ? (
        <ThreeGridSkeleton />
      ) : threeGridData.length > 0 ? (
        <section className="container mx-auto pt-8 lg:pt-6 2xl:pt-6">
          <GiftCollections giftCategories={threeGridData} />
        </section>
      ) : null}

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
