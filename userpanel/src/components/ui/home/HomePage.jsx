"use client";
import "swiper/css";
import "swiper/css/navigation";
import newArrivalBannerMobile from "@/assets/images/home/newArrivalBannerMobile.png";
import newArrivalBannerDesktop from "@/assets/images/home/newArrivalBanner-desktop.png";

import {
  AccordionDropdown,
  CenterFocusSlider,
  GetToKnowUsSection,
  HomePagePopup,
  HomePagePopupWithLogin,
  JewelryAppointment,
  LatestProduct,
  ReviewSlider,
  RingSettingCenterStone,
} from "@/components/dynamiComponents";

import TextAboveImage from "@/components/ui/TextAboveImage";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@/components/ui/Alert";
import { setLoginMessage } from "@/store/slices/userSlice";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import HeroBanner from "../HeroBanner";
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
    date: "10/21/24",
    title: "Love my heart shaped ring.",
    rating: 3,
    content:
      "Love my heart shaped ring. The band is nice and thick very comfortable. The diamond is spectacular.",
    author: "Anamaria M.",
    starImage: fiveStar,
  },
  {
    date: "10/25/24",
    title: "Best purchase ever! Fast shipping",
    rating: 4,
    content:
      "Best purchase ever! Fast shipping got it to my door in time even after a last minute decision. The diamonds are dazzling and brilliant.",
    author: "Mark T.",
    starImage: fourStar,
  },
  {
    date: "11/04/24",
    title: "Best site out there",
    rating: 3,
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
    rating: 3,
    starImage: fiveStar,
  },
  {
    date: "10/25/24",
    title: "Best purchase ever! Fast shipping",
    rating: 3,
    content: "Best purchase ever! Fast shipping got it to my door in ",
    author: "Mark T.",
    starImage: fourStar,
  },
  {
    date: "10/21/24",
    title: "Love my heart shaped ring.",
    rating: 3,
    content:
      "Love my heart shaped ring. The band is nice and thick very comfortable. The diamond is spectacular.",
    author: "Anamaria M.",
    starImage: fiveStar,
  },
  {
    date: "10/25/24",
    title: "Best purchase ever! Fast shipping",
    rating: 4,
    content:
      "Best purchase ever! Fast shipping got it to my door in time even after a last minute decision. The diamonds are dazzling and brilliant.",
    author: "Mark T.",
    starImage: fourStar,
  },
  {
    date: "11/04/24",
    title: "Best site out there",
    rating: 3,
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
    rating: 3,
    starImage: fiveStar,
  },
  {
    date: "10/25/24",
    title: "Best purchase ever! Fast shipping",
    rating: 3,
    content: "Best purchase ever! Fast shipping got it to my door in ",
    author: "Mark T.",
    starImage: fourStar,
  },
  {
    date: "10/21/24",
    title: "Love my heart shaped ring.",
    rating: 3,
    content:
      "Love my heart shaped ring. The band is nice and thick very comfortable. The diamond is spectacular.",
    author: "Anamaria M.",
    starImage: fiveStar,
  },
  {
    date: "10/25/24",
    title: "Best purchase ever! Fast shipping",
    rating: 4,
    content:
      "Best purchase ever! Fast shipping got it to my door in time even after a last minute decision. The diamonds are dazzling and brilliant.",
    author: "Mark T.",
    starImage: fourStar,
  },
  {
    date: "11/04/24",
    title: "Best site out there",
    rating: 3,
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
    rating: 3,
    starImage: fiveStar,
  },
  {
    date: "10/25/24",
    title: "Best purchase ever! Fast shipping",
    rating: 3,
    content: "Best purchase ever! Fast shipping got it to my door in ",
    author: "Mark T.",
    starImage: fourStar,
  },
  {
    date: "11/04/24",
    title: "Best site out there",
    rating: 3,
    content: "The ring was everything and more. My fiancé loves it 💍",
    author: "Evan B.",
    starImage: fourAndHalfStar,
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
